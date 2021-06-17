import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout/Layout'
import HomeLayout from "@/layout/HomeLayout";
Vue.use(Router)
// import { basic } from './basic'
// import { maintenance } from './maintenance'
// import { systemsAnaysis } from './systemsAnaysis'
// import { other } from './other'
// import { every } from './every'
// import { profile } from './profile'
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: HomeLayout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: {
          title: '首页',
          icon: 'el-icon-s-home',
          affix: true
        }
      }
    ]
  }
]
export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  // basic,
  // maintenance,
  // systemsAnaysis,
  // other,
  // profile,
  // every,
  { path: '*', redirect: '/404', hidden: true }
]
