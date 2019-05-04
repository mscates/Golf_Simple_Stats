var mongoose = require("mongoose");
var Round = require("./models/round");
var Comment = require("./models/comment");

var data = [
  {
    score: 75,
    fairways: 10,
    greens: 9,
    putts: 29
  },
  {
    score: 80,
    fairways: 7,
    greens: 8,
    putts: 32
  },
  {
    score: 91,
    fairways: 4,
    greens: 5,
    putts: 36
  }
];

function seedDB() {
  //Remove all campgrounds
  Round.deleteMany({}, function(err) {
    if (err) {
      console.log(err);
    }
    console.log("removed rounds!");
    Comment.deleteMany({}, function(err) {
      if (err) {
        console.log(err);
      }
      console.log("removed rounds!");
      //add a few campgrounds
      data.forEach(function(seed) {
        Round.create(seed, function(err, round) {
          if (err) {
            console.log(err);
          } else {
            console.log("added a round");
            //create a comment
            Comment.create(
              {
                text: "A great round today for you",
                author: "Timmmy"
              },
              function(err, comment) {
                if (err) {
                  console.log(err);
                } else {
                  round.comments.push(comment);
                  round.save();
                  console.log("Created new round");
                }
              }
            );
          }
        });
      });
    });
  });
}

module.exports = seedDB;
