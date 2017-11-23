const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 4444;

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/ping', (req, res) => {
  res.send(`pong \n token=${process.env.token}`);
});

app.post('/zendesk', (req, res) => {
  const Botkit = require('botkit');

  const slackController = Botkit.slackbot({
    require_delivery: true
  });

  const bot = slackController.spawn({
    token: process.env.token
  });

  bot.say({
    username: 'zenbot',
    icon_url: 'http://garden.zendesk.com/favicons/zendesk/apple-touch-icon.png',
    channel: req.body.slack_channel,
    text: `*[${req.body.status}]* <${req.body.url}|Ticket #${req.body.id}>`,
    attachments: [
      {
        color: '#78a300',
        title: req.body.title,
        text: `${req.body.latest_comment} \n`,
        author_name: `Requested by ${req.body.requester}`,
        fields: [
          {
            title: "Priority",
            value: req.body.priority,
            short: true
          },
          {
            title: "Assignee",
            value: req.body.assignee,
            short: true
          }
        ],
        actions: [
          {
            name: 'edit_ticket',
            text: 'Edit Ticket',
            type: 'button',
            value: 'edit_ticket'
          }
        ]
      }
    ]
  });

  res.send('pong');
});

app.post('/slack/events', (req, res) => {
  console.log(`/slack/events \n ${JSON.stringify(req.body)}`);
  res.send(req.body.challenge);
});

app.all('/zendesk/admin', (req, res) => {
  console.log(`/zendesk/admin \n ${JSON.stringify(req.body)}`);
  res.render('admin', req.body);
});

app.all('/zendesk/manifest', (req, res) => {
  const manifest = {
    name: 'Zendesk Slack Integration',
    id: 'zendesk-slack-integration-v0.1-alpha',
    author: 'Karl Casas',
    version: 'v0.1-alpha',
    urls: {
      admin_ui: `${process.env.url}/zendesk/admin`,
      channelback_url: `${process.env.url}/zendesk/channelback`,
    },
    push_client_id: 'slackkarl'
  };

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(manifest));
});

app.all('/zendesk/channelback', (req, res) => {
  console.log(`/zendesk/channelback \n ${JSON.stringify(req.body)}`);
  res.send(200);
});

app.listen(port, () => console.log(`Example zendesk slack integration on port ${port}`));
