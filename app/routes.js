module.exports=function(app,passport){
var User=require('../app/models/user');
var Todo=require('../app/models/todo');
var Photo=require('../app/models/photo');
var busboy = require('connect-busboy');

app.use(busboy()); 
const fs = require('fs');
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
    Todo.find({'email':req.user.local.email,'completed':false},function(err,todos){
    	if(err) res.send(err);    	
    	res.json(todos);
    });
});


app.post('/todos',isLoggedIn,function(req,res){
	Todo.create({
		email:req.user.local.email,
		text:req.body.text,
		date:req.body.date,
		completed:false

	},function(err,todo){

		
		if(err) res.send(err);
		Todo.find({'email':req.user.local.email,'completed':false},function(err,todos){
			if(err) res.send(err);
			res.json(todos);
		});
	});
});

app.delete('/todos/:todo_id',function(req,res){



	Todo.update({_id:req.params.todo_id},
		{
        $set: { 'completed': true,
               'date':new Date()},
    	},
    	function(err,todo){


    	if(err) res.send(err);

		Todo.find({'email':req.user.local.email,'completed':false},function(err,todos){
			if(err) res.send(err);
			res.json(todos);
		});

    	});




});


app.get('/num_todos',isLoggedIn,function(req,res){

	//console.log(new Date()-1000*60*60*24*30);
    Todo.aggregate([
    // Get only records created in the last 30 days
    {$match:{
          "date":{$gt: new Date((new Date()).getTime()- 1000*60*60*24*30) },
          "completed":true,
          'email':req.user.local.email
    }}, 
    // Get the year, month and day from the createdTimeStamp
    {$project:{
          "year":{$year:"$date"}, 
          "month":{$month:"$date"}, 
          "day": {$dayOfMonth:"$date"}
    }}, 
    // Group by year, month and day and get the count
    {$group:{
          _id:{year:"$year", month:"$month", day:"$day"}, 
          "count":{$sum:1}
    }}
],function(err,result){
	//console.log(result);
	if(err)
		res.json(err);
	else{
		var nresult=[];
		result.forEach(function(r){
			nresult.push([Date.UTC(r['_id']['year'],parseInt(r['_id']['month'])-1,r['_id']['day']),r['count']])
		});

		


		res.json(nresult);
	}
});
});








app.post('/profilepic',isLoggedIn, function(req, res) {
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        var fformat=filename.split(".")[1];
        var nfilename=req.user._id+'.'+fformat
        fstream = fs.createWriteStream('views/images/' + nfilename);


    Photo.findOneAndUpdate({email:req.user.local.email}, {
        	email:req.user.local.email,
			address:nfilename
		}, {upsert:true}, function(err, doc){
	    if (err) return res.send(500, { error: err });
	    
	});




        file.pipe(fstream);
        fstream.on('close', function () {
            res.redirect('back');
        });
    });
});


app.get('/profilepic',isLoggedIn, function(req, res) {

	Photo.findOne({'email':req.user.local.email},function(err,photo){
    	if(err) res.send(err);    	
    	res.json(photo);
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