import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../components/Login"
import Home from "../components/Home"
import Admin from "../components/admin/Admin"
import User from "../components/user/User"
import Categories from "../components/categories/Categories"
import Order from "@/components/order/Order.vue"
import ChartPage from "@/views/ChartPage"
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Login
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/home",
    component: Home,
    redirect: "/admin",
    children: [
      {
        path: "/admin",
        component: Admin,
      },
      {
        path: "/user",
        component: User,
      },
      {
        path: "/categories",
        component: Categories
      },
      {
        path: "/order",
        component: Order,
      },
      {
        path: "/chart",
        component: ChartPage,
      }
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
