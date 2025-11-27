// src/bot/commands/menu/index.ts

import { TelegramWebhook } from '../../../controllers/webhook/receive-webhook'
import sendResponseToUser from '../../../controllers/handler-telegram/send-message-telegram'

// Тексты кнопок — в одном месте, чтобы не ошибиться
export const RU_MENU_BUTTONS = {
  PROFILE: '👤 Мой профиль',
  VOICEAI: '🎤 VoiceAI',
  SUPPORT: '💬 Поддержка',
  TERMS: '📜 Условия использования',
}

export const EN_MENU_BUTTONS = {
  PROFILE: '👤 My profile',
  VOICEAI: '🎤 VoiceAI',
  SUPPORT: '💬 Support',
  TERMS: '📜 Terms of Use',
}

// Клавиатура главного меню
export const buildMainMenuKeyboard = (lang: 'ru' | 'en') => {
  const b = lang === 'ru' ? RU_MENU_BUTTONS : EN_MENU_BUTTONS

  return {
    keyboard: [
      [ { text: b.PROFILE }, { text: b.VOICEAI } ],
      [ { text: b.SUPPORT }, { text: b.TERMS } ],
    ],
    resize_keyboard: true,
    one_time_keyboard: false,
  }
}

// Проверка: это одна из наших кнопок меню?
export const isMenuButton = (text: string) => {
  const allButtons = [
    ...Object.values(RU_MENU_BUTTONS),
    ...Object.values(EN_MENU_BUTTONS),
  ]
  return allButtons.includes(text)
}

// Обработка нажатий на кнопки меню
export const handleMenuAction = async (body: TelegramWebhook) => {
  const text = body.message.text
  let response: string

  switch (text) {
    case RU_MENU_BUTTONS.PROFILE:
    case EN_MENU_BUTTONS.PROFILE:
      response = [
        '👤 Профиль пока в разработке.',
        'Скоро здесь будет баланс генераций, история и настройки.',
      ].join('\n')
      break

    case RU_MENU_BUTTONS.VOICEAI:
    case EN_MENU_BUTTONS.VOICEAI:
      response = [
        '🎤 Раздел VoiceAI скоро будет доступен.',
        'Здесь будут все голосовые функции: TTS, Voice Changer и другие.',
      ].join('\n')
      break

    case RU_MENU_BUTTONS.SUPPORT:
    case EN_MENU_BUTTONS.SUPPORT:
      response = [
        '💬 Поддержка бота.',
        'Пока просто напишите сюда ваш вопрос — мы всё прочитаем.',
      ].join('\n')
      break

    case RU_MENU_BUTTONS.TERMS:
    case EN_MENU_BUTTONS.TERMS:
      response = [
        '📜 Условия использования будут оформлены здесь чуть позже.',
        'Главное: не злоупотребляйте сервисом и не нарушайте законы.',
      ].join('\n')
      break

    default:
      response = 'Меню пока обновляется. Попробуй ещё раз чуть позже.'
      break
  }

  await sendResponseToUser({
    text: response,
    body,
  })

  return { message: 'Ok' }
}
