import express from 'express'
import routes from './routes'
import * as dotenv from 'dotenv'
import pino from 'pino-http'

dotenv.config()

const api = express()
const port = process.env.PORT || 3000

api.use(pino)

api.use(express.json())

api.use('/', routes)

const date = new Date().toISOString()
api.get('/', (req, res) => {
  req.log.info('Route: Health Check')
  res.send(`Bot lives! ${date}`)
})

api.use((req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

api.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`)
})
