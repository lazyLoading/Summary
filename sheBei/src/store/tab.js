import Cookie from "js-cookie";

export default {
  namespaced: true,
  //存储数据
  state: {
    isCollapse: false,
    currentMenu: null,
    contract: "supplier",
    tabsList: [
      {
        path: "/home",
        name: "home",
        label: "首页",
        icon: "home",
      },
    ],
  },
  //调用方法
  mutations: {
    collapseMenu(state) {
      state.isCollapse = !state.isCollapse;
    },

    //选择标签 选择面包屑
    selectMenu(state, val) {
      if (val.name === "home") {
        state.currentMenu = null;
      } else {
        state.currentMenu = val;
        //如果等于-1说明tabsList不存在那么插入，否则什么都不做
        let result = state.tabsList.findIndex((item) => item.path === val.path);
        result === -1 ? state.tabsList.push(val) : "";
      }
      // Cookie.set("tagList", JSON.stringify(state.tabsList));
      localStorage.setItem("tagList", JSON.stringify(state.tabsList));

      // val.name === 'home' ? (state.currentMenu = null) : (state.currentMenu = val)
    },
    //获取标签
    getMenu(state) {
      // if (Cookie.get("tagList")) {
      if (localStorage.getItem("tagList")) {
        let tagList = JSON.parse(localStorage.getItem("tagList"));
        if (tagList) {
          state.tabsList = tagList;
        }
      }
    },
    //关闭标签
    closeTab(state, val) {
      let result = state.tabsList.findIndex((item) => item.path === val.path);
      state.tabsList.splice(result, 1);
      // Cookie.set("tagList", JSON.stringify(state.tabsList));
      localStorage.setItem("tagList", JSON.stringify(state.tabsList));
    },
    // 清除tab缓冲
    clearTabList(state) {
      (state.tabsList = [
        {
          path: "/home",
          name: "home",
          label: "首页",
          icon: "home",
        },
      ]),
        Cookie.remove("tagList");
      localStorage.removeItem("tagList");
    },
  },
  actions: {},
};
