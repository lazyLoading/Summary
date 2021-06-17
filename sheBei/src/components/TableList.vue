<template>
  <el-card class="table-list">
    <div class="operation-head">
      <p>
        <el-checkbox>全选/全不选</el-checkbox>
      </p>
      <p class="batch-head">
        <el-button
          v-for="(item, index) in btnBatch"
          :key="index"
          type="primary"
          size="medium"
          @click="onBtnBatch(item)"
          >{{ item.label }}</el-button
        >
      </p>
    </div>

    <div class="collapse-box">
      <el-collapse v-model="activeList" @change="handleChange">
        <el-collapse-item
          v-for="(item, index) in listData"
          :key="index"
          :name="index"
        >
          <!-- 父列表 -->
          <template slot="title">
            <div class="parent-list">
              <el-row>
                <!-- 左边 -->
                <el-col :span="1"
                  ><div class="text-center">
                    <el-checkbox v-model="checked"></el-checkbox></div
                ></el-col>

                <!-- 中间 -->
                <el-col :span="20">
                  <el-row>
                    <el-col v-for="(row, i) in listTitle" :span="4" :key="i"
                      ><div>{{ row.label }}</div>
                    </el-col>
                  </el-row>
                </el-col>

                <!-- 右边 -->
                <el-col :span="3">
                  <el-row>
                    <el-col :span="12">
                      <div @click.stop="onDownload(item)">
                        <el-link type="primary">下载附件</el-link>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <slot name="status"></slot>
                      <div>
                        <el-link type="primary">{{ item.status }}</el-link>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
            <!-- <el-row class="parent-list">
              <el-col :span="1">
                <div class="text-center">
                  <el-checkbox v-model="checked"></el-checkbox>
                </div>
              </el-col>
              <el-col :span="5">
                <div>
                  <p
                    class="text-overflow"
                    :title="item.purchaseCode"
                    @click.stop="orderDetail(item)"
                  >
                    订单编号：{{ item.purchaseCode }}
                  </p>
                  <p class="text-overflow" :title="item.deliveryAddress">
                    地址：{{ item.deliveryAddress }}
                  </p>
                </div>
              </el-col>
              <el-col :span="4">
                <div>
                  <p>下达时间：{{ item.issuedAt }}</p>
                  <p>拒绝时间：{{ item.refusedAt }}</p>
                </div>
              </el-col>
              <el-col :span="4">
                <div>
                  <p>交货日期：{{ item.deliveredAt }}</p>
                  <p>拒绝人：{{ item.refusedOperatorName }}</p>
                </div>
                <div></div
              ></el-col>
              <el-col :span="3">
                <div>
                  <p>客户名称:{{ item.purchaserCompanyName }}</p>
                  <p>拒绝原因:{{ item.refuseReason }}</p>
                </div></el-col
              >
              <el-col :span="3">
                <div>
                  联系人：{{ item.linkmanName }} {{ item.linkmanPhone }}
                </div></el-col
              >
              <el-col :span="2">
                <div @click.stop="onDownload(item)">
                  <el-link type="primary">下载附件</el-link>
                </div></el-col
              >
              <el-col :span="2">
                <div>{{ reversedStatus(item.status) }}</div>
              </el-col>
            </el-row> -->
          </template>
          <!-- 子列表 -->
          <div class="children-list">
            <div class="common-table">
              <el-table
                :data="item.materialList"
                stripe
                :header-cell-style="{
                  'background-color': '#e6eaf0',
                  color: '#142133',
                }"
              >
                <el-table-column
                  label="序号"
                  width="55"
                  type="index"
                ></el-table-column>

                <el-table-column
                  v-for="curr in listLabel"
                  :key="curr.prop"
                  :label="curr.label"
                  :width="curr.width ? curr.width : ''"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row[curr.prop] }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="batch-head text-right">
              <slot name="bnt"></slot>
              <!-- <el-button
                  v-for="(val, index) in item.btnList"
                  :key="index"
                  type="primary"
                  size="medium"
                  >{{ val.label }}
                </el-button> -->
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="common-pagination">
      <!-- <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageNum"
        background
        prev-text="上一页 "
        next-text="下一页 "
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total,prev, pager, next,sizes,jumper"
        :total="total"
      ></el-pagination> -->
    </div>
  </el-card>
</template>

<script>
export default {
  name: "TableList",
  props: {
    listTitle: Array,
    listData: Array,
    listLabel: Array,
    btnBatch: Array,
    config: Object,
  },
  data() {
    return {
      activeList: ["1"],
      checked: false,
    };
  },
  methods: {
    //批量操作
    onBtnBatch(e) {
      this.$emit("onBtnBatch", e);
    },
    //附件下载
    onDownload(e) {
      // this.$emit("onDownload", e);
    },
    handleChange(e) {},
    handleEdit(row) {
      this.$emit("onEdit", row);
    },
    handleDelete(row) {
      this.$emit("onDel", row);
    },
  },
};
</script>

<style lang="less" scoped>
@deep: ~">>>";

.table-list {
  .operation-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .batch-head {
      padding-bottom: 15px;
      text-align: right;
    }
  }

  @{deep} .collapse-box {
    .el-collapse-item__header {
      height: 100%;
      background: #ddd;
      &.is-active {
        background: #dfeafa;
      }
      .parent-list {
        box-sizing: border-box;
        width: 100%;
        padding: 10px 0;

        .el-col {
          > div {
            padding-right: 5px;
          }
          &:last-child {
            div {
              text-align: right;
              color: #f60;
            }
          }
          &:nth-child(2) {
            p:nth-child(1) {
              text-decoration: underline;
            }
          }
        }
      }
    }
    .el-collapse-item__wrap {
      border: 0;
    }

    .el-collapse-item {
      margin-bottom: 20px;
    }

    .children-list {
      width: 100%;
      .batch-head {
        padding: 15px 0 0;
      }
    }
  }
  .common-table {
    height: calc(100% - 62px);
    background-color: #fff;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    @{deep} .el-table {
      // .status {
      //   margin-right: 20px;
      //   &:last-child {
      //     margin-right: 0;
      //   }
      // }
      .el-link,
      .status {
        margin-right: 20px;

        &:last-child {
          margin-right: 0;
        }
      }
    }

    .pager {
      margin-top: 20px;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
