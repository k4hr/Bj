// src/bot/commands/start/index.ts

import { TelegramWebhook } from '../../../controllers/webhook/receive-webhook'
import sendResponseToUser from '../../../controllers/handler-telegram/send-message-telegram'

const buildStartMessage = (name?: string) => {
  const userName = name || 'друг'

  return [
    `Привет, ${userName}! 👋`,
    '',
    'Выбери язык интерфейса с помощью кнопок ниже:',
    'Choose your language using the buttons below:',
  ].join('\n')
}

const buildStartKeyboard = () => ({
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
    replyMarkup: buildStartKeyboard(),
  })

  return { message: 'Ok' }
}

export const handleLanguageSelection = async (body: TelegramWebhook) => {
  const text = body.message.text

  let response: string

  if (text === '🇷🇺 Русский') {
    response = [
      '✅ Язык интерфейса: 🇷🇺 Русский.',
      '',
      'Скоро здесь появится меню с командами для озвучки и приколов.',
    ].join('\n')
  } else {
    response = [
      '✅ Interface language: 🇬🇧 English.',
      '',
      'Soon you will see a menu with voice features and fun tools here.',
    ].join('\n')
  }

  await sendResponseToUser({
    text: response,
    body,
  })

  return { message: 'Ok' }
}
