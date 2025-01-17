require("dotenv").config();

const env = process.env.NODE_ENV;

const TelegramBot = require("node-telegram-bot-api");
const logger = require("./winston");

const chat_token = process.env.CHAT_TOKEN_acsap;

const chat_id = process.env.CHAT_ID_acsap;
const bot = new TelegramBot(chat_token, { polling: true });

const warn = (para) => {
  let text = `
  [warn]
  ${para}
  `;
  logger.warn(para);
  bot.sendMessage(chat_id, text);
};

const info = (para) => {
  let text = `
  [info]
  ${para}
  `;
  if (env === "production_acsap") {
    logger.info(para);
    bot.sendMessage(chat_id, text);
  } else {
    logger.info(para);

    //test
    bot.sendMessage(chat_id, text);
  }
};

const alarm = {
  info,
  warn,
};

module.exports = alarm;
