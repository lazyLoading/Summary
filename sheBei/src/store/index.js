import Vue from "vue";
import Vuex from "vuex";
import tab from "./tab";
import user from "./user";
import selectedList from './selectedList/index'
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    tab,
    user,
    selectedList
  },
});
