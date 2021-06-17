<template>
  <div class="dashboard-editor-container">
    <iframe src="../../public/home/index.html" width="100%" height="100%" frameborder="0" scrolling="auto" style="position:absolute;top: 0;left: 0px;" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      userTotal: 0,
      goodsTotal: 0,
      productTotal: 0,
      orderTotal: 0
    }
  },
  created() {

  },
  methods: {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  min-height: 100%;

}
</style>
