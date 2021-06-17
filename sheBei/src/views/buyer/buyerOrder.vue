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
      @onCheckAll="getCheckedCities"
      @onChecked="getCheckedCities"
      @onCurrentChange="handleCurrentChange"
      @onSizeChange="handleSizeChange"
      @onBtnBatch="btnBatchHandle"
      @onBtnRadio="btnRadioHandle"
      @onDetails="orderDetailHandle"
      @onDownload="annexDownload"
      @onImportError="importError"
      @onImportSuccess="getList()"
    ></OpenList>

    <!---------------------------------抽 屉--------------------------------->
    <!-- 订单详情 -->
    <el-drawer
      v-if="drawerShowDetail"
      class="drawer-box"
      :visible.sync="drawerShowDetail"
      size="90%"
    >
      <template slot="title">
        <div class="drawer-title">
          <strong>{{ drawerTitle }} </strong>
          <el-tag v-if="statusName" :type="statusTag">{{ statusName }}</el-tag>
        </div>
      </template>
      <OrderDetail :detailData="detailData"> </OrderDetail>
    </el-drawer>

    <!--填写物料信息 -->
    <el-drawer
      v-if="drawerShowMateriel"
      class="drawer-box"
      :visible.sync="drawerShowMateriel"
    >
      <template slot="title">
        <div class="drawer-title">
          <strong>物料信息</strong>
        </div>
      </template>
      <div class="materiel-order">
        <OrderForms
          :formLabel="materielFormLabel"
          :form="materielForms"
          :rules="materielRules"
          @onCancel="drawerShowMateriel = false"
          @onConfirm="materielConfirm"
        >
        </OrderForms>
      </div>
    </el-drawer>

    <!-- 填写订单信息 -->
    <el-drawer
      v-if="drawerShowAdd"
      class="drawer-box"
      :title="drawerTitle"
      :visible.sync="drawerShowAdd"
      size="90%"
    >
      <template slot="title">
        <div class="drawer-title">
          <strong>{{ drawerTitle }} </strong>
        </div>
      </template>
      <order-submit
        :drawerTitle="drawerTitle"
        :addForms="addForms"
        :formLabel="addFormaLabel"
        :rules="addRules"
        :tableLabel="addMaterielLabel"
        :addOff="addOff"
        @onUpChange="handleChange"
        @onCancel="drawerShowAdd = false"
        @onEdit="materielEdit"
        @onDel="materielDel"
        @onConfirm="submitOrder"
        @onAdd="materielAdd"
      >
      </order-submit>
    </el-drawer>

    <!-- 中止原因 -->
    <el-dialog
      v-if="dialogStop"
      title="提示"
      :visible.sync="dialogStop"
      width="40%"
    >
      <el-row>
        <el-col :span="6" style="text-align: right">
          <sup class="color-red4">*</sup>中止原因：</el-col
        >
        <el-col :span="18">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入中止原因"
            v-model.trim="abortReason"
            maxlength="200"
          >
          </el-input>
        </el-col>
      </el-row>
      <p slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="dialogStop = false">取 消</el-button>
        <el-button type="primary" @click="submitStop">确 定</el-button>
      </p>
    </el-dialog>

    <!-- 导入错误提示 -->
    <el-dialog
      v-if="dialogImport"
      class="dialog-import"
      title="导入错误提示"
      :visible.sync="dialogImport"
    >
      <ul>
        <li v-for="(item, index) in importList" :key="index">{{ item }}</li>
      </ul>
      <p slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" @click="dialogImport = false">关闭</el-button>
      </p>
    </el-dialog>
  </div>
</template>

<script>
import formItem from "@/components/FormItem";
import OrderDetail from "@/views/buyer/components/orderDetail";
import OpenList from "@/views/buyer/components/openList";
import OrderForms from "@/views/buyer/components/orderForms";
import orderSubmit from "@/views/buyer/components/orderSubmit";

import {
  purchaseList,
  purchaseAdd,
  purchaseUpdate,
  purchaseOperationUpdate,
  importTemplate,
  purchaseRelated,
  purchaseExport,
  purchaseDownload,
  batchExport,
  purchaseCurrentStatus,
} from "@/api/order.js";

import orderDtailsMixin from "@/assets/mixins/orderDtails.js"

