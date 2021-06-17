<template>
  <div class="purchaser-supplier">
    <!-- 查询 -->
    <el-card class="search-head">
      <el-form ref="formSearchRef" :model="formSearch" :inline="true">
        <el-form-item
          v-for="(item, index) in formOptions"
          :key="index"
          :prop="item.prop"
          :label="item.label ? item.label + '：' : ''"
        >
          <FormItem v-model="formSearch[item.prop]" :itemOptions="item" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="btnPeration({ type: 'search' })"
            size="medium"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 列表 -->
    <el-card style="min-height: 480px">
      <!-- 批量操作 -->
      <p class="batch-head">
        <el-button
          type="primary"
          size="medium"
          @click="btnBatchHandle('confirm')"
          >批量确认</el-button
        >
        <el-button
          type="primary"
          size="medium"
          @click="btnBatchHandle('refuse')"
          >批量拒绝</el-button
        >
      </p>

      <OrderList
        :tableData="listData"
        :tableLabel="listLabel"
        :listTotal="listTotal"
        @onPeration="btnPeration"
        @onSelectionChange="handleSelectionChange"
      >
      </OrderList>
    </el-card>
    <div class="common-pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="formSearch.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="formSearch.pageSize"
        layout="total,prev, pager, next,sizes,jumper"
        :total="listTotal"
      >
      </el-pagination>
    </div>
    <!-------------------- 抽屉---------------------------- -->
    <!--拒绝说明 -->
    <el-drawer :title="drawerTitle" :visible.sync="drawerRecordShow">
      <OrderList :tableData="recordData" :tableLabel="recordLabel"> </OrderList>
    </el-drawer>

    <!--编辑|确认|批量确认 -->
    <el-drawer :title="drawerTitle" :visible.sync="drawerShow">
      <OrderForms
        :formLabel="addFormLabel"
        :form="addForms"
        :rules="addFormsRules"
        @onCancel="drawerShow = false"
        @onConfirm="submitAddForms"
        @onChange="roleChange"
      >
      </OrderForms>
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
import FormItem from "@/components/FormItem";
import OrderForms from "@/views/buyer/components/orderForms";
import OrderList from "@/components/table/OrderList";
import {
  enterpriseList,
  enterpriseAll,
  enterpriseRecord,
  enterpriseCompany,
  companyRole,
  companyUsers,
  refuseList,
  batchConfirm,
  batchRefuse,
} from "@/api/customer";

