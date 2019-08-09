const KoaRouter = require('koa-router')
const router = new KoaRouter()
const Book = require("../model/Book")

router.get("/getBooks", async ctx => {
  let query = {}
  if (ctx.request.query.searchKey) {
    query.name = ctx.request.query.searchKey
  }

  const books = await Book.find(query).skip(Number((ctx.request.query.currentPage - 1) * Number(ctx.request.query.pageSize))).limit(Number(ctx.request.query.pageSize))
  const count = await Book.find(query).count()

  return ctx.body = {
    isSuccess: true,
    msg: "查询成功",
    result: { books, count }
  }
})

router.post("/addBook", async ctx => {
  const newBook = new Book({
    name: ctx.request.body.name,
    stock: ctx.request.body.stock,
    incomePrice: ctx.request.body.incomePrice,
    sellPrice: ctx.request.body.sellPrice,
    type: ctx.request.body.type,
    percentage: ctx.request.body.percentage
  })

  const book = await newBook.save()
  return ctx.body = {
    isSuccess: true,
    msg: "新增成功",
    result: book
  }
})

router.put("/updateBook/:id", async ctx => {
  const newBook = {
    name: ctx.request.body.name,
    stock: ctx.request.body.stock,
    incomePrice: ctx.request.body.incomePrice,
    sellPrice: ctx.request.body.sellPrice,
    type: ctx.request.body.type,
    percentage: ctx.request.body.percentage
  }
  const book = await Book.findOneAndUpdate({ _id: ctx.params.id }, { $set: newBook }, { new: true })
  return ctx.body = {
    isSuccess: true,
    msg: "编辑成功",
    result: book
  }
})

router.delete("/deleteBook/:id", async ctx => {
  const book = await Book.findOneAndRemove({ _id: ctx.params.id })
  return ctx.body = {
    isSuccess: true,
    msg: "删除成功",
    result: book
  }
})

module.exports = router.routes()