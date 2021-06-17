<template>
  <!-- <el-drawer class="drawer" title="发货详情" :visible.sync="drawer" size="90%"> -->
  <el-card class="contentCard1">
    <div class="tableMainQin">
      <el-collapse>
        <el-collapse-item v-for="(item, i) in tableList.content" :key="i">
          <template slot="title">
            <div class="orderNumber">
              <div class="titleContentleft">
                <div class="titleContent">
                  <div :title="item.cargoCode">
                    <span>发货单号：</span>
                    <span>{{ item.cargoCode }}</span>
                  </div>
                  <div
                    class="clickOrder"
                    @click.stop="clickOrder(item.id)"
                    :title="item.purchaseCode"
                  >
                    <span>采购订单号：</span>
                    <span>{{ item.purchaseCode }}</span>
                  </div>
                  <div :title="item.requirementCode">
                    <span>到货通知单号：</span>
                    <span>{{ item.requirementCode }}</span>
                  </div>
                  <div :title="item.buyerCompanyName" v-if="source === 'buyer'">
                    <span>客户名称：</span>
                    <span>{{ item.buyerCompanyName }}</span>
                  </div>
                  <div
                    :title="item.supplierCompanyName"
                    v-if="source === 'supply'"
                  >
                    <span>供应商名称：</span>
                    <span>{{ item.supplierCompanyName }}</span>
                  </div>
                  <div :title="item.linkmanInfo">
                    <span>联系人：</span>
                    <span>{{ item.linkmanInfo }}</span>
                  </div>
                </div>
                <div class="titleContent">
                  <div :title="item.sendAt" v-if="source === 'supply'">
                    <span>发货时间：</span>
                    <span>{{ item.sendAt }}</span>
                  </div>
                  <div :title="item.creatorName" v-if="source === 'buyer'">
                    <span>制单人：</span>
                    <span>{{ item.creatorName }}</span>
                  </div>
                  <div :title="item.createdAt" v-if="source === 'buyer'">
                    <span>制单时间：</span>
                    <span>{{ item.createdAt }}</span>
                  </div>
                  <div :title="item.deliveryAddress">
                    <span>收货地址：</span>
                    <span>{{ item.deliveryAddress }}</span>
                  </div>
                  <div :title="item.receivedAt">
                    <span>收货时间：</span>
                    <span>{{ item.receivedAt }}</span>
                  </div>
                  <div :title="item.receiveManInfo">
                    <span>收货人：</span>
                    <span>{{ item.receiveManInfo }}</span>
                  </div>
                </div>
              </div>
              <div class="titleContentright">
                <div class="downLoad"></div>
                <div style="color: #04abff !important">
                  {{ item.statusName }}
                </div>
              </div>
            </div>
          </template>
          <div class="tableContent" style="width：100%;">
            <el-table
              ref="multipleTable"
              :data="item.materialList"
              :row-style="{ height: '40px' }"
              :header-row-style="{ height: '40px' }"
              :cell-style="{ padding: '1px' }"
              style="width: 100%"
              :header-cell-style="{
                background: '#eef1f6',
                color: '#606266',
              }"
            >
              <el-table-column
                align="center"
                sortable
                prop="orderId"
                label="序号"
                width="100"
              ></el-table-column>
              <el-table-column
                sortable
                prop="materialCode"
                label="物料编号"
                min-width="2"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                sortable
                prop="materialName"
                label="物料名称"
                min-width="2"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                sortable
                prop="specification"
                label="规格/型号"
                min-width="2"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                sortable
                prop="unit"
                label="单位"
                min-width="1"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                sortable
                prop="sendNumber"
                label="送货数量"
                width="140"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                sortable
                prop="remark"
                label="备注"
                min-width="2"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                sortable
                prop="receiveNumber"
                label="实收数量"
                width="140"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                sortable
                prop="refusedNumber"
                label="拒收数量"
                width="140"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                sortable
                prop="refusedReason"
                label="拒绝原因"
                min-width="2"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="none" v-show="tableList.total < 1">暂无数据</div>
      <div class="pageBottom" v-show="tableList.total > 0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageNum"
          background
          prev-text="上一页 "
          next-text="下一页 "
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total,prev, pager, next,sizes,jumper"
          :total="tableList.total"
        ></el-pagination>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    tableList: {
      content: [],
    },
    source: String,
  },
  data() {
    return {
      pagenumber: {},
      pageNum: 1,
      pageSize: 10,
      // total: this.tableList.total,
      // drawer: false,
    };
  },
  created() {},
  methods: {
    clickOrder(val) {
      this.$parent.$parent.getListDetail0(val);
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.$emit("detailPage", {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      });
    },
    // 分页
    handleCurrentChange(val) {
      this.pageNum = val;
      this.$emit("detailPage", {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      });
    },
    // 订单状态
    orderStatus(val) {
      let status = {};
      if (val == 1) {
        status = { name: "已确认", color: "#3183FF" };
      } else if (val == 2) {
        status = { name: "已完成", color: "#47AA3B" };
      } else if (val == 3) {
        status = { name: "已拒绝", color: "#411AEF" };
      } else if (val == 4) {
        status = { name: "待确认", color: "#F95E00" };
      } else if (val == 5) {
        status = { name: "待申请", color: "#F95E00" };
      }
      return status;
    },
    // orderDetail() {
    //   this.drawer = true;
    // },
  },
};
</script>

