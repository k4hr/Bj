// index.js
// Minimal Telegram bot + web server skeleton (polling) for Railway.
// Commands: /start (lang choose), /game (open WebApp), /info (rules).

import 'dotenv/config';
import express from 'express';
import { Telegraf, Markup } from 'telegraf';

// ====== ENV ======
const BOT_TOKEN = process.env.BOT_TOKEN;           // required
const WEBAPP_URL = process.env.WEBAPP_URL || '';   // your mini-app URL (can be empty for now)
const PORT = process.env.PORT || 3000;

if (!BOT_TOKEN) {
  console.error('Missing BOT_TOKEN in .env');
  process.exit(1);
}

// ====== i18n (super-minimal, in-memory) ======
const LANGS = ['ru', 'en'];
const userLang = new Map(); // userId -> 'ru' | 'en'

const t = (lang, key) => {
  const ru = {
    start_title: 'ИИ-советник по базовой стратегии блэкджека (обучающий инструмент).\nВыберите язык:',
    disclaimer: '⚠️ Это обучающий инструмент. Мы не управляем ставками и не связаны с казино. Ответственная игра, 18+.',
    btn_ru: '🇷🇺 Русский',
    btn_en: '🇬🇧 English',
    menu: 'Выберите действие:',
    menu_game: '🎮 Открыть мини-приложение',
    menu_info: 'ℹ️ Правила и параметры стола',
    info_title: 'ℹ️ Правила и параметры стола',
    info_body:
`• Колоды: 1/2/4/6/8 — больше колод → ниже ожидание игрока.
• Дилер: H17 (тянет на soft-17, хуже для игрока) / S17 (стоит на soft-17).
• Double: DA2 (на любых двух) или только 9–11.
• Double after Split (DAS): можно ли удваивать после сплита.
• Surrender: None / Late / Early — при жёстких 15/16 против 10 сдача часто оптимальна.
• Blackjack payout: 3:2 лучше, чем 6:5 (не меняет решения по рукам, но снижает ожидание).
• Dealer Peek: проверка блэкджека дилером при A/10 — снижает лишние риски при дабле/сплите.`,
    open_webapp_missing: 'Ссылка мини-приложения не настроена. Добавь WEBAPP_URL в .env',
    webapp_button: 'Открыть мини-приложение',
    lang_set: 'Язык сохранён: Русский',
    change_lang_hint: 'Чтобы сменить язык, введите /start ещё раз.',
  };

  const en = {
    start_title: 'Blackjack basic-strategy AI assistant (educational tool).\nChoose your language:',
    disclaimer: '⚠️ Educational use only. We do not control bets and are not affiliated with casinos. 18+ responsible gaming.',
    btn_ru: '🇷🇺 Russian',
    btn_en: '🇬🇧 English',
    menu: 'Choose an option:',
    menu_game: '🎮 Open Mini-App',
    menu_info: 'ℹ️ Rules & table settings',
    info_title: 'ℹ️ Rules & table settings',
    info_body:
`• Decks: 1/2/4/6/8 — more decks → lower player EV.
• Dealer: H17 (hits soft-17, worse for player) / S17 (stands on soft-17).
• Double: DA2 (any two) or only 9–11.
• Double after Split (DAS): allowed or not.
• Surrender: None / Late / Early — often optimal with hard 15/16 vs dealer 10.
• Blackjack payout: 3:2 > 6:5 (doesn’t change per-hand actions, lowers EV).
• Dealer Peek: reduces risk of wasting doubles/splits vs A/10.`,
    open_webapp_missing: 'Mini-app URL not set. Add WEBAPP_URL to .env',
    webapp_button: 'Open Mini-App',
    lang_set: 'Language saved: English',
    change_lang_hint: 'Run /start again to change language.',
  };

  const dict = lang === 'en' ? en : ru;
  return dict[key] || key;
};

const langKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('🇷🇺 Русский', 'lang_ru'), Markup.button.callback('🇬🇧 English', 'lang_en')],
]);

const mainKeyboard = (lang) =>
  Markup.inlineKeyboard([
    [Markup.button.callback(t(lang, 'menu_game'), 'open_game')],
    [Markup.button.callback(t(lang, 'menu_info'), 'open_info')],
  ]);

