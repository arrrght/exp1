exports.Login = {

	some1: function(para){ //:: { "formHandler": "true" }
		var that = this, User = Mongoose.model('User');

		/*
		var user = new User({ name: '123', pass: '123' });
		user.save(function(err){
			if (err){
				console.log('ERR ' + err);
				that.failure({ username: err.message });
			}else{
				*/
				var q = User.findOne({ name: para.username, pass: para.password }, function(err,docs){
					if (docs){
						that.success({ id: docs.id, full: docs.full });
					}else{
						that.failure({ username: 'Not Found' });
					}
				});
				/*
			}
		}); */


	},

	some2: function(para){
		var that = this, User = Mongoose.model('User');
		that.failure({username: 'Too long'});
		//that.success({yea : true});
		//User.find({}, function(err,docs){ that.success(docs); });
	}

}