export default {
  components: {
    FormItem,
    OrderForms,
    OrderList,
  },
  data() {
    return {
      checkAll: false,
      checkedCities: [],
      drawerTitle: "",
      drawerShow: false,
      abortReason: "",
      //拒绝
      drawerRefuseShow: false,
      supplierContactUserId: null,
      refuseList: [],
      refuseForms: {
        // reason: "", //拒绝原因
        // rejectType: "", //拒绝类型
        //ids: [], //供应商联系人id
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
      //查询
      formSearch: {
        page: 1,
        pageSize: 10,
        buyerCompanyName: "",
        supplierContactUserRealName: "",
        supplierPhone: "",
        status: "",
      },
      formOptions: [
        {
          label: "客户名称",
          prop: "buyerCompanyName",
          element: "el-input",
        },
        {
          label: "联系人",
          prop: "supplierContactUserRealName",
          element: "el-input",
        },
        {
          label: "手机号码",
          prop: "supplierPhone",
          element: "el-input",
          max: 11,
        },
        {
          label: "关联状态",
          prop: "status",
          element: "el-select",
          options: [
            { label: "全部", value: "" },
            { label: "未关联", value: "INIT" },
            { label: "已拒绝", value: "REFUSED" },
            { label: "已关联", value: "RELATED" },
            { label: "已解除关联", value: "ABROGATION" },
          ],
        },
      ],
      //拒绝记录
      drawerRecordShow: false,
      recordData: [],
      recordLabel: [
        {
          prop: "createdAt",
          label: "拒绝时间",
        },
        {
          prop: "creatorName",
          label: "拒绝人员",
        },
        {
          prop: "reason",
          label: "拒绝原因",
        },
      ],
      //列表
      listTotal: 0,
      listData: [],
      listLabel: [
        {
          prop: "selection",
          label: "",
          width: "55px",
        },
        {
          prop: "buyerCompanyName",
          label: "客户名称",
        },
        {
          prop: "supplierContactUserRealName",
          label: "指定员工",
        },
        {
          prop: "supplierPhone",
          label: "手机号",
        },
        {
          prop: "buyerDetailAddr",
          label: "客户地址",
        },
        {
          prop: "statusName",
          label: "关联状态",
        },
        {
          prop: "bnt",
          label: "操作",
        },
      ],
      //编辑|确认
      addForms: {},
      addFormsRules: {
        name: [{ required: true, message: "请选择员工角色", trigger: "blur" }],
        supplierContactUserRealName: [
          { required: true, message: "请选择指定员工", trigger: "blur" },
        ],
      },
      addFormLabel: [
        {
          label: "员工角色",
          model: "name",
          type: "select",
          opts: [],
        },
        {
          label: "选择员工",
          model: "supplierContactUserRealName",
          type: "select",
          disabled: false,
          opts: [],
        },
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    onCheckAll() {},
    //获取列表
    getList() {
      enterpriseList(this.formSearch).then(({ config, data, ...r }) => {
        if (data.code == 200) {
          let d = data.data;
          this.listData = d.content;
          this.listTotal = d.total;
          //生成按钮
          this.listData.forEach((val, index) => {
            this.reversedStatus(val, val.status);
          });
        }
      });
    },
    //勾选
    handleSelectionChange(e) {
      this.checkedCities = e;
    },
    //批量操作
    btnBatchHandle(type) {

      if (this.checkedCities.length == 0) {
        this.$message.warning("请勾选至少一项!");
        return false;
      }
      //批量确认
      if (type == "confirm") {
        this.addForms = {}; //清空值
        this.drawerShow = true;
        this.drawerTitle = "批量确认";
        this.addFormLabel[1].disabled = true;
        this.companyRole(); //获取员工角色
      }

      //批量拒绝
      if (type == "refuse") {
        this.refuseForms = {}; //清空值
        this.drawerRefuseShow = true;
        this.drawerTitle = "批量拒绝";
        this.getRefuseList();
        if (this.refuseFormLabel.length > 1)
          this.refuseFormLabel.splice(this.refuseFormLabel.length - 1, 1);
      }
    },

    //单操作
    btnPeration(d) {
  
      let { item, type } = d;
      //查询
      if (type == "search") this.getList();

      //编辑|确认
      if (type == "编辑" || type == "确认") {
        this.drawerShow = true;
        this.addForms = JSON.parse(JSON.stringify(item)); //赋值
        this.drawerTitle = type;
        this.addFormLabel[1].disabled = true;
        this.companyRole(); //获取员工角色
      }

      if (type == "拒绝") {
        this.drawerRefuseShow = true;
        this.drawerTitle = type;
        this.supplierContactUserId = item.id;
        this.getRefuseList();
        if (this.refuseFormLabel.length > 1)
          this.refuseFormLabel.splice(this.refuseFormLabel.length - 1, 1);
      }

      //拒绝说明
      if (type == "record") {
        this.drawerRecordShow = true;
        this.drawerTitle = "拒绝说明";
        this.enterpriseRecord(item.id);
      }
    },
    //拒绝说明
    enterpriseRecord(permissionId) {
      enterpriseRecord({ permissionId }).then(({ data: res }) => {
        if (res.code == 200) {
          this.recordData = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    //编辑|确认|批量确认
    submitAddForms() {
      let d = {
        ids: [], //批量id
        supplierContactUserId: this.addForms.supplierContactUserRealName, //员工id
      };
      if (this.drawerTitle == "批量确认") {
        this.checkedCities.forEach((item) => {
          d.ids.push(item.id);
        });
      } else {
        //确认|编辑
        d.ids = [this.addForms.id];
      }

      this.batchConfirm(d);
    },

    //批量确认-提交
    batchConfirm(d) {
      let _this = this;
      batchConfirm(d).then(({ data: res }) => {
        if (res.code == 200) {
          _this.getList(); //更新列表
          _this.addForms = {}; //清空值
          _this.drawerShow = false;
        }
      });
    },
    //角色选择
    roleChange(d) {
 
      let { e, name } = d;
      if (name == "员工角色") {
        this.companyUsers(e);
        this.addFormLabel[1].disabled = false;
      }
    },

    //获取员工列表
    companyUsers(roleId) {
      companyUsers({ roleId }).then(({ data: res }) => {
        if (res.code == 200) {
          let d = res.data;
          this.addFormLabel[1].opts = d.map((item) => {
            return {
              label: item["realName"],
              value: item["id"],
            };
          });

          //清空下选框上一个选择值
          if (this.addFormLabel[1].opts.length == 0) {
            this.addForms.supplierContactUserRealName = "";
          }
          if (this.drawerTitle == "编辑" || this.drawerTitle == "确认") {
            this.addForms.supplierContactUserRealName = "";
          }
        }
      });
    },
    //员工下拉列表
    enterpriseCompany() {
      enterpriseCompany().then(({ data: res }) => {
        if (res.code == 200) {
          let d = res.data;

          this.addFormLabel[3].opts = d.map((item) => {
            return {
              label: item["realName"],
              value: item["id"],
            };
          });
        }
      });
    },

    //获取员工角色
    companyRole() {
      companyRole().then(({ data: res }) => {
        if (res.code == 200) {
          let d = res.data.content;

          this.addFormLabel[0].opts = d.map((item) => {
            return {
              label: item["name"],
              value: item["id"],
            };
          });
        }
      });
    },
    //获取供应商列表
    enterpriseAll() {
      enterpriseAll().then(({ data: res }) => {
        if (res.code == 200) {
          let d = res.data;
          this.addFormLabel[0].opts = d.map((item) => {
            return {
              label: item["companyName"],
              value: item["companyId"],
            };
          });
        }
      });
    },

    //生成状态...
    reversedStatus(val, e) {
      //INIT-未关联 | REFUSED-已拒绝 | RELATED-已关联 | ABROGATION-已解除关联
      if (e == "INIT") {
        val.statusName = "未关联";
        val.bnt = ["确认", "拒绝"];
      }
      if (e == "RELATED") {
        val.statusName = "已关联";
        val.bnt = ["编辑"];
      }
      if (e == "REFUSED") {
        val.statusName = "已拒绝";
      }

      if (e == "ABROGATION") {
        val.statusName = "已解除关联";
      }
    },
    //批量拒绝|拒绝-验证
    submitRefuseForms() {
      let d = {};

      if (this.refuseForms.rejectReason != "OTHER") {
        this.refuseFormLabel[0].opts.find((item) => {
          if (item.value == this.refuseForms.rejectReason) {
            d = {
              reason: item.label,
              rejectReason: item.rejectType,
            };
          }
        });
      } else {
        d = this.refuseForms;
      }

      d.ids = [];
      if (this.drawerTitle == "批量拒绝") {
        this.checkedCities.forEach((item) => {
          d.ids.push(item.id);
        });
      }

      if (this.drawerTitle == "拒绝") d.ids = [this.supplierContactUserId];

  
      this.batchRefuse(d);
    },
    //批量拒绝-提交
    batchRefuse(d) {
      batchRefuse(d).then(({ data: res }) => {
        if (res.code == 200) {
          this.getList(); //更新列表
        } else {
          this.$message.error(res.message);
        }
        this.refuseForms = {}; //清空值
        this.drawerRefuseShow = false;
      });
    },

    //拒绝原因列表
    getRefuseList() {
      refuseList({ rejectType: "REJECT_USER_ENTERPRISE_LINK" }).then(
        ({ data: res }) => {
          if (res.code == 200) {
            let d = res.data;

            //赋给下拉框
            this.refuseFormLabel[0].opts = d.map((item, i) => {
              return {
                label: item["rejectReason"],
                value: item["id"],
                rejectType: item["rejectType"],
                //value: item["rejectType"] + "." + i,
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
  },
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.purchaser-supplier {
  .el-card {
    margin-bottom: 20px;
  }

  @{deep} .no-data {
    line-height: 480px;
  }

  .search-head {
    .el-card__body {
      padding: 15px;
    }
    .el-form-item {
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
  .batch-head {
    padding-bottom: 15px;
    text-align: right;
  }
}

@{deep} .el-drawer {
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
</style>
