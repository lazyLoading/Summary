// 系统前台路由守卫

import router from "./router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import store from "./store";

NProgress.configure({ showSpinner: false });

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  document.title = "供应链协同系统";
  // debugger;
  // 设置白名单
  let whiteList = [
    "/login",
    "/main",
    "/home",
    "/supplier-information",
    "/buyer-information",
  ];
  let menuRouter = JSON.parse(localStorage.getItem("menu")) || [];
  menuRouter.forEach((element) => {
    whiteList.push(element.path);
  });

  let isshow = whiteList.includes(to.path);
  // 防止刷新后vuex里丢失标签列表tagList
  store.commit("tab/getMenu");
  let token = localStorage.getItem("jwt-token");
  // 过滤登录页，因为去登陆页不需要token(防止死循环)
  if (!token && to.name !== "login") {
    next({ path: "/login" });
    // next();
  } else {
    if (!isshow) {
      next({ path: "/main" });
    } else {
      next();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
