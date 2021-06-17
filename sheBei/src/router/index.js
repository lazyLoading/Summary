import Vue from "vue";
import VueRouter from "vue-router";
import { supplier } from "./supplierRouter";
import { procurement } from "./procurementRouter";
Vue.use(VueRouter);

// 静态路由
export const constantRouter = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index"),
  },
  {
    path: "/main",
    name: "main",
    component: () => import("@/views/Main"),
  },
  {
    path: "/",
    name: "layout",
    redirect: "/login",
    component: () => import("@/components/Layout"),
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("@/views/home/Home"),
      },
      ...supplier,
      ...procurement,
    ],
  },
];
export default new VueRouter({
  mode: "history",
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouter,
  base: process.env.VUE_APP_BASE_URL,
});
