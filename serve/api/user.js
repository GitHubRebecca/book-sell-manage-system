const KoaRouter = require('koa-router')
const router = new KoaRouter()

router.post("/login/:id", ctx => {
  console.log(ctx.request.body)
  ctx.body = 'text'
})

module.exports = router.routes()