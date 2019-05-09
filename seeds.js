var mongoose = require("mongoose");
var Round = require("./models/round");
var Comment = require("./models/comment");

var seeds = [
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

async function seedDB() {
  await Round.remove({});
  console.log("rounds removed");
  await Comment.remove({});
  console.log("comments removed");

  for (const seed of seeds) {
    let round = await Round.create(seed);
    console.log("rounds created");
    let comment = await Comment.create({
      text: "A great round today for you",
      author: "Timmmy"
    });
    console.log("comment created");
    round.comment.push(comment);
    round.save();
  }
}

module.exports = seedDB;
