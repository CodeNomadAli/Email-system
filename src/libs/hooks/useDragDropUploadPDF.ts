import type { GCSData } from '@/types'

export function useDragDropUploadPDF() {
  return async (filename: string, file: File) => {
    try {
      const response = await fetch(`/api/file-upload?file=${filename}`, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch upload URL: ${response.statusText}`)
      }

      const { data, status } = await response.json()

      if (status !== 200) {
        throw new Error(`Unexpected status code: ${status}`)
      }

      await googleCloudUpload(data.gcs, file)

      return data.uploadedFile
    } catch (error) {
      console.error('Error uploading file:', error)

      return false
    }
  }
}

export function useFileUpload() {
  return async (formData: FormData, file: File) => {
    try {
      const response = await fetch(`/api/hub/filemanager/file-upload`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch upload URL: ${response.statusText}`)
      }

      const { data, status } = await response.json()

      if (status !== 200) {
        throw new Error(`Unexpected status code: ${status}`)
      }

      await googleCloudUpload(data.gcs, file)

      await fetch(`/api/hub/filemanager/file-upload`, {
        method: 'PUT',
        body: JSON.stringify({
          fileId: data.uploadedFile.id,
          status: 'COMPLETED'
        })
      })

      return data.uploadedFile
    } catch (error) {
      console.error('Error uploading file:', error)

      return false
    }
  }
}

const googleCloudUpload = async (data: GCSData, file: File): Promise<void> => {
  try {
    const formData = new FormData()

    Object.entries({ ...data.fields, file }).forEach(([key, value]) => {
      formData.append(key, value as string | Blob)
    })

    const uploadResponse = await fetch(data.url, {
      method: 'POST',
      body: formData
    })

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload file: ${uploadResponse.statusText}`)
    }
  } catch (error) {
    throw new Error('Error Uploading file')
  }
}
