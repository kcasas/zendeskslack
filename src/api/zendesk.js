const zendesk = require('node-zendesk');

const client = zendesk.createClient({
  username: 'kcasas@zendesk.com',
  token: process.env.zendesk_api_token,
  remoteUri: 'https://z3nkcasas.zendesk.com/api/v2'
});

module.exports = client;
