
var mongoose=require('mongoose');
var Todo=mongoose.model('Todo',{
	text:String,
	email:String
});

module.exports=Todo;