const Botkit = require('botkit');

const slackController = Botkit.slackbot({
  require_delivery: true
});

const bot = slackController.spawn({
  token: process.env.token
});

bot.say({
  text: 'hello',
  channel: 'zendesk'
});
