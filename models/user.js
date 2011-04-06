var crypto = require('crypto'),
		Schema = Mongoose.Schema,
		ObjectId = Schema.ObjectId,
		util = require('util');

// Ppl
var Ppl = new Schema({
	im: String,
	fam: String,
	oth: String
});

// User
var User = new Schema({
		ppl_id: ObjectId,
		login: String,
		pswd: { salt: String , hash: String }
});

function getCrypted(salt, pass){ return crypto.createHmac('sha1', salt).update(pass).digest('hex') };
User.virtual('password')
	.set(function(pass){
		var salt = (function getSalt(){
			var str = '', chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
			chars.forEach(function(){ str += chars[Math.floor(Math.random() * chars.length)] });
			return str;
		})();
		this.set('pswd.salt', salt);
		this.set('pswd.hash', getCrypted(salt, pass));
	})
	.get(function(){
		return this.pswd.hash
	});

User.static({
	auth: function(login, password, callback){
		this.findOne({ login: login }, function(err, user){
			if (user && user.password === getCrypted(user.pswd.salt, password)){
				var Ppl = Mongoose.model('Ppl');
				Ppl.findById(user.ppl_id, function(err,ppl){
					callback({ user: user, ppl: ppl });
				});
			}else{ callback(null) }
		});
	}
});

/*
User.path('name').validate(function(v){
	return false;
	//return v.length>50;
}, 'Username length must be more than 9999');
*/

Mongoose.model('User', User);
Mongoose.model('Ppl', Ppl);
