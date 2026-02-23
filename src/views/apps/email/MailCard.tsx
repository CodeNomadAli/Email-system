// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

// Third-party Imports
import classnames from 'classnames'
import DOMPurify from 'dompurify'

// Type Imports
import type { Email } from '@/types/apps/emailTypes'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'

// Styles Imports
import styles from './styles.module.css'
import { showError, showSuccess } from '@/front-helper'

// ────────────────────────────────────────────────
// DOMPurify config (fixed – no conflict)
const purifyConfig = {
  ADD_TAGS: ['style'],
  ADD_ATTR: ['target', 'class', 'id', 'bgcolor', 'align', 'valign'],
  FORBID_TAGS: [
    'script',
    'iframe',
    'object',
    'embed',
    'form',
    'input',
    'textarea',
    'button',
    'link',
    'meta',
    'base',
    'frame',
    'frameset',
  ],
  FORBID_ATTR: ['on*', 'action', 'formaction', 'srcdoc'],
  ALLOWED_URI_REGEXP:
    /^(?:(?:https?|mailto|tel|sms|data:image\/(?:png|gif|jpeg|webp|svg\+xml)):|[^&:\/?#]*(?:[\/?#]|$))/i,
  KEEP_CONTENT: true,
}

const CardHeaderAction = ({ data, isReplies }: { data: Email; isReplies: boolean }) => {
  return (
    <div className='flex items-center gap-4'>
      <Typography color='text.disabled'>
        {new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }).format(new Date(data.time))}
      </Typography>
      <div className='flex items-center gap-1'>
        {data.attachments.length ? (
          <IconButton>
            <i className='tabler-paperclip text-textSecondary' />
          </IconButton>
        ) : null}
        {isReplies ? (
          <OptionMenu
            iconClassName='text-textSecondary'
            iconButtonProps={{ size: 'medium' }}
            options={[
              { text: 'Reply', icon: 'tabler-arrow-back-up' },
              { text: 'Forward', icon: 'tabler-arrow-forward-up' }
            ]}
          />
        ) : (
          <IconButton>
            <i className='tabler-dots-vertical text-textSecondary' />
          </IconButton>
        )}
      </div>
    </div>
  )
}

const MailCard = ({ data, isReplies }: { data: Email; isReplies: boolean }) => {
  // Sanitize
  const cleanHtml = DOMPurify.sanitize(data.message || data.htmlBody || '', purifyConfig)

  // ─── Extract OTP (6 digits) ───────────────────────────────
  const otp = (() => {
    let text = data.body || ''

    if (cleanHtml) {
      const doc = new DOMParser().parseFromString(cleanHtml, 'text/html')

      text = doc.body.textContent?.trim() || text
    }

    const match = text.match(/\b\d{6}\b/)


    return match ? match[0] : null
  })()

  // Simple copy helper
  const copyToClipboard = async (text: string, msg: string) => {
    try {
      await navigator.clipboard.writeText(text)
      showSuccess(msg) // ← replace with toast/snackbar later if you want
    } catch {
      showError('Copy failed')
    }
  }

  return (
    <Card className='border' sx={{ position: 'relative' }}>
      {/* ─── Triangle pointer at top ─────────────────────────────── */}
      <Box
        sx={{
          position: 'absolute',
          top: -10,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '12px solid transparent',
          borderRight: '12px solid transparent',
          borderBottom: '12px solid',
          borderBottomColor: 'background.paper', // matches card background
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      <CardContent className='flex is-full gap-4'>
        <CustomAvatar src={data.from.avatar} size={38} alt={data.from.name} />
        <div className='flex items-center justify-between flex-wrap grow gap-x-4 gap-y-2'>
          <div className='flex flex-col'>
            <Typography color='text.primary'>{data.from.name}</Typography>
            <Typography variant='body2'>{data.from.email}</Typography>
          </div>
          <CardHeaderAction data={data} isReplies={isReplies} />
        </div>
      </CardContent>

      <Divider />

      <CardContent sx={{ position: 'relative' }}>
        {/* ─── OTP copy area (only added when OTP exists) ──────────── */}
        {otp && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              mb: 2,
              flexWrap: 'wrap',
            }}
          >
            <Box
            className="border"
              sx={{
                bgcolor: '', // green like your screenshot
                color: 'white',
                px: 2,
                py: 0.8,
                borderRadius: 50,
                fontSize: '1.1rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <ContentCopyIcon fontSize='small' sx={{ opacity: 0.9 }} />
              {otp}
            </Box>

            <Tooltip title='Copy verification code'>
              <span
                size='small'
                onClick={() => copyToClipboard(otp, `Code ${otp} copied!`)}
                sx={{
                  bgcolor: '',
                  color: 'white',
                  '&:hover': { bgcolor: '' },
                }}
              >
                <ContentCopyIcon fontSize='small' />
              </span>
            </Tooltip>
          </Box>
        )}

        {/* Original message rendering – untouched */}
        <div
          className={classnames('text-green', styles.message)}
          dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />

        {data.attachments.length ? (
          <div className='flex flex-col gap-4'>
            <hr className='border-be -mli-6 mbs-4' />
            <Typography variant='caption'>Attachments</Typography>
            {data.attachments.map(attachment => (
              <div key={attachment.fileName} className='flex items-center gap-2'>
                <img src={attachment.thumbnail} alt={attachment.fileName} className='bs-6' />
                <Typography>{attachment.fileName}</Typography>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>

      {/* Optional: small full-message copy button at bottom-right */}
      <Tooltip title='Copy full message text'>
        <IconButton
          size='small'
          onClick={() => {
            const text = new DOMParser()
              .parseFromString(cleanHtml, 'text/html')
              .body.textContent?.trim() || data.body || ''

            copyToClipboard(text, 'Full message copied')
          }}
          sx={{
            position: 'absolute',
            bottom: 12,
            right: 16,
            bgcolor: 'background.paper',
            boxShadow: 1,
          }}
        >
          <ContentCopyIcon fontSize='small' color='action' />
        </IconButton>
      </Tooltip>
    </Card>
  )
}

export default MailCard
