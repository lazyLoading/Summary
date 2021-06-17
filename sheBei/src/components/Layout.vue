<template>
  <el-container style="height: 100%">
    <el-container class="content-wrap">
      <div class="header">
        <common-header></common-header>
      </div>
      <common-tab></common-tab>
      <el-main class="content-center">
        <router-view />
      </el-main>
      <div class="footer">
        CopyRight @ 版权所有 蜂巢互联科技有限公司 网站备案号 粤ICP1907871号
      </div>
    </el-container>
  </el-container>
</template>

<script>
//
import CommonTab from "./CommonTab";
import CommonHeader from "./CommonHeader";

export default {
  components: {
    CommonHeader,
    CommonTab,
  },
};
</script>

<style lang="less" scoped>
.header {
  background-color: #0f1923;
  height: 80px;
  display: block;
  padding: 0 18px;
}
.el-container {
  flex-direction: column;
  height: 100%;
}
.content-wrap {
  .content-center {
    padding-top: 30px;
    background: #fff;
  }
}
.el-main {
  padding-top: 0;
}
.footer {
  height: 50px;
  background: #333;
  color: #fff;
  text-align: center;
  font-size: 12px;
  line-height: 50px;
}
</style>
