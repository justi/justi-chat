var express = require("express");
var app = express();
var redis = require('redis');
var url = require('url');
var partials = require('express-partials');

// Configure connection to your Redis Cloud service using REDISCLOUD_URL config vars
// heroku config:get REDISCLOUD_URL
// http://rediscloud:password@hostname:port
// ex. set in .env file:
// REDISCLOUD_URL=........

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

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

// test redis db
// REDISCLOUD_URL should be set !!
client.set('foo', 'bar');
client.get('foo', function (err, reply) {
    console.log(reply.toString()); // Will print `bar`
});