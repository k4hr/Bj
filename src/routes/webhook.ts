import express from 'express'
import setWebhook from '../controllers/webhook/set-webhook'
import receiveWebhook from '../controllers/webhook/receive-webhook'

const router = express.Router()

router.get('/set', setWebhook)
router.post('/', receiveWebhook)

export default router
