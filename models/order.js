var mongoose=require('mongoose');

var OrderSchema=mongoose.Schema({

	user: {type: mongoose.Schema.Types.ObjectID, ref: 'User'},

	cart: {type: Object, required: true}
	
});

var Order=module.exports=mongoose.model('Order',OrderSchema);