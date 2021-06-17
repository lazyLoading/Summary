<template>
  <div class="statementquery">
    <div class="btnChange">
      <div
        @click="planOrInventory('plan')"
        class="wordsBtn"
        :style="{ color: active == 'plan' ? '#43a0fe' : 'black' }"
      >
        生产计划
      </div>
      <div
        @click="planOrInventory('inventory')"
        class="wordsBtn"
        :style="{ color: active == 'inventory' ? '#43a0fe' : 'black' }"
      >
        库存
      </div>
    </div>
    <el-card class="searchCard">
      <div style="margin-top: 10px; width: 100%">
        <el-form label-width="110px" :inline="true" class="demo-form-inline">
          <el-form-item class="formRight" label="采购订单号：">
            <el-input
              v-model="searchContent.purchaseCode"
              class="inputWidth"
              prefix-icon="el-icon-search"
              placeholder="请输入关键字搜索"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item class="formRight" label="供应商名称：">
            <el-input
              v-model="searchContent.supplierCompanyName"
              class="inputWidth"
              prefix-icon="el-icon-search"
              placeholder="请输入关键字搜索"
            ></el-input>
          </el-form-item> -->
          <el-form-item label="客户名称：">
            <el-select
              filterable
              class="inputWidth"
              v-model="searchContent.companyId"
              placeholder="请选择客户名称"
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
          <el-form-item label="下达时间：">
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
                @change="timeChange"
                align="right"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item class="formRight" label="联系人：">
            <el-input
              v-model="searchContent.contactName"
              class="inputWidth"
              prefix-icon="el-icon-search"
              placeholder="请输入联系人/联系人手机号"
            ></el-input>
          </el-form-item>
          <br />
          <el-form-item class="formRight" label="订单状态：">
            <el-select v-model="searchContent.status" class="inputWidth">
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="(item, i) in statusList"
                :key="i"
                :label="item.statusName"
                :value="item.statusId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="formRight" label="交货日期：">
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
          </el-form-item>
          <div class="btn">
            <el-button
              type="primary"
              style="margin-left: 10px"
              @click="getMenuList"
              >查询</el-button
            >
            <el-button
              type="primary"
              style="margin-left: 10px"
              @click="clearSearch"
              >重置</el-button
            >
          </div>
        </el-form>
      </div>
    </el-card>
    <el-card class="contentCard">
      <div class="tableMainQin">
        <el-collapse>
          <el-collapse-item v-for="(item, index) in tableList" :key="index">
            <template slot="title">
              <div class="orderNumber">
                <div class="titleContentleft">
                  <div class="titleContent">
                    <div
                      class="clickOrder"
                      @click.stop="getListDetail0(item.purchaseId)"
                      :title="item.purchaseCode"
                    >
                      <span>采购订单号：</span>
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
                    <div :title="item.supplierCompanyName">
                      <span>客户名称：</span>
                      <span>{{ item.supplierCompanyName }}</span>
                    </div>
                   <div>
                      <span>联系人：</span>
                      <span :title="item.contactName?item.contactName+' '+item.phone:''">{{
                       item.contactName?item.contactName+' '+item.phone:''
                      }}</span>
                    </div>
                  </div>
                  <div class="titleContent">
                    <div :title="item.deliveryAddress">
                      <span>地址：</span>
                      <span>{{ item.deliveryAddress }}</span>
                    </div>
                    <div :title="item.updatedAt" v-if="active == 'plan'">
                      <span>生产计划更新时间：</span>
                      <span>{{ item.updatedAt }}</span>
                    </div>
                    <div :title="item.updatedAt" v-if="active == 'inventory'">
                      <span>入库更新时间：</span>
                      <span>{{ item.updatedAt }}</span>
                    </div>
                  </div>
                </div>
                <div class="titleContentright">
                  <div class="downLoad" @click.stop="downLoad">
                    <!-- 下载附件 -->
                  </div>
                </div>
              </div>
            </template>
            <div style="width：100%;">
              <el-table
                ref="multipleTable"
                :key="index"
                :data="item.list"
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
                  prop="orderingNumber"
                  label="订货数量"
                  width="140"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  v-if="active == 'plan'"
                  sortable
                  prop="manufactureDate"
                  label="计划生产日期"
                  width="140"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  v-if="active == 'plan'"
                  sortable
                  prop="manufactureNum"
                  label="计划生产数量"
                  min-width="1"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  v-if="active == 'plan'"
                  sortable
                  prop="completeNum   "
                  label="计划完成数量"
                  min-width="1"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  v-if="active == 'inventory'"
                  sortable
                  prop="reworkNum"
                  label="完成数量"
                  min-width="1"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  v-if="active == 'inventory'"
                  sortable
                  prop="inventoryNum"
                  label="入库数量"
                  min-width="1"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  sortable
                  prop="remarks"
                  label="备注"
                  min-width="2"
                  show-overflow-tooltip
                ></el-table-column>
              </el-table>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div class="none" v-show="tableList.length < 1" style="">暂无数据</div>
      </div>
    </el-card>
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
// import { windowHeight } from "@/utils/setSize.js";
import OrderDetail from "@/views/buyer/components/orderDetail";
import { purchaseDetail } from "@/api/order.js";
import { supplyApi } from "@/api/user.js";
import orderDtailsMixin from '@/assets/mixins/orderDtails'
export default {
  mixins:[orderDtailsMixin],
  components: {
    OrderDetail,
  },
  data() {
    return {
      pagenumber: {},
      searchContent: {
        purchaseCode: "",
        supplierCompanyName: "",
        companyId: "",
        deliveredAtEndTime: "",
        deliveredAtStartTime: "",
        issuedAtEndTime: "",
        issuedAtStartTime: "",
        contactName: "",
        status: "",
        pageNum: 1,
        pageSize: 10,
      },
      statusList: [
        {
          statusName: "待下发",
          statusId: 0,
        },
        {
          statusName: "订单待确认",
          statusId: 1,
        },
        {
          statusName: "变更待确认",
          statusId: 2,
        },
        {
          statusName: "订单已拒绝",
          statusId: 3,
        },
        {
          statusName: "变更已拒绝",
          statusId: 4,
        },
        {
          statusName: "已确认",
          statusId: 5,
        },
        {
          statusName: "已完成",
          statusId: 6,
        },
        {
          statusName: "已中止",
          statusId: 7,
        },
      ],
      drawerorder: false,
      tableList: [],
      active: "plan",
      total: 0,
      timeValue: "",
      timeValue0: "",
      companyList: [],
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
    this.getMenuList();
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
    getMenuList() {
      // this.searchContent.pageNum = 1;
      // this.searchContent.pageSize = 10;
      let api;
      if (this.active === "plan") {
        api = "getProductionQuery";
      } else {
        api = "getInventoryQuery";
      }
      supplyApi[api](this.searchContent).then(({ data: res }) => {
        if (res.code === 200) {
          this.total = res.data.total;
          this.tableList = res.data.records;
          this.tableList.map((item) => {
            item.list.map((item0, index) => {
              item0.orderId = index + 1;
            });
          });
        }
      });
    },
    timeChange() {
      if (this.timeValue != null && this.timeValue.length > 0) {
        this.searchContent.deliveredAtEndTime = this.timeValue[1];
        this.searchContent.deliveredAtStartTime = this.timeValue[0];
      } else {
        this.searchContent.deliveredAtEndTime = "";
        this.searchContent.deliveredAtStartTime = "";
      }
    },
    timeChange0() {
      if (this.timeValue0 != null && this.timeValue0.length > 0) {
        this.searchContent.issuedAtEndTime = this.timeValue0[1];
        this.searchContent.issuedAtStartTime = this.timeValue0[0];
      } else {
        this.searchContent.issuedAtEndTime = "";
        this.searchContent.issuedAtStartTime = "";
      }
    },
    // 分页
    handleSizeChange(val) {
      this.searchContent.pageSize = val;
      this.getMenuList();
    },
    // 分页
    handleCurrentChange(val) {
      this.searchContent.pageNum = val;
      this.getMenuList();
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
    //重置
    clearSearch() {
      this.searchContent.purchaseCode = "";
      this.searchContent.supplierCompanyName = "";
      this.searchContent.deliveredAtEndTime = "";
      this.searchContent.deliveredAtStartTime = "";
      this.searchContent.issuedAtEndTime = "";
      this.searchContent.issuedAtStartTime = "";
      this.searchContent.contactName = "";
      this.searchContent.status = "";
      this.searchContent.companyId = "";
      this.searchContent.pageNum = 1;
      this.searchContent.pageSize = 10;
      this.timeValue = "";
      this.timeValue0 = "";
      this.getMenuList();
    },
    // table切换
    planOrInventory(val) {
      this.active = val;
      if (this.active == "plan") {
        this.getMenuList();
      } else if (this.active == "inventory") {
        this.getMenuList();
      }
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
  .btnChange {
    width: 100%;
    display: flex;
    .wordsBtn {
      padding: 5px 30px 10px 15px;
      font-size: 14px;
      cursor: pointer;
      font-weight: 600;
    }
  }
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
    .demo-form-inline {
      .labelWidth {
        /deep/.el-form-item__label {
          width: 140px !important;
        }
      }
    }
    /deep/.el-card__body {
      padding-bottom: 0px !important;
      padding-top: 13px !important;
    }
  }
  .contentCard {
    min-height: 480px;
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
  .pageBottom {
    text-align: center;
    margin-top: 15px;
  }
}
</style>
