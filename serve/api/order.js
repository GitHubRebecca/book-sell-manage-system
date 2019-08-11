const KoaRouter = require('koa-router')
const router = new KoaRouter()
const Order = require("../model/Order")
const Book = require("../model/Book")
const User = require("../model/User")
const mongoose = require("mongoose")

router.get("/getOrders", async ctx => {
  let query = {user: {$in: [ctx.request.query.id]}} //获取自己的订单 还有就是自己创建的用户的订单
  if (ctx.request.query.searchKey) {
    query['$or'] = [
      {bookName: ctx.request.query.searchKey},
      {userName: ctx.request.query.searchKey}
    ]
  }
  if(ctx.request.query.searchDate && ctx.request.query.searchDate != 'null') {
    query.saleDate = {
      $gte: Number(ctx.request.query.searchDate.split(",")[0]),
      $lte: Number(ctx.request.query.searchDate.split(",")[1])
    }
    console.log(query)
  }
  const users = await User.find({createUser: ctx.request.query.id})
  if(users) {
    users.forEach(user => {
      query['user']['$in'].push(user._id)
    })
  }

  const orders = await Order.find(query).populate("book", ["percentage"]).skip(Number((ctx.request.query.currentPage - 1) * Number(ctx.request.query.pageSize))).limit(Number(ctx.request.query.pageSize))
  const count = await Order.find(query).countDocuments()

  return ctx.body = {
    isSuccess: true,
    msg: "查询成功",
    result: { orders, count }
  }
})

router.post("/addOrder", async ctx => {
  const book = await Book.findOne({_id: ctx.request.body.bookId})
  const user = await User.findOne({_id: ctx.request.body.userId})
  const newOrder = new Order({
    bookName: book.name,
    book: book._id,
    user: user._id,
    userName: user.name,
    saleCount: ctx.request.body.saleCount,
    saleDate: ctx.request.body.saleDate,
    bookIncomPrice: book.incomePrice,
    bookSellPrice: book.sellPrice,
    sellIncome: (book.sellPrice * book.percentage * ctx.request.body.saleCount).toFixed(2),
  })

  const order = await newOrder.save()
  return ctx.body = {
    isSuccess: true,
    msg: "新增成功",
    result: order
  }
})

router.put("/updateOrder/:id", async ctx => {
  const book = await Book.findOne({_id: ctx.request.body.bookId})
  const newOrder = {
    bookName: book.name,
    book: book._id,
    saleCount: ctx.request.body.saleCount,
    saleDate: ctx.request.body.saleDate,
    sellIncome: (book.sellPrice * book.percentage * ctx.request.body.saleCount).toFixed(2),
  }
  const order = await Order.findOneAndUpdate({ _id: ctx.params.id }, { $set: newOrder }, { new: true })
  return ctx.body = {
    isSuccess: true,
    msg: "编辑成功",
    result: order
  }
})

router.delete("/deleteOrder/:id", async ctx => {
  const order = await Order.findOneAndRemove({ _id: ctx.params.id })
  return ctx.body = {
    isSuccess: true,
    msg: "删除成功",
    result: order
  }
})

router.get("/getMoneys", async ctx => {
  let query = {'user': {'$in': [mongoose.Types.ObjectId(ctx.request.query.id)]}} //这里需要转换成ObjectId
  if (ctx.request.query.searchKey) {
    query.userName = ctx.request.query.searchKey
  }

  if(ctx.request.query.searchDate && ctx.request.query.searchDate != 'null') {
    query.saleDate = {
      $gte: Number(ctx.request.query.searchDate.split(",")[0]),
      $lte: Number(ctx.request.query.searchDate.split(",")[1])
    }
    console.log(query)
  }

  const users = await User.find({createUser: ctx.request.query.id})
  if(users) {
    users.forEach(user => {
      query['user']['$in'].push(user._id)
    })
  }

  const group = {
    $group: {
      _id: '$user',
      sellIncome: {$sum: "$sellIncome"},
      userName: {$first: '$userName'}
    }
  }

  const moneys = await Order.aggregate([{$match: query}, group]).skip(Number((ctx.request.query.currentPage - 1) * Number(ctx.request.query.pageSize))).limit(Number(ctx.request.query.pageSize))
  const count = await Order.aggregate([{$match: query}, group])

  return ctx.body = {
    isSuccess: true,
    msg: "查询成功",
    result: { moneys, count: count.length }
  }
})

module.exports = router.routes()