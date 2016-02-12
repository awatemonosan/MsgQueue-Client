'use strict'

const MsgQueueClient = require('./msgqueueclient.js');

const express = require('express');
const app = express();

const client = new MsgQueueClient('http://127.0.0.1:3000');

client.watch('test');
client.on('test', function(msg){
  console.log(msg);
  console.log("pew pew pew fireworks pew pew pew");
  client.send('test2', {});
});
client.on('test2', function(msg){
  console.log("whoa cool");
  client.send('test2', {});
});

app.get('/send', function (req, res) {
  let queue = 'test';
  let message = {a:1};

  client.send(queue, message);

  res.sendStatus(200);
});

app.listen(8080, function () {
  console.log('listening on port 8080!');
});
