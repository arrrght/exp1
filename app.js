/**
 * Module dependencies.
 */
var express = require('express');

var app = module.exports = express.createServer(),
    mongoStore = require('connect-mongodb'),
		jsz = require(__dirname + '/lib/jsz');

// Global
Mongoose = require('mongoose');
Mongoose.connect('mongodb://localhost/test');

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here', store: mongoStore({ dbname: 'test' }) }));
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

jsz.init(__dirname, app);

// Default is adm/adm
function createDefUser(req,res,next){
	var Ppl = Mongoose.model('Ppl');
	Ppl.findOne({ login: 'adm' }, function(err, doc){
		if(doc){
			next();
		}else{
			var u = new Ppl({ login: 'adm', password: 'adm', name: { im: 'adm-im', fam: 'adm-fam', oth: 'adm-oth' }, suspended: false });
			u.save(function(){
				next();
			});
		}
	});
}
// Routes
// Auth by-default
function loadUser(req, res, next){
	//req.session.user_id = '1';
	//req.user = [];
	next();
};

function restrictUnauthorized(req, res, next){
	console.log('User: ' + req.session.user_id);
	req.session.user_id ? next() : res.redirect('/login');
};

app.get('/login', createDefUser, function(req, res){
	res.render('login');
});

app.get('/logout', createDefUser, function(req, res){
	delete req.session.user_id;
	res.redirect('/');
});

app.get('/', createDefUser, restrictUnauthorized, function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

app.get('/components/*', function(req, res){
	res.header('Content-type', 'text/javascript');
	res.partial(__dirname + req.url);
});

app.get('/win', function(req, res){
	res.render('win');
});


// Only listen on $ node app.js
if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}
