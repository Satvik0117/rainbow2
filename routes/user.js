var express=require('express');
var router=express.Router(); 
var passport = require('passport');
var Fuse = require('fuse.js');
// var csrf = require("csurf");

// var csrfProtection = csrf();
// router.use(csrfProtection);

var Cart=require('../models/cart.js');
var Brand=require('../models/brand.js');
var Product=require('../models/products.js');
var Order=require('../models/order.js');
var Category=require('../models/categories.js');
var User=require('../models/user.js');
var Contact_user=require('../models/contactus-user-submission.js');
router.use('/uploads', express.static('uploads'));
router.use(express.static(__dirname + '/public'));

router.get("/user/signup",function(req,res){
    var messages = req.flash('error');

    if(!req.session.cart){
        return res.render('user/signup',{messages: messages, inCartProducts: null, totalPrice: null});
     }
     var cart = new Cart(req.session.cart);
    
    res.render("user/signup", {messages: messages,inCartProducts: cart.generateArray(), totalPrice: cart.totalPrice});
})

router.post("/user/signup",passport.authenticate('local.signup',{
    successRedirect: '/shopping-cart',
    failureRedirect: '/user/signup',
    failureFlash: true
}));
    // console.log(req.body.username);
router.get("/user/signin",function(req,res,next){
    var messages = req.flash('error');
    // var cart = new Cart(req.session.cart);
    if(!req.session.cart){
        return res.render('user/signin',{messages: messages, inCartProducts: null, totalPrice: null});
     }
     var cart = new Cart(req.session.cart);


    res.render("user/signin", { messages: messages,inCartProducts: cart.generateArray(), totalPrice: cart.totalPrice});
    // res.render("user/signin", {csrfToken: req.csrfToken(), messages: messages});

});


    
router.post("/user/signin",passport.authenticate('local.signin',{
    successRedirect: '/checkout',
    failureRedirect: '/user/signin',
    failureFlash: true
}));


router.get('/user/profile',isLoggedIn,function(req, res){
    var user = req.user;
    console.log(user);

    Order.find({user : user}, function(err, orders){
        if(err){
            return  res.send("Some error occured. Please try again.")
        }
        console.log(orders);
        var cart;
        orders.forEach(function(order){
            cart = new Cart(order.cart);
            order.items = cart.generateArray;
        });

        // console.log(orders[1].cart.items);
        // var key = Object.keys(orders[1].cart.items);
        // console.log(key[0]);
        // console.log('sdf');
        // console.log(orders[1].cart.items);
        // console.log( orders[1].cart.items[key[0]]);
        res.render('user/profile',{user:user,orders:orders});
    });


	// Order.find({user : user}).exec(function(err, orders){
    //     for(var i=0 ; i<orders.length; i++){

        
    //     console.log(orders[i].cart);
    //     }
    //     res.send(orders);

    // });

});


router.get('/user/profile/edit',isLoggedIn,function(req,res){
    var user = req.user;
    User.findById(user._id, function(err, foundUser){
        res.render('user/edit-profile',{user:foundUser});
    });

});

router.post('/user/profile/edit',isLoggedIn,function(req,res){
    var newName = req.body.name;
    var newAddress = req.body.address;
    var newNumber = req.body.number;
    var user = req.user;

    User.findById(user._id, function(err, foundUser){
        foundUser.name = newName;
        foundUser.address = newAddress;
        foundUser.number = newNumber;
        foundUser.save(function(err){
            if(err) {return res.redirect('/user/profile/edit');
                }            
                return res.redirect('/user/profile');
        });
    });

});

router.get('/user/logout',function(req, res,next){
    req.logOut();
    res.redirect('/');
});

router.get('/add-to-cart/:id', function(req, res, next){ //for request from shop page
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function(err,product){
        if(err){
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);

        res.redirect('/all-products');
    });

});

router.get('/add-to-cart/rqst-from-index-page/:id/', function(req, res, next){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function(err,product){
        if(err){
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);

        res.redirect('/');
    });

});

router.get('/reduce/:id',function(req,res,next){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    console.log(cart);
    res.redirect('/shopping-cart'); 
});

router.get('/remove/:id',function(req,res,next){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    console.log(cart);
    if(cart.totalQty ==0){
        req.session.cart = null;
    }
    res.redirect('/shopping-cart'); 
});

router.get('/add-to-cart/rqst-from-cart-page/:id/', function(req, res, next){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function(err,product){
        if(err){
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);

        res.redirect('/shopping-cart');
    });

});



