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
                  <div
                    class="clickOrder"
                    @click.stop="clickOrder(item.id)"
                    :title="item.purchaseCode"
                  >
                    <span>采购订单编号：</span>
                    <span>{{ item.purchaseCode }}</span>
                  </div>
                  <div :title="item.issuedAt">
                    <span>下达时间：</span>
                    <span>{{ item.issuedAt }}</span>
                  </div>
                  <div :title="item.deliveredAt">
                    <span>交货日期：</span>
                    <span>{{ item.deliveredAt }}</span>
                  </div>
                  <div
                    :title="item.purchaserCompanyName"
                    v-if="source === 'buyer'"
                  >
                    <span>客户名称：</span>
                    <span>{{ item.purchaserCompanyName }}</span>
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
                  <div :title="item.deliveryAddress">
                    <span>地址：</span>
                    <span>{{ item.deliveryAddress }}</span>
                  </div>
                  <div :title="item.confirmedAt" v-if="source === 'buyer'">
                    <span>确认时间：</span>
                    <span>{{ item.confirmedAt }}</span>
                  </div>
                  <div
                    :title="item.confirmedOperatorUser"
                    v-if="source === 'buyer'"
                  >
                    <span>确认人：</span>
                    <span>{{ item.confirmedOperatorUser }}</span>
                  </div>
                </div>
              </div>
              <div class="titleContentright">
                <div class="downLoad" @click.stop="downLoad(item)">下载附件</div>
                <div style="color: #34a427 !important">
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
                prop="orderingNumber"
                label="订货数量"
                min-width="1"
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
                prop="unit"
                label="单位"
                min-width="1"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                sortable
                prop="remark"
                label="备注"
                min-width="2"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
            <!-- <div class="titleContent0">
              <div class="clickOrder">
                <span>地址：</span>
                <span>{{ item.orderNo }}</span>
              </div>
              <div class="clickOrder">
                <span>确认时间：</span>
                <span>{{ item.orderNo }}</span>
              </div>
              <div class="clickOrder">
                <span>确认人：</span>
                <span>{{ item.orderNo }}</span>
              </div>
            </div> -->
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
import { supplyApi } from "@/api/user.js";
export default {
  props: {
    tableList: Object,
    source: String,
  },
  data() {
    return {
      pagenumber: {},
      pageNum: 1,
      pageSize: 10,
    };
  },
  created() {
    // console.log(this.source)
  },
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
    downLoad(item) {
      supplyApi.purchaseDownload(item).then((res) => {
        const type = "application/zip"; // zip文件
        const blob = new Blob([res.data], { type: type });
        const createA = document.createElement("a");
        const href = window.URL.createObjectURL(blob);
        createA.href = href;
        createA.download = item.purchaseCode + ".zip";
        document.body.appendChild(createA);
        createA.click();
        document.body.removeChild(createA); // 下载完成后移除标签
        window.URL.revokeObjectURL(href); // 释放url
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
    border-left: 3px solid #2d94ff;
    padding: 0 5px;
  }
  /deep/.el-drawer__body {
    padding: 0 20px !important;
  }
  .contentCard1 {
    height: 800px;
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
          width: 70%;
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
          width: 30%;
          height: 70px;
          line-height: 70px;
          display: flex;
          justify-content: space-between;
          div {
            margin: 0 30px 0 60px;
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
        height: 150px;
        text-align: center;
        line-height: 150px;
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
