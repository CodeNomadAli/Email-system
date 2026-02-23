import { ZodError } from 'zod'

import pusher from '@/libs/pusher-backened'
import { apiResponse, catchErrors } from '@/utils/backend-helper'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { message, channel, event } = body

    if (!message) {
      return catchErrors(new Error('Missing required fields'), 'message is required', 400)
    }

    if (!message) {
      throw new Error('Message object is undefined or null')
    }

    // Validate and construct the payload
    const payload = {
      Timestamp: new Date().toISOString(),
      Format: message.Format || 'ANSI', // Default to 'ANSI' if not provided
      Data: message.Data || '', // Expect base64-encoded fingerprint data
      message
    }

    console.log(event, channel, 'Sending payload:', payload)

    // Send the payload to Pusher without double-stringifying
    await pusher.trigger(channel, event, payload)

    return apiResponse({}, 'Notifications sent and stored successfully for all super-admin users')
  } catch (error) {
    console.error(error)

    if (error instanceof ZodError) {
      return catchErrors(error, 'Invalid data', 400)
    }

    return catchErrors(error as Error, 'Failed to send notification')
  }
}
