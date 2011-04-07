exports.Login = {

	getOrg: function(para){
		var callback = this,
				//User = Mongoose.model('User'),
				Ppl = Mongoose.model('Ppl');

		Ppl.find({}, function(err, users){
			var ret = [];
			users.forEach(function(u){
				ret.push({ id: u.id, name: u.name, login: u.fullName, name_im: u.name.im, name_oth: u.name.oth, name_fam: u.name.fam });
			});
			// add empty one?
			ret.push({ login: '< новый >' });
			callback.success(ret);
			//callback.success({ users: users })
		});
		//callback.success({ none: 'none' });
	},

	some1: function(para){ //:: { "formHandler": "true" }
		var callback = this;//, User = Mongoose.model('User');
		var Ppl = Mongoose.model('Ppl');
		//console.log(callback.app.req.session.items);
		//callback.app.req.session.items = '123123123123123123';
		//callback.app.req.flash('info', 'ASDASDASD');

		/*
		var ppl = new Ppl({ im: 'im', fam: 'fam', oth: 'oth' });
		var user = new User({ ppl_id: ppl.id, login: para.username, password: para.password });
		ppl.save();
		user.save();
		*/
		/*
		var user = new User({ login: para.username, password: para.password });
		user.save(function(err){
			if (err){
				callback.failure({ username: err.message });
			}else{
				*/

				Ppl.auth(para.username, para.password, function(user){
					if (user){
						callback.app.req.session.user_id = user.user.id;

						//callback.app.res.redirect('/');
						callback.success({ login: user.login });
					}else{
						callback.failure({ username: 'Noooooo!' });
					}
					/*
					if (aUser.user){
						//console.log(aUser.id);
						console.log(user.ppl + '-' + ppl.id);
						Ppl.findOne({ _id: aUser.ppl }, function(err, aPpl){
							console.log('aPpl:' + aPpl);
							callback.success({ ppl: aPpl });
						});
						//callback.success({ id: docs.id });
					}else{
						callback.failure({ username: 'Not Found' });
					}
					*/
				//});

				/*
				var q = User.findOne({ login: para.username, password: para.password }, function(err,docs){
					if (docs){
						callback.success({ id: docs.id, full: docs.full });
					}else{
						callback.failure({ username: 'Not Found' });
					}
				});
				*/
			//}
		});


	},

	some2: function(para){
		var callback = this, Ppl = Mongoose.model('Ppl');
		callback.failure({ username: 'Too long' });
		//callback.success({yea : true});
		//User.find({}, function(err,docs){ callback.success(docs); });
	}

}
