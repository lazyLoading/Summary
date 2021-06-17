import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./routerPermission";
import "./utils/rem";

// 全局配置
import "@/assets/style/reset.css";
import "@/assets/style/_variable.less";
import "element-ui/lib/theme-chalk/index.css";
// import http from "@/api/config"; //axios
// 第三方包
import ElementUI from "element-ui";
import { message } from "./utils/messags";
Vue.use(ElementUI);
Vue.prototype.$message = message;
// Vue.prototype.$http = http;
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
