import Pusher from 'pusher-js'

// Pusher.logToConsole = true

const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
})

export default pusherClient
