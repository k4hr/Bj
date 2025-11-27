import axios from 'axios'
import { Request, Response } from 'express'

const token = process.env.TELEGRAM_TOKEN
const url = process.env.URL_SERVER // Substitua pelo URL do seu servidor (Ngrok ou outro)

const setWebhook = (req: Request, res: Response) => {
  // Configuração do webhook
  axios
    .post(`https://api.telegram.org/bot${token}/setWebhook`, {
      url: url,
    })
    .then((response) => {
      console.log('Webhook configured:', response.data)

      res.json({
        message: `'Webhook configured:' ${response.data}`,
      })
    })
    .catch((error) => {
      console.error('Error configuring webhook:', error.response.data)

      res.json({
        message: `Error configuring webhook:' ${error.response.data}`,
      })
    })
}

export default setWebhook
