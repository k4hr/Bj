// src/bot/commands/start/index.ts

import { TelegramWebhook } from '../../../controllers/webhook/receive-webhook'
import sendResponseToUser, {
  deleteTelegramMessage,
} from '../../../controllers/handler-telegram/send-message-telegram'
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

const buildStartKeyboard = () => ({
  keyboard: [[{ text: '🇷🇺 Русский' }, { text: '🇬🇧 English' }]],
  resize_keyboard: true,
  one_time_keyboard: false,
})

export const handleStart = async (body: TelegramWebhook) => {
  const chatId = body.message.chat.id
  const msgId = body.message.message_id
  const name = body.message.from.first_name

  await sendResponseToUser({
    text: buildStartMessage(name),
    body,
    replyMarkup: buildStartKeyboard(),
  })

  // удаляем /start
  deleteTelegramMessage(chatId, msgId).catch((err) =>
    console.log('Cant delete /start message', err)
  )

  return { message: 'Ok' }
}

export const handleLanguageSelection = async (body: TelegramWebhook) => {
  const text = body.message.text
  const chatId = body.message.chat.id
  const msgId = body.message.message_id

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

  // удаляем сообщение "Русский"/"English"
  deleteTelegramMessage(chatId, msgId).catch((err) =>
    console.log('Cant delete language selection message', err)
  )

  return { message: 'Ok' }
}
