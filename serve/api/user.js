const KoaRouter = require('koa-router')
const router = new KoaRouter()

router.post("/login", ctx => {
  
  ctx.body = 'text'
})

module.exports = router.routes()