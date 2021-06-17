<template>
  <div class="wecome">
    <div class="wecome_logo"></div>
    <div class="content">
      <div class="title">
        <img :src="logo" />
        <p>蜂巢互联供应链协调平台系统</p>
      </div>
      <div class="text">
        供需双方在线协同，消息全方位实时触达 <br />
        规范送货流程，缩短供货周期，对账准确高效 <br />
        全面革新供应链协同管理
      </div>
    </div>
    <el-button class="longin_submit" size="mini" @click="userLogin"
      >立即使用</el-button
    >
    <el-dialog
      title="提示"
      width="24%"
      :visible.sync="noUse"
      :show-close="true"
      :before-close="handleClose"
    >
      <div class="errtips">
        <div>
          <img src="../../assets/images/khlxdh.jpg" alt="">
        </div>
        <div class="shoppinguse">
          <p>{{ this.txt }}</p>
          <p class="phone">客服联系电话:{{ phone }}</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Cookie from "js-cookie";
import { login } from "@/api/user.js";
import { Message } from "element-ui";
export default {
  data() {
    return {
      noUse: false,
      logo: require("../../assets/images/fc_logo.jpg"),
      phone: process.env.VUE_APP_BASE_PHONE,
      txt: "若你需啊哟购买精益供应链协同系统，请联系我们的客服",
      loading: {},
    };
  },

  mounted() {
    if (
      window &&
      window.external &&
      window.external.IsClient &&
      window.external.IsClient()
    ) {
      // 客户端打开 通过cookie 获取token
      let refToken = Cookie.get("code");
      localStorage.setItem("refreshToken", refToken ? refToken : "");
    } else {
      // 浏览器打开 通过 query 获取token
      let refToken = this.getRefreshToken();
      localStorage.setItem("refreshToken", refToken ? refToken : "");
      if (refToken) {
        this.getuserInfo();
        this.loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
      }
    }
  },

  methods: {
    // 获取浏览器打开的token
    getRefreshToken() {
      return this.$route.query.token;
    },
    // 获取用户权限
    getuserInfo() {
      let obj = {
        accessToken: localStorage.getItem("refreshToken"),
      };
      login(obj)
        .then((res) => {
          this.loading.close();
          // 未授权该应用, 请获得授权后使用!
          if (res.data.code == 20002) {
            this.txt = res.data.message;
            this.noUse = true;
            this.$store.commit("user/clearToken");
            localStorage.removeItem("refreshToken");
          }
          // 请联系企业管理员申请供应链平台使用权限！
          if (res.data.code == 20004) {
            this.txt = res.data.message;
            this.noUse = true;
            this.$store.commit("user/clearToken");
            localStorage.removeItem("refreshToken");
          }
          // 已购买
          if (res.data.code === 200) {
            this.$router.push({ path: "/main" });
          } else {
            this.txt = res.data.message;
            this.noUse = true;
          }
        })
        .catch((err) => {
          this.loading.close();
          Message.error(err.message);
        });
    },
    handleClose() {
      this.noUse = false;
    },
    userLogin() {
      // 判断是否登陆
      if (localStorage.getItem("refreshToken")) {
        // 如果登陆 调用后台接口 获取权限信息
        this.getuserInfo();
      } else {
        // 没有登陆
        let url = process.env.VUE_APP_ZZY_LOGIN;
        window.location.href = url + process.env.VUE_APP_CALLBACK;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.wecome /deep/ .el-dialog {
  border-radius: 10px;
  overflow: hidden;
}
.wecome /deep/ .el-dialog__footer {
  padding: 0;
  overflow: hidden;
}
.dialog-footer {
  width: 100%;
  .el-button {
    width: 100%;
    border-radius: 0;
  }
}
.wecome {
  height: 100vh;
  background: url("../../assets/images/login_bg.jpg") no-repeat;
  background-size: cover;
  overflow: hidden;
  padding-top: 40px;
  padding-left: 50px;

  .wecome_logo {
    width: 230px;
    height: 80px;
    background: url("../../assets/images/main_logo.jpg") no-repeat;
    background-size: 100%;
  }
  .content {
    color: #fff;
    padding-left: 50px;
    .title {
      padding-top: 200px;
      display: flex;
      align-items: center;
      p {
        padding-left: 15px;
        font-size: 36px;
      }
    }
    .text {
      font-size: 24px;
      letter-spacing: 4px;
      line-height: 1.5;
      padding-top: 40px;
    }
  }
}
.shoppinguse {
  padding:0 20px;
  p {
    font-size: 18px;
    line-height: 1.8;
  }
}
.phone {
  color: #409eff;
  padding-top:10px;
  padding-bottom: 10px;
}
.login-container {
  border-radius: 15px; /*圆角*/
  background-clip: padding-box; /*背景被裁剪到内边距框*/
  width: 350px; /*表单宽度*/
  height: 400px;
  margin: 50px auto;
  padding: 35px 35px 15px 35px; /*填充*/
  background: #fff;
  border: 1px solid #eaeaea; /*边框*/
  box-shadow: 0 0 25px #cac6c6; /*隐形*/
}

.login_title {
  margin: 0px auto 40px auto; /*上边界0 下边边界40 左右居中*/
  text-align: center; /*上面仅是标签居中 这里是文字居中*/
  color: #505458;
}

.longin_submit {
  height: 65px;
  width: 180px;
  margin-left: 50px;
  font-size: 28px;
  letter-spacing: 3px;
  color: #fff;
  border: 0;
  background: #03e2f8;
  margin-top: 70px;
}
.errtips{
  display:flex;
  margin-top:-15px;
  img{
    width:58px;
    }

}
</style>
