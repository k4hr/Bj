/* eslint-disable no-useless-escape */
import axios from 'axios'
import { TelegramWebhook } from '../webhook/receive-webhook'

interface ResponseToTelegram {
  text: string
  body: TelegramWebhook
  replyMarkup?: any // <-- добавили опциональное поле для клавиатуры
}

const sendResponseToUser = async ({ text, body, replyMarkup }: ResponseToTelegram) => {
  const token = process.env.TELEGRAM_TOKEN

  const payload: any = {
    chat_id: body.message.chat.id,
    text,
    parse_mode: 'HTML',
  }

  if (replyMarkup) {
    payload.reply_markup = replyMarkup
  }

  try {
    await axios({
      url: `https://api.telegram.org/bot${token}/sendMessage`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(payload),
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
