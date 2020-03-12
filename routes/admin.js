var express=require('express');
var router=express.Router(); 
var Brand=require('../models/brand.js');
var Product=require('../models/products.js');
var Category=require('../models/categories.js');
var Order=require('../models/order.js');
var Cart=require('../models/cart.js');
var User=require('../models/user.js');
var Contact_user=require('../models/contactus-user-submission.js');


const upload = require("../multer/storage.js");


router.get("/brands",function(req,res){
	Brand.find(function(err,brands){
		if(err) return console.log(err);
		res.render('admin/brands',{
			brands:brands
		});
	});
});


router.get("/orders",function(req,res){
	Order.find().populate("user").sort({'_id': -1}).exec(function(err, orders){
        if(err){
            return  res.send("Some error occured. Please try again.")
        }
        console.log(orders);
        var cart;
        orders.forEach(function(order){
            cart = new Cart(order.cart);
            order.items = cart.generateArray;
        });

        res.render('admin/orders',{orders:orders});
    });
});

router.get('/contact-response',function(req,res){
	Contact_user.find({},function(err,entries){
		if(!err)
		res.render('admin/contact-responses',{entries,entries});
	})
});

router.get("/add-brand",function(req,res){
    res.render("admin/add-brand.ejs");
});


router.post('/add-brand',function(req,res){
	var name=req.body.brand_name;
	// var slug=title.replace(/\s+/g,'-').toLowerCase();
	// var img=req.body.imgUrl;
    // console.log(name);

				var brand= new Brand({
					name:name
				});
				brand.save(function(err){
					if(err){
						return console.log(err);
					}
					// req.flash('success','Category Added');
					res.redirect('/admin/brands');
				});
});

router.post("/brands/delete/:id", function(req, res){
	Brand.findById(req.params.id, function(err, brand){
		if(err){
			console.log(err);
		} else {
			brand.remove();
			res.redirect("/admin/brands");
		}
	}); 
 });

// router.get("/categories",function(req,res){

//     res.render("admin/categories.ejs");

// });
router.get('/categories',function(req,res){
	Category.find(function(err,categories){
		if(err) return console.log(err);
		res.render('admin/categories',{
			categories:categories
		});
	});
});

router.get("/add-category",function(req,res){
    res.render("admin/add-category.ejs");
});


router.post("/categories/delete/:id", function(req, res){
	Category.findById(req.params.id, function(err, category){
		if(err){
			console.log(err);
		} else {
			category.remove();
			res.redirect("/admin/categories");
		}
	}); 
 });


router.post('/add-category',function(req,res){
	var name=req.body.category_name;
	// var slug=title.replace(/\s+/g,'-').toLowerCase();
	// var img=req.body.imgUrl;
    // console.log(name);

				var category= new Category({
					name:name
				});
				category.save(function(err){
					if(err){
						return console.log(err);
					}
					// req.flash('success','Category Added');
					res.redirect('/admin/categories');
				});
});

router.get('/products',function(req,res){
	Product.find(function(err,products){
		if(err) return console.log(err);
		res.render('admin/products',{
			products:products
		});
	});
});

router.get("/add-product",function(req,res){
	Category.find(function(err,categories){
		if(err) return console.log(err);
		Brand.find(function(err,brands){
			var data= JSON.stringify({categories:categories, brands: brands})
			// console.log(JSON.parse(data).categories);
			res.render('admin/add-product',{
				data:data
			});
		});
		
		
	});	
	
	
	// res.render("admin/add-product.ejs");
	


});

router.post('/add-product',function(req,res){
	upload(req, res, function (err) {
		// need to check if the req.file is set.
		if(req.file== null){
			console.log("nothing got here");
		}
        if(req.file == null || req.file == undefined || req.file == ""){
            //redirect to the same url         
            console.log("failed");   
            res.redirect("/");
            
        }else{
            // An error occurred when uploading
            if (err) {
                console.log("failed while uploading");   

                console.log(err);
            }else{
                // Everything went fine
                //define what to do with the params
                //both the req.body and req.file(s) are accessble here
                // console.log(req.file);
        
        
                //store the file name to mongodb    
                //we use the model to store the file.
                var product= new Product({
                    product_name:req.body.product_name,
                    category:req.body.category,
                    brand_name:req.body.brand_name,
                    original_price :req.body.original_price,
                    discounted_price:req.body.discounted_price,
                    short_description:req.body.short_description,
                    long_description:req.body.long_description,
                    specifications:req.body.specifications,
                    usage:req.body.usage,
                    image_path:req.file.filename

                });
                product.save(function(err,product){
                    if(err){
                        return console.log(err);
					}
					Brand.findOne({name: req.body.brand_name}, function(err, foundBrand){
						if(err){
							console.log(err);
						} else {
							// console.log(foundBrand);
							foundBrand.products.push(product);
							foundBrand.save(function(err, data){
								if(err){
									console.log(err);
								} else {
									console.log(data);
								}
							});
						}
					});
					Category.findOne({name: req.body.category}, function(err, foundCat){
						if(err){
							console.log(err);
						} else {
							// console.log(foundBrand);
							foundCat.products.push(product);
							foundCat.save(function(err, data){
								if(err){
									console.log(err);
								} else {
									console.log(data);
								}
							});
						}
					});
                    // req.flash('success','Category Added');
                    res.redirect('/admin/products');
                });

            }
          }

        });
});

router.post("/products/delete/:id", function(req, res){
	Product.findById(req.params.id, function(err, product){
		if(err){
			console.log(err);
		} else {
			product.remove();
			res.redirect("/admin/products");
		}
	}); 
 });

module.exports=router; 