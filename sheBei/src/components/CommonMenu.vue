<template>
  <el-row :gutter="15">
    <el-col
      :span="4"
      :index="item.path"
      v-for="item in menu"
      :key="item.path"
      class="item-router"
    >
      <div
        class="wrapicon"
        @click="clickMenu(item)"
        :style="{
          backgroundImage: 'url(' + item.bgIcon + ')',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }"
      >
        <p class="name"><img :src="item.urlImg" />{{ item.label }}</p>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { mapState } from "vuex";
export default {
  //计算属性
  computed: {
    ...mapState({
      tabsList: (state) => state.tab.tabsList,
    }),
  },
  mounted() {
    // 获取用户可展示的菜单
    let userMenu = JSON.parse(localStorage.getItem("userInfo"));
    let types = localStorage.getItem("types");
    let roles =
      types == "procurement"
        ? "BUYER"
        : types == "supplier"
        ? "SUPPLIER"
        : false;
    // 获取对应的路由菜单
    let arrRoter = userMenu.menuList.filter((obj) => {
      if(obj.isEnable) {
        return obj.direction == roles;
      } else {
        return false
      }
      // return obj.direction == roles;
    });
    let menuRouter = this.$router.options.routes.filter((item) => {
      return item.name == "layout";
    });
    // 过滤用户权限功能菜单
    let objMenu;
    if (menuRouter[0]["children"] && arrRoter[0].children) {
      objMenu = menuRouter[0]["children"].filter((obj) =>
        arrRoter[0].children.some((obj1) => {
          // 判断路由相同，并且是显示的
          if (obj1.url == obj.path && obj1.isEnable) {
            obj.urlImg = obj1.iconUrl ? obj1.iconUrl : obj.urlImg;
            obj.orderNum = obj1.orderNum;
            obj.label = obj1.name;
            return true;
          } else {
            return false;
          }
        })
      );
    }
    objMenu.sort((a, b) => {
      return a.orderNum - b.orderNum;
    });
    localStorage.setItem("menu", JSON.stringify(objMenu));
    this.menu = JSON.parse(localStorage.getItem("menu"));
  },
  data() {
    return {
      menu: [],
    };
  },
  methods: {
    //跳转路由 根据名称跳转
    clickMenu(item) {
      let result = this.tabsList.some(obj=>{
        if(obj.path==item.path){
          return true
        }
      })
      console.log(result)
      if (this.tabsList.length > 10 && !result) {
        this.$alert(
          "最多只能展示10个功能模块页面，如需打开其它功能，请先关闭已打开的功能",
          "提示",
          {
            confirmButtonText: "确定",
          }
        );

      } else {
        this.$store.commit("tab/selectMenu", item);
        this.$router.push({ path: item.path });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.el-menu {
  height: 100%;
  border: none;
  h3 {
    color: #ffffff;
    text-align: center;
    line-height: 48px;
  }
}
.menu-wrap {
  display: flex;
  background: #fff;
}

.item-router {
  > div {
    cursor: pointer;
    padding: 20px;
    margin: 10px 0;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  .name {
    font-size: 18px;
    line-height: auto;
    img {
      display: inline-block;
      width: 40px;
      height: 40px;
      margin-right: 10px;
      vertical-align: -10px;
    }
  }
}
</style>
