const mongoose = require("mongoose")
const Schema = mongoose.Schema

const BookSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  incomePrice: {
    type: Number,
    required: true
  },
  sellPrice: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  img: {
    type: String,
    default: ''
  },
  percentage: {
    type: Number,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("book", BookSchema)