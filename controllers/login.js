exports.Login = {

	pplDelete: function(para){
		var callback = this,
				Ppl = Mongoose.model('Ppl');

		var id = para.data[0].id;
		if (!id){ callback.failure({ login: 'Не могу найти' }); return };
		Ppl.findById(id, function(err, ppl){
			if(!ppl){ callback.failure({ login: 'Не могу найти' }); return };
			ppl.remove( function(){
				callback.success({ yea: true });
			});
		});
	},

	pplSendForm: function(para){ //:: { "formHandler" : "true" }
		var callback = this,
				Ppl = Mongoose.model('Ppl');

		if (para.pass1 && para.pass1 != para.pass2){
			callback.failure({ pass1: 'Пароли не совпадают' });
			return;
		}
		if (para.id){
			// update
			Ppl.findById(para.id, function(err, ppl){
				if (ppl){
					updPpl(ppl);
				}else{
					callback.failure({ login: 'Не могу найти' });
				}
			});
		}else{
			// new one
			if (!para.pass1){
				callback.failure({ pass1: 'Задайте пароль' });
				return;
			}
			updPpl(new Ppl());
		}
		function updPpl(ppl){
				if (para.pass1){ ppl.password = para.pass1 };
				ppl.login = para.login;
				ppl.name.im = para.name_im;
				ppl.name.fam = para.name_fam;
				ppl.name.oth = para.name_oth;
				ppl.save(function(){
					callback.success({ id: ppl.id });
				});
		}
		//console.log(para);
	},

	getOrg: function(para){
		var callback = this,
				//User = Mongoose.model('User'),
				Ppl = Mongoose.model('Ppl');

		Ppl.find({}, function(err, users){
			var ret = [];
			users.forEach(function(u){
				ret.push({ id: u.id, name: u.name, fullName: u.fullName, login: u.login, name_im: u.name.im, name_oth: u.name.oth, name_fam: u.name.fam });
			});
			// add empty one?
			ret.push({ fullName: '< новый >' });
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
						callback.app.req.session.user_id = user.id;

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
