var mongoose=require('mongoose');
var Photo=mongoose.model('Photo',{
	email:String,
	address:String,
});

module.exports=Photo;