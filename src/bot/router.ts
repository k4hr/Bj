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

  // Если вообще нет message — странный апдейт, отвечаем мягко
  if (!msg) {
    return handleUnknown(body, true)
  }

  const chatId = msg.chat.id

  // 0) Если уже идёт сценарий создания персонажа —
  //    ЛЮБОЙ апдейт (текст, фото и т.п.) отдаём в pers-сценарий
  if (hasActivePersSession(chatId)) {
    return handlePersUpdate(body)
  }

  // 1) Если нет текстового сообщения и нет pers-сессии —
  //    это стикер/фото/войс не по сценарию, отвечаем мягко
  if (typeof msg.text !== 'string') {
    return handleUnknown(body, true)
  }

  const text = msg.text.trim()

  // 2) /start
  if (text === '/start') {
    return handleStart(body)
  }

  // 3) выбор языка
  if (text === '🇷🇺 Русский' || text === '🇬🇧 English') {
    return handleLanguageSelection(body)
  }

  // 4) Вход в раздел "Мои персонажи":
  //    - явная команда /pers
  //    - кнопка меню "Мои персонажи" (RU/EN)
  //    - спец-тексты из pers (Создать персонажа и т.п.)
  if (
    isPersEntryCommand(text) ||
    text === RU_MENU_BUTTONS.CHARACTERS ||
    text === EN_MENU_BUTTONS.CHARACTERS
  ) {
    return handlePersUpdate(body)
  }

  // 5) Остальные кнопки главного меню
  if (isMenuButton(text)) {
    return handleMenuAction(body)
  }

  // 6) Всё остальное — неизвестная команда/текст
  return handleUnknown(body, false)
}
