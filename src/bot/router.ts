// src/bot/router.ts

import { TelegramWebhook } from '../controllers/webhook/receive-webhook'
import sendResponseToUser from '../controllers/handler-telegram/send-message-telegram'
import { handleStart, handleLanguageSelection } from './commands/start'

export const dispatchUpdate = async (body: TelegramWebhook) => {
  const text = body.message.text || ''

  // 1) Команда /start
  if (text === '/start') {
    return handleStart(body)
  }

  // 2) Нажатие на кнопки выбора языка
  if (text === '🇷🇺 Русский' || text === '🇬🇧 English') {
    return handleLanguageSelection(body)
  }

  // 3) Всё остальное — пока заглушка
  const response = [
    'Я пока понимаю только базовые команды.',
    '',
    'Нажми /start, чтобы выбрать язык и увидеть доступные функции.',
  ].join('\n')

  await sendResponseToUser({
    text: response,
    body,
  })

  return { message: 'Ok' }
}
