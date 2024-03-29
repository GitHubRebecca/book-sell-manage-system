const koa = require("koa")
const KoaRouter = require('koa-router')
const router = new KoaRouter()
const bodyParser = require('koa-bodyparser')
const mongoose = require("mongoose")
const user = require("./api/user")
const book = require("./api/book")
const order = require("./api/order")

const app = new koa()

mongoose.connect("mongodb://localhost:27017/bookstore", { useNewUrlParser: true, useFindAndModify: false }).then(res => {
  console.log("mongodb connect success")
}).catch(err => {
  console.log(err, "mongodb connect error")
})

//注册路由
router.use("/api/user", user)
router.use("/api/book", book)
router.use("/api/order", order)


app.use(bodyParser())//这样就能拿到post提交的参数 这个必须在上面
app.use(router.routes()).use(router.allowedMethods())


app.listen(7000, () => {
  console.log("book store serve is running...")
})