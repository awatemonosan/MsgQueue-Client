'use strict'

const Pidgey = require('pidgey');
const request = require('request-json');

class MsgQueueClient extends Pidgey {
  constructor(url, interval){
    super();
    this.interval = interval || 500;
    this.queues = [];
    this.url = url;
    this.client = request.createClient(url);

    var that = this;
    var checkQueue = function(){
      // Poll to see if there are messages
      that.queues.forEach(function(queue){
        that.poll(queue)
        .then(function(count){
          return new Promise(function(resolve, reject){
            if(count === 0){
              reject();
            } else {
              that.req(queue, count)
              .then(function(msgs){
                resolve(msgs);
              })
              .catch(function(){
                reject();
              });
            }
          });
        })
        // if there are, then trigger the event system
        .then(function(msgs){
          msgs.forEach(function(msg){
            that.trigger(queue, msg);
            that.ack(msg.id);
          });
        });
      });
      setTimeout(checkQueue, that.interval);
    };

    checkQueue();
  }

  sendToServer(apiEndpoint, payload) {
    var that = this;
    return new Promise(function(resolve, reject){
      that.client.post(apiEndpoint, payload, function (err, res, body) {
        if (!err && res.statusCode == 200){
          // console.log(apiEndpoint + ' successful');
          resolve(body);
        } else {
          // console.log(apiEndpoint + ' failed');
          reject(body);
        }
      });
    });
  }

  enqueue(queue, payload){
    var that = this;
    // console.log('enqueuing "' + payload.toString() + '" to "' + queue + '" queue');
    return new Promise(function(resolve, reject){
      that.sendToServer('enqueue', {queue:queue, payload:payload})
      .then(function(){ resolve(); })
      .catch(function(){ reject(); });
    });
  }

  poll(queue){
    var that = this;
    // console.log('polling for messages in "' + queue + '" queue');
    return new Promise(function(resolve, reject){
      that.sendToServer('poll', {queue:queue})
      .then(function(body){ resolve(body.count); })
      .catch(function(body){ reject(); });
    });
  }

  req(queue, count){
    var that = this;
    // console.log('requesting "' +count+ '" messages from "' + queue + '" queue');
    return new Promise(function(resolve, reject){
      that.sendToServer('req', {queue:queue,count:count})
      .then(function(body){ resolve(body.msgs); })
      .catch(function(body){ reject(); });
    });
  }

  ack(id){
    var that = this;
    // console.log('acking message ID "' +id+ '"');
    return new Promise(function(resolve, reject){
      that.sendToServer('ack', {id:id})
      .then(function(body){ resolve(); })
      .catch(function(body){ reject(); });
    });
  }

  rej(id){
    var that = this;
    // console.log('rejecting message ID "' +id+ '"');
    return new Promise(function(resolve, reject){
      that.sendToServer('rej', {id:id})
      .then(function(body){ resolve(); })
      .catch(function(body){ reject(); });
    });
  }

  watch(queue, callback){
    if(this.queues.indexOf(queue)!==-1) return;
    this.queues.push(queue);
    if(callback === undefined) return;
    this.on(queue, callback);
  }

  stop(queue){
    if(this.queues.indexOf(queue)===-1) return;
    this.queues.splice(this.queues.indexOf(queue),1);
  }
}

module.exports = MsgQueueClient;
