<template>
  <div class="statementquery">
    <el-card class="searchCard">
      <div style="margin-top: 10px; max-width: 1600px">
        <el-form label-width="110px" :inline="true" class="demo-form-inline">
          <el-form-item class="formRight" label="对账单号：">
            <el-input
              v-model="searchContent.compareCode"
              class="inputWidth"
              prefix-icon="el-icon-search"
              placeholder="请输入关键字搜索"
            ></el-input>
          </el-form-item>
          <el-form-item class="formRight" label="对账状态：">
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
          <el-form-item class="labelWidth" label="发起对账时间：">
            <div class="block">
              <el-date-picker
                :default-time="['00:00:00', '23:59:59']"
                value-format="yyyy-MM-dd HH:mm:ss"
                class="inputWidth"
                v-model="timeValue"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="timeChange"
                align="right"
              ></el-date-picker>
            </div>
          </el-form-item>
          <!-- <el-form-item class="formRight" label="客户名称：">
            <el-input
              v-model="searchContent.purchaserCompanyName"
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
          <el-form-item class="formRight" label="付款状态：">
            <el-select v-model="searchContent.paidStatus" class="inputWidth">
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="(item, i) in payStatusList"
                :key="i"
                :label="item.statusName"
                :value="item.statusId"
              ></el-option>
            </el-select>
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
          <el-collapse-item v-for="(item, i) in tableList" :key="i">
            <template slot="title">
              <div class="orderNumber">
                <div class="titleContentleft">
                  <div
                    :class="[
                      item.status == 0 || item.status == 1
                        ? 'titleContent0'
                        : 'titleContent',
                    ]"
                  >
                    <div :title="item.compareCode">
                      <span>对账单号：</span>
                      <span>{{ item.compareCode }}</span>
                    </div>
                    <div :title="item.createdAt">
                      <span>发起对账时间：</span>
                      <span>{{ item.createdAt }}</span>
                    </div>
                    <div :title="item.purchaserCompanyName">
                      <span>客户名称：</span>
                      <span>{{ item.purchaserCompanyName }}</span>
                    </div>
                    <div :title="item.compareAmount">
                      <span>申请对账金额：</span>
                      <span>{{ item.compareAmount }}</span>
                    </div>
                    <div :title="item.creatorName">
                      <span>申请对账人：</span>
                      <span>{{ item.creatorName }}</span>
                    </div>
                    <div :title="item.compareStartedAt+'-'+item.compareEndAt">
                      <span>对账周期：</span>
                      <span>{{ item.compareStartedAt }}-{{ item.compareEndAt }}</span>
                    </div>
                  </div>
                  <div
                    class="titleContent"
                    v-if="item.status == 4 || item.status == 2"
                  >
                    <div :title="item.confirmedOperatorName">
                      <span>确认对账人：</span>
                      <span>{{ item.confirmedOperatorName }}</span>
                    </div>
                    <div :title="item.confirmedAt">
                      <span>确认对账时间：</span>
                      <span>{{ item.confirmedAt }}</span>
                    </div>
                    <div
                      :style="{
                        color: orderStatus(item.status).color + '!important',
                      }"
                      :title="getPayStatus(item.paidStatus)"
                    >
                      <span>付款状态：</span>
                      <span>{{ getPayStatus(item.paidStatus) }}</span>
                    </div>
                    <div :title="item.paidProgress">
                      <span>付款进度：</span>
                      <span>{{ item.paidProgress }}</span>
                    </div>
                  </div>
                  <div class="titleContent" v-if="item.status == 3">
                    <div :title="item.refuseReason">
                      <span>拒绝原因：</span>
                      <span>{{ item.refuseReason }}</span>
                    </div>
                    <div :title="item.refusedOperatorName">
                      <span>拒绝人：</span>
                      <span>{{ item.refusedOperatorName }}</span>
                    </div>
                    <div :title="item.refusedAt">
                      <span>拒绝时间：</span>
                      <span>{{ item.refusedAt }}</span>
                    </div>
                  </div>
                </div>
                <div class="titleContentright">
                  <div class="downLoad"></div>
                  <div
                    :style="{
                      color: orderStatus(item.status).color + '!important',
                    }"
                  >
                    {{ orderStatus(item.status).name }}
                  </div>
                </div>
              </div>
            </template>
            <div style="width：100%;">
              <el-table
                ref="multipleTable"
                :key="i"
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
                  prop="cargoCode"
                  label="发货单号"
                  min-width="2"
                ></el-table-column>
                <el-table-column
                  sortable
                  prop="rejectCode"
                  label="退货单号"
                  min-width="2"
                ></el-table-column>
                <el-table-column
                  sortable
                  prop="materialCode"
                  label="物料编号"
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
                  label="规格/型号"
                  min-width="2"
                ></el-table-column>
                <el-table-column
                  sortable
                  prop="unit"
                  label="单位"
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
                  prop="refuseNumber"
                  label="拒收数量"
                  min-width="1"
                ></el-table-column>
                <el-table-column
                  sortable
                  prop="rejectNumber"
                  label="退货数量"
                  min-width="1"
                ></el-table-column>
                <el-table-column
                  sortable
                  prop="unitPrice"
                  label="单价"
                  min-width="1"
                ></el-table-column>
              </el-table>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div class="none" v-show="tableList.length < 1">暂无数据</div>
      </div>
    </el-card>
    <div class="pageBottom">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="searchContent.page"
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
</template>

