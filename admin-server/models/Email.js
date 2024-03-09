// models/Email.js
const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  email: String,
  name: String,
  mobile: String,
  subject: String,
});

const Email = mongoose.model("Email", emailSchema);

module.exports = Email;
