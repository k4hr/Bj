// src/bot/commands/unknown.ts

import { TelegramWebhook } from '../../controllers/webhook/receive-webhook'
import sendResponseToUser from '../../controllers/handler-telegram/send-message-telegram'

export const handleUnknown = async (
  body: TelegramWebhook,
  isNonText: boolean = false
) => {
  let response: string

  if (isNonText) {
    response = [
      'Я пока понимаю только текстовые сообщения 💬',
      '',
      'Нажми /start, чтобы выбрать язык и открыть меню.',
    ].join('\n')
  } else {
    response = [
      'Я пока понимаю только базовые команды.',
      '',
      'Нажми /start, чтобы выбрать язык и открыть меню.',
    ].join('\n')
  }

  await sendResponseToUser({
    text: response,
    body,
  })

  return { message: 'Ok' }
}
