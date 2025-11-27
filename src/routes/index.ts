// src/routes/index.ts
import express from 'express'
import receiveWebhook from '../controllers/webhook/receive-webhook'

const router = express.Router()

// только вебхук
router.use('/webhook', receiveWebhook)

export default router
