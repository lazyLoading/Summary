<template>
  <div class="statementquery supply-order">
    <!-- 查询 -->
    <el-card class="search-head">
      <el-form ref="formSearchRef" :model="formSearch" :inline="true">
        <el-form-item
          v-for="(item, index) in formOptions"
          :key="index"
          :prop="item.prop"
          :label="item.label ? item.label + '：' : ''"
          label-width="100px"
        >
          <formItem v-model="formSearch[item.prop]" :itemOptions="item" />
        </el-form-item>
        <el-form-item class="search-btn">
          <el-button type="primary" @click="formSearchHandle" size="medium"
            >查询</el-button
          >
          <el-button @click="formSearchReset('formSearchRef')" size="medium"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 列表 -->
    <OpenList
      ref="openList"
      :btnBatch="btnBatch"
      :listData="listData"
      :listLabel="listLabel"
      :materielLabel="materielLabel"
      :listTotal="listTotal"
      :config="formSearch"
      :checkedCities="checkedCities"
      :checkAll="checkAll"
      @onCheckAll="getCheckedCities"
      @onChecked="getCheckedCities"
      @onCurrentChange="handleCurrentChange"
      @onSizeChange="handleSizeChange"
      @onBtnBatch="btnBatchHandle"
      @onBtnRadio="btnRadioHandle"
      @onDetails="orderDetailHandle"
      @onDownload="annexDownload"
    ></OpenList>

    <!---------------------------------抽 屉--------------------------------->
    <!-- 订单详情 -->
    <el-drawer class="drawer-box" :visible.sync="drawerShowDetail" size="90%">
      <template slot="title">
        <div class="drawer-title">
          <strong>{{ drawerTitle }} </strong>
          <el-tag v-if="statusName" type="warning">{{ statusName }}</el-tag>
        </div>
      </template>
      <OrderDetail :detailData="detailData"> </OrderDetail>
    </el-drawer>

    <!--拒绝 -->
    <el-drawer
      class="drawer-refuse"
      :title="drawerTitle"
      :visible.sync="drawerRefuseShow"
    >
      <OrderForms
        :formLabel="refuseFormLabel"
        :form="refuseForms"
        :rules="refuseFormsRules"
        @onCancel="drawerRefuseShow = false"
        @onConfirm="submitRefuseForms"
        @onChange="refuseChange"
      >
      </OrderForms>
    </el-drawer>
  </div>
</template>

