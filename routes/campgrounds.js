var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
//INDEX - show all campgronds
router.get("/",function(req,res){
    //Get all campgrounds from db
    Campground.find({},function(err,allcampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index",{campgrounds: allcampgrounds,currentUser:req.user});
        }
    })

})
//CREATE = add new campground to DB
router.post("/",middleware.isLoggedIn,function(req,res){
    var nameAdd = req.body.name;
    var priceAdd = req.body.price;
    var imageAdd = req.body.image;
    var descriptionAdd = req.body.description;
    var author = {
        id : req.user._id,
        username : req.user.username
    }
    var newCampground = {name:nameAdd,price:priceAdd,image:imageAdd,description:descriptionAdd,author:author};
    // create a new campgroud and save to DB
    Campground.create(newCampground,function(err,newCreate){
        if(err){
            console.log(err);
        }else{
            // redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    })
});

// NEW = show form create new campground
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});

//SHOW - more info about one camp
router.get("/:id",function(req,res){
    //find the campground by id
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show",{campground: foundCampground});
        }
     })
});


//edit campground
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        res.render("campgrounds/edit",{campground:foundCampground});
        })
})
//update campground
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatecampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY campground
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    //destroy
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    })
    //redirect
});

module.exports = router;