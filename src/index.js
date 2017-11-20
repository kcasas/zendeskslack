const express = require('express');
const app = express();
const port = 4444;

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.get('/zendesk', (req, res) => {
  console.log(req);
  res.send('pong');
});

app.listen(port, () => console.log(`Example zendesk slack integration on port ${port}`));
