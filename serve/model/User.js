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
  status: {
    type: String,
    required: true,
    default: 'enable'
  },
  created: {
    type: Date,
    default: Date.now
  },
  createUser: {
    type: Schema.Types.ObjectId,
    ref: "user"
  }
})

module.exports = mongoose.model("user", Userschema)