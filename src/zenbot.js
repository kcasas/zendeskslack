const Botkit = require('botkit');

const slack_token = 'xoxb-274386247377-aVWXvKdeW2GBjDgPYgqWEF2Z';
const slack_oauth = '';

const slackController = Botkit.slackbot({
  require_delivery: true
});

const bot = slackController.spawn({
  token: slack_token
});

bot.say({
  text: 'fuck you',
  channel: 'zendesk'
});
