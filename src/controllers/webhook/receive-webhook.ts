import { Request, Response } from 'express'
import { dispatchUpdate } from '../../bot/router'

export interface TelegramFrom {
  id: number
  is_bot: boolean
  first_name?: string
  last_name?: string
  username?: string
  language_code?: string
}

export interface TelegramChat {
  id: number
  first_name?: string
  last_name?: string
  username?: string
  type: string
}

export interface TelegramNewMessage {
  message_id: number
  from: TelegramFrom
  chat: TelegramChat
  date: number
  text: string
}

export interface TelegramWebhook {
  update_id: number
  message: TelegramNewMessage
}

const receiveWebhook = async (req: Request, res: Response) => {
  const update: TelegramWebhook = req.body

  console.log({
    message: 'Message received',
    chat: update.message.chat.id,
    name: update.message.from.first_name,
    new_message: update.message.text,
  })

  try {
    await dispatchUpdate(update)
    res.sendStatus(200)
  } catch (error) {
    console.error('Error handling Telegram update:', error)
    res.sendStatus(500)
  }
}

export default receiveWebhook
