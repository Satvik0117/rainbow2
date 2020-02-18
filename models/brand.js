var mongoose=require('mongoose');

var BrandSchema=mongoose.Schema({
	
	name:{
		type:String,
		required:true
	},
	
	products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ]
	
});

var brand=module.exports=mongoose.model('Brand',BrandSchema);