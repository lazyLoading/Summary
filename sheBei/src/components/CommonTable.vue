<template>
  <div class="common-table">
    <el-table
      :data="tableData"
      height="90%"
      stripe
      row-key="id"
      @select-all="selectAll"
      ref="multipleTable"
      v-loading="config.loading"
      @selection-change="handleSelectionChange"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="序号" width="55" type="index"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        v-for="item in tableLabel"
        :key="item.prop"
        :label="item.label"
        :width="item.width ? item.width : ''"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pager"
      layout="prev, pager, next"
      :total="config.total"
      :current-page.sync="config.page"
      @current-change="changePage"
      :page-size="config.pageSize"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkedKeys: false,
    };
  },
  props: {
    tableData: Array,
    tableLabel: Array,
    config: Object,
  },
  methods: {
    handleEdit(row) {
      this.$emit("edit", row);
    },
    handleDelete(row) {
      this.$emit("del", row);
    },
    changePage(page) {
      this.$emit("changePage", page);
    },
    handleSelectionChange(val) {
      console.log(val);
    },
    selectAll() {
      this.checkedKeys = !this.checkedKeys;
      this.splite(this.tableData, this.checkedKeys);
    },
    /**
     * 处理数据
     */
    splite(data, flag) {
      data.forEach((row) => {
        this.$refs.multipleTable.toggleRowSelection(row, flag);
        if (row.children != undefined) {
          this.splite(row.children);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.common-table {
  height: calc(100% - 62px);
  background-color: #fff;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .pager {
    padding: 10px;
    display: flex;
    justify-content: center;
  }
}
</style>
