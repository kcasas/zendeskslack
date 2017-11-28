const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 4444;
const zendesk = require('./api/zendesk');
const slack = require('./api/slack');

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/ping', (req, res) => {
  res.send(`pong \n token=${process.env.token}`);
});

app.post('/zendesk', (req, res) => {
  console.log('/zendesk');
  console.log(req.body);
  console.log('\n');
  const ticket_message = require('./elements/ticket_message');
  slack.bot.say(ticket_message(req.body));

  res.send('pong');
});

app.post('/slack/events', (req, res) => {
  console.log(`/slack/events`);
  console.log(req.body);
  console.log('\n');
  res.send(req.body.challenge);
});

app.post('/slack/command/zendesk', (req, res) => {
  console.log(`/slack/command/zendesk \n ${JSON.stringify(req.body)}`);
  zendesk.groups.list((err, r, result) => {
    const ticket_dialog = require('./elements/ticket_dialog');

    slack.bot.api.dialog.open({
      trigger_id: req.body.trigger_id,
      dialog: JSON.stringify(ticket_dialog(result))
    }, (err, response) => {
      console.log(response);
    });
    res.setHeader('Content-Type', 'application/json');
    res.send(200);
  });
});

app.all('/slack/interactive/components', (req, res) => {
  const payload = JSON.parse(req.body.payload);
  console.log(`/slack/interactive/components`);
  console.log(payload);
  if (payload.type == 'dialog_submission') {
    zendesk.tickets.create({
      ticket: {
        description: payload.submission.description,
        subject: payload.submission.title,
        group_id: payload.submission.assignee,
        custom_fields: [{ id: 81069827, value: payload.channel.name }],
        requester_id: 16673807228,
        priority: payload.submission.priority,
        type: payload.submission.type
      }
    }, (err) => {
      console.log(err);
      res.setHeader('Content-Type', 'application/json');
      res.send({});
    });
  } else {
    const new_message = payload.original_message;
    payload.actions.forEach(action => {
      new_message.attachments.forEach(attachment => {
        attachment.actions.forEach(attachmentAction => {
          if (action.name === attachmentAction.name) {
            attachmentAction.selected_options = action.selected_options;
            attachmentAction.selected_options.forEach(selectedOption => {
              selectedOption.text = selectedOption.value;
            });
          }
        })
      });
    });
    const action = new_message.attachments[0].actions[1];
    console.log(action);
    console.log('\n');
    if (action.selected_options[0].value == 'Solved') {
      const dialog = require('./elements/requirement_dialog');
      slack.bot.api.dialog.open({
        trigger_id: payload.trigger_id,
        dialog: JSON.stringify(dialog)
      }, (err, response) => {
        console.log(response);
      });
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(new_message);
  }
});

app.post('/slack/interactive/menus', (req, res) => {
  console.log(`/slack/interactive/menus \n ${JSON.stringify(req.body)}`);
  res.send(200);
});

app.listen(port, () => console.log(`Example zendesk slack integration on port ${port}`));
