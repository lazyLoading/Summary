<template>
  <div class="statementquery" :style="{ height: cardHeight }">
    <el-card class="searchCard">
      <div style="margin-top: 10px">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item class="labelWidth" label="交货日期：">
            <div class="block">
              <el-date-picker
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                class="inputWidth"
                v-model="timeValue"
                type="datetimerange"
                change="datachange"
                :picker-options="pickerOptions"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="timeChange"
                align="right"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item class="labelWidth" label="下达日期：">
            <div class="block">
              <el-date-picker
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                class="inputWidth"
                v-model="timeValue0"
                type="datetimerange"
                change="datachange"
                :picker-options="pickerOptions"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="timeChange0"
                align="right"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item class="formRight" label="物料名称：">
            <el-input
              v-model="searchContent.materialName"
              class="inputWidth"
              prefix-icon="el-icon-search"
              placeholder="请输入关键字搜索"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item class="formRight" label="供应商名称：">
            <el-input
              v-model="searchContent.companyName"
              class="inputWidth"
              prefix-icon="el-icon-search"
              placeholder="请输入关键字搜索"
            ></el-input>
          </el-form-item> -->
          <el-form-item label="供应商名称：">
            <el-select
              filterable
              class="inputWidth"
              v-model="searchContent.companyId"
              placeholder="请选择供应商名称"
            >
            <el-option label="全部" value=""></el-option>
              <el-option
                v-for="(item, i) in companyList"
                :key="i"
                :label="item.companyName"
                :value="item.companyId"
              ></el-option>
            </el-select>
          </el-form-item>
          <div class="btn">
            <el-button type="primary" style="margin-left: 10px" @click="getList"
              >查询</el-button
            >
            <el-button
              type="primary"
              style="margin-left: 10px"
              @click="clearSearch"
              >重置</el-button
            >
            <el-button
              type="primary"
              style="margin-left: 10px"
              @click="exportExcel"
              >导出</el-button
            >
          </div>
        </el-form>
      </div>
    </el-card>
    <el-card class="contentCard">
      <div class="tableMainQin">
        <div style="width：100%;">
          <el-table
            ref="multipleTable"
            :data="list"
            :row-style="{ height: '40px' }"
            :header-row-style="{ height: '40px' }"
            :cell-style="{ padding: '1px' }"
            class="tableStyle"
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
              prop="supplierCompanyName"
              label="供应商名称"
              min-width="2"
            ></el-table-column>
            <el-table-column
              sortable
              prop="materialCode"
              label="物料编码"
              min-width="2"
            ></el-table-column>
            <el-table-column
              sortable
              prop="materialName"
              label="物料名称"
              min-width="2"
            ></el-table-column>
            <el-table-column
              sortable
              prop="specification"
              label="型号规格"
              min-width="2"
            ></el-table-column>
            <el-table-column
              sortable
              prop="orderingNumber"
              label="订货数量"
              min-width="1"
            ></el-table-column>
            <el-table-column
              sortable
              prop="receiveNumber"
              label="实收数量"
              width="140"
            ></el-table-column>
            <el-table-column
              sortable
              prop="unit"
              label="单位"
              min-width="1"
            ></el-table-column>
            <el-table-column label="操作" min-width="1">
              <template slot-scope="scope">
                <div class="detailStyle" @click="myOrderDetail(scope.row)">
                  详情
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pageBottom">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="searchContent.pageNum"
            background
            prev-text="上一页 "
            next-text="下一页 "
            :page-sizes="[10, 20, 50, 100]"
            :page-size="searchContent.pageSize"
            layout="total,prev, pager, next,sizes,jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </el-card>
    <el-drawer
      class="drawer"
      title="订货详情"
      :visible.sync="drawer"
      size="90%"
    >
      <orderDetails
        :tableList="detailList"
        source="supply"
        @detailPage="detailPage"
      ></orderDetails>
    </el-drawer>
    <el-drawer
      class="drawer"
      title="采购订单详情"
      :visible.sync="drawerorder"
      size="90%"
    >
      <OrderDetail :detailData="detailData">
      </OrderDetail>
    </el-drawer>
  </div>
