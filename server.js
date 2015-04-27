/**
 * Created by shatyajeet on 26/04/15.
 */

var server = require('express'),
    stylus = require('stylus'),
    logger = require('morgan'),
    exphbs = require('express-handlebars'),
    mongoose = require('mongoose');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

var app = server();

function compile (str, path) {
  return stylus(str).set('filename', path);
}

app.set('views', __dirname + '/views');
app.engine('.hbs', exphbs({
  defaultLayout: 'layout', extname: '.hbs'
}));
app.set('view engine', 'hbs');

app.use(logger(env));

app.use(stylus.middleware({
  src: __dirname + '/public',
  compile: compile
}));

app.use(server.static(__dirname + '/public'));

app.use('/partials/:partialPath', function (req, res) {
  res.render('partials/' + req.params.partialPath, {layout: false});
});

mongoose.connect('mongodb://localhost/multivision');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'conection error..'));
db.once('open', function callback () {
  console.log('multivision db opened');
});

app.get('*', function (req, res) {
  res.render('index', {title: 'CRUDs.io'});
});

var port = 3030;
app.listen(port);

console.log('Listening on port ' + port + '...');