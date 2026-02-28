import crypto from 'crypto'

import { google } from 'googleapis'

import prisma from '@/db'

/* =======================================================
   GLOBAL STATE
======================================================= */
let isRunning = false
let pendingSync = false
let lastHistoryId: string | null = null

function log(step: string) {
  console.log(`[${new Date().toISOString()}] ${step}`)
}

/* =======================================================
   GMAIL CLIENT (OAUTH2)
======================================================= */
function getGmailClient() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, GOOGLE_REFRESH_TOKEN } = process.env

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    throw new Error('Missing Gmail OAuth2 credentials!')
  }

  const auth = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  )

  auth.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN })

  return google.gmail({ version: 'v1', auth })
}

/* =======================================================
   START GMAIL WATCH
======================================================= */
export async function startGmailWatch() {
  try {
    const gmail = getGmailClient()

    log('🚀 Starting Gmail watch...')

    const res = await gmail.users.watch({
      userId: 'me',
      requestBody: {
        topicName: 'projects/web-application-488012/topics/gmail-notifications',
        labelIds: ['INBOX'],
      },
    })

    lastHistoryId = res.data.historyId || null
    log('✅ Gmail watch started')
    log(`📢 Initial historyId: ${lastHistoryId}`)

    // Auto renew before expiration (6 days)
    setTimeout(startGmailWatch, 6 * 24 * 60 * 60 * 1000)

  } catch (err) {
    log('❌ Watch start error')
    console.error(err)
  }
}

/* =======================================================
   SYNC EMAILS
======================================================= */
async function syncEmails() {
  if (isRunning) {
    pendingSync = true
    log('⏳ Sync already running...')
    
return
  }

  if (!lastHistoryId) {
    log('⚠️ No stored historyId. Skipping.')
    
return
  }

  isRunning = true
  log(`🔄 START SYNC from historyId: ${lastHistoryId}`)

  try {
    const gmail = getGmailClient()

    const historyRes = await gmail.users.history.list({
      userId: 'me',
      startHistoryId: lastHistoryId,
      historyTypes: ['messageAdded'],
    })

    const records = historyRes.data.history || []

    log(`🗂️ Found ${records.length} history records`)

    for (const record of records) {
      if (!record.messagesAdded) continue

      for (const item of record.messagesAdded) {
        const msgId = item.message?.id

        if (!msgId) continue

        const exists = await prisma.email.findUnique({
          where: { messageId: msgId },
          select: { id: true },
        })

        if (exists) continue

        try {
          const full = await gmail.users.messages.get({
            userId: 'me',
            id: msgId,
            format: 'full',
          })

          if (!full.data || !full.data.payload) continue

          const headers = full.data.payload?.headers || []
          const getHeader = (name: string) => headers.find(h => h.name === name)?.value || ''

          const cleanEmail = (email: string) => {
            const match = email.match(/<(.+)>/)

            
return match ? match[1] : email
          }

          const toEmail = cleanEmail(getHeader('To'))

          const existingTo = await prisma.email.findFirst({
            where: { to: toEmail },
            select: { id: true },
          })

          const emailData = {
            uid: Number(full.data.historyId!),
            messageId: full.data.id!,
            folder: 'inbox',
            subject: getHeader('Subject'),
            fromName: getHeader('From'),
            fromEmail: cleanEmail(getHeader('From')),
            to: cleanEmail(getHeader('To')),
            date: new Date(Number(full.data.internalDate)),
            body: extractText(full.data.payload),
            htmlBody: extractHtml(full.data.payload),
            isRead: !full.data.labelIds?.includes('UNREAD'),
            isStarred: full.data.labelIds?.includes('STARRED'),
            labels: full.data.labelIds || [],
            hasAttachment: hasAttachments(full.data.payload),
            userId: 'cmm1yl2cc000xojim8iizjj3x',
          }

          const emptyEmail = {
            uid: Math.floor(Math.random() * 1000000000),
            messageId: crypto.randomUUID(),
            folder: 'inbox',
            subject: null,
            fromName: null,
            fromEmail: null,
            to: cleanEmail(getHeader('To')),
            date: new Date(),
            body: null,
            htmlBody: null,
            isRead: false,
            isStarred: false,
            labels: [],
            hasAttachment: false,
            userId: 'cmm1yl2cc000xojim8iizjj3x',
          }

          if (existingTo) {
            log(`🟢 Email exists, inserting only real email for ${toEmail}`)
            await prisma.email.createMany({ data: [emailData] })
          } else {
            log(`🔵 Email does not exist, inserting real + empty email for ${toEmail}`)
            await prisma.email.createMany({ data: [emailData, emptyEmail] })
          }

          log(`📥 Inserted: ${emailData.subject} ${emptyEmail.uid}`)

        } catch (err: any) {
          if (err.code === 404) {
            log(`⚠️ Message ${msgId} deleted, skipping`)
          } else {
            throw err
          }
        }
      }
    }

    if (historyRes.data.historyId) lastHistoryId = historyRes.data.historyId

  } catch (err: any) {
    log('❌ Sync error')
    console.error(err)
  } finally {
    isRunning = false
    log('🟢 END SYNC')

    if (pendingSync) {
      pendingSync = false
      await syncEmails()
    }
  }
}

/* =======================================================
   HELPERS
======================================================= */
function extractText(payload: any): string {
  if (!payload) return ''
  if (payload.mimeType === 'text/plain' && payload.body?.data)
    return Buffer.from(payload.body.data, 'base64').toString()

  if (payload.parts) {
    for (const part of payload.parts) {
      const text = extractText(part)

      if (text) return text
    }
  }

  return ''
}

function extractHtml(payload: any): string | null {
  if (!payload) return null
  if (payload.mimeType === 'text/html' && payload.body?.data)
    return Buffer.from(payload.body.data, 'base64').toString()

  if (payload.parts) {
    for (const part of payload.parts) {
      const html = extractHtml(part)

      if (html) return html
    }
  }

  return null
}

function hasAttachments(payload: any): boolean {
  if (!payload?.parts) return false
  
return payload.parts.some((p: any) => p.filename)
}

/* =======================================================
   INIT POLLING (Fully Free)
======================================================= */
startGmailWatch().then(() => log('🏁 Gmail watcher initialized'))

// Poll every 30 seconds instead of Pub/Sub
setInterval(async () => {
  log('⏱️ Polling Gmail for new messages...')
  await syncEmails()
}, 30_000) // 30 seconds
