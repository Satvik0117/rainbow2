var mongoose=require('mongoose');

var ProductSchema=mongoose.Schema({
	
	product_name:{
		type:String,
		required:true
	},
	brand_name:{
		type:String,
		required:true
	},
	category:{
		type:String,
		required:true
	},
	original_price:{
		type:String
	},
	discounted_price:{
		type:String
	},
	short_description:{
		type:String
	},
	long_description:{
		type:String
	},
	specifications:{
		type:String
	},
	usage:{
		type:String
	},
	image_path:{
		type:String
	}
 
});

var Product=module.exports=mongoose.model('Product',ProductSchema);