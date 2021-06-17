<template>
  <div class="tabs">
    <el-tag
      :key="tag.name"
      size="medium"
      type="info"
      v-for="(tag, index) in tags"
      :closable="tag.name !== 'home'"
      :disable-transitions="false"
      @close="handleClose(tag, index)"
      @click="changeMenu(tag)"
      :effect="$route.name === tag.name ? 'dark' : 'plain'"
    >
      {{ tag.label }}
    </el-tag>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  computed: {
    ...mapState({
      tags: (state) => state.tab.tabsList,
    }),
  },
  methods: {
    ...mapMutations({
      close: "tab/closeTab",
    }),
    //关闭标签
    handleClose(tag, index) {
      let length = this.tags.length - 1;
      this.close(tag);
      // 如果关闭的标签不是当前路由的话，就不跳转
      if (tag.path !== this.$route.path) {
        return;
      }
      // 关闭的标签是最右边的话，往左边跳转一个
      if (index === length) {
        this.$router.push({ path: this.tags[index - 1].path });
      } else {
        // 否则往右边跳转
        this.$router.push({ path: this.tags[index].path });
      }
    },
    //选择标签跳转路由
    changeMenu(item) {
      // 避免重复跳路由
      if (this.$route.path != item.path) {
        this.$router.push({ path: item.path });
        this.$store.commit("tab/selectMenu", item);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.tabs /deep/ .el-tag__close {
  color: #666 !important;
}
.tabs {
  padding: 10px 10px 0 20px;
  background: #e8e8eb;
  .el-tag {
    cursor: pointer;
    padding: 10px;
    height: auto;
    width: 150px;
    background: #fff;
    border: 0;
    border-radius: 5px 5px 0 0;
    color: #409eff;
    text-align: center;
    margin-right: 10px;
  }

  .el-tag--plain {
    background: #e8e8eb;
    color: #333;
  }
}
</style>
