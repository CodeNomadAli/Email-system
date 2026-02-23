'use client'

import React, { useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'

export default function CanvaEditor() {
  const editorRef = useRef<any>(null)
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const [sending, setSending] = useState(false)

  // Get editor content
  const getContent = () => editorRef.current?.getContent() || ''

  // Download function
  const downloadFile = (type: 'pdf' | 'doc' | 'txt') => {
    const content = getContent()

    if (type === 'txt') {
      const blob = new Blob([content.replace(/<[^>]+>/g, '')], { type: 'text/plain' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'document.txt'
      link.click()
    } else {
      // Trigger TinyMCE export plugin for Word/PDF
      editorRef.current.execCommand(type === 'pdf' ? 'mceExportPdf' : 'mceExportWord')
    }
  }

  // Send document via email (requires backend)
  const sendEmail = async (type: 'pdf' | 'doc' | 'txt') => {
    if (!email) return alert('Please enter an email')
    setSending(true)

    try {
      await fetch('/api/send-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          note,
          type,
          html: getContent(),
        }),
      })

      alert('Document sent successfully ✨')
      setEmail('')
      setNote('')
    } catch (err) {
      console.error(err)
      alert('Failed to send document')
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* TinyMCE Editor */}
      <Editor
        apiKey="7qare1j3cfgpd60hikdiz50re2py59xgdg5jck4m2jyzyzpb"
        onInit={(_, editor) => (editorRef.current = editor)}
        init={{
          plugins: [
            'anchor','autolink','charmap','codesample','emoticons','link',
            'lists','media','searchreplace','table','visualblocks','wordcount',
            'checklist','mediaembed','casechange','formatpainter','pageembed',
            'a11ychecker','tinymcespellchecker','permanentpen','powerpaste',
            'advtable','advcode','advtemplate','ai','uploadcare','mentions',
            'tinycomments','tableofcontents','footnotes','mergetags',
            'autocorrect','typography','inlinecss','markdown','importword',
            'exportword','exportpdf'
          ],
          toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
          tinycomments_mode: 'embedded',
          tinycomments_author: 'Author name',
          mergetags_list: [
            { value: 'First.Name', title: 'First Name' },
            { value: 'Email', title: 'Email' },
          ],
          ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
          uploadcare_public_key: 'a81adf2aebe5c6855f5c',
        }}
        initialValue="Welcome to AxoraWeb"
      />

      {/* Canva-style share bar */}
      <div
        style={{
          marginTop: 16,
          padding: 12,
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          alignItems: 'center',
          background: '#fafafa',
        }}
      >
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: '8px 10px',
            borderRadius: 6,
            border: '1px solid #d1d5db',
            minWidth: 220,
          }}
        />

        <input
          type="text"
          placeholder="Add a note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{
            padding: '8px 10px',
            borderRadius: 6,
            border: '1px solid #d1d5db',
            minWidth: 240,
            flex: 1,
          }}
        />

        {/* Download buttons */}
        <button onClick={() => downloadFile('pdf')}>Download PDF</button>
        <button onClick={() => downloadFile('doc')}>Download Word</button>
        <button onClick={() => downloadFile('txt')}>Download Text</button>

        {/* Send via email buttons */}
        <button onClick={() => sendEmail('pdf')} disabled={sending}>Send PDF</button>
        <button onClick={() => sendEmail('doc')} disabled={sending}>Send Word</button>
        <button onClick={() => sendEmail('txt')} disabled={sending}>Send Text</button>
      </div>
    </div>
  )
}
