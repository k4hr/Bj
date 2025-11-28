// src/controllers/webhook/receive-webhook.ts

import { Request, Response } from 'express'
import { dispatchUpdate } from '../../bot/router'

export interface TelegramFrom {
  id: number
  is_bot?: boolean
  first_name?: string
  last_name?: string
  username?: string
  language_code?: string
}

export interface TelegramChat {
  id: number
  type: 'private' | 'group' | 'supergroup' | 'channel'
  title?: string
  username?: string
  first_name?: string
  last_name?: string
}

export interface TelegramPhotoSize {
  file_id: string
  width: number
  height: number
}

export interface TelegramMessage {
  message_id: number
  from?: TelegramFrom
  chat?: TelegramChat
  date?: number
  text?: string
  photo?: TelegramPhotoSize[]
}

export interface TelegramWebhook {
  update_id: number
  message?: TelegramMessage
  // если потом понадобится: edited_message?: TelegramMessage; callback_query и т.д.
}

export const receiveWebhook = async (req: Request, res: Response) => {
  const body = req.body as TelegramWebhook

  const msg = body.message

  if (msg?.chat?.id) {
    console.log({
      message: 'Message received',
      chat: msg.chat.id,
      name: msg.from?.first_name,
      new_message: msg.text,
    })
  } else {
    // сюда попадаем на служебных апдейтах без message/chat
    console.log('Update without message.chat, skipping', JSON.stringify(body))
  }

  try {
    await dispatchUpdate(body)
  } catch (error) {
    console.error('Error handling Telegram update:', error)
    // Telegram всё равно главное — получить 200, чтобы не спамил ретраями
  }

  // всегда отвечаем ok
  return res.sendStatus(200)
}

export default receiveWebhook
