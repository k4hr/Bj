import { TelegramWebhook } from '../webhook/receive-webhook'
import startMessage from './messages/start'
import sendResponseToUser from './send-message-telegram'

const verifyMessage = async (body: TelegramWebhook) => {
  const message = body.message.text

  let response: string

  switch (message) {
    case '/start':
      response = startMessage(body.message.from.first_name)
      break
    // Add new functions in your messages
  }

  await sendResponseToUser({
    text: response,
    body,
  })

  return {
    message: 'Ok',
  }
}

export default verifyMessage
