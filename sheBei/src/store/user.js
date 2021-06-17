import Cookie from "js-cookie";
export default {
  namespaced: true,
  state: {
    token: "",
    roles: "",
  },
  mutations: {
    //存放token
    setToken(state, val) {
      console.log(val);
      state.token = val;
      Cookie.set("token", val);
    },
    //清空token
    clearToken(state) {
      state.token = "";
      Cookie.remove("token");
    },
    //获取token
    getToken(state) {
      state.token = Cookie.get("token");
      // console.log(Cookie.get("token"));
    },
    setUserMain(state, val) {
      state.roles = val;
    },
  },
  actions: {},
};
