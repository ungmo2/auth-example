var mongoose = require("mongoose");

// Define Schemes
var userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  lastname: String,
  firstname: String
},
{
  timestamps: true
});

// Create Model & Export
module.exports = mongoose.model("User", userSchema);
