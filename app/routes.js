module.exports=function(app,passport){
var User=require('../app/models/user');
var Todo=require('../app/models/todo');
app.get('/',function(req,res){
	res.render('index.ejs');
});

app.get('/login',function(req,res){
	res.render('login.ejs',{message:req.flash('loginMessage')});
});

app.get('/signup',function(req,res){
	res.render('signup.ejs',{message:req.flash('signupMessage')});
});

app.get('/profile', isLoggedIn,function(req,res){
	res.sendfile('./views/profile.html');
});


////////////////////////

app.get('/currentuser',isLoggedIn,function(req,res){

	res.json(req.user);

});

app.get('/todos',isLoggedIn,function(req,res){
    Todo.find({'email':req.user.local.email},function(err,todos){
    	if(err) res.send(err);    	
    	res.json(todos);
    })
});


app.post('/todos',isLoggedIn,function(req,res){
	Todo.create({
		email:req.user.local.email,
		text:req.body.text
	},function(err,todo){
		if(err) res.send(err);
		Todo.find({'email':req.user.local.email},function(err,todos){
			if(err) res.send(err);
			res.json(todos);
		});
	});
});

app.delete('/todos/:todo_id',function(req,res){
	Todo.remove({
		_id:req.params.todo_id
	},function(err,todo){
		if(err) res.send(err);

		Todo.find({'email':req.user.local.email},function(err,todos){
			if(err) res.send(err);
			res.json(todos);
		});

	});
});


/////////////////////


app.get('/logout',function(req,res){
	req.logout();
	res.redirect('/');
});


app.post('/signup',passport.authenticate('local-signup',{
	successRedirect:'/profile',
	failureRedirect:'/signup',
	failureFlash:true

}));


app.post('/login',passport.authenticate('local-login',{

	successRedirect:'/profile',
	failureRedirect:'/login',
	failureFlash:true

}));

};


function isLoggedIn(req,res,next){
	if(req.isAuthenticated())
		return next();

	res.redirect('/');
}