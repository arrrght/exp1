function hereDoc(s){ return s.toString().split('\n').slice(1,-1).join('\n') }

var fs = require('fs'),
		util = require('util');

var ctrl = {}, services = {};

module.exports = {

	init: function(root_dir, app){
		app.get('/direct/api', this.showApi);
		app.all('/direct/entry', this.entry);
		// Routes here
		/ /

		app.helpers(this.staticHelpers); 
		app.dynamicHelpers(this.dinamicHelpers);

		function getDef(def, fun){
			//work with //:: { "formHandler": "true" } 
			var m = fun.toString().match(/\/\/::\ +(.+)\n/);
			if(m){
				var a = JSON.parse(m[1]);
				for (var key in a){ def[key] = a[key] }
			}
			return def;
		}

		// Read in controllers
		fs.readdirSync(root_dir + '/controllers').forEach(function(f) {
			if(f.match(/.js$/)){
				var o = require(root_dir + '/controllers/' + f);
				for(var key in o){
					ctrl[key] = [];
					for(var method in o[key]){
						ctrl[key].push(getDef({ name: method, len: 1 }, o[key][method]));
						services[key + '.' + method] = o[key][method];
					}
				}
			}
		});
		
		// Read in models
		fs.readdirSync(root_dir + '/models').forEach(function(f){
			if(f.match(/.js$/)){
				require(root_dir + '/models/' + f);
			}
		});
		return this;
	},

	showApi: function(req,res,next){
		var result = { type: 'remoting', url: '/direct/entry', actions: ctrl };
		res.writeHead(200, { 'Content-type': 'text/javascript' });
		res.write('Ext.app.REMOTING_API=' + JSON.stringify(result));
		res.end(';Ext.Direct.addProvider(Ext.app.REMOTING_API);');
	},

	entry: function(req,res,next){
		var that = this;

		function respond(obj) {
			var body = JSON.stringify(obj);
			res.writeHead(200, {
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(body)
			});
			res.end(body);
		}

		var contentType = req.headers['content-type'] || '';
		var data = [];

		if (contentType.indexOf('application/x-www-form-urlencoded') >= 0){
			// Form
			var changeFields = { extAction: 'action', extMethod: 'method', extTID: 'tid', extType: 'type' };
			for (var x in changeFields){
				if (req.body[x]){
					req.body[changeFields[x]] = req.body[x];
					delete req.body[x];
				}
			}
			data.push(req.body);
		}else if (contentType.indexOf('application/json') >= 0){
			// JSON
			if (req.body instanceof Array){
				data = req.body;
			}else{
				data.push(req.body);
			}
		}else{
			// Else what?
		}

		var retArr = [], dataL = data.length;
		data.forEach(function(rpc){
			var method = services[rpc.action + '.' + rpc.method];

			// Callback template
			var reply = {
				app: { req: req, res: res, next: next },
				ret: { action: rpc.action, method: rpc.method, tid: rpc.tid, type: rpc.type, result: {} },
				respond: function(){
					console.log('  \x1b[32m'+this.ret.action+'.\x1b[33m'+this.ret.method + '\x1b[0m');
					if (--dataL<1){ respond( retArr.length > 1 ? retArr : retArr.shift() ) }
				},
				success: function(result){
					this.ret.result = result;
					this.ret.result.success = true;
					retArr.push(this.ret);
					this.respond();
				},
				failure: function(result){
					this.ret.result.errors = result;
					this.ret.result.success = false;
					retArr.push(this.ret);
					this.respond();
				}
			};

			try{
				// Call controller
				method.call(reply, rpc);
			}catch(err){
				// WARN - all debug to user ))
				reply.failure(err.toString());
				console.log('\x1b[31mDIE:\x1b[0m ' + err + '\n' + util.inspect(err));
			}
		});
	},

	// ejs static helpers
	staticHelpers: {
		zzz: function(){
			return 'asdasdasd';
		}
	},

	// ejs dinamic helpers
	dinamicHelpers: {
		session: function(req,res){
			return req.session;
		},

		xxx: function(req, res){
			var html = '';
			['error', 'info'].forEach(function(type) {
				var messages = req.flash(type);
				if (messages.length > 0) {
					html += 'Flash: ' + type + messages;
				}
			});
			return '/* ' + html + ' */';
		}
	}

};