<style lang="less" scoped>
.drawer {
  /deep/.el-drawer__header > :first-child {
    border-left: 4px solid #2d94ff;
    padding: 2px 10px;
    font-size: 22px;
  }
  /deep/.el-drawer__body {
    padding: 0 20px !important;
  }
  .contentCard1 {
    height: 840px;
    padding-top: 10px;
    border-radius: 10px;
    /deep/.el-form-item {
      margin-bottom: 25px !important;
    }
    /deep/.el-card__body {
      padding-top: 0px;
    }
    .tableMainQin {
      .titleContent0 {
        margin-top: 15px;
        margin-left: 20px;
        height: 20px;
        line-height: 20px;
        display: flex;
        // background: #e8e8eb;
        div {
          min-width: 15%;
          max-width: 30%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: black !important;
        }
      }
      width: 100%;
      // padding: 20px;
      height: 760px;
      overflow-y: auto;
      .orderNumber {
        padding: 0 20px;
        width: 100%;
        height: 100%;
        display: flex;
        box-sizing: border-box;
        .titleContentleft {
          width: 80%;
          height: 70px;
          padding: 5px 0;
          .titleContent {
            height: 30px;
            line-height: 30px;
            display: flex;
            div {
              width: 20%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              color: black !important;
            }
            .clickOrder {
              color: #43a0fe !important;
            }
          }
        }
        .titleContentright {
          width: 20%;
          height: 70px;
          line-height: 70px;
          display: flex;
          justify-content: space-between;
          div {
            margin: 0 30px 0 0px;
            color: black !important;
          }
          .downLoad {
            color: #2f82ff !important;
          }
        }
      }
      .progress {
        width: 250px;
        display: inline-block;
        margin-left: 30px;
        margin-right: 30px;
      }
      .customerName {
        width: 250px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      /deep/.el-collapse {
        border-top: 0px;
      }
      /deep/.el-collapse-item__header {
        background: #e8e8eb;
        height: 70px;
        margin-top: 30px;
      }
      /deep/.el-collapse-item__header {
        background: #e8e8eb;
        height: 70px;
        margin-top: 20px;
      }
      /deep/.el-collapse
        .el-collapse-item:nth-child(1)
        div
        .el-collapse-item__header {
        background: #dfeafa;
      }
      /deep/.el-collapse-item__content {
        padding-bottom: 15px;
      }
      .pageBottom {
        text-align: center;
        margin-top: 15px;
      }
      .none {
        // width：100%;
        height: 300px;
        text-align: center;
        line-height: 300px;
        color: #909399;
        font-size: 14px;
      }
      /deep/.el-table__header th {
        padding: 0;
        height: 50px;
        line-height: 50px;
      }
      .detailStyle {
        color: #33aef0;
        cursor: pointer;
      }
    }
  }
}
</style>
