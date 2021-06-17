<template>
  <div class="tree-box">
    <el-tree
      :data="tree"
      :props="defaultProps"
      accordion
      @node-click="handleNodeClick"
    />
  </div>
</template>

<script>
export default {
  name: 'HouseTree',

  props: {
    tree: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },

  methods: {
    handleNodeClick(data) {
      this.$emit('selectTree', data)
    }
  }
}
</script>
