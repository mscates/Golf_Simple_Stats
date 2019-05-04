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
    putts: Number,
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
      }
    ]
  },
  { _id: false }
);
roundSchema.plugin(AutoIncrement);

module.exports = mongoose.model("Round", roundSchema);
