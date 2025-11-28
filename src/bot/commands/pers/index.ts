// src/bot/commands/pers/index.ts

import { TelegramWebhook } from '../../../controllers/webhook/receive-webhook'
import sendResponseToUser, {
  deleteTelegramMessage,
} from '../../../controllers/handler-telegram/send-message-telegram'

// Кнопка для создания персонажа
const CREATE_PERS_RU = '➕ Создать персонажа'
const CREATE_PERS_EN = '➕ Create character'

// Тип персонажа (упрощённо, пока в памяти)
type Pers = {
  id: string
  name: string
  photoFileId: string
  description?: string
  createdAt: number
}

// Список персонажей по chat_id
const persByChat = new Map<number, Pers[]>()

// Состояние диалога создания персонажа
type PersStep = 'idle' | 'wait_photo' | 'wait_description' | 'wait_name'

type PersSession = {
  step: PersStep
  temp?: {
    photoFileId?: string
    description?: string
  }
}

const sessions = new Map<number, PersSession>()

const getSession = (chatId: number): PersSession => {
  const current = sessions.get(chatId)
  if (!current) {
    const fresh: PersSession = { step: 'idle', temp: {} }
    sessions.set(chatId, fresh)
    return fresh
  }
  return current
}

const setSession = (chatId: number, session: PersSession) => {
  sessions.set(chatId, session)
}

const resetSession = (chatId: number) => {
  sessions.set(chatId, { step: 'idle', temp: {} })
}

// ==================== Публичные функции ====================

// Проверяем: "это вход в раздел персонажей?"
export const isPersEntryCommand = (text: string) => {
  return text === '/pers' || text === CREATE_PERS_RU || text === CREATE_PERS_EN
}

// Есть ли активная сессия создания персонажа
export const hasActivePersSession = (chatId: number) => {
  const s = sessions.get(chatId)
  return !!s && s.step !== 'idle'
}

// Основной обработчик ВСЕХ шагов сценария персонажей
export const handlePersUpdate = async (body: TelegramWebhook) => {
  const chatId = body.message.chat.id
  const msgId = body.message.message_id
  const session = getSession(chatId)
  const msg = body.message

  // Вход в раздел (кнопка "Мои персонажи" или /pers)
  if (session.step === 'idle' && typeof msg.text === 'string') {
    const text = msg.text.trim()

    if (text === '/pers') {
      const result = await showPersList(body)
      deleteTelegramMessage(chatId, msgId).catch((err) =>
        console.log('Cant delete /pers message', err)
      )
      return result
    }

    if (text === CREATE_PERS_RU || text === CREATE_PERS_EN) {
      const result = await startPersCreation(body)
      deleteTelegramMessage(chatId, msgId).catch((err) =>
        console.log('Cant delete create-pers message', err)
      )
      return result
    }
  }

  // Ветка создания персонажа по шагам
  switch (session.step) {
    case 'wait_photo':
      return handlePhotoStep(body, session)

    case 'wait_description':
      return handleDescriptionStep(body, session)

    case 'wait_name':
      return handleNameStep(body, session)

    default:
      // На всякий случай: покажем список
      return showPersList(body)
  }
}

// ==================== Реализация шагов ====================

