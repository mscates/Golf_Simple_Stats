// CONFIGURATION OF MONGOOSE AND THE MODEL
var mongoose = require("mongoose"),
  AutoIncrement = require("mongoose-sequence")(mongoose);

var roundSchema = new mongoose.Schema(
  {
    _id: Number,
    created: { type: Date, default: Date.now },
    score: Number,
    fairways: Number,
    greens: Number,
    putts: Number
  },
  { _id: false }
);
roundSchema.plugin(AutoIncrement);

// Golf.counterReset("_id", function(err) {});

module.exports = mongoose.model("Golf", roundSchema);
