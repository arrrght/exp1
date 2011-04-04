/**
 * Module dependencies.
 */
var express = require('express');

var app = module.exports = express.createServer(),
    //mongoStore = require('connect-mongodb'),
		jsz = require(__dirname + '/lib/jsz');

// Global
Mongoose = require('mongoose');
Mongoose.connect('mongodb://localhost/test');

//Mongoose = require('mongoose');
//Mongoose.connect('mongodb://localhost/test');
//Model = Mongoose.noSchema('test',db);
//mongoose.load('./models/');

//app.settings.db = JSON.parse(require('fs').readFileSync(__dirname + '/config/db.json', 'utf-8'))[app.settings.env];
/*
var mongoSessionStore = mongoStore({
    // maxAge:   60000,
    dbname:   app.settings.db.database,
    host:     app.settings.db.host,
    username: app.settings.db.user,
    password: app.settings.db.password
}, function () {});
*/

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  //app.use(express.session({ secret: 'your secret here', store: mongoSessionStore }));
  app.use(express.logger({ format: '\x1b[32m:method\x1b[0m \x1b[33m:url\x1b[0m :response-time ms' }))
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
	//app.use(express.logger({ format: ':method :url :status' }));
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

app.jsz = jsz.init(__dirname, app);

// Routes
app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});


// Only listen on $ node app.js
if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}
