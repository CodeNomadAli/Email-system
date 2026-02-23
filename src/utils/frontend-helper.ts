import { useContext } from 'react'

import { toast } from 'react-toastify'

import { getCoreRowModel, useReactTable, getPaginationRowModel } from '@tanstack/react-table'

import { BackdropController } from '@core/contexts/BackdropContext'
import { SettingsContext } from '@core/contexts/settingsContext'

export function showSuccess(message: string) {
  toast.success(message, {
    position: 'top-center'
  })
}

export function showError(message: string) {
  toast.error(message, {
    position: 'top-center'
  })
}

export function useCanDoAction() {
  const { permissions = [] } = useContext(SettingsContext)!.settings

  return (action: string) => permissions.includes(action)
}

export async function getFileUrl(filePath: string) {
  try {
    const req = await fetch(`/api/google-cloud?filePath=${filePath}`)

    if (!req.ok) {
      throw new Error('Failed to fetch file')
    }

    const res = await req.json()

    return res.data.url
  } catch (error) {}
}

export const formatDate = (date: string | Date) => {
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()

  return `${day}-${month}-${year}`
}

// Global helper functions
export const showLoading = () => {
  BackdropController.show()
}

export const hideLoading = () => {
  BackdropController.hide()
}

export function useReactTableHelper(data: any[], columns: any[], pagination: { pageIndex: number; pageSize: number }) {
  return useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination
    },
    filterFns: {
      fuzzy: () => false
    }
  })
}

export const sendNotification = async (
  message: string = 'no message',
  seePrevious: boolean = false,
  url: string = ''
) => {
  try {
    const req = await fetch(`/api/notify?seePrevious=${seePrevious}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message, url })
    })

    if (!req.ok) {
      throw new Error('Failed to send notification')
    }

    const res = await req.json()

    if (res.success) {
      console.log('Notification sent successfully')
    }
  } catch (error) {
    console.error('Error sending notification:', error)
  }
}

export const dynamicNotification = async (
  message: string = 'no message',
  channel: string = 'notification-channel',
  event: string = 'new-notification'
) => {
  try {
    const req = await fetch(`/api/notify/dynamically`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message, channel, event })
    })

    if (!req.ok) {
      throw new Error('Failed to send notification')
    }

    const res = await req.json()

    if (res.success) {
      console.log('Notification sent successfully')
    }
  } catch (error) {
    console.error('Error sending notification:', error)
  }
}

export const readNotification = async (notificationId: string) => {
  try {
    const req = await fetch(`/api/notify/read/${notificationId}`, {
      method: 'PUT'
    })

    if (!req.ok) {
      throw new Error('Failed to read notification')
    }

    const res = await req.json()

    if (res.success) {
      console.log('Notification marked as read successfully')
    }
  } catch (error) {
    console.error('Error marking notification as read:', error)
  }
}
