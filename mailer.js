'use strict';


var nodemailer = require('nodemailer');
var amqp = require('amqplib/callback_api');

var email = {};
var configAuth ={};
var emailConfig = require('./configAuth');
configAuth ['service'] = emailConfig['service'];

configAuth['user'] = emailConfig['auth']['user'];

configAuth['pass'] = emailConfig['auth']['pass'];


amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'hello';

    ch.assertQueue(q, {durable: true});
    
    ch.consume(q, function(msg) {
      console.log(JSON.parse(msg.content));
      email = JSON.parse(msg.content);

      var transport = nodemailer.createTransport({
            service: configAuth['service'],
            auth: {
                user: configAuth['user'],
                pass: configAuth['pass']
            }
        });

    transport.sendMail(email, function(error){
      //console.log(email)
    if (error) console.log(error && error.stack);
    else console.log("check Email");
    });
    }, {noAck:true});

  })
})