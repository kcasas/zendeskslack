const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 4444;

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
            value: req.body.priority
          },
          {
            title: "Assignee",
            value: req.body.assignee
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


  console.log(req.body);
  res.send('pong');
});

app.listen(port, () => console.log(`Example zendesk slack integration on port ${port}`));