<script>
// import { windowHeight } from "@/utils/setSize.js";
import { supplyApi } from "@/api/user.js";
export default {
  computed: {},
  data() {
    return {
      searchContent: {
        page: 1,
        pageSize: 10,
        compareCode: "",
        status: "",
        companyId: "",
        createdAtEnd: "",
        createdAtStart: "",
        purchaserCompanyName: "",
        entranceMark: "PURCHASER ",
        paidStatus: "",
      },
      statusList: [
        {
          statusName: "待申请",
          statusId: 0,
        },
        {
          statusName: "待确认",
          statusId: 1,
        },
        {
          statusName: "已确认",
          statusId: 2,
        },
        {
          statusName: "已拒绝",
          statusId: 3,
        },
        {
          statusName: "已完成",
          statusId: 4,
        },
      ],
      payStatusList: [
        {
          statusName: "未付款",
          statusId: 0,
        },
        {
          statusName: "付款未完成",
          statusId: 1,
        },
        {
          statusName: "付款已完成",
          statusId: 2,
        },
      ],
      tableList: [],
      total: 100,
      timeValue: "",
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
    timeChange() {
      if (this.timeValue != null && this.timeValue.length > 0) {
        this.searchContent.createdAtStart = this.timeValue[0];
        this.searchContent.createdAtEnd = this.timeValue[1];
      } else {
        this.searchContent.createdAtStart = "";
        this.searchContent.createdAtEnd = "";
      }
    },
    // clickOrder(val) {
    //   console.log("999999999999");
    //   this.searchContent.pageSize = val;
    // },
    // 分页
    handleSizeChange(val) {
      this.searchContent.pageSize = val;
      this.getMenuList();
    },
    // 分页
    handleCurrentChange(val) {
      this.searchContent.page = val;
      this.getMenuList();
    },
    //获取关联的企业信息
    getRelatedEnterprise() {
      supplyApi.getEnterpriselist().then(({ data: res }) => {
        if (res.code == 200) {
          this.companyList = res.data;
        }
      });
    },
    // 订单状态
    orderStatus(val) {
      let status = {};
      if (val == 2) {
        status = { name: "已确认", color: "#3183FF" };
      } else if (val == 4) {
        status = { name: "已完成", color: "#47AA3B" };
      } else if (val == 3) {
        status = { name: "已拒绝", color: "#411AEF" };
      } else if (val == 1) {
        status = { name: "待确认", color: "#F95E00" };
      } else if (val == 0) {
        status = { name: "待申请", color: "#F95E00" };
      }
      return status;
    },
    //表格数据列表查询
    getMenuList() {
      // this.searchContent.page = 1;
      // this.searchContent.pageSize = 10;
      supplyApi.getCompareList(this.searchContent).then(({ data: res }) => {
        if (res.code == 200) {
          this.tableList = res.data.records;
          this.total = res.data.total;
          this.tableList.map((item) => {
            item.materialList.map((item0, index) => {
              item0.orderId = index + 1;
            });
          });
        }
      });
    },
    //重置
    clearSearch() {
      this.searchContent.compareCode = "";
      this.searchContent.status = "";
      this.searchContent.createdAtEnd = "";
      this.searchContent.createdAtStart = "";
      this.searchContent.purchaserCompanyName = "";
      this.searchContent.paidStatus = "";
      this.searchContent.computed = "";
      this.searchContent.page = 1;
      this.searchContent.pageSize = 10;
      this.searchContent.companyId = '';
      this.timeValue = "";
      this.getMenuList();
    },
    // 获取付款状态
    getPayStatus(val) {
      let name = "";
      this.payStatusList.map((item) => {
        if (item.statusId == val) {
          name = item.statusName;
        }
      });
      return name;
    },
  },
};
</script>

<style lang="less" scoped>
.statementquery {
  height: 700px;
  overflow-y: auto;
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
          width: 80%;
          height: 70px;
          padding: 5px 0;
          .titleContent {
            height: 30px;
            line-height: 30px;
            display: flex;
            div {
              width: 16.5%;
              max-width: 300px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              color: black !important;
            }
            .clickOrder {
              color: #43a0fe !important;
            }
          }
          .titleContent0 {
            height: 60px;
            line-height: 60px;
            display: flex;
            div {
              width: 16.5%;
              max-width: 300px;
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
  .pageBottom {
    text-align: center;
    margin-top: 15px;
  }
}
</style>
