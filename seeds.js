var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Flight CA",
        image: "https://cdn.jetphotos.com/full/5/10420_1532657842.jpg",
        description: "B-7832"
    },
    {
        name: "Flight CZ",
        image: "https://orig00.deviantart.net/0667/f/2012/152/6/a/china_southern_fist_airbus_a380_by_reith100-d51xtwe.jpg",
        description: "CZ A380"
    },
    {
        name: "Flight CX",
        image: "http://www.ejinsight.com/wp-content/uploads/2015/11/1176238_2f76e58e7cb796ba6a191db50c271732.jpg",
        description: "CX 777"
    }
]

function seedDB(){
    //Remove Campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }   
        else{
        console.log("Removed campgrounds");
        //Add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err)
                }   else{
                    console.log("Added a campground");
                    //Add a few comments
                    Comment.create(
                        {
                            text:"Great flight",
                            author:"Frank"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            }   else{
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment");
                            }
                        })
                }
            });
        })
        }
    });
}

module.exports = seedDB;