<script>
import formItem from "@/components/FormItem";
import OrderDetail from "@/views/buyer/components/orderDetail";
import OpenList from "@/views/buyer/components/openList";
import OrderForms from "@/views/buyer/components/orderForms";
import {
  purchaseList,
  purchaseOperationUpdate,
  importTemplate,
  purchaseExport,
  purchaseDownload,
  batchExport,
  purchaseRelated,
  purchaseCurrentStatus,
} from "@/api/order.js";
import { refuseList } from "@/api/customer";
import orderDtailsMixin from "@/assets/mixins/orderDtails.js"
export default {
   mixins:[orderDtailsMixin],
  components: {
    formItem,
    OrderDetail,
    OpenList,
    OrderForms,
  },
  data() {
    return {
       isClick: false,
      drawerTitle: "",
      drawerShowAdd: false,
      drawerShowDetail: false,
      drawerShowMateriel: false,
      //拒绝
      drawerRefuseShow: false,
      supplierContactUserId: null,
      refuseList: [],
      refuseForms: {
        //refuseReason: "", //拒绝原因
        //idList: [], //供应商联系人id
      },
      refuseFormLabel: [
        {
          label: "拒绝原因",
          model: "rejectReason",
          type: "select",
          opts: [],
        },
      ],
      refuseFormsRules: {
        rejectReason: [
          { required: true, message: "请选择拒绝原因", trigger: "blur" },
        ],
        reason: [
          { required: true, message: "请输入其它原因", trigger: "blur" },
        ],
      },
      //订单详情
      statusName: "",//标题tag色
      //批量按钮
      btnBatch: [
        { label: "批量确认", type: "confirm" },
        { label: "批量拒绝", type: "refuse" },
        { label: "导出", type: "export" },
      ],
      //列表按钮
      btnList: [],
      //订单列表
      checkAll: false,
      checkedCities: [],
      listTotal: 0,
      listData: [],
      listLabel: [
        {
          prop: "issuedAt",
          label: "下达时间",
        },
        {
          prop: "deliveredAt",
          label: "交货日期",
        },
        {
          prop: "purchaserCompanyName",
          label: "客户名称",
        },
        {
          prop: "linkmanName",
          label: "联系人",
        },
        {
          prop: "linkmanPhone",
          label: "联系方式",
        },
        {
          prop: "deliveryAddress",
          label: "地址",
        },
      ],
      materielLabel: [
        {
          prop: "index",
          label: "序号",
          width: "55px",
        },
        {
          prop: "materialCode",
          label: "物料编码",
        },
        {
          prop: "materialName",
          label: "物料名称",
        },
        {
          prop: "specification",
          label: "规格/型号",
        },
        {
          prop: "orderingNumber",
          label: "订货数量",
        },
        {
          prop: "receiveNumber",
          label: "实收数量",
        },
        {
          prop: "unit",
          label: "单位",
        },
        {
          prop: "remark",
          label: "备注",
        },
      ],
      //查询
      formSearch: {
        confirmedTime: [], //确认暂存时间
        deliveredTime: [], //交货暂存时间
        issuedTime: [], //下达暂存时间
        page: 1,
        pageSize: 10,
        confirmedAtStart: [], //确认开始时间
        confirmedAtEnd: "", //确认结束时间
        deliveredAtStart: [], //交货开始时间
        deliveredAtEnd: "", //交货结束时间
        issuedAtStart: [], //下达开始时间
        issuedAtEnd: "", //下达结束时间
        confirmedMan: "", //确认人
        linkman: "", //联系人
        purchaseCode: "", //采购订单编码
        purchaserCompanyId: "", //采购方公司
        purchaserCompanyName: "", //客户名称
        status: "", //订单状态 0 - 待下发, 1 - 待确认, 2 - 已确认, 3 - 已拒绝, 4 - 已终止, 5 - 已完成
        supplierCompanyId: "", //供货公司
        supplierCompanyName: "", //供应商名称
      },
      formOptions: [
        {
          label: "采购订单号",
          prop: "purchaseCode",
          element: "el-input",
          max: 20,
        },
        {
          label: "客户名称",
          prop: "purchaserCompanyId",
          element: "el-select",
          options: [],
        },
        {
          label: "下达时间",
          type: "daterange",
          prop: "issuedTime",
          element: "el-date-picker",
        },
        {
          label: "联系人",
          prop: "linkman",
          element: "el-input",
        },
        {
          label: "订单状态",
          prop: "status",
          element: "el-select",
          options: [
            { label: "全部", value: "" },
            { label: "订单待确认", value: "1" },
            { label: "变更待确认", value: "2" },
            { label: "订单已拒绝", value: "3" },
            { label: "变更已拒绝", value: "4" },
            { label: "已确认", value: "5" },
            { label: "已完成", value: "6" },
            { label: "已中止", value: "7" },
          ],
        },
        {
          label: "确认人",
          prop: "confirmedMan",
          element: "el-input",
        },
        {
          label: "确认时间",
          type: "daterange",
          prop: "confirmedTime",
          element: "el-date-picker",
        },
        {
          label: "交货日期",
          type: "daterange",
          prop: "deliveredTime",
          element: "el-date-picker",
        },
      ],
    };
  },
  computed: {},
  created() {
    this.getList();
    this.purchaseRelated();
  },
  methods: {
    //查询
    formSearchHandle() {
      //时间节取赋值
      let issuedTime = this.formSearch.issuedTime;
      let confirmedTime = this.formSearch.confirmedTime;
      let deliveredTime = this.formSearch.deliveredTime;

      // 下达时间;
      if (issuedTime != null && issuedTime.length > 0) {
        this.formSearch.issuedAtStart = issuedTime[0];
        this.formSearch.issuedAtEnd = issuedTime[1];
      }
      //确认时间
      if (confirmedTime != null && confirmedTime.length > 0) {
        this.formSearch.confirmedAtStart = confirmedTime[0];
        this.formSearch.confirmedAtEnd = confirmedTime[1];
      }
      //交货时间
      if (deliveredTime != null && deliveredTime.length > 0) {
        this.formSearch.deliveredAtStart = deliveredTime[0];
        this.formSearch.deliveredAtEnd = deliveredTime[1];
      }
      this.getList();
    },
    //获取列表
    getList() {
      let d = JSON.parse(JSON.stringify(this.formSearch));
      //删除初始生成的冗余赋值
      delete d.confirmedTime;
      delete d.deliveredTime;
      delete d.issuedTime;
      purchaseList(d).then(({ data: res }) => {
        if (res.code == 200) {
          let d = res.data;
          this.listData = d.records;
          this.listTotal = d.total;
          //生成按钮
          this.listData.forEach((val, index) => {
            this.reversedStatus(val, val.status);
          });
          //更新子组件内部定义的数据
          this.$refs.openList.checkParentHandel();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    //批量操作
    btnBatchHandle(e) {
      let { type, label } = e;

      //批量确认
      if (type == "confirm") {
        if (this.checkedCities.length == 0) {
          this.$message.warning("请勾选至少一项!");
          return false;
        }
        let updateDto = {
          idList: this.checkedCities,
          statusAfter: 5,
        };
        this.purchaseOperationUpdate(updateDto);
      }

      //批量拒绝
      if (type == "refuse") {
        if (this.checkedCities.length == 0) {
          this.$message.warning("请勾选至少一项!");
          return false;
        }
        this.refuseForms = {}; //清空
        this.drawerTitle = "批量拒绝";
        this.drawerRefuseShow = true;
        if (this.refuseFormLabel.length > 1)
          this.refuseFormLabel.splice(this.refuseFormLabel.length - 1, 1);
        this.getRefuseList(); //获取拒绝原因列表
      }
      //批量导出
      if (type == "export") this.batchExport();
    },
    //单个操作
    btnRadioHandle(d) {
      let { item, e } = d;
      //先状态校验
      purchaseCurrentStatus({ id: item.id, currentStatus: item.status }).then(
        ({ data: res }) => {
          if (res.code == 200) {
            if (res.data) {
              if (e == "确认") {
                let updateDto = {
                  idList: [item.id],
                  statusBefore: item.status,
                  statusAfter: 5,
                };
                this.openMessageBox("是否提交订单确定?", "提示", updateDto);
              }

              if (e == "拒绝") {
                this.refuseForms = {}; //清空值
                this.supplierContactUserId = item.id;
                this.drawerTitle = "拒绝";
                this.drawerRefuseShow = true;
                this.getRefuseList(); //获取拒绝原因列表
                if (this.refuseFormLabel.length > 1)
                  this.refuseFormLabel.splice(
                    this.refuseFormLabel.length - 1,
                    1
                  );
              }

              if (e == "导出") this.exportExcel([item.id]);
            } else {
              this.$message.error("当前状态已变更，待刷新后操作");
            }
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    //操作-拒绝|确认
    purchaseOperationUpdate(updateDto) {
      purchaseOperationUpdate(updateDto).then(({ data: res }) => {
        if (res.code == 200) {
          this.$message.success("操作成功!");
          this.refuseForms = {}; //清空值
          this.drawerRefuseShow = false;
          this.getList();
        } 
      });
    },
    //批量拒绝|拒绝-验证
    submitRefuseForms() {
      let d = {};
      if (this.refuseForms.rejectReason != "OTHER") {
        this.refuseFormLabel[0].opts.find((item) => {
          if (item.value == this.refuseForms.rejectReason) {
            d.refuseReason = item.label;
          }
        });
      } else {
        d.refuseReason = this.refuseForms.reason;
      }
      if (this.drawerTitle == "批量拒绝") d.idList = this.checkedCities;
      if (this.drawerTitle == "拒绝") d.idList = [this.supplierContactUserId];
      this.purchaseOperationUpdate(d);
    },
    //拒绝原因-列表选择
    refuseChange(d) {
      let { e } = d;
      if (e == "OTHER") {
        this.refuseFormLabel.push({
          model: "reason",
          label: "其它原因",
          type: "textarea",
          max:200
        });
      } else {
        if (this.refuseFormLabel.length > 1)
          this.refuseFormLabel.splice(this.refuseFormLabel.length - 1, 1);
      }
    },
    //拒绝原因列表
    getRefuseList() {
      refuseList({ rejectType: "REJECT_PURCHASE_ORDER" }).then(
        ({ data: res }) => {
          if (res.code == 200) {
            let d = res.data;

            //赋给下拉框
            this.refuseFormLabel[0].opts = d.map((item, i) => {
              return {
                label: item["rejectReason"],
                value: item["id"],
                rejectType: item["rejectType"],
              };
            });
            this.refuseFormLabel[0].opts.push({
              label: "其它",
              value: "OTHER",
            });
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    //询问弹框
    openMessageBox(text, title, par) {
      let _this = this;
      this.$confirm(text, title, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          _this.purchaseOperationUpdate(par);
        })
        .catch(() => {});
    },

    //订单详情
    orderDetailHandle(e) {
      this.drawerShowDetail = true;
      this.drawerTitle = "订单详情";
      this.statusName = e.statusName;
      this.getListDetail(e.id);
    },
    //状态生成...
    reversedStatus(val, e) {
      //0 - 待下发, 1 - 订单待确认, 2 - 变更待确认, 3 - 订单已拒绝, 4 - 变更已拒绝, 5 - 已确认, 6 - 已完成, 7 - 已中止
      let refusedArr = [
        {
          prop: "refusedAt",
          label: "拒绝时间",
        },
        {
          prop: "refusedOperatorName",
          label: "拒绝人",
        },
        {
          prop: "refuseReason",
          label: "拒绝原因",
        },
      ];
      let confirmedArr = [
        {
          prop: "confirmedAt",
          label: "确认时间",
        },
        {
          prop: "confirmedOperatorName",
          label: "确认人",
        },
      ];
      let finishArr = [
        {
          prop: "finishAt",
          label: "完成时间",
        },
      ];
      let abortArr = [
        {
          prop: "abortAt",
          label: "中止时间",
        },
        {
          prop: "abortOperatorName",
          label: "中止人",
        },
        {
          prop: "abortReason",
          label: "中止原因",
        },
      ];
      switch (e) {
        case 0:
          val.statusName = "待下发";
          val.statusColor = "color-orange1";
          val.listLabel = this.listLabel;
          break;
        case 1:
          val.statusName = "订单待确认";
          val.statusColor = "color-orange1";
          val.bnt = ["确认", "拒绝"];
          val.listLabel = this.listLabel;
          break;
        case 2:
          val.statusName = "变更待确认";
          val.bnt = ["确认", "拒绝"];
          val.statusColor = "color-orange1";
          val.listLabel = this.listLabel;
          break;
        case 3:
          val.statusName = "订单已拒绝";
          val.statusColor = "color-purple1";
          val.listLabel = this.listLabel.concat(refusedArr);
          break;
        case 4:
          val.statusName = "变更已拒绝";
          val.statusColor = "color-purple1";
          val.listLabel = this.listLabel.concat(refusedArr);
          break;
        case 5:
          val.statusName = "已确认";
          val.statusColor = "color-blue1";
          val.listLabel = this.listLabel.concat(confirmedArr);
          break;
        case 6:
          val.statusName = "已完成";
          val.statusColor = "color-green1";
          val.listLabel = this.listLabel.concat(finishArr);
          break;
        case 7:
          val.statusName = "已中止";
          val.statusColor = "color-red5";
          val.listLabel = this.listLabel.concat(abortArr);
          break;
      }
    },
    //获取勾选列表
    getCheckedCities(e) {
      this.checkedCities = e;
    },
    //重置
    formSearchReset(formName) {
      this.$refs[formName].resetFields();
      this.formSearch.confirmedAtStart = ""; //确认开始时间
      this.formSearch.confirmedAtEnd = ""; //确认结束时间
      this.formSearch.deliveredAtStart = ""; //交货开始时间
      this.formSearch.deliveredAtEnd = ""; //交货结束时间
      this.formSearch.issuedAtStart = ""; //下达开始时间
      this.formSearch.issuedAtEnd = ""; //下达结束时间
      this.getList();
    },
    //客户列表
    purchaseRelated() {
      purchaseRelated().then(({ data: res }) => {
        if (res.code == 200) {
          let d = res.data;
          this.formOptions[1].options = d.map((item) => {
            return {
              label: item["companyName"],
              value: item["companyId"],
            };
          });
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 改变每页显示的条数
    handleSizeChange(val) {
      this.formSearch.pageSize = val;
      this.formSearch.page = 1;
      this.getList();
    },
    // 点击页码
    handleCurrentChange(val) {
      this.formSearch.page = val;
      this.getList();
    },
    //下载模板
    importTemplate(d) {
      importTemplate(d).then(({ data: res }) => {
        if (res.code == 200) {
          let d = res.data[0].fileUrl;
          window.open(d);
        } else {
          this.$message.error(res.message);
        }
      });
    },
      //下载附件
    annexDownload(item) {
      let _this = this;

      if (_this.isClick) {
        _this.$message.error("请等待1s后再次点击");
        return false;
      }
      purchaseDownload(item.id).then((res) => {
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

      _this.isClick = true;
      setTimeout(() => {
        _this.isClick = false;
      }, 1000);
    },
    //导出
    exportExcel(idList) {
      purchaseExport(idList).then(({ data: res }) => {
        const type = "application/vnd.ms-excel;charset=utf-8"; // excel文件
        const blob = new Blob([res], { type: type });
        const createA = document.createElement("a");
        const href = window.URL.createObjectURL(blob);
        createA.href = href;
        createA.download = "供应协同订单" + this.getData() + ".xls";
        document.body.appendChild(createA);
        createA.click();
        document.body.removeChild(createA); // 下载完成后移除标签
        window.URL.revokeObjectURL(href); // 释放url
      });
    },
    batchExport() {
      batchExport(this.formSearch).then(({ data: res }) => {
        const type = "application/vnd.ms-excel;charset=utf-8"; // excel文件
        const blob = new Blob([res], { type: type });
        const createA = document.createElement("a");
        const href = window.URL.createObjectURL(blob);
        createA.href = href;
        createA.download = "供应协同订单" + this.getData() + ".xls";
        document.body.appendChild(createA);
        createA.click();
        document.body.removeChild(createA); // 下载完成后移除标签
        window.URL.revokeObjectURL(href); // 释放url
      });
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
  },
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.supply-order {
  > .el-card {
    margin-bottom: 20px;
    .no-data {
      text-align: center;
      line-height: 480px;
      color: #999;
    }
  }
   
  @{deep} .drawer-box .order-list {
    .el-table {
      border-left: 1px solid #eee;
      border-right: 1px solid #eee;
      th {
        padding: 0;
      }
    }
  }

  @{deep} .search-head {
    .el-form {
      position: relative;
      .search-btn {
        position: absolute;
        right: 0;
      }
    }
    .el-card__body {
      padding: 15px;
    }
    .el-form-item {
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
  @{deep} .drawer-refuse {
  .el-drawer__header {
    color: #333;
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;
    span {
      border-left: 5px solid #00aaff;
      line-height: 30px;
      padding: 0 10px;
      font-size: 22px;
      color: #000;
    }
  }

  .el-drawer__body {
    padding-right: 30px;
  }
}
}


</style>
