<template>
  <header>
    <div class="l-content">
      <div class="logo-box">
        <img :src="logo" class="logo" />
      </div>
      <div class="platform-system">蜂巢互联供应协同平台系统</div>
      <span>|</span>
      <div class="enterprise-name">{{ companyName }}</div>
    </div>
    <div class="r-content">
      <el-dropdown trigger="click" size="mini">
        <div class="drop-title">
          <span class="el-dropdown-link"
            ><img :src="userImg" class="user"
          /></span>
          <span>{{ realName }}</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </div>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="changeType()"
            >切换入口</el-dropdown-item
          >
          <el-dropdown-item @click.native="person()"
            >个人控制台</el-dropdown-item
          >
          <el-dropdown-item v-if="isAdmin" @click.native="enterprise()"
            >企业控制台</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
      <div class="tips" @click="goInformation">
        <el-badge :value="infoNum" class="item" :max="100">
          <img src="../assets/images/tips.png" />
        </el-badge>
      </div>
      <div class="logout">
        <span @click="logOut" v-if="!isclient" class="close">退出登录</span>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState } from "vuex";
import { logout } from "@/api/user";
import { powerApi } from "../api/user.js";
export default {
  computed: {
    ...mapState({
      current: (state) => state.tab.currentMenu,
    }),
  },
  mounted() {
    this.isclient = window && window.external && window.external.IsClient;
    this.companyName = JSON.parse(
      localStorage.getItem("userInfo")
    ).enterpriseInfo.companyName;
    this.isAdmin = JSON.parse(localStorage.getItem("userInfo")).isRoot;
    this.realName = JSON.parse(localStorage.getItem("userInfo")).realName;
  },

  data() {
    return {
      isclient: false,
      companyName: "",
      infoNum: "",
      isAdmin: false,
      realName: "",
      userImg: require("../assets/images/default-pic.jpg"),
      logo: require("../assets/images/logo.png"),
    };
  },
  created() {
    this.getInfoNum();
  },
  methods: {
    // 个人控制台
    person() {
        let url = process.env.VUE_APP_ZZY_BASEURL +
        "redirect?path=Information&token= " +
        localStorage.getItem("refreshToken");
        window.open(url)
    },
    // 企业控制台
    enterprise() {
      let url = process.env.VUE_APP_ZZY_BASEURL +
        "redirect?path=Identification&token= " +
        localStorage.getItem("refreshToken");
        window.open(url)
    },
    changeType() {
      this.$confirm("切换到入口页,会丢失当前的数据,是否切换", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$store.commit("tab/clearTabList");
        localStorage.removeItem("menu");
        localStorage.removeItem("types");
        this.$router.push({ path: "/main" });
      });
    },

    getInfoNum() {
      powerApi.getInfoList({ pageNum: 1, pageSize: 99999999 }).then((res) => {
        if (res.data.code === 200) {
          this.infoNum = res.data.data.total>0?res.data.data.total:"";
        }
      });
    },
    // 消息提醒
    goInformation() {
      let types = localStorage.getItem("types");
      let infoObj = {
        name: "",
        label: "消息",
        path: "",
      };
      if (types == "supplier") {
        infoObj.name = "supplierInformation";
        infoObj.path = "/supplier-information";
      } else if (types == "procurement") {
        infoObj.name = "buyerInformation";
        infoObj.path = "/buyer-information";
      }
      this.$store.commit("tab/selectMenu", infoObj);
      this.$router.push({ path: infoObj.path });
    },
    //退出登陆
    logOut() {
      logout().then((res) => {
        this.$store.commit("user/clearToken");
        this.$store.commit("tab/clearTabList");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("menu");
        localStorage.removeItem("types");
        localStorage.removeItem("jwt-token");
        this.$router.push({ path: "/login" });
      });
    },
  },
};
</script>

<style lang="less" scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .close {
    font-size: 18px;
    cursor: pointer;
  }
}

.l-content {
  display: flex;
  height: 80px;
  align-items: center;
  color: #fff;
  .logo-box {
    padding: 5px;
    .logo {
      width: 48px;
      height: 48px;
      vertical-align: center;
    }
  }
  .platform-system {
    font-size: 30px;
    padding: 0 18px;
  }
  .enterprise-name {
    // font-weight: 600;
    font-size: 20px;
    font-family: "SourceHanSansCN-Regular";
    padding-left: 18px;
    letter-spacing: 2px;
  }
}

.r-content {
  display: flex;
  color: #fff;
  align-items: center;
  .drop-title {
    display: flex;
    align-items: center;
    cursor: pointer;
    color: #fff;
    font-size: 16px;
    .el-dropdown-link {
      margin-right: 13px;
    }
  }
  .user {
    width: 26px;
    border-radius: 50%;
    margin: 0 10px;
  }
  .tips {
    padding: 0 30px;
    margin-top: -5px;
    .item {
      cursor: pointer;
      font-size: 12px;
      margin-top: 10px;
      margin-right: 30px;
    }
    img {
      width: 20px;
    }
  }
}
</style>

<style lang="less">
.l-content {
  .el-badge__content {
    font-size: 12px;
    line-height: 1;
  }
}
.el-breadcrumb__item {
  .el-breadcrumb__inner {
    color: #666666;
    font-weight: normal;
  }
  &:last-child {
    .el-breadcrumb__inner {
      color: #ffffff;
    }
  }
}
</style>