export default {
  mixins:[orderDtailsMixin],
  components: {
    formItem,
    OrderForms,
    OrderDetail,
    OpenList,
    orderSubmit,
  },
  data() {
    //验证数量
    var testTwoSmallNum = (rule, value, callback) => {
      if (isNaN(value)) {
        callback(new Error("请输入数字"));
      } else if (value[0] === "0" && value[1] !== ".") {
        callback(new Error("请输入正确的数字"));
        this.$message.error("请输入正确的数字");
      } else if (value === "0." || value === "0.0" || value === "0.00") {
        callback(new Error("请输入正确的数字"));
      } else {
        callback();
      }
    };

    return {
      isClick: false,
      drawerTitle: "",
      drawerShowAdd: false,
      drawerShowDetail: false,
      drawerShowMateriel: false,
      dialogStop: false,
      //导入提示
      dialogImport: false,
      importList: [],
      //中止
      abortReason: "", //中止原因
      stopPar: {}, //中止传参
      //订单详情
      statusTag: "",
      statusName: "",
      btnBatch: [
        { label: "新增订单", type: "add" },
        { label: "批量下发", type: "issue" },
        { label: "批量删除", type: "del" },
        { label: "下载模板", type: "download" },
        { label: "导入订单", type: "import" },
        { label: "导出", type: "export" },
      ],
      //列表按钮
      btnList: [],
      //订单列表
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
          prop: "supplierCompanyName",
          label: "供应商名称",
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
        entranceMark: "PURCHASER", //入口标识
        confirmedAtStart: "", //确认开始时间
        confirmedAtEnd: "", //确认结束时间
        deliveredAtStart: "", //交货开始时间
        deliveredAtEnd: "", //交货结束时间
        issuedAtStart: "", //下达开始时间
        issuedAtEnd: "", //下达结束时间
        confirmedMan: "", //确认人
        linkman: "", //联系人
        purchaseCode: "", //采购订单编码
        purchaserCompanyId: "", //采购方公司
        purchaserCompanyName: "", //客户名称
        status: "", //订单状态 0 - 待下发, 1 - 待确认, 2 - 已确认, 3 - 已拒绝, 4 - 已终止, 5 - 已完成
        supplierCompanyId: "", //供货公司
        supplierCompanyName: "", //供应商名称
        productionOrderNumber: "", //生产订单事情
      },
      formOptions: [
        {
          label: "采购订单号",
          prop: "purchaseCode",
          element: "el-input",
          max: 20,
        },
        {
          label: "供应商名称",
          prop: "supplierCompanyId",
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
            { label: "待下发", value: "0" },
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
        {
          label: "生产订单号",
          prop: "productionOrderNumber",
          element: "el-input",
        },
      ],
      //订单-新增|编辑|变更|编辑变更
      addForms: {},
      addMaterielLabel: [],
      addRules: {
        purchaseCode: [
          { required: true, message: "请输入采购订单号", trigger: "blur" },
        ],
        supplierCompanyId: [
          { required: true, message: "请选择供应商名称", trigger: "blur" },
        ],
        deliveredAt: [
          { required: true, message: "请选择交货日期", trigger: "blur" },
        ],
      },
      addFormaLabel: [
        {
          label: "采购订单号",
          prop: "purchaseCode",
          element: "el-input",
          disabled: false,
          max: 20,
        },
        {
          label: "供应商名称",
          prop: "supplierCompanyId",
          element: "el-select",
          disabled: false,
          options: [],
        },
        {
          label: "交货日期",
          type: "date",
          prop: "deliveredAt",
          element: "el-date-picker",
        },
        {
          label: "地址",
          prop: "deliveryAddress",
          element: "el-input",
          max: 50,
        },
        {
          label: "生产订单号",
          prop: "productionOrderNumber",
          element: "el-input",
          max: 20,
        },
        {
          label: "上传附件",
          prop: "fileList",
          element: "el-upload",
        },
      ],
      //物料弹框-编辑
      materielForms: {},
      materielRules: {
        materialCode: [
          { required: true, message: "请输入物料编号", trigger: "blur" },
        ],
        materialName: [
          { required: true, message: "请输入物料名称", trigger: "blur" },
        ],
        orderingNumber: [
          { required: true, message: "请输入订货数量", trigger: "blur" },
          {
            pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
            message: "最多保留两位小数",
            trigger: "blur",
          },
          { validator: testTwoSmallNum, trigger: "blur" },
        ],
        receiveNumber: [
          { required: true, message: "请输入实收数量", trigger: "blur" },
        ],
        finalOrderingNumber: [
          { required: true, message: "请输入最终订货数量", trigger: "blur" },
          {
            pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
            message: "最多保留两位小数",
            trigger: "blur",
          },
          { validator: testTwoSmallNum, trigger: "blur" },
        ],
      },
      materielFormLabel: [],
      //物料弹框-新增||编辑
      materielIsAdd: {},
      addOff: true,
      //订单物料-新增|编辑
      tableAddMateriel: [
        {
          model: "materialCode", //表单读参值
          prop: "materialCode", //表格读参值
          label: "物料编号",
          max: 20,
        },
        {
          model: "materialName",
          prop: "materialName",
          label: "物料名称",
          max: 50,
        },
        {
          model: "specification",
          prop: "specification",
          label: "规格/型号",
          max: 100,
        },
        {
          model: "unit",
          prop: "unit",
          label: "单位",
          max: 10,
        },
        {
          model: "orderingNumber",
          prop: "orderingNumber",
          label: "订货数量",
          type: "number",
          slot: "orderingNumber",
        },
        {
          model: "remark",
          prop: "remark",
          type: "textarea",
          label: "备注",
          slot: "text",
          max: 200,
        },
      ],
      //订单物料-变更|编辑变更
      tableChangeMateriel: [
        {
          model: "materialCode", //表单读参值
          prop: "materialCode", //表格读参值
          label: "物料编号",
          disabled: true,
        },
        {
          model: "materialName",
          prop: "materialName",
          label: "物料名称",
          disabled: true,
        },
        {
          model: "specification",
          prop: "specification",
          label: "规格/型号",
          disabled: true,
        },
        {
          model: "unit",
          prop: "unit",
          label: "单位",
          disabled: true,
        },
        {
          model: "orderingNumber",
          prop: "orderingNumber",
          type: "number",
          label: "订货数量",
          slot: "orderingNumber",
          disabled: true,
        },
        {
          model: "receiveNumber",
          prop: "receiveNumber",
          label: "实收数量",
          disabled: true,
        },
        {
          model: "finalOrderingNumber",
          prop: "finalOrderingNumber",
          type: "number",
          label: "最终订货数量",
          slot: "finalOrderingNumber",
        },
        {
          model: "remark",
          prop: "remark",
          type: "textarea",
          label: "备注",
          slot: "text",
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
          val.bnt = ["下发", "编辑", "删除"];
          val.listLabel = this.listLabel;
          break;
        case 1:
          val.statusName = "订单待确认";
          val.bnt = ["撤回"];
          val.statusColor = "color-orange1";
          val.listLabel = this.listLabel;
          break;
        case 2:
          val.statusName = "变更待确认";
          val.bnt = ["撤回"];
          val.statusColor = "color-orange1";
          val.listLabel = this.listLabel;
          break;
        case 3:
          val.statusName = "订单已拒绝";
          val.bnt = ["下发", "编辑"];
          val.statusColor = "color-purple1";
          val.listLabel = this.listLabel.concat(refusedArr);
          break;
        case 4:
          val.statusName = "变更已拒绝";
          val.bnt = ["撤回变更", "编辑变更"];
          val.statusColor = "color-purple1";
          val.listLabel = this.listLabel.concat(refusedArr);
          break;
        case 5:
          val.statusName = "已确认";
          val.bnt = ["变更", "中止"];
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
    //提交订单
    submitOrder(e) {
      this.addForms = e;

      //验证物料列表长度
      let materialList = this.addForms.materialList;
      if (materialList == undefined || materialList.length == 0) {
        this.$message.error("点击新增,添加物料信息!");
        return false;
      }

      //上传字段处理
      let fileList = this.addForms.fileList || [];
      let list = [];
      if (fileList != undefined || fileList.length > 0) {
        fileList.forEach((val, i) => {
          list.push({
            name: val.name,
            newName: val.newName || val.response.data[0].newName,
          });
        });
        this.addForms.fileList = list;
      }

      //删除赋加字段
      delete this.addForms.bnt;
      delete this.addForms.statusName;
      delete this.addForms.listLabel;

      //提交
      if (this.drawerTitle == "编辑订单" || !this.addOff) this.purchaseUpdate();
      if (this.drawerTitle == "新增订单") this.purchaseAdd();
    },
    //批量操作
    btnBatchHandle(e) {
      //新增订单
      if (e.type == "add") {
        //清空值
        this.addForms = {
          fileList: [],
          materialList: [],
        };
        this.addMaterielLabel = this.tableAddMateriel; //更新物料表格
        this.materielFormLabel = this.tableAddMateriel; //更新物料表单
        this.drawerShowAdd = true; //显示弹框
        this.drawerTitle = e.label; //更新弹框标题
        this.addOff = true;
        this.addFormaLabel[0].disabled = false; //采购订单为可写
        this.addFormaLabel[1].disabled = false; //供应商为可写
      }
      //批量下发
      if (e.type == "issue") {
        if (this.checkedCities.length == 0) {
          this.$message.warning("请勾选至少一项!");
          return false;
        }
        let updateDto = {
          idList: this.checkedCities,
          statusBefore: 0,
          statusAfter: 1,
        };
        this.purchaseOperationUpdate(updateDto);
      }
      //批量删除
      if (e.type == "del") {
        if (this.checkedCities.length == 0) {
          this.$message.warning("请勾选至少一项!");
          return false;
        }
        let updateDto = {
          idList: this.checkedCities,
          isDeleted: 1,
        };
        this.openMessageBox("是否确定删除?", "提示", updateDto);
      }
      //下载模板
      if (e.type == "download") {
        this.importTemplate({ fileName: "采购订单导入模板.xlsx" });
      }
      //批量导出
      if (e.type == "export") this.batchExport();
    },
    //单个操作
    btnRadioHandle(d) {
      let { item, e } = d;
      //先状态校验
      purchaseCurrentStatus({ id: item.id, currentStatus: item.status }).then(
        ({ data: res }) => {
          if (res.code == 200) {
            if (res.data) {
              if (e == "编辑") {
                this.addMaterielLabel = this.tableAddMateriel; //更新物料表格
                this.materielFormLabel = this.tableAddMateriel; //更新物料表单
                this.drawerShowAdd = true; //显示弹框
                this.drawerTitle = `${e}订单`; //更新弹框标题
                this.addForms = JSON.parse(JSON.stringify(item));
                this.addForms.entranceMark = "EDIT";
                this.addFormaLabel[0].disabled = true; //采购订单为只读
                this.addFormaLabel[1].disabled = false; //供应商为可写
                this.addOff = true;
              }

              if (e == "变更" || e == "编辑变更") {
                this.addMaterielLabel = this.tableChangeMateriel; //更新物料表格
                this.materielFormLabel = this.tableChangeMateriel; //更新物料表单
                this.drawerShowAdd = true; //显示弹框
                this.drawerTitle = `${e}订单`; //更新弹框标题

                this.addForms = JSON.parse(JSON.stringify(item));
                this.addForms.entranceMark = "CHANGE";
                this.addFormaLabel[0].disabled = true; //采购订单为只读
                this.addFormaLabel[1].disabled = true; //供应商为只读
                this.addOff = false;
              }

              if (e == "中止") {
                this.abortReason = "";
                this.stopPar = {
                  idList: [item.id],
                  statusBefore: item.status,
                  statusAfter: 7,
                };
                this.dialogStop = true;
              }

              if (d.e == "下发") {
                let updateDto = {
                  idList: [item.id],
                  statusBefore: item.status,
                  statusAfter: 1,
                };
                this.purchaseOperationUpdate(updateDto);
              }

              if (e == "撤回") {
                let updateDto = {
                  idList: [item.id],
                  statusBefore: item.status,
                  statusAfter: item.status == 1 ? 0 : 5,
                };
                this.purchaseOperationUpdate(updateDto);
              }

              if (e == "撤回变更") {
                let updateDto = {
                  idList: [item.id],
                  statusBefore: item.status,
                  statusAfter: 5,
                };
                this.purchaseOperationUpdate(updateDto);
              }
              //删除
              if (e == "删除") {
                let updateDto = {
                  idList: [item.id],
                  isDeleted: 1,
                };
                this.openMessageBox("是否确定删除?", "提示", updateDto);
              }
              //导出
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

    //物料信息-新增
    materielAdd(e) {
      if (this.addOff) this.materielForms = {};
      this.materielIsAdd = {};
      this.drawerShowMateriel = e; //显示物料弹框
      this.materielFormLabel[0].disabled = false;
    },
    //物料信息-编辑
    materielEdit(d) {
      this.materielIsAdd = d; //新增|编辑
      this.materielFormLabel[0].disabled = true;
      //赋值
      this.materielForms = JSON.parse(
        JSON.stringify(this.addForms.materialList[d.index])
      );
      this.drawerShowMateriel = true; //显示物料弹框
    },
    //物料信息-删除
    materielDel(d) {
      this.addForms.materialList.splice(d.index, 1);
    },
    //物料信息-确认
    materielConfirm(e) {
      if (Object.keys(this.materielIsAdd).length > 0) {
        //如果有数据为编辑
        this.addForms.materialList.splice(this.materielIsAdd.index, 1, e);
      } else {
        //否则为新增
        const materialCode = this.addForms.materialList.find(
          (item) => e.materialCode == item.materialCode
        );

        if (materialCode) {
          this.$message.error("物料编号不能重复");
          return false;
        }
        this.addForms.materialList.push(e);
      }

      this.drawerShowMateriel = false;
      this.materielForms = {};
      this.materielIsAdd = {};
    },
    //中止原因
    submitStop() {
      if (this.abortReason == "") {
        this.$message.error("中止原因不能为空!");
        return false;
      }
      this.stopPar.abortReason = this.abortReason;
      this.purchaseOperationUpdate(this.stopPar);
    },
    //操作-下发|删除
    purchaseOperationUpdate(updateDto) {
      updateDto.entranceMark = "";
      purchaseOperationUpdate(updateDto).then(({ data: res }) => {
        if (res.code == 200) {
          this.getList();
          this.dialogStop = false;
          this.checkedCities = [];
          this.$message.success("操作成功!");
        }
      });
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
    //新增订单
    purchaseAdd() {
      purchaseAdd([this.addForms]).then(({ data: res }) => {
        if (res.code == 200) {
          //更新列表
          this.getList();
          //清空值
          this.addForms = { materialList: [] };
          // 关闭弹框
          this.drawerShowAdd = false;
        } 
      });
    },
    //更新订单
    purchaseUpdate() {
      purchaseUpdate(this.addForms).then(({ data: res }) => {
        if (res.code == 200) {
          //更新列表
          this.getList();
          //清空值
          this.addForms = { materialList: [] };
          //关闭弹框
          this.drawerShowAdd = false;
        } 
      });
    },
    //上传改变时更新值
    handleChange(e) {
      this.addForms.fileList = e;
    },
    //订单详情
    orderDetailHandle(e) {
      this.drawerShowDetail = true;
      this.drawerTitle = "订单详情";
      this.statusName = e.statusName;

      if (e.status == 3 || e.status == 4) {
        this.statusTag = "";
      } else if (e.status == 5 || e.status == 6) {
        this.statusTag = "success";
      } else if (e.status == 7) {
        this.statusTag = "danger";
      } else {
        this.statusTag = "warning";
      }
      this.getListDetail(e.id);
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
    //供应商列表
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
          this.addFormaLabel[1].options = this.formOptions[1].options;
        } else {
          this.$message.error(res.message);
        }
      });
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
        createA.download = "采购协同订单" + this.getData() + ".xls";
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
        createA.download = "采购协同订单" + this.getData() + ".xls";
        document.body.appendChild(createA);
        createA.click();
        document.body.removeChild(createA); // 下载完成后移除标签
        window.URL.revokeObjectURL(href); // 释放url
      });
    },
    //导入失败信息
    importError(e) {
      this.dialogImport = true;
      this.importList = e;
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
}
@{deep} .el-drawer {
  .el-drawer__body {
    padding: 0 20px;
  }
}
@{deep} .el-dialog {
  .el-dialog__header {
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

  .el-dialog__body {
    padding-right: 30px;
  }
}

@{deep} .dialog-import {
  ul {
    max-height: 400px;
    overflow: auto;
    li {
      font-size: 16px;
      line-height: 50px;
    }
  }
}
</style>
