/* eslint-disable no-useless-escape */
import axios from 'axios'
import { TelegramWebhook } from '../webhook/receive-webhook'

interface ResponseToTelegram {
  text: string
  body: TelegramWebhook
}

const sendResponseToUser = async ({ text, body }: ResponseToTelegram) => {
  const token = process.env.TELEGRAM_TOKEN

  const text_options = {
    parse_mode: 'HTML',
  }

  const message = {
    chat_id: body.message.chat.id,
    text,
    ...text_options,
  }

  try {
    await axios({
      url: `https://api.telegram.org/bot${token}/sendMessage`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(message),
    })

    return {
      message: 'OK',
    }
  } catch (err) {
    console.log(err)
    return {
      message: err,
    }
  }
}

export default sendResponseToUser