</template>

<script>
import { windowHeight } from "@/utils/setSize.js";
import orderDetails from "@/components/cargoStatistics/orderDetails";
import OrderDetail from "@/views/buyer/components/orderDetail";
import { purchaseDetail } from "@/api/order.js";
import { supplyApi, buyerApi } from "@/api/user.js";
import orderDtailsMixin from '@/assets/mixins/orderDtails'
export default {
  mixins:[orderDtailsMixin],
  components: {
    orderDetails,
    OrderDetail,
  },
  data() {
    return {
      cardHeight: windowHeight,
      searchContent: {
        materialName: "",
        companyName: "",
        companyId: "",
        deliveredAtEnd: "",
        deliveredAtStart: "",
        issuedAtEnd: "",
        issuedAtStart: "",
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      list: [],
      timeValue: "",
      timeValue0: "",
      drawer: false,
      drawerorder: false,
      detailList: {},
      companyList: [],
      myParams: {
        companyId: "",
        entranceMark: "PURCHASER",
        materialCode: "",
        pageNum: 1,
        pageSize: 10,
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getRelatedEnterprise();
  },
  methods: {
    //获取关联的企业信息
    getRelatedEnterprise() {
      supplyApi.getEnterpriselist().then(({ data: res }) => {
        if (res.code == 200) {
          this.companyList = res.data;
        }
      });
    },
    timeChange() {
      if (this.timeValue != null && this.timeValue.length > 0) {
        this.searchContent.deliveredAtStart = this.timeValue[0];
        this.searchContent.deliveredAtEnd = this.timeValue[1];
      } else {
        this.searchContent.deliveredAtStart = "";
        this.searchContent.deliveredAtEnd = "";
      }
    },
    timeChange0() {
      if (this.timeValue0 != null && this.timeValue0.length > 0) {
        this.searchContent.issuedAtStart = this.timeValue0[0];
        this.searchContent.issuedAtEnd = this.timeValue0[1];
      } else {
        this.searchContent.issuedAtStart = "";
        this.searchContent.issuedAtEnd = "";
      }
    },
    // 分页
    handleSizeChange(val) {
      this.searchContent.pageSize = val;
      this.getList();
    },
    // 分页
    handleCurrentChange(val) {
      this.searchContent.pageNum = val;
      this.getList();
    },

    // 表格数据列表查询
    getList() {
      buyerApi.buyerpurchase(this.searchContent).then(({ data: res }) => {
        if (res.code == 200) {
          this.list = res.data.content;
          this.total = res.data.total;
        }
      });
    },
    //重置
    clearSearch() {
      this.searchContent.materialName = "";
      this.searchContent.companyName = "";
      this.searchContent.receivedAtStart = "";
      this.searchContent.receivedAtEnd = "";
      this.searchContent.issuedAtEnd = "";
      this.searchContent.issuedAtStart = "";
      this.searchContent.companyId = "";
      this.searchContent.pageNum = 1;
      this.searchContent.pageSize = 10;
      this.timeValue = "";
      this.timeValue0 = "";
      this.getList();
    },
    //导出
    exportExcel() {
      buyerApi.buyerpurchaseexport(this.searchContent).then(({ data: res }) => {
        if (this.list.length<1) {
          this.$message({
            showClose: true,
            message: "暂无可导出数据!",
            type: "warning",
          });
        } else {
          const type = "application/vnd.ms-excel;charset=utf-8"; // excel文件
          const blob = new Blob([res], { type: type });
          const createA = document.createElement("a");
          const href = window.URL.createObjectURL(blob);
          createA.href = href;
          createA.download = "订货统计" + this.getData() + ".xls";
          document.body.appendChild(createA);
          createA.click();
          document.body.removeChild(createA); // 下载完成后移除标签
          window.URL.revokeObjectURL(href); // 释放url
        }
      });
    },
    //订单详情
    myOrderDetail(val) {
      this.myParams.companyId = val.purchaserCompanyId;
      this.myParams.materialCode = val.materialCode;
      this.drawer = true;
      this.detailPage();
    },
    detailPage(val) {
      if (val) {
        this.myParams.pageNum = val.pageNum;
        this.myParams.pageSize = val.pageSize;
      }
      // console.log(supplyApi.supplierpurchasedatail());
      supplyApi.supplierpurchasedetail(this.myParams).then(({ data: res }) => {
        if (res.code == 200) {
          this.detailList = {};
          this.detailList = res.data;
        }
      });
    },
    drawerorderDetail() {
      this.drawerorder = true;
    },
    //当前日期
    getData() {
      let aData = new Date();
      let month =
        aData.getMonth() < 9
          ? "0" + (aData.getMonth() + 1)
          : aData.getMonth() + 1;
      let date = aData.getDate() <= 9 ? "0" + aData.getDate() : aData.getDate();
      let value = aData.getFullYear() + "-" + month + "-" + date;
      return value;
    },
     //获取详情
    getListDetail0(id) {
      this.drawerorder = true;
      this.getListDetail(id)
      // purchaseDetail({ id }).then(({ data: res }) => {
      //   if (res.code == 200) {
      //     let {
      //       cargoList,
      //       changeLogList,
      //       purchaseBaseInfoVo,
      //       rejectedList,
      //       requirementList,
      //     } = res.data;
      //     //转成组件数据格式
      //     this.detailData[0].data = [purchaseBaseInfoVo];//基础信息
      //     this.detailData[1].data = changeLogList;//变更记录
      //     this.detailData[2].data = requirementList;//客户到货通知单
      //     this.detailData[3].data = rejectedList;//退货信息
      //     this.detailData[4].data = cargoList;//发货/客户收货
      //   } else {
      //     this.$message.error(res.message);
      //   }
      // });
    },
  },
};
</script>

<style lang="less" scoped>
.statementquery {
  .searchCard {
    margin-bottom: 15px;
    border-radius: 10px;
    /deep/.el-form-item {
      margin-bottom: 20px !important;
    }
    .inputWidth {
      width: 230px !important;
    }
    .btn {
      display: inline-block;
      float: right;
    }
    // .demo-form-inline {
    // .labelWidth {
    //   /deep/.el-form-item__label {
    //     width: 140px !important;
    //   }
    // }
    // }
    /deep/.el-card__body {
      padding-bottom: 0px !important;
      padding-top: 13px !important;
    }
  }
  .contentCard {
    padding: 30px 0 10px 0;
    border-radius: 10px;
    /deep/.el-form-item {
      margin-bottom: 25px !important;
    }
    /deep/.el-card__body {
      padding-top: 0px;
    }
    .tableMainQin {
      .tableStyle {
        width: 100%;
        /deep/.el-table__body-wrapper {
          height: 430px !important;
        }
      }
      width: 100%;
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
      .pageBottom {
        text-align: center;
        margin-top: 25px;
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
      .contentCard {
        min-height: 550px;
        padding: 0px 5px 10px 5px;
        border-radius: 10px;
        /deep/.el-form-item {
          margin-bottom: 25px !important;
        }
        /deep/.el-card__body {
          padding-top: 0px;
        }
        .tableMainQin {
          width: 100%;
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
        }
      }
    }
  }
  .drawer {
    /deep/.el-drawer__header > :first-child {
      border-left: 4px solid #2d94ff;
      padding: 2px 10px;
      font-size: 22px;
    }
    /deep/.el-drawer__body {
      padding: 0 20px !important;
    }
    /deep/.el-drawer {
      border-bottom-left-radius: 20px !important;
      border-top-left-radius: 20px !important;
    }
  }
}
</style>
