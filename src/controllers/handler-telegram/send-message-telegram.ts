/* eslint-disable no-useless-escape */
import axios from 'axios'
import { TelegramWebhook } from '../webhook/receive-webhook'

interface ResponseToTelegram {
  text: string
  body: TelegramWebhook
  replyMarkup?: any
}

const sendResponseToUser = async ({
  text,
  body,
  replyMarkup,
}: ResponseToTelegram) => {
  const token = process.env.TELEGRAM_TOKEN

  if (!token) {
    console.error('TELEGRAM_TOKEN is not set in environment variables')
    return { message: 'TELEGRAM_TOKEN is missing' }
  }

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
    console.log('Error sending message to Telegram:', err)
    return {
      message: err,
    }
  }
}

/**
 * Удаление сообщения пользователя (кнопка, /start, /pers и т.д.)
 */
export const deleteTelegramMessage = async (
  chatId: number,
  messageId: number
) => {
  const token = process.env.TELEGRAM_TOKEN

  if (!token) {
    console.error('TELEGRAM_TOKEN is not set in environment variables')
    return { ok: false, error: 'TELEGRAM_TOKEN is missing' }
  }

  try {
    const res = await axios.post(
      `https://api.telegram.org/bot${token}/deleteMessage`,
      {
        chat_id: chatId,
        message_id: messageId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    return res.data
  } catch (err) {
    console.log('Error deleting Telegram message:', err)
    return { ok: false, error: err }
  }
}

export default sendResponseToUser
