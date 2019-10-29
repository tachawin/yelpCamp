var Campground = require("../models/campground");
var Comment = require("../models/comment");

//all the middleware
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){

        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                req.flash("error","Campground not Found");
                res.redirect("back");
            }else{
                //does user own the campgrounds
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","you don't have permisstion to do  that");
                    res.redirect("back");
                }
            }
        })
    }else{
        req.flash("error","YOU NEED TO BE LOGGED IN TO DO THAT!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){

        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                res.redirect("back");
            }else{
                //does user own the comment
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","you don't have permisstion to do  that")
                    res.redirect("back");
                }
            }
        })
    }else{
        req.flash("error","YOU NEED TO BE LOGGED IN TO DO THAT!");
        res.redirect("back");
    }
}


middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","YOU NEED TO BE LOGGED IN TO DO THAT!");
    res.redirect("/login");
}

module.exports = middlewareObj;