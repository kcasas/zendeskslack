const Botkit = require('botkit');

const slack = {
  controller: Botkit.slackbot({
    require_delivery: true
  })
};

slack.bot = slack.controller.spawn({
  token: process.env.token
});

module.exports = slack;
