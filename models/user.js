var crypto = require('crypto');

var User = new Mongoose.Schema({
		name: { type: String },
		pass: { type: String, set: hashIt },
});

function hashIt(v){
	return(crypto.createHash('md5').update(v).digest('hex'));
}

User.virtual('full').get(function(){
	return this.name + ' - ' + this.pass;
});

/*
User.path('name').validate(function(v){
	return false;
	//return v.length>50;
}, 'Username length must be more than 9999');
*/

Mongoose.model('User', User);
