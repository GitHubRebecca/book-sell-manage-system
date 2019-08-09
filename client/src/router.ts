import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/Layout/Index.vue'

Vue.use(Router)

export const routes = [
  {
    path: '/',
    name: 'layout',
    component: Layout,
    hidden: false,
    meta: { title: "首页", icon: 'fa fa-home' },
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        meta: { title: "主页", icon: 'fa fa-home' },
        hidden: false,
        component: () => import("@/views/Index/Home.vue")
      }
    ]
  },
  {
    path: "/accountManage",
    name: "accountManage",
    component: Layout,
    hidden: false,
    meta: { title: "用户管理", icon: 'fa fa-vcard', roles: ["admin", "shopowner", "shopguide"] },
    redirect: '/accountManage/accountlist',
    children: [
      {
        path: "accountlist",
        name: "accountlist",
        hidden: false,
        meta: { title: "用户列表", icon: 'fa fa-users', roles: ["admin", "shopowner"] },
        component: (resolve: any) => require(["@/views/AccountManage/AccountList.vue"], resolve)
      },
      {
        path: "userinfo",
        name: "userinfo",
        hidden: false,
        meta: { title: "个人中心", icon: 'fa fa-user', roles: ["admin", "shopowner", "shopguide"] },
        component: (resolve: any) => require(["@/views/AccountManage/UserInfo.vue"], resolve)
      }
    ]
  },
  {
    path: "/bookManage",
    name: "bookManage",
    component: Layout,
    hidden: false,
    meta: { title: "书本管理", icon: 'fa fa-book', roles: ["admin", "shopowner"] },
    redirect: '/bookManage/booklist',
    children: [
      {
        path: "booklist",
        name: "booklist",
        hidden: false,
        meta: { title: "书本列表", icon: 'fa fa-file-o', roles: ["admin", "shopowner", "shopguide"] },
        component: (resolve: any) => require(["@/views/BookManage/BookList.vue"], resolve)
      },
      {
        path: "addbook",
        name: "addbook",
        hidden: false,
        meta: { title: "新增编辑书本", icon: 'fa fa-file', roles: ["admin", "shopowner"] },
        component: (resolve: any) => require(["@/views/BookManage/AddBook.vue"], resolve)
      }
    ]
  },
  {
    path: '/login',
    name: "login",
    hidden: true,
    component: (resolve: any) => require(["@/views/Login/Login.vue"], resolve)
  },
  {
    path: "/password",
    name: "password",
    hidden: true,
    component: () => import("@/views/Login/Password.vue")
  },
  {
    path: "/code",
    name: "code",
    hidden: true,
    component: () => import("@/views/Login/Code.vue")
  },
  {
    path: "/newpassword",
    name: "newpassword",
    hidden: true,
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
  if (to.path == '/login' || to.path == "/password" || to.path == "/code" || to.path == "/newpassword") {
    localStorage.removeItem("bsToken")
  }
  const bsToken = localStorage.getItem("bsToken")
  if (to.path == '/login' || to.path == '/password') {
    next()
  } else if ((to.path == "/code" && from.path == "/password") || (to.path == "/newpassword" && from.path == "/code")) {
    next()
  } else {
    bsToken ? next() : next("/login")
  }
})

export default router
