exports.Login = {

	some1: function(para){ //:: { "formHandler": "true" }
		var callback = this, User = Mongoose.model('User');
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

				User.auth(para.username, para.password, function(aUser){
					//console.log(aUser);
					if (aUser){
						callback.app.req.session.userLogin = aUser.ppl.im;
						callback.success(aUser.ppl.im);
					}else{
						// That worked ::)
						//callback.app.res.redirect('/nonexist');
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
		var callback = this, User = Mongoose.model('User');
		callback.failure({username: 'Too long'});
		//callback.success({yea : true});
		//User.find({}, function(err,docs){ callback.success(docs); });
	}

}
