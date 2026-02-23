// Third-party Imports
import { createSlice } from '@reduxjs/toolkit'

// Type Imports
import type { Email, EmailState } from '@/types/apps/emailTypes'

// Constants
const initialState: EmailState = {
  emails: [],
  filteredEmails: [],
  currentEmailId: null
}

export const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    setEmails: (state, action) => {
      state.emails = action.payload
      state.filteredEmails = action.payload
    },

    filterEmails: (state, action) => {
      const { emails, folder, label, uniqueLabels } = action.payload

      state.filteredEmails = emails.filter((email: Email) => {
        if (folder === 'starred' && email.folder !== 'trash') {
          return email.isStarred
        }
        if (uniqueLabels.includes(label) && email.folder !== 'trash') {
          return email.labels.includes(label)
        }
        return email.folder === folder
      })
    },

    moveEmailsToFolder: (state, action) => {
      const { emailIds, folder } = action.payload
      state.emails = state.emails.map(email =>
        emailIds.includes(email.id) ? { ...email, folder } : email
      )
    },

    deleteTrashEmails: (state, action) => {
      const { emailIds } = action.payload
      state.emails = state.emails.filter(email => !emailIds.includes(email.id))
    },

    toggleReadEmails: (state, action) => {
      const { emailIds } = action.payload

      const hasUnread = state.filteredEmails
        .filter(e => emailIds.includes(e.id))
        .some(e => !e.isRead)

      const allUnread = state.filteredEmails
        .filter(e => emailIds.includes(e.id))
        .every(e => !e.isRead)

      const allRead = state.filteredEmails
        .filter(e => emailIds.includes(e.id))
        .every(e => e.isRead)

      state.emails = state.emails.map(email => {
        if (!emailIds.includes(email.id)) return email
        if (hasUnread || allUnread) return { ...email, isRead: true }
        if (allRead) return { ...email, isRead: false }
        return email
      })
    },

    toggleLabel: (state, action) => {
      const { emailIds, label } = action.payload
      state.emails = state.emails.map(email => {
        if (!emailIds.includes(email.id)) return email
        if (email.labels.includes(label)) {
          return { ...email, labels: email.labels.filter(l => l !== label) }
        }
        return { ...email, labels: [...email.labels, label] }
      })
    },

    toggleStarEmail: (state, action) => {
      const { emailId } = action.payload
      state.emails = state.emails.map(email =>
        email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
      )
    },

    getCurrentEmail: (state, action) => {
      state.currentEmailId = action.payload
      state.emails = state.emails.map(email =>
        email.id === action.payload && !email.isRead
          ? { ...email, isRead: true }
          : email
      )
    },

    navigateEmails: (state, action) => {
      const { type, emails: filteredEmails, currentEmailId } = action.payload
      const idx = filteredEmails.findIndex(e => e.id === currentEmailId)

      if (type === 'next' && idx < filteredEmails.length - 1) {
        state.currentEmailId = filteredEmails[idx + 1].id
      } else if (type === 'prev' && idx > 0) {
        state.currentEmailId = filteredEmails[idx - 1].id
      }

      if (state.currentEmailId) {
        const email = state.emails.find(e => e.id === state.currentEmailId)
        if (email) email.isRead = true
      }
    }
  }
})

export const {
  setEmails,
  filterEmails,
  moveEmailsToFolder,
  deleteTrashEmails,
  toggleReadEmails,
  toggleLabel,
  toggleStarEmail,
  getCurrentEmail,
  navigateEmails
} = emailSlice.actions

export default emailSlice.reducer
