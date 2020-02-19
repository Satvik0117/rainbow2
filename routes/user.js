var express=require('express');
var router=express.Router(); 

var Brand=require('../models/brand.js');
var Product=require('../models/products.js');
var Category=require('../models/categories.js');
router.use('/uploads', express.static('uploads'));
router.use(express.static(__dirname + '/public'));
router.get("/",function(req,res){
	Category.find().populate("products").exec(function(err, categories){
		if(err) return console.log(err);
		Brand.find().populate("products").exec(function(err,brands){
            Product.find(function(err,products){
                var data= JSON.stringify({categories:categories, brands: brands,products : products});
                // console.log(JSON.parse(data).categories);
                res.render('user/index.ejs',{
                    data:data
                });

            })
	
		});
	});	

});

router.get("/all-products/",function(req,res){
    Product.find(function(err,products){
		if(err) return console.log(err);
		res.render('user/shop',{
			products:products
		});
    });
});


router.get("/product/:id",function(req,res){
    Product.findById(req.params.id, function(err, product){
        if(err){
            console.log(err);
        } else {
            console.log(product);
            // res.send(blog);
            res.render("user/product", {product: product}); 
        }
    })
});



module.exports=router; 