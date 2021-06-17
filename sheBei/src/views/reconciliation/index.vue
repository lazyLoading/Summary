<template>
  <div class="statementquery" :style="{ height: cardHeight }">
    <el-card class="searchCard">
      <div style="margin-top: 10px; width: 100%">
        <el-form label-width="110px" :inline="true" class="demo-form-inline">
          <el-form-item class="formRight" label="对账单号：">
            <el-input
                v-model="pagenumber.orderNo"
                class="inputWidth"
                prefix-icon="el-icon-search"
                placeholder="请输入关键字搜索"
            ></el-input>
          </el-form-item>
          <el-form-item class="formRight" label="对账状态：">
            <el-select v-model="value" filterable placeholder="请选择">
              <el-option
                  v-for="item in dzztList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="labelWidth" label="发起对账时间：">
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
          <el-form-item class="formRight" label="客户名称：">
            <el-input
                v-model="pagenumber.customerName"
                class="inputWidth"
                prefix-icon="el-icon-search"
                placeholder="请输入关键字搜索"
            ></el-input>
          </el-form-item>
          <el-form-item class="formRight" label="付款状态：">
            <el-select v-model="value" filterable placeholder="请选择">
              <el-option
                  v-for="item in fkztList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <div class="btn">
            <el-button
                type="primary"
                style="margin-left: 10px;width: 100px"
                @click="getMenuList"
            >查询</el-button>
            <el-button
                type="primary"
                style="margin-left: 10px"
                @click="clearSearch"
            >重置</el-button>
          </div>
        </el-form>
      </div>
    </el-card>
    <div class="view_operation">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选/全不选</el-checkbox>
      <div class="flex"></div>
      <el-button type="primary" @click="handleNav">发起对账</el-button>
      <el-button type="primary">打印</el-button>
    </div>
    <el-card class="contentCard">
      <div class="tableMainQin">
        <el-checkbox-group v-model="checkedCities" @change="handleChange">
          <el-collapse>
            <el-collapse-item v-for="(item, i) in tableList" :key="i">
              <template slot="title">
                <el-checkbox style="margin-left: 10px"></el-checkbox>
                <div class="orderNumber">
                  <div class="titleContentleft">
                    <div class="titleContent">
                      <div>
                        <span>对账单号：</span>
                        <span>{{ item.time1 }}</span>
                      </div>
                      <div class="clickOrder" @click.stop="clickOrder">
                        <span>发起对账时间：</span>
                        <span>{{ item.orderNo }}</span>
                      </div>
                      <div>
                        <span>客户名称：</span>
                        <span>{{ item.time2 }}</span>
                      </div>
                      <div>
                        <span>申请对账金额：</span>
                        <span>{{ item.name1 }}</span>
                      </div>
                      <div>
                        <span>申请对账人：</span>
                        <span>{{ item.name2 }}</span>
                      </div>
                    </div>
                    <div class="titleContent">
                      <div>
                        <span>确认对账人：</span>
                        <span>{{ item.address }}</span>
                      </div>
                      <div>
                        <span>确认对账时间：</span>
                        <span>{{ item.address }}</span>
                      </div>
                      <div>
                        <span>付款进度：</span>
                        <span>{{ item.reason }}</span>
                      </div>
                      <div>
                        <span>备注：</span>
                        <span>{{ item.name3 }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="titleContentright">
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
              <div class="w-full">
                <el-table
                    ref="multipleTable"
                    :key="i"
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
                      sortable
                      prop="workshopName"
                      label="序号"
                      width="100"
                  ></el-table-column>
                  <el-table-column
                      sortable
                      prop="accNum"
                      label="物料编号"
                      min-width="2"
                  ></el-table-column>
                  <el-table-column
                      sortable
                      prop="reworkNum"
                      label="物料名称"
                      min-width="2"
                  ></el-table-column>
                  <el-table-column
                      sortable
                      prop="scrapNum"
                      label="规格/型号"
                      min-width="2"
                  ></el-table-column>
                  <el-table-column
                      sortable
                      prop="planCompletionRate"
                      label="订单数量"
                      min-width="1"
                  ></el-table-column>
                  <el-table-column
                      sortable
                      prop="yieldRate"
                      label="到货数量"
                      min-width="1"
                  ></el-table-column>
                  <el-table-column
                      sortable
                      prop="workLossTime"
                      label="单位"
                      min-width="1"
                  ></el-table-column>
                  <el-table-column
                      sortable
                      show-overflow-tooltip
                      prop="targetStartDate"
                      label="备注"
                      min-width="3"
                  ></el-table-column>
                </el-table>
                <div class="w-full text-right m-t-20">
                  <el-button type="primary" @click="handleRefuse">付款完成</el-button>
                  <el-button type="primary" @click="handleDialog('发起申请', '申请发起对账成功!', 1)">发起申请</el-button>
                  <el-button type="primary" @click="handleDialog('', '申请对账撤回成功!',1)">重新发起申请</el-button>
                  <el-button type="primary" @click="handleDialog('撤回', '申请对账撤回成功!', 1)">撤回</el-button>
                  <el-button type="primary" @click="handleUpdate">编辑</el-button>
                  <el-button type="primary" @click="handleDialog('删除确认','是否确认删除？', 0)">删除</el-button>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-checkbox-group>
        <div class="none" v-show="tableList.length < 1" style="">暂无数据</div>
        <div class="pageBottom">
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
              :total="total"
          ></el-pagination>
        </div>
      </div>
    </el-card>
    <el-dialog :title="dislogTitle" width="430px" :visible.sync="dialogVisible">
      <div v-if="dislogType === 0" class="dialog_container">
        <div class="flex-row items-center justify-center w-full">
          <el-image
              :src="require('@/assets/images/icon_delete.png')"
              fit="fill"></el-image>
          <div class="m-l-15 f-s-16">{{dislogBody}}</div>
        </div>
        <div class="dialog_footer">
          <el-button plain @click="closeDialog">取消</el-button>
          <el-button type="primary">确认</el-button>
        </div>
      </div>
      <div v-else class="dialog_container">
        <div class="flex-row items-center justify-center w-full">
          <el-image
              :src="require('@/assets/images/icon_affirm.png')"
              fit="fill"></el-image>
          <div class="m-l-15 f-s-16">{{dislogBody}}</div>
        </div>
        <div class="dialog_footer">
          <el-button type="primary" @click="closeDialog">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { windowHeight } from "@/utils/setSize.js";
export default {
  computed: {},
  data() {
    return {
      checkedCities: [],
      dialogVisible: false,
      dislogType: 0,
      dislogTitle: '',
      dislogBody: '',
      cardHeight: windowHeight,
      pagenumber: {},
      dzztList: [
        {
          label: '全部',
          value: '全部'
        },
        {
          label: '待申请',
          value: '待申请'
        },
        {
          label: '待确认',
          value: '待确认'
        },
        {
          label: '已确认',
          value: '已确认'
        },
        {
          label: '已拒绝',
          value: '已拒绝'
        }
      ],
      fkztList: [
        {
          label: '全部',
          value: '全部'
        },
        {
          label: '付款未完成',
          value: '付款未完成'
        },
        {
          label: '付款已完成',
          value: '付款已完成'
        }
      ],
      tableList: [
        {
          orderNo: 10000000,
          time1: "2021-01-01 13:00",
          time2: "2021-01-01,",
          name1: "韩梅梅",
          name2: "李雷 1820576559",
          address: "南京市建邺区江东中路",
          reason: "不好吃",
          name3: "韩梅梅",
          status: 1,
          list: [
            {
              workshopName: 1,
              accNum: "00012001",
              reworkNum: "名称名称",
              scrapNum: "型号限号",
              planCompletionRate: "1000",
              yieldRate: "200",
              workLossTime: "单位单位",
              targetStartDate: "备注备注备注备注备注备注备注备注备注备注",
            },
            {
              workshopName: 1,
              accNum: "00012001",
              reworkNum: "名称名称",
              scrapNum: "型号限号",
              planCompletionRate: "1000",
              yieldRate: "200",
              workLossTime: "单位单位",
              targetStartDate: "备注备注备注备注备注备注备注备注备注备注",
            },
            {
              workshopName: 1,
              accNum: "00012001",
              reworkNum: "名称名称",
              scrapNum: "型号限号",
              planCompletionRate: "1000",
              yieldRate: "200",
              workLossTime: "单位单位",
              targetStartDate: "备注备注备注备注备注备注备注备注备注备注",
            },
            {
              workshopName: 1,
              accNum: "00012001",
              reworkNum: "名称名称",
              scrapNum: "型号限号",
              planCompletionRate: "1000",
              yieldRate: "200",
              workLossTime: "单位单位",
              targetStartDate: "备注备注备注备注备注备注备注备注备注备注",
            },
            {
              workshopName: 1,
              accNum: "00012001",
              reworkNum: "名称名称",
              scrapNum: "型号限号",
              planCompletionRate: "1000",
              yieldRate: "200",
              workLossTime: "单位单位",
              targetStartDate: "备注备注备注备注备注备注备注备注备注备注",
            },
            {
              workshopName: 1,
              accNum: "00012001",
              reworkNum: "名称名称",
              scrapNum: "型号限号",
              planCompletionRate: "1000",
              yieldRate: "200",
              workLossTime: "单位单位",
              targetStartDate: "备注备注备注备注备注备注备注备注备注备注",
            },
            {
              workshopName: 1,
              accNum: "00012001",
              reworkNum: "名称名称",
              scrapNum: "型号限号",
              planCompletionRate: "1000",
              yieldRate: "200",
              workLossTime: "单位单位",
              targetStartDate: "备注备注备注备注备注备注备注备注备注备注",
            },
          ],
        },
        {
          orderNo: 10000000,
          time1: "2021-01-01 13:00",
          time2: "2021-01-01,",
          name1: "韩梅梅",
          name2: "李雷 1820576559",
          address: "南京市建邺区江东中路",
          reason: "不好吃",
          name3: "韩梅梅",
          status: 3,
          list: [
            {
              workshopName: 1,
              accNum: "00012001",
              reworkNum: "名称名称",
              scrapNum: "型号限号",
              planCompletionRate: "1000",
              yieldRate: "200",
              workLossTime: "单位单位",
              targetStartDate: "备注备注备注备注备注备注备注备注备注备注",
            },
            {
              workshopName: 1,
              accNum: "00012001",
              reworkNum: "名称名称",
              scrapNum: "型号限号",
              planCompletionRate: "1000",
              yieldRate: "200",
              workLossTime: "单位单位",
              targetStartDate: "备注备注备注备注备注备注备注备注备注备注",
            },
            {
              workshopName: 1,
              accNum: "00012001",
              reworkNum: "名称名称",
              scrapNum: "型号限号",
              planCompletionRate: "1000",
              yieldRate: "200",
              workLossTime: "单位单位",
              targetStartDate: "备注备注备注备注备注备注备注备注备注备注",
            },
            {
              workshopName: 1,
              accNum: "00012001",
              reworkNum: "名称名称",
              scrapNum: "型号限号",
              planCompletionRate: "1000",
              yieldRate: "200",
              workLossTime: "单位单位",
              targetStartDate: "备注备注备注备注备注备注备注备注备注备注",
            },
            {
              workshopName: 1,
              accNum: "00012001",
              reworkNum: "名称名称",
              scrapNum: "型号限号",
              planCompletionRate: "1000",
              yieldRate: "200",
              workLossTime: "单位单位",
              targetStartDate: "备注备注备注备注备注备注备注备注备注备注",
            },
            {
              workshopName: 1,
              accNum: "00012001",
              reworkNum: "名称名称",
              scrapNum: "型号限号",
              planCompletionRate: "1000",
              yieldRate: "200",
              workLossTime: "单位单位",
              targetStartDate: "备注备注备注备注备注备注备注备注备注备注",
            },
            {
              workshopName: 1,
              accNum: "00012001",
              reworkNum: "名称名称",
              scrapNum: "型号限号",
              planCompletionRate: "1000",
              yieldRate: "200",
              workLossTime: "单位单位",
              targetStartDate: "备注备注备注备注备注备注备注备注备注备注",
            },
          ],
        },
      ],
      pageNum: 1,
      pageSize: 10,
      total: 100,
      startTime: "",
      endTime: "",
      timeValue: "",
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
    console.log(this.orderStatus(2).color);
  },
  methods: {
    handleDialog (title, body, index) {
      this.dialogVisible = true
      this.dislogTitle = title
      this.dislogType = index
      this.dislogBody = body
    },
    handleAffirm () {
      this.dialogVisible = true
      this.dislogTitle = '发货'
    },
    handleDelete () {
      this.dialogVisible = true
      this.dislogTitle = '删除确认'
    },
    handleNav () {
      this.$router.push({name: 'OperatorReconciliation'})
    },
    handleChange () {

    },
    timeChange() {
      if (this.timeValue != null && this.timeValue.length > 0) {
        this.startTime = this.timeValue[0];
        this.endTime = this.timeValue[1];
      } else {
        this.startTime = "";
        this.endTime = "";
      }
    },
    clickOrder() {
      console.log("999999999999");
    },
    // 分页
    handleSizeChange(val) {
      console.log(val);
    },
    // 分页
    handleCurrentChange(val) {
      console.log(val);
    },
    downLoad() {
      alert("下载附件");
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
    //查询
    getMenuList() {
      alert("查询");
    },
    //重置
    clearSearch() {
      alert("重置");
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../less/base.less";
@{deep} .el-dialog__title{
  font-size: 16px;
}
.statementquery {
  height: 750px;
  overflow-y: auto;
  .view_operation{
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 20px 16px 36px;
    .flex{
      flex: 1;
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
      width: 100%;
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
        padding: 0 20px 0 10px;
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
          justify-content: flex-end;
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
  .dialog_container{
    width: 100%;
    .downBtn{
      padding: 0 12px;
      width: 295px;
      height: 32px;
      border-radius: 4px;
      border: solid 1px #e6eaee;
      display: flex;
      flex-direction: row;
      align-items: center;
      color: @gray_text;
    }
    .dialog_footer{
      margin-top: 50px;
      width: 100%;
      text-align: center;
      @{deep} .el-button{
        width: 100px;
      }
      @{deep} .el-button+.el-button{
        margin-left: 20px;
      }
    }
  }
}
</style>
