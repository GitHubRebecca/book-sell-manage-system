import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: "login",
    component: (resolve: any) => require(["@/views/Login/Login.vue"], resolve)
  },
  {
    path: "/password",
    name: "password",
    component: () => import("@/views/Login/Password.vue")
  },
  {
    path: "/code",
    name: "code",
    component: () => import("@/views/Login/Code.vue")
  },
  {
    path: "/newpassword",
    name: "newpassword",
    component: () => import("@/views/Login/NewPassword.vue")
  }
]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//全局守卫 判断是否登录
router.beforeEach((to: any, from: any, next: any) => {
  const bsToken = localStorage.getItem("bsToken")
  if (to.path == '/login' || to.path == '/password') {
    next()
  } else {
    bsToken ? next() : next("/login")
  }
})

export default router
