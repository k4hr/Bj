// src/bot/commands/menu/index.ts

import { TelegramWebhook } from '../../../controllers/webhook/receive-webhook'
import sendResponseToUser from '../../../controllers/handler-telegram/send-message-telegram'

// Команда для персонажей (её будет ловить pers, а не меню)
export const CHARACTERS_COMMAND = '/pers'

// Тексты кнопок — в одном месте, чтобы не ошибиться
export const RU_MENU_BUTTONS = {
  PROFILE: '👤 Мой профиль',
  VOICEAI: '🎤 VoiceAI',
  CHARACTERS: '🧬 Мои персонажи',
  BUY_TOKENS: '💳 Купить токены',
}

export const EN_MENU_BUTTONS = {
  PROFILE: '👤 My profile',
  VOICEAI: '🎤 VoiceAI',
  CHARACTERS: '🧬 My characters',
  BUY_TOKENS: '💳 Buy tokens',
}

// Клавиатура главного меню
export const buildMainMenuKeyboard = (lang: 'ru' | 'en') => {
  const b = lang === 'ru' ? RU_MENU_BUTTONS : EN_MENU_BUTTONS

  return {
    keyboard: [
      [{ text: b.PROFILE }, { text: b.VOICEAI }],
      [{ text: b.CHARACTERS }, { text: b.BUY_TOKENS }],
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

// Обработка нажатий на кнопки меню (без персонажей)
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

    case RU_MENU_BUTTONS.BUY_TOKENS:
    case EN_MENU_BUTTONS.BUY_TOKENS:
      response = [
        '💳 Раздел покупки токенов в разработке.',
        'Скоро здесь можно будет пополнить баланс и открыть доступ к генерациям.',
      ].join('\n')
      break

    default:
      // сюда, на всякий случай, попадёт и то, что мы не ожидали
      response = 'Меню пока обновляется. Попробуй ещё раз чуть позже.'
      break
  }

  await sendResponseToUser({
    text: response,
    body,
  })

  return { message: 'Ok' }
}
