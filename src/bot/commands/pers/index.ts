// src/bot/commands/pers/index.ts

import { TelegramWebhook } from '../../../controllers/webhook/receive-webhook'
import sendResponseToUser from '../../../controllers/handler-telegram/send-message-telegram'

// Тексты для кнопок (на будущее, если где-то используешь)
const CREATE_PERS_RU = '➕ Создать персонажа'
const CREATE_PERS_EN = '➕ Create character'

// ==================== Публичные функции ====================

// Это вход в раздел персонажей?
export const isPersEntryCommand = (text: string) => {
  if (!text) return false

  return (
    text === '/pers' ||
    text === '🧬 Мои персонажи' ||
    text === '🧬 My characters' ||
    text === CREATE_PERS_RU ||
    text === CREATE_PERS_EN
  )
}

// Активных сессий персонажей сейчас нет вообще — всё заглушка
export const hasActivePersSession = (_chatId: number) => {
  return false
}

// Один простой обработчик: отвечаем заглушкой
export const handlePersUpdate = async (body: TelegramWebhook) => {
  const text = [
    '🧬 Раздел «Мои персонажи» сейчас в разработке.',
    '',
    'Скоро здесь можно будет:',
    '• загружать фото и создавать персонажей;',
    '• давать им имена и сохранять;',
    '• быстро выбирать персонажа из списка.',
    '',
    'Пока это просто заглушка, чтобы интерфейс выглядел цельно.',
  ].join('\n')

  await sendResponseToUser({
    text,
    body,
  })

  return { message: 'Ok' }
}
