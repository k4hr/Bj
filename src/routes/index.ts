import express from 'express'
import testBot from '../controllers/test-bot/hello-user'
import receiveWebhook from '../controllers/webhook/receive-webhook'

const router = express.Router()

// Only for test route
router.use('/test', testBot)

// Use in local test for set telegram webhook
router.use('/webhook', receiveWebhook)

export default router
