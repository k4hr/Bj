// src/app.ts
import express from 'express'
import routes from './routes'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

// простой health-check, чтобы проверить, что сервер жив
app.get('/', (req, res) => {
  res.send('OK')
})

// здесь цепляем все наши роуты (включая /set-webhook и /webhook)
app.use('/', routes)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
