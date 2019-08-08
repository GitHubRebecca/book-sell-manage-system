const KoaRouter = require('koa-router')
const router = new KoaRouter()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const gravatar = require("gravatar")
const nodemailer = require("nodemailer")
const redis = require("redis")
const bluebird = require("bluebird")
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const redisClient = redis.createClient(6379, "localhost")
const User = require("../model/User")
const {getRandomCode} = require("../utils/randomCode")

//登录
router.post("/login", async ctx => {
  const user = await User.findOne({ name: ctx.request.body.username })
  if (!user) {
    return ctx.response.body = {
      isSuccess: false,
      msg: '该用户未注册',
      result: null
    }
  }
  const isMatch = await bcrypt.compare(ctx.request.body.pwd, user.password)
  if (isMatch) {
    const rules = {
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      indentity: user.indentity
    }
    const token = await jwt.sign(rules, 'secret', { expiresIn: ctx.request.body.autoLogin ? 3600 * 24 * 7 : 3600 })
    return ctx.body = {
      isSuccess: true,
      msg: '登录成功',
      result: 'Bearer ' + token
    }
  } else {
    return ctx.body = {
      isSuccess: false,
      msg: '密码错误',
      result: null
    }
  }
})

//注册
router.post("/register", async ctx => {
  const user = User.findOne({ name: ctx.request.body.name })
  if (user) {
    return ctx.body = {
      isSuccess: false,
      msg: "该用户已经注册",
      result: null
    }
  }
  const password = await bcrypt.hash(ctx.request.body.password, 10);
  const avatar = gravatar.url(ctx.request.body.email, { s: '200', r: 'pg', d: '404' }, true);

  const newUser = new User({
    name: ctx.request.body.name,
    password,
    email: ctx.request.body.email,
    avatar,
    indentity: ctx.request.body.indentity
  })

  newUser.save().then(user => {
    return ctx.body = {
      isSuccess: true,
      msg: '注册成功',
      result: user
    }
  }).catch(err => {
    console.log(err)
    return ctx.body = {
      isSuccess: false,
      msg: '注册失败',
      result: null
    }
  })
})

//发送验证码 jfnzwbdbeuytffad
router.post("/sendCode", async ctx => {
  const user = await User.findOne({ name: ctx.request.body.username, email: ctx.request.body.email })
  if (!user) {
    return ctx.body = {
      isSuccess: false,
      msg: "用户或邮箱不匹配",
      result: null
    }
  }
  //创建发送者
  const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    secureConnection: true, // use SSL
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
      user: '1287530097@qq.com',
      pass: 'jfnzwbdbeuytffad' // QQ邮箱需要使用授权码
    }
  })
  //设置验证码
  const code = getRandomCode()
  // 设置邮件内容（谁发送什么给谁）
  let mailOptions = {
    from: '"网上书城" <1287530097@qq.com>', // 发件人 这个<1287530097@qq.com>必须带上
    to: ctx.request.body.email, // 收件人
    subject: '找回密码', // 验证码
    text: `您的账户${ctx.request.body.username}重置密码的验证码是${code},验证码一分钟有效，请及时使用`, // plain text body
    // html: '<b>这是一封来自 Node.js 的测试邮件</b>', // html body
    // 下面是发送附件，不需要就注释掉
    // attachments: [{
    //         filename: 'test.md',
    //         path: './test.md'
    //     },
    //     {
    //         filename: 'content',
    //         content: '发送内容'
    //     }
    // ]
  };
  //发送邮件
  const sendResult = await transporter.sendMail(mailOptions)

  //redis存储code
  redisClient.set(ctx.request.body.username, code)
  redisClient.expire(ctx.request.body.username, 60)

  return ctx.body = {
    isSuccess: true,
    result: sendResult,
    msg: '邮件发送成功'
  }
})

//验证验证码
router.post("/verifyCode", async ctx => {
  const code = await redisClient.getAsync(ctx.request.body.name)//安装了bluebird就可以使用redis的异步方法了
  if(!code) {
    return ctx.body = {
      isSuccess: false,
      msg: "验证码已过期",
      result: null
    }
  }
  if(code == ctx.request.body.code){
    return ctx.body = {
      isSuccess: true,
      msg: "验证成功",
      result: null
    }
  } else {
    return ctx.body = {
      isSuccess: false,
      msg: "验证失败",
      result: null
    }
  }
})

//设置新密码
router.post("/newPassword", async ctx => {
  const user = await User.findOne({ name: ctx.request.body.name })
  if (!user) {
    return ctx.body = {
      isSuccess: false,
      msg: "未找到该用户",
      result: null
    }
  }

  const password = await bcrypt.hash(ctx.request.body.password1, 10)
  user.password = password
  newUser = await user.save()
  return ctx.body = {
    isSuccess: true,
    msg: "修改密码成功",
    result: newUser
  }
})

//获取所有用户
router.get("/getUsers", async ctx => {
  const users = await User.find({})
  return ctx.body = {
    isSuccess: true,
    msg: '查询成功',
    result: users
  }
})

module.exports = router.routes()