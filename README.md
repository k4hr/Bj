# Template for Telegram Bot

## Structure

```txt
🤖 bot-telegram-template
├── src
│   ├── app.ts
│   ├── controllers
│   │   ├── handler-telegram
│   │   │   ├── messages
│   │   │   │   └── start
│   │   │   │       └── index.ts
│   │   │   ├── new-message.ts // Aqui voce vai adicionar as novas funções
│   │   │   └── send-message-telegram.ts
│   │   ├── test-bot
│   │   │   └── hello-user.ts
│   │   └── webhook
│   │       ├── receive-webhook.ts
│   │       └── set-webhook.ts
│   └── routes
│       ├── index.ts
│       └── webhook.ts
└── tsconfig.json
```

## Local Test

Add file `.env` to the project root with the variables below.

```bash
PORT=3000

# Create the bot on Telegram and place the token here
TELEGRAM_TOKEN=

# URL of where your backend is hosted
URL_SERVER=
```
