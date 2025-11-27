// src/bot/commands/start/index.ts

import { TelegramWebhook } from '../../../controllers/webhook/receive-webhook'
import sendResponseToUser from '../../../controllers/handler-telegram/send-message-telegram'
import { buildMainMenuKeyboard } from '../menu'

const buildStartMessage = (name?: string) => {
  const userName = name || 'друг'

  return [
    `Привет, ${userName}! 👋`,
    '',
    'Выбери язык интерфейса с помощью кнопок ниже:',
    'Choose your language using the buttons below:',
  ].join('\n')
}

const buildLanguageKeyboard = () => ({
  keyboard: [
    [
      { text: '🇷🇺 Русский' },
      { text: '🇬🇧 English' },
    ],
  ],
  resize_keyboard: true,
  one_time_keyboard: true,
})

export const handleStart = async (body: TelegramWebhook) => {
  const name = body.message.from.first_name

  await sendResponseToUser({
    text: buildStartMessage(name),
    body,
    replyMarkup: buildLanguageKeyboard(),
  })

  return { message: 'Ok' }
}

export const handleLanguageSelection = async (body: TelegramWebhook) => {
  const text = body.message.text

  let response: string
  let lang: 'ru' | 'en' = 'ru'

  if (text === '🇷🇺 Русский') {
    lang = 'ru'
    response = [
      '✅ Язык интерфейса: 🇷🇺 Русский.',
      '',
      'Вот главное меню бота:',
    ].join('\n')
  } else {
    lang = 'en'
    response = [
      '✅ Interface language: 🇬🇧 English.',
      '',
      'Here is the main menu of the bot:',
    ].join('\n')
  }

  await sendResponseToUser({
    text: response,
    body,
    replyMarkup: buildMainMenuKeyboard(lang),
  })

  return { message: 'Ok' }
}
