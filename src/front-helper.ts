import { toast } from 'react-toastify'

export function showError(message: string) {
  toast.error(message, {
    position: 'top-center'
  })
}

export function showSuccess(message: string) {
  toast.success(message, {
    position: 'top-center'
  })
}
