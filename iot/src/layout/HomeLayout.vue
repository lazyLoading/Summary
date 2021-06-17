<template>
  <div class="app-wrapper">
    <router-view :key="key" />
  </div>
</template>

<script>
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'HomeLayout',

  mixins: [ResizeMixin],

  computed: {
    key() {
      return this.$route.fullPath
    }
  },
  methods: {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }

</style>
