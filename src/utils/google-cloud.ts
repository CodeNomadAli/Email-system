import type { GetSignedUrlConfig } from '@google-cloud/storage'
import { Storage } from '@google-cloud/storage'

const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  credentials: {
    client_email: process.env.GCS_CLIENT_EMAIL,
    private_key: process.env.GCS_PRIVATE_KEY?.split(String.raw`\n`).join('\n')
  }
})

export const initBucket = async (bucketName: string = '') => {
  if (!bucketName) bucketName = process.env.GCS_BUCKET_NAME || ''

  const isBucketExist = await checkBucketExists(bucketName)

  if (isBucketExist) {
    return storage.bucket(bucketName)
  }

  const [bucket] = await storage.createBucket(bucketName)

  return bucket
}

async function checkBucketExists(bucketName: string) {
  try {
    const bucket = storage.bucket(bucketName)
    const [exists] = await bucket.exists()

    return exists ? true : false
  } catch (err) {
    console.error('Error checking if bucket exists:', err)
  }
}

export async function generateV4ReadSignedUrl(fileName: string, bucketName: string = '') {
  try {
    if (!bucketName) bucketName = process.env.GCS_BUCKET_NAME || ''

    // These options will allow temporary read access to the file
    const options: GetSignedUrlConfig = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000 // 15 minutes
    }

    // Get a v4 signed URL for reading the file
    const [url] = await storage
      .bucket(bucketName)
      .file(fileName)
      .getSignedUrl(options as GetSignedUrlConfig)

    console.log('Generated Google GET signed URL')

    return url
  } catch (error) {
    console.error('Error getting file from bucket:', error)
  }
}

export async function uploadFileToBucket(bucketName: string, fileName: string, file: Buffer | File) {
  try {
    const bucket = storage.bucket(bucketName)
    const bucketFile = bucket.file(fileName)

    if (file instanceof Buffer) {
      await bucketFile.save(file)
    } else {
      throw new Error('Unsupported file type')
    }

    console.log(`${fileName} uploaded to ${bucketName}`)

    return { bucketName, fileName }
  } catch (error) {
    console.error('Error uploading file to bucket:', error)
  }
}

export async function downloadFileFromBucket(bucketName: string, fileName: string, destFileName: string) {
  try {
    const options = {
      destination: destFileName
    }

    await storage.bucket(bucketName).file(fileName).download(options)
    console.log(`gs://${bucketName}/${fileName} downloaded to ${destFileName}.`)
  } catch (error) {
    console.error('Error downloading file from bucket:', error)
  }
}

export async function getCborSignedUrl(prefix: string) {
  const bucket = storage.bucket(process.env.GCS_BUCKET_NAME || '')

  const [files] = await bucket.getFiles({ prefix })

  console.log(files)

  // Find the .cbor file
  const cborFile = files.find(file => file.name.endsWith('.cbor'))

  if (!cborFile) {
    throw new Error('No .cbor file found in the folder')
  }

  const [url] = await cborFile.getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + 15 * 60 * 1000 // 15 mins
  })

  return url
}
