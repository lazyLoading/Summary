<template>
  <div class="toggle-menu">
    <div
      :class="{'is-active':isActive}"
      class="el-icon-s-fold"
      @click="toggleClick"
    />
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    toggleClick: {
      type: Function,
      default: null
    }
  }
}
</script>

<style scoped>

.el-icon-s-fold {
  display: inline-block;
  cursor: pointer;
  font-size: 28px;
  transform: rotate(180deg);
  transition: .38s;
  transform-origin: 50% 50%;
}

.el-icon-s-fold.is-active {
  transform: rotate(0deg);
}

</style>
