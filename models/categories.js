var mongoose=require('mongoose');

var CategorySchema=mongoose.Schema({
	
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

module.exports=mongoose.model('Category',CategorySchema);