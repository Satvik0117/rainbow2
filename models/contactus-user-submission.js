var mongoose=require('mongoose');

var contact_userSchema=mongoose.Schema({
	email:{type:String,required:true},	
	message:{type:String,required:false},
	name:{type:String,required:true},
	number:{type:String,required:true}
	
});



module.exports=mongoose.model('Contact_user',contact_userSchema);