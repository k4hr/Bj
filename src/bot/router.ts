// src/bot/router.ts

import { TelegramWebhook } from '../controllers/webhook/receive-webhook'
import { handleStart, handleLanguageSelection } from './commands/start'
import { handleUnknown } from './commands/unknown'
import { handleMenuAction, isMenuButton } from './commands/menu'

export const dispatchUpdate = async (body: TelegramWebhook) => {
  const msg = body.message

  console.log('dispatchUpdate called, raw message =', {
    chat_id: msg?.chat?.id,
    type: msg?.chat?.type,
    text: msg?.text,
  })

  // Если нет текста — стикер/фото/голос — отвечаем мягко
  if (!msg || typeof msg.text !== 'string') {
    return handleUnknown(body, true)
  }

  const text = msg.text.trim()

  // 1) /start
  if (text === '/start') {
    return handleStart(body)
  }

  // 2) Выбор языка
  if (text === '🇷🇺 Русский' || text === '🇬🇧 English') {
    return handleLanguageSelection(body)
  }

  // 3) Кнопки главного меню ИЛИ команда /pers
  if (isMenuButton(text) || text === '/pers') {
    return handleMenuAction(body)
  }

  // 4) Всё остальное
  return handleUnknown(body, false)
}
