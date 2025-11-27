// src/routes/index.ts
import express from 'express'
import receiveWebhook from '../controllers/webhook/receive-webhook'
import setWebhook from '../controllers/webhook/set-webhook'

const router = express.Router()

// один раз дергаем руками, чтобы зарегистрировать вебхук у Telegram
router.get('/set-webhook', setWebhook)

// сюда Telegram будет слать апдейты (method: POST)
router.post('/webhook', receiveWebhook)

export default router
