const KoaRouter = require('koa-router')
const router = new KoaRouter()
const Order = require("../model/Order")
const Book = require("../model/Book")
const User = require("../model/User")

router.get("/getOrders", async ctx => {
  let query = {}
  if (ctx.request.query.searchKey) {
    query['$or'] = [{bookName: ctx.request.query.searchKey}, {userName: ctx.request.query.searchKey}]
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

module.exports = router.routes()