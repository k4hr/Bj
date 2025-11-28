/* eslint-disable no-useless-escape */
import axios from 'axios'
import { TelegramWebhook } from '../webhook/receive-webhook'

interface ResponseToTelegram {
  text: string
  body: TelegramWebhook
  replyMarkup?: any
}

// универсальная отправка текста
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
    console.log(err)
    return {
      message: err,
    }
  }
}

// отдельная функция для удаления сообщений
export const deleteTelegramMessage = async (
  chatId: number,
  messageId: number
) => {
  const token = process.env.TELEGRAM_TOKEN

  if (!token) {
    console.error('TELEGRAM_TOKEN is not set in environment variables')
    return { message: 'TELEGRAM_TOKEN is missing' }
  }

  try {
    await axios({
      url: `https://api.telegram.org/bot${token}/deleteMessage`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
      }),
    })

    return { message: 'OK' }
  } catch (err) {
    console.log('deleteTelegramMessage error', err)
    return { message: err }
  }
}

// отправка фото по file_id
export const sendPhotoToUser = async (params: {
  body: TelegramWebhook
  fileId: string
  caption?: string
  replyMarkup?: any
}) => {
  const { body, fileId, caption, replyMarkup } = params
  const token = process.env.TELEGRAM_TOKEN

  if (!token) {
    console.error('TELEGRAM_TOKEN is not set in environment variables')
    return { message: 'TELEGRAM_TOKEN is missing' }
  }

  const payload: any = {
    chat_id: body.message.chat.id,
    photo: fileId,
  }

  if (caption) payload.caption = caption
  if (replyMarkup) payload.reply_markup = replyMarkup

  try {
    await axios({
      url: `https://api.telegram.org/bot${token}/sendPhoto`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(payload),
    })

    return { message: 'OK' }
  } catch (err) {
    console.log('sendPhotoToUser error', err)
    return { message: err }
  }
}

export default sendResponseToUser
