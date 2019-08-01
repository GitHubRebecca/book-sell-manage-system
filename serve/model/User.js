const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Userschema = new Schema({
  name: {
    type: String,
    require: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    trim: true
  },
  indentity: {
    type: String,
    required: true,
    trim: true
  },
  created: {
    type: Data,
    default: Data.now
  }
})

module.exports = mongoose.model("user", Userschema)