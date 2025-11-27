import axios from 'axios'
import { Request, Response } from 'express'

const token = process.env.TELEGRAM_TOKEN
const url = process.env.URL_SERVER // полный URL вебхука, например: https://xxx.railway.app/webhook

const setWebhook = async (req: Request, res: Response) => {
  if (!token || !url) {
    console.error('Missing TELEGRAM_TOKEN or URL_SERVER in environment')
    res.status(500).json({
      ok: false,
      message: 'TELEGRAM_TOKEN or URL_SERVER is not set',
    })
    return
  }

  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${token}/setWebhook`,
      { url },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    console.log('Webhook configured:', response.data)

    res.json({
      ok: true,
      message: 'Webhook configured',
      result: response.data,
    })
  } catch (error: any) {
    console.error('Error configuring webhook:', error?.response?.data || error?.message || error)

    res.status(500).json({
      ok: false,
      message: 'Error configuring webhook',
      error: error?.response?.data || error?.message || error,
    })
  }
}

export default setWebhook
