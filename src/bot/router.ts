// src/bot/router.ts

import { TelegramWebhook } from '../controllers/webhook/receive-webhook'
import { handleStart, handleLanguageSelection } from './commands/start'
import { handleUnknown } from './commands/unknown'
import {
  handleMenuAction,
  isMenuButton,
  RU_MENU_BUTTONS,
  EN_MENU_BUTTONS,
} from './commands/menu'
import {
  handlePersUpdate,
  isPersEntryCommand,
  hasActivePersSession,
} from './commands/pers'

export const dispatchUpdate = async (body: TelegramWebhook) => {
  const msg = body.message

  console.log('dispatchUpdate called, raw message =', {
    chat_id: msg?.chat?.id,
    type: msg?.chat?.type,
    text: msg?.text,
  })

  const chatId = msg?.chat?.id

  // Если уже идёт диалог создания персонажа — отдаём всё туда
  if (chatId && hasActivePersSession(chatId)) {
    return handlePersUpdate(body)
  }

  // Если нет текста (стикер/фото/голос) и нет активной сессии — заглушка
  if (!msg || typeof msg.text !== 'string') {
    return handleUnknown(body, true)
  }

  const text = msg.text.trim()

  // 1) /start
  if (text === '/start') {
    return handleStart(body)
  }

  // 2) выбор языка
  if (text === '🇷🇺 Русский' || text === '🇬🇧 English') {
    return handleLanguageSelection(body)
  }

  // 3) Вход в "Мои персонажи": кнопка из меню или /pers
  if (
    isPersEntryCommand(text) ||
    text === RU_MENU_BUTTONS.CHARACTERS ||
    text === EN_MENU_BUTTONS.CHARACTERS
  ) {
    return handlePersUpdate(body)
  }

  // 4) Кнопки главного меню (профиль, VoiceAI, купить токены и т.д.)
  if (isMenuButton(text)) {
    return handleMenuAction(body)
  }

  // 5) Всё остальное
  return handleUnknown(body, false)
}
