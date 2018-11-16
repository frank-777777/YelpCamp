var express = require("express");
var router = express.Router();
var Campground = require("../models/campground")
var Comment = require("../models/comment")
var middleware = require("../middleware/index.js")

router.get("/campgrounds", function(req, res) {
    //get from DB and render
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
    //res.render("campgrounds", {campgrounds: campgrounds});
    //Fisrt camp is whatever we want, the second is the data we want to pass in
});

router.post("/campgrounds", middleware.isLoggedIn, function(req, res) {
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: description, author: author};
    //save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log("err");
        }
        else{
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    })
    //campgrounds.push(newCampground);
    //redirect back to campgrounds page
})

router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new.ejs");
})

router.get("/campgrounds/:id", function(req, res) {
    //render show templ
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err){
            console.log(err);
        }
        else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    })
});

//edit campground route
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
        })
})

//update campground route
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           //redirect somewhere(show page)
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

module.exports = router;