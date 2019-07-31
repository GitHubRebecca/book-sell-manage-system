const koa = require("koa")
const KoaRouter = require('koa-router')
const router = new KoaRouter()
const bodyParser = require('koa-bodyparser')
const user = require("./api/user")

const app = new koa()

router.use("/api/user", user)


app.use(bodyParser())//这样就能拿到post提交的参数 这个必须在上面
app.use(router.routes()).use(router.allowedMethods())


app.listen(7000, () => {
  console.log("book store serve is running...")
})