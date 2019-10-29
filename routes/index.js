var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/",function(req,res){
    res.render("landing");
})


//auth route
/// show sign up form
router.get("/register",function(req,res){
    res.render("register");
});

//handling user sign up
router.post("/register",function(req,res){
    User.register(new User({username: req.body.username}),req.body.password,function(err,user){
        if(err){
            req.flash("error",err);
            return res.render('register');
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","welcome to yelp camp" + user.username);
            res.redirect("/campgrounds");
        })
    })
});


//login routes
router.get("/login",function(req,res){
    res.render("login");
});


// login logic
//middleware
router.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),function(req,res){
    res.render("login");
});


//logout routes
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect("/campgrounds");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;