// Показать список персонажей
export const showPersList = async (body: TelegramWebhook) => {
  const chatId = body.message.chat.id
  const list = persByChat.get(chatId) || []

  if (!list.length) {
    const text = [
      'У вас пока нет персонажей 🧬',
      '',
      'Давайте создадим первого?',
    ].join('\n')

    await sendResponseToUser({
      text,
      body,
      replyMarkup: {
        keyboard: [[{ text: CREATE_PERS_RU }]],
        resize_keyboard: true,
        one_time_keyboard: false,
      },
    })

    return { message: 'Ok' }
  }

  const listText = list
    .map((c, idx) => `${idx + 1}. ${c.name}`)
    .join('\n')

  const text = [
    '🧬 Ваши персонажи:',
    '',
    listText,
    '',
    'Чтобы создать нового персонажа, нажмите кнопку ниже.',
  ].join('\n')

  await sendResponseToUser({
    text,
    body,
    replyMarkup: {
      keyboard: [[{ text: CREATE_PERS_RU }]],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  })

  return { message: 'Ok' }
}

// Старт создания персонажа
const startPersCreation = async (body: TelegramWebhook) => {
  const chatId = body.message.chat.id
  setSession(chatId, { step: 'wait_photo', temp: {} })

  const text = [
    '🧬 Создание персонажа.',
    '',
    'Загрузите свою фотографию, из которой мы сделаем персонажа.',
  ].join('\n')

  await sendResponseToUser({
    text,
    body,
  })

  return { message: 'Ok' }
}

// Шаг 1: получаем фото
const handlePhotoStep = async (
  body: TelegramWebhook,
  session: PersSession
) => {
  const chatId = body.message.chat.id
  const msgId = body.message.message_id
  const msg = body.message

  const photos = (msg as any).photo as
    | { file_id: string; width: number; height: number }[]
    | undefined

  if (!photos || !photos.length) {
    await sendResponseToUser({
      text: 'Пожалуйста, отправьте фотографию, а не текст.',
      body,
    })
    return { message: 'Ok' }
  }

  // Берём самое большое по размеру фото
  const largest = photos[photos.length - 1]
  const photoFileId = largest.file_id

  const nextSession: PersSession = {
    step: 'wait_description',
    temp: {
      ...session.temp,
      photoFileId,
    },
  }

  setSession(chatId, nextSession)

  const text = [
    'Фото получено ✅',
    '',
    'Теперь опишите, что вы хотите изменить или сделать с ней.',
    '',
    'Например:',
    '«Не изменяя лицо, сделай этого человека на фоне уютной комнаты с тёплым светом».',
  ].join('\n')

  await sendResponseToUser({
    text,
    body,
  })

  // удаляем фото-сообщение пользователя
  deleteTelegramMessage(chatId, msgId).catch((err) =>
    console.log('Cant delete photo message', err)
  )

  return { message: 'Ok' }
}

// Шаг 2: описание изменений (промпт)
const handleDescriptionStep = async (
  body: TelegramWebhook,
  session: PersSession
) => {
  const chatId = body.message.chat.id
  const msgId = body.message.message_id
  const msg = body.message

  if (typeof msg.text !== 'string' || !msg.text.trim()) {
    await sendResponseToUser({
      text: 'Пожалуйста, отправьте текстовое описание того, что нужно сделать с фото.',
      body,
    })
    return { message: 'Ok' }
  }

  const description = msg.text.trim()

  const nextSession: PersSession = {
    step: 'wait_name',
    temp: {
      ...session.temp,
      description,
    },
  }

  setSession(chatId, nextSession)

  const text = [
    '🧠 Описание получено.',
    'Дальше я по этому описанию создам персонажа (фото).',
    '',
    'Теперь придумайте имя персонажу и отправьте его одним сообщением.',
    'Например: «Я на стриме» или «Тёмный рыцарь».',
  ].join('\n')

  await sendResponseToUser({
    text,
    body,
  })

  // удаляем описание
  deleteTelegramMessage(chatId, msgId).catch((err) =>
    console.log('Cant delete description message', err)
  )

  return { message: 'Ok' }
}

// Шаг 3: имя персонажа + сохранение
const handleNameStep = async (
  body: TelegramWebhook,
  session: PersSession
) => {
  const chatId = body.message.chat.id
  const msgId = body.message.message_id
  const msg = body.message

  if (typeof msg.text !== 'string' || !msg.text.trim()) {
    await sendResponseToUser({
      text: 'Пожалуйста, отправьте имя персонажа текстом.',
      body,
    })
    return { message: 'Ok' }
  }

  const name = msg.text.trim()
  const temp = session.temp || {}

  if (!temp.photoFileId) {
    // что-то пошло не так, защищаемся
    resetSession(chatId)
    await sendResponseToUser({
      text: 'Что-то пошло не так при создании персонажа. Попробуйте начать заново через «🧬 Мои персонажи».',
      body,
    })
    return { message: 'Ok' }
  }

  const newPers: Pers = {
    id: `${Date.now()}`,
    name,
    photoFileId: temp.photoFileId,
    description: temp.description,
    createdAt: Date.now(),
  }

  const prev = persByChat.get(chatId) || []
  persByChat.set(chatId, [...prev, newPers])

  resetSession(chatId)

  const text = [
    `Персонаж «${name}» сохранён 🧬`,
    '',
    'Теперь он будет отображаться в разделе «Мои персонажи».',
  ].join('\n')

  await sendResponseToUser({
    text,
    body,
  })

  // удаляем сообщение с именем
  deleteTelegramMessage(chatId, msgId).catch((err) =>
    console.log('Cant delete name message', err)
  )

  // Можно сразу показать обновлённый список (уже без лишних сообщений)
  return showPersList(body)
}
