var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const mongoose = require('mongoose');
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
var flash = require('connect-flash');

//requring route
var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");

var Campground = require("./models/campground");
// var seedDB = require("./seed");
var Comment   = require("./models/comment");
var User = require("./models/user");

mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(flash());

app.use(require("express-session")({
    secret: "bbbbbbbbbbb",
    resave: false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(methodOverride("_method"));
app.use(expressSanitizer());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// seedDB();


app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})




app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.listen(2000,function(){
    console.log("Connected");
});