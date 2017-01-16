
var mongoose=require('mongoose');
var Todo=mongoose.model('Todo',{
	text:String,
	email:String,
	date:{ type: Date, default: Date.now },
	completed: Boolean
});

module.exports=Todo;