var crypto = require('crypto'),
		Schema = Mongoose.Schema,
		ObjectId = Schema.ObjectId,
		util = require('util');

// Ppl
var Ppl = new Schema({
	name: {
		im: String,
		fam: String,
		oth: String
	},
	login: String,
	pswd: { salt: String , hash: String }
});

function getCrypted(salt, pass){
	return crypto.createHmac('sha1', salt).update(pass).digest('hex')
};

Ppl.virtual('fullName').get(function(){
	return this.name.fam + ' ' + this.name.im + ' ' + this.name.oth;
});
Ppl.virtual('shortName').get(function(){
	return this.name.fam[0].toUpperCase() + this.name.fam.slice(1) + ' '
		+ (this.name.im ? this.name.im[0].toUpperCase() + '.' : '')
		+ (this.name.oth ? this.name.oth[0].toUpperCase() + '.' : '');
});
Ppl.virtual('password')
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

Ppl.static({
	auth: function(login, password, callback){
		this.findOne({ login: login }, function(err, user){
			if (user && user.password === getCrypted(user.pswd.salt, password)){
				callback(user);
			}else{
				callback(null);
			}
		});
	}
});

/*
User.path('name').validate(function(v){
	return false;
	//return v.length>50;
}, 'Username length must be more than 9999');
*/

Mongoose.model('Ppl', Ppl);
