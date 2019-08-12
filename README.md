# vue-book-store
  网上书城管理系统

# 技术点
  vue3.0 vuex vue-router font-awesome scss elementui echarts typescript axios node redis mongodb koa

# 功能
  登录
    使用用户名跟密码登录，可以七天自动登录
  登出
    清除个人信息回到登录页
  找回密码
    使用用户名跟邮箱验证，通过邮箱获取验证码，验证通过即可修改新密码。
  用户管理
    管理员 店长 导购都可以查看个人信息，修改密码。
    只有管理员 店长才能查看用户列表，查看自己所创建的用户。对用户进行编辑 禁用 删除操作。
    只有管理员 店长才能创建用户
  书本管理
    管理员 店长 导购都能查看书本列表，但只有管理员 店长才能查看书本进价 执行编辑和删除操作。
    只有管理员 店长才能进行书本的新增操作。
  订单管理
    管理员 店长 导购都能自己创建订单，并且都具有编辑删除权限
    管理员 店长 导购都能查看自己创建订单，管理员 店长还能查看自己创建的用户的订单。
  资金管理
    管理员 店长 导购都能看到自己的收入。 管理员 店长还能看到自己所创建的用户的收入。
    管理员 店长 导购都能看到自己收入的图表

# 亮点
  七天自动登录
  使用邮箱接收验证码实现修改密码(使用nodemailer发送邮件,使用redis存储验证码,使用bluebird使操作redis异步化)
  动态路由加载
  头像使用全球公认头像

# 注意
  需要安装@types/axios来辅助axios的使用
  需要安装vuex-class来提供State getter Mutation Action装饰器
  需要安装@types/jwt-decode来辅助jwt-decode的使用
  使用@types/echarts辅助echarts使用



