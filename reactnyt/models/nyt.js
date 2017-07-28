var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NytSchema = new Schema({
  title: {
    type: String
  },
  date: {
    type: Date
  },
  url: {
    type: String
  }
});

var NYT = mongoose.model("NYT", NytSchema);
module.exports = NYT;
