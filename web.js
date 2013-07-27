var url = require('url');
var partials = require('express-partials');

var redis = require('redis');
// Configure connection to your Redis Cloud service using REDISCLOUD_URL config vars
// heroku config:get REDISCLOUD_URL
// http://rediscloud:password@hostname:port
// ex. set in .env file:
// REDISCLOUD_URL=........

var express = require("express");
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// assuming io is the Socket.IO server object
io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

var port = process.env.PORT || 8090;
server.listen(port);

var redisURL = url.parse(process.env.REDISCLOUD_URL);
var client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
client.auth(redisURL.auth.split(":")[1]);

app.use(express.logger());
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(partials());

app.get('/', function(request, response) {
  response.render('index', {msg: "hello"});
});

// test redis db
// REDISCLOUD_URL should be set !!
client.set('foo', 'bar');
client.get('foo', function (err, reply) {
    console.log(reply.toString()); // Will print `bar`
});

// test socket connection
io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
