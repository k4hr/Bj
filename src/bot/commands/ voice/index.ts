// src/bot/commands/voice/index.ts

import { TelegramWebhook } from '../../../controllers/webhook/receive-webhook'
import sendResponseToUser from '../../../controllers/handler-telegram/send-message-telegram'
import { RU_MENU_BUTTONS, EN_MENU_BUTTONS } from '../menu'

export const VOICE_COMMAND = '/voice'

export const RU_VOICE_BUTTONS = {
  CREATE: '🎙 Создать голос',
  MY: '📁 Мои голоса',
  LIB: '🎧 Библиотека голосов',
}

export const EN_VOICE_BUTTONS = {
  CREATE: '🎙 Create voice',
  MY: '📁 My voices',
  LIB: '🎧 Voice library',
}

// --- helper: это вход в раздел VoiceAI? ---
export const isVoiceEntryCommand = (raw: string) => {
  if (!raw) return false
  const text = raw.trim()

  if (text === VOICE_COMMAND) return true

  // клик по кнопке VoiceAI в главном меню
  if (text === RU_MENU_BUTTONS.VOICEAI || text === EN_MENU_BUTTONS.VOICEAI) {
    return true
  }

  // клики по внутренним кнопкам VoiceAI
  const all = [
    ...Object.values(RU_VOICE_BUTTONS),
    ...Object.values(EN_VOICE_BUTTONS),
  ]
  return all.includes(text)
}

// --- основной обработчик раздела VoiceAI ---
export const handleVoiceUpdate = async (body: TelegramWebhook) => {
  const text = (body.message.text || '').trim()

  // простая эвристика языка
  const isRu =
    text === RU_MENU_BUTTONS.VOICEAI ||
    Object.values(RU_VOICE_BUTTONS).includes(text)

  const lang: 'ru' | 'en' = isRu ? 'ru' : 'en'

  // вход в раздел: /voice или кнопка VoiceAI
  if (
    text === VOICE_COMMAND ||
    text === RU_MENU_BUTTONS.VOICEAI ||
    text === EN_MENU_BUTTONS.VOICEAI
  ) {
    return showVoiceMain(body, lang)
  }

  // обработка трёх внутренних кнопок
  switch (text) {
    case RU_VOICE_BUTTONS.CREATE:
    case EN_VOICE_BUTTONS.CREATE:
      return handleCreateStub(body, lang)

    case RU_VOICE_BUTTONS.MY:
    case EN_VOICE_BUTTONS.MY:
      return handleMyVoicesStub(body, lang)

    case RU_VOICE_BUTTONS.LIB:
    case EN_VOICE_BUTTONS.LIB:
      return handleLibraryStub(body, lang)

    default:
      // что-то странное — просто заново покажем меню VoiceAI
      return showVoiceMain(body, lang)
  }
}

// --- внутренние функции ---

const buildVoiceKeyboard = (lang: 'ru' | 'en') => {
  const b = lang === 'ru' ? RU_VOICE_BUTTONS : EN_VOICE_BUTTONS

  return {
    keyboard: [
      [{ text: b.CREATE }, { text: b.MY }],
      [{ text: b.LIB }],
    ],
    resize_keyboard: true,
    one_time_keyboard: false,
  }
}

const showVoiceMain = async (body: TelegramWebhook, lang: 'ru' | 'en') => {
  const text =
    lang === 'ru'
      ? [
          '🎤 Раздел VoiceAI.',
          '',
          'Выберите, что хотите сделать:',
          '— 🎙 Создать голос',
          '— 📁 Мои голоса',
          '— 🎧 Библиотека голосов',
        ].join('\n')
      : [
          '🎤 VoiceAI section.',
          '',
          'Choose what you want to do:',
          '— 🎙 Create voice',
          '— 📁 My voices',
          '— 🎧 Voice library',
        ].join('\n')

  await sendResponseToUser({
    text,
    body,
    replyMarkup: buildVoiceKeyboard(lang),
  })

  return { message: 'Ok' }
}

const handleCreateStub = async (body: TelegramWebhook, lang: 'ru' | 'en') => {
  const text =
    lang === 'ru'
      ? [
          '🎙 Создание голоса пока в разработке.',
          'Тут будет загрузка референса или описание голоса текстом.',
        ].join('\n')
      : [
          '🎙 Voice creation is under development.',
          'Here you will upload a reference or describe a voice in text.',
        ].join('\n')

  await sendResponseToUser({
    text,
    body,
    replyMarkup: buildVoiceKeyboard(lang),
  })

  return { message: 'Ok' }
}

const handleMyVoicesStub = async (
  body: TelegramWebhook,
  lang: 'ru' | 'en'
) => {
  const text =
    lang === 'ru'
      ? [
          '📁 Раздел «Мои голоса» в разработке.',
          'Здесь будет список всех голосов, которые ты создашь.',
        ].join('\n')
      : [
          '"📁 My voices" section is under development.',
          'Here you will see the list of all voices you created.',
        ].join('\n')

  await sendResponseToUser({
    text,
    body,
    replyMarkup: buildVoiceKeyboard(lang),
  })

  return { message: 'Ok' }
}

const handleLibraryStub = async (
  body: TelegramWebhook,
  lang: 'ru' | 'en'
) => {
  const text =
    lang === 'ru'
      ? [
          '🎧 Библиотека голосов в разработке.',
          'Тут будут готовые пресеты голосов, которые можно использовать сразу.',
        ].join('\n')
      : [
          '🎧 Voice library is under development.',
          'Here you will find ready-made voice presets.',
        ].join('\n')

  await sendResponseToUser({
    text,
    body,
    replyMarkup: buildVoiceKeyboard(lang),
  })

  return { message: 'Ok' }
}