router.get('/shopping-cart', function(req,res){
    if(!req.session.cart){
       return res.render('user/shopping-cart',{products:null, user:null,totalPrice : null});
    }
    var cart = new Cart(req.session.cart);
    console.log(req.user);
    res.render('user/shopping-cart',{products: cart.generateArray(),user:req.user ,totalPrice: cart.totalPrice});
});

router.get('/checkout',isLoggedIn,function(req,res){
    if(!req.session.cart){
        return res.redirect('/shopping-cart');
    }
    user = req.user;
    var cart = new Cart(req.session.cart);
    res.render('user/check-out',{products: cart.generateArray(),totalPrice: cart.totalPrice,user:user});

});

router.post('/payment/success',isLoggedIn,function(req,res){
    var cart = new Cart(req.session.cart);
    // console.log(cart);
    // req.session.cart = null;
    console.log(req);
    req.session.cart = null;
    var order = new Order({
        user : req.user._id,
        cart : cart
    });
    order.save(function(err, result){
        req.flash('success','Order placed successfully.');
        res.redirect('/user/profile/');
    });    
});

router.get("/",function(req,res){
	Category.find().populate("products").sort({'_id': 1}).exec(function(err, categories){
		if(err) return console.log(err);
		Brand.find().populate("products").exec(function(err,brands){
            Product.find(function(err,products){
                var data= JSON.stringify({categories:categories, brands: brands,products : products});
                if(!req.session.cart){
                    // console.log(req.user);3
                    return res.render('user/index',{data:data, inCartProducts: null, totalPrice: null,user:req.user});
                 }
                
                var cart = new Cart(req.session.cart);
                // console.log(JSON.parse(data).categories);
                res.render('user/index.ejs',{
                    data:data,inCartProducts: cart.generateArray(), totalPrice: cart.totalPrice, user:req.user
                });

            })
	
		});
	});	
});

router.get("/all-products/",function(req,res){
    Product.find(function(err,products){
        if(err) return console.log(err);
        if(!req.session.cart){
            return 	res.render('user/shop',{
                products:products,inCartProducts: null, totalPrice: null,user:req.user
            });
        }


    var cart = new Cart(req.session.cart);
        console.log(cart);
		res.render('user/shop',{
			products:products,inCartProducts: cart.generateArray(), totalPrice: cart.totalPrice,user:req.user
		});
    });
});


router.get("/product/:id",function(req,res){
    Product.findById(req.params.id, function(err, product){
        if(err){
            console.log(err);
        } else {
            // console.log(product);
        if(!req.session.cart){
            return 	res.render('user/product',{
                product:product,inCartProducts: null, totalPrice: null
            });
        }
        var cart = new Cart(req.session.cart);

            // res.send(blog);
            res.render("user/product", {product: product,inCartProducts: cart.generateArray(), totalPrice: cart.totalPrice}); 
        }
    })
});

router.get('/search',function(req,res){
    var query = req.query.searchquery;
    console.log(query);

    Product.find(function(err,products){
        var options = {
            shouldSort: true,
            threshold: 0.5,
            location: 0,
            distance: 5000,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [
                "product_name",
                "brand_name",
                "category"
                  ]
                      };
            var fuse = new Fuse(products, options);
            var result = fuse.search(query);
            console.log(result);
            // res.send(result);
        if(err) return console.log(err);
        if(!req.session.cart){
            return 	res.render('user/shop',{
                products:result,inCartProducts: null, totalPrice: null,user:req.user
            });
        }

    var cart = new Cart(req.session.cart);
        console.log(cart);
		res.render('user/shop',{
			products:result,inCartProducts: cart.generateArray(), totalPrice: cart.totalPrice,user:req.user
		});
    });



});

router.get('/contact',function(req,res){
    if(!req.session.cart){
        return 	res.render('user/contact',{
            inCartProducts: null, totalPrice: null,user:req.user
        });
    }
    var cart = new Cart(req.session.cart);
        console.log(cart);
		res.render('user/contact',{
			inCartProducts: cart.generateArray(), totalPrice: cart.totalPrice, user:req.user
		});
});

router.post('/contact',function(req,res){
    var contact_user = new Contact_user;

    contact_user.name = req.body.name;
    contact_user.email = req.body.email;
    contact_user.number = req.body.number;
    contact_user.message = req.body.message;
    contact_user.save(function(err){
        if(!err)
        return res.redirect('/');
    })
});



function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        next();
    }
    else{
        res.redirect('/user/signin');
    }
}


module.exports=router; 