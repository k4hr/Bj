// src/bot/commands/pers/index.ts

import { TelegramWebhook } from '../../../controllers/webhook/receive-webhook'
import sendResponseToUser from '../../../controllers/handler-telegram/send-message-telegram'

// Тексты для кнопки (чтобы совпадали с меню)
const PERS_RU = '🧬 Мои персонажи'
const PERS_EN = '🧬 My characters'

// ==================== Публичные функции ====================

// Это вход в раздел персонажей? (команда или кнопка)
export const isPersEntryCommand = (text: string) => {
  if (!text) return false
  const trimmed = text.trim()
  return trimmed === '/pers' || trimmed === PERS_RU || trimmed === PERS_EN
}

// Активных сессий пока нет — всё выключено
export const hasActivePersSession = (_chatId: number) => {
  return false
}

// Единственный обработчик — просто заглушка
export const handlePersUpdate = async (body: TelegramWebhook) => {
  const msg = body.message
  const textFromUser = msg?.text || ''

  // Пытаемся угадать язык: если нажата RU-кнопка или язык юзера ru — отвечаем по-русски
  const isRu =
    textFromUser === PERS_RU ||
    msg?.from?.language_code?.toLowerCase().startsWith('ru')

  const response = isRu
    ? [
        '🧬 Раздел «Мои персонажи» пока в разработке.',
        '',
        'Совсем скоро тут можно будет создавать персонажей по фото, ',
        'сохранять их и озвучивать голосом нейросети.',
      ].join('\n')
    : [
        '🧬 The "My characters" section is under construction.',
        '',
        'Very soon you’ll be able to create characters from your photos,',
        'save them and give them an AI voice here.',
      ].join('\n')

  await sendResponseToUser({
    text: response,
    body,
  })

  return { message: 'Ok' }
}