// ====== BOT ======
const bot = new Telegraf(BOT_TOKEN);

// /start — language selection + disclaimer + menu
bot.start(async (ctx) => {
  const uid = ctx.from?.id;
  const lang = userLang.get(uid) || 'ru';
  await ctx.reply(t(lang, 'start_title'), langKeyboard);
  await ctx.reply(t(lang, 'disclaimer'));
});

// language handlers
bot.action('lang_ru', async (ctx) => {
  const uid = ctx.from?.id;
  userLang.set(uid, 'ru');
  await ctx.editMessageText(t('ru', 'lang_set'));
  await ctx.reply(t('ru', 'menu'), mainKeyboard('ru'));
  await ctx.answerCbQuery();
});

bot.action('lang_en', async (ctx) => {
  const uid = ctx.from?.id;
  userLang.set(uid, 'en');
  await ctx.editMessageText(t('en', 'lang_set'));
  await ctx.reply(t('en', 'menu'), mainKeyboard('en'));
  await ctx.answerCbQuery();
});

// /game — open WebApp button
bot.command('game', async (ctx) => {
  const lang = userLang.get(ctx.from?.id) || 'ru';
  if (!WEBAPP_URL) {
    return ctx.reply(t(lang, 'open_webapp_missing'));
  }
  // Inline button that opens mini-app
  return ctx.reply(t(lang, 'menu_game'), {
    reply_markup: {
      inline_keyboard: [[{ text: t(lang, 'webapp_button'), web_app: { url: WEBAPP_URL } }]],
    },
  });
});

// /info — rules
bot.command('info', async (ctx) => {
  const lang = userLang.get(ctx.from?.id) || 'ru';
  await ctx.reply(`*${t(lang, 'info_title')}*\n\n${t(lang, 'info_body')}`, {
    parse_mode: 'Markdown',
  });
});

// callbacks from main menu
bot.action('open_game', async (ctx) => {
  const lang = userLang.get(ctx.from?.id) || 'ru';
  if (!WEBAPP_URL) {
    await ctx.answerCbQuery(t(lang, 'open_webapp_missing'), { show_alert: true });
    return;
  }
  await ctx.reply(t(lang, 'menu_game'), {
    reply_markup: {
      inline_keyboard: [[{ text: t(lang, 'webapp_button'), web_app: { url: WEBAPP_URL } }]],
    },
  });
  await ctx.answerCbQuery();
});

bot.action('open_info', async (ctx) => {
  const lang = userLang.get(ctx.from?.id) || 'ru';
  await ctx.reply(`*${t(lang, 'info_title')}*\n\n${t(lang, 'info_body')}`, { parse_mode: 'Markdown' });
  await ctx.answerCbQuery();
});

// Optional: handle data returned from WebApp (when you add it)
// ctx.update.message?.web_app_data?.data → JSON string from WebApp
bot.on('message', async (ctx) => {
  const lang = userLang.get(ctx.from?.id) || 'ru';
  const webAppData = ctx.message?.web_app_data?.data;
  if (webAppData) {
    // Here you could parse and echo a summary back to chat.
    await ctx.reply(`✅ ${webAppData}`);
  } else if (ctx.message?.text === '/start') {
    // ignore — already handled by bot.start
  } else if (ctx.message?.text === '/game') {
    // ignore — already handled by bot.command
  } else if (ctx.message?.text === '/info') {
    // ignore — already handled by bot.command
  } else {
    // noop
  }
});

// ====== EXPRESS (health + static, if needed) ======
const app = express();
app.get('/health', (_, res) => res.status(200).send('OK'));

// (optional) serve future WebApp assets if you deploy them here
// app.use('/app', express.static('webapp_dist'));

const server = app.listen(PORT, () => {
  console.log(`HTTP server on :${PORT}`);
});

// ====== START BOT (long polling; simple for Railway) ======
bot.launch().then(() => {
  console.log('Bot started (polling).');
});

// Graceful shutdown
process.once('SIGINT', () => {
  bot.stop('SIGINT');
  server.close();
});
process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
  server.close();
});
