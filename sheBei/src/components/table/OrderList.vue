<template>
  <div class="order-list">
    <div class="no-data" v-if="tableData.length == 0">暂无数据</div>
    <el-table
      v-else
      :data="tableData"
      stripe
      @selection-change="onSelectionChange"
      :header-cell-style="{ 'background-color': '#e6eaf0', color: '#142133' }"
    >
      <template v-for="(item, index) in tableLabel">
        <!-- 序号 -->
        <el-table-column
          v-if="item.prop === 'index'"
          type="index"
          :key="index"
          :label="item.label"
          :width="item.width ? item.width : ''"
          show-overflow-tooltip
        ></el-table-column>
        <!-- 勾选 -->
        <el-table-column
          v-else-if="item.prop === 'selection'"
          type="selection"
          :key="index"
          :width="item.width ? item.width : ''"
        >
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          v-else-if="item.prop === 'bnt'"
          :label="item.label"
          :key="item.prop"
          :width="item.width ? item.width : ''"
        >
          <template slot-scope="scope">
            <div class="table-list-content">
              <span
                class="color-blue2"
                style="cursor: pointer"
                v-for="(val, i) in scope.row.bnt"
                :key="i"
                type="primary"
                @click="onPeration(scope.row, val, scope.$index)"
              >
                {{ val }}</span
              >
            </div>
          </template>
        </el-table-column>

        <!-- 文字展示 -->
        <el-table-column
          v-else
          :key="item.prop"
          :label="item.label"
          :width="item.width ? item.width : ''"
        >
          <template slot-scope="scope">
            <div class="table-list-content">
              <p v-if="scope.row[item.prop] == '已拒绝'">
                <span>{{ scope.row[item.prop] }}</span>
                <span
                  class="color-blue2 link-underline"
                  type="primary"
                  @click="onPeration(scope.row, 'record', scope.$index)"
                  >拒绝原因</span
                >
              </p>
              <p v-else class="text-overflow" :title="scope.row[item.prop]">
                {{ scope.row[item.prop] }}
              </p>
            </div>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    tableData: Array,
    tableLabel: Array,
    config: Object,
  },
  methods: {
    //操作
    onPeration(item, type, i) {
      let d = { item, type, i };
      this.$emit("onPeration", d);
    },
    onSelectionChange(e) {
      this.$emit("onSelectionChange", e);
    },
  },
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.order-list {
  .no-data {
    text-align: center;
    color: #999;
    line-height: 40px;
  }
  @{deep} .el-table {
    .table-list-content {
      span {
        // display: inline-block;
        margin-right: 20px;
        &:last-child {
          margin-right: 0;
        }
        &.text-overflow {
          display: flow-root;
        }
      }
      .link-underline {
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }
}
</style>
