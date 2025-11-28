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

  // нет сообщения вообще — странно, но такое бывает
  if (!msg) {
    return handleUnknown(body, true)
  }

  const chatId = msg.chat.id
  const text = typeof msg.text === 'string' ? msg.text.trim() : ''

  // 0) если уже идёт сценарий создания персонажа — всё туда
  if (hasActivePersSession(chatId)) {
    return handlePersUpdate(body)
  }

  // 1) /start
  if (text === '/start') {
    return handleStart(body)
  }

  // 2) выбор языка
  if (text === '🇷🇺 Русский' || text === '🇬🇧 English') {
    return handleLanguageSelection(body)
  }

  // 3) Вход в раздел "Мои персонажи":
  // - явная команда /pers
  // - кнопка меню "Мои персонажи" (RU/EN)
  // - спец-тексты из pers (Создать персонажа и т.п.)
  if (
    isPersEntryCommand(text) ||
    text === RU_MENU_BUTTONS.CHARACTERS ||
    text === EN_MENU_BUTTONS.CHARACTERS
  ) {
    return handlePersUpdate(body)
  }

  // 4) Остальные кнопки главного меню
  if (isMenuButton(text)) {
    return handleMenuAction(body)
  }

  // 5) Всё остальное
  return handleUnknown(body, false)
}
