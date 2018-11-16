var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground") 
var seedDB = require("./seeds")
var Comment = require("./models/comment")
var passport = require("passport")
var LocalStrategy = require("passport-local")
var User = require("./models/user")
var methodOverride = require("method-override")
var flash = require("connect-flash");

var commentRoutes = require("./routes/comments")
var campgroundsRoutes = require("./routes/campgrounds")
var indexRoutes = require("./routes/index")

//seedDB();

mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT Configuration
app.use(require("express-session")({
    secret: "Once again my love is Crystal",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//for currentUser: req.user
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

// Campground.create(
//     {name: "Boeing 787-900", 
//     image: "https://cdn.jetphotos.com/full/5/94282_1491725024.jpg",
//     description: "Boeing Dream Liner"
//     },
//     function(err, campground) {
//         if(err){
//             console.log("err");
//         }
//         else{
//             console.log("New create campground");
//             console.log(campground);
//         }
//     });

// var campgrounds = [
//         {name: "Salon", image: "https://cdn.pixabay.com/photo/2017/07/31/06/21/singapore-2556630__340.jpg"},
//         {name: "Mark", image: "https://cdn.pixabay.com/photo/2017/07/31/06/20/singapore-2556628__340.jpg"},
//         {name: "Arie", image: "https://cdn.pixabay.com/photo/2015/07/13/14/40/paris-843229__340.jpg"}
//     ]

app.use(indexRoutes);
app.use(campgroundsRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp Server Has Started!");
})