const mongoose = require("mongoose")
const Schema = mongoose.Schema

const OrderSchema = new Schema({
  book: {
    type: Schema.Types.ObjectId,
    ref: "book",
    required: true
  },
  bookName: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  userName: String,
  saleCount: {
    type: Number,
    required: true
  },
  saleDate: {
    type: Date,
    required: true
  },
  bookIncomPrice: {
    type: Number,
    required: true
  },
  bookSellPrice: {
    type: Number,
    required: true
  },
  sellIncome: Number,
  created: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("order", OrderSchema)