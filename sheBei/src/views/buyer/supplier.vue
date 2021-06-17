<template>
  <div class="purchaser-supplier" :style="{ height: cardHeight }">
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
          <FormItem v-model="formSearch[item.prop]" :itemOptions="item" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="btnPeration({ type: 'search' })"
            size="medium"
            >查询</el-button
          >
          <el-button
            type="primary"
            @click="btnPeration({ type: 'add' })"
            size="medium"
            >添加</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 列表 -->
    <el-card style="min-height:480px">
      <OrderList
        :tableData="listData"
        :tableLabel="listLabel"
        :listTotal="listTotal"
        @onPeration="btnPeration"
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
    <!--新增|编辑 -->
    <el-drawer :title="drawerTitle" :visible.sync="drawerShow">
      <OrderForms
        :formLabel="addFormLabel"
        :form="addForms"
        :rules="addFormsRules"
        @onCancel="drawerShow = false"
        @onConfirm="submitAddForms"
      >
      </OrderForms>
    </el-drawer>

    <!--拒绝说明 -->
    <el-drawer :title="drawerTitle" :visible.sync="drawerRecordShow">
      <OrderList :tableData="recordData" :tableLabel="recordLabel"> </OrderList>
    </el-drawer>
  </div>
</template>

<script>
import { windowHeight } from "@/utils/setSize.js";
import FormItem from "@/components/FormItem";
import OrderForms from "@/views/buyer/components/orderForms";
import OrderList from "@/components/table/OrderList";
import {
  enterpriseList,
  enterpriseAll,
  enterpriseAdd,
  enterpriseUpdate,
  enterpriseDel,
  enterpriseRecord,
  enterpriseCompany,
} from "@/api/customer";

export default {
  components: {
    FormItem,
    OrderForms,
    OrderList,
  },
  data() {
    return {
      cardHeight: windowHeight,
      drawerTitle: "",
      drawerShow: false,
      drawerRecordShow: false,

      //查询
      formSearch: {
        page: 1,
        pageSize: 10,
        supplierCompanyName: "",
        buyerContactUserRealName: "",
        buyerPhone: "",
        status: "",
      },
      formOptions: [
        {
          label: "供应商名称",
          prop: "supplierCompanyName",
          element: "el-input",
          max: 20,
        },
        {
          label: "指定员工",
          prop: "buyerContactUserRealName",
          element: "el-input",
        },
        {
          label: "手机号码",
          prop: "buyerPhone",
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
      //拒绝说明
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
      listData: [
        // {
        //   supplierContactUserRealName: "",
        //   supplierCompanyAlias: "",
        //   supplierDetailAddr: "",
        //   avgDeliverTime: "",
        //   buyerContactUserRealName: "",
        //   buyerPhone: "",
        //   isEnable: "",
        //   status: "",
        // },
      ],
      listLabel: [
        {
          prop: "supplierCompanyName",
          label: "供应商名称",
        },
        {
          prop: "supplierCompanyAlias",
          label: "供应商编码",
        },
        {
          prop: "supplierDetailAddr",
          label: "供应商地址",
        },
        {
          prop: "avgDeliverTime",
          label: "运输周期(天)",
        },
        {
          prop: "buyerContactUserRealName",
          label: "指定员工",
        },
        {
          prop: "buyerPhone",
          label: "手机号",
        },
        {
          prop: "isEnableName",
          label: "有效标识",
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
      //新增|编辑
      addForms: {
        supplierCompanyId: "", //供应商公司ID
        supplierCompanyAlias: "", //供应商编码
        avgDeliverTime: "", //运输时间
        buyerContactUserId: "", //采购商联系人ID
      },
      addFormsRules: {
        supplierCompanyId: [
          { required: true, message: "请输入供应商名称", trigger: "blur" },
        ],
        buyerContactUserId: [
          { required: true, message: "请选择指定员工", trigger: "blur" },
        ],
      },

      addFormLabel: [
        {
          label: "供应商名称",
          model: "supplierCompanyId",
          type: "select",
          disabled: false,
          opts: [],
        },
        {
          label: "供应商编码",
          model: "supplierCompanyAlias",
          max: 20,
        },
        {
          model: "avgDeliverTime",
          label: "运输周期(天)",
          type: "number",
        },
        {
          label: "指定员工",
          model: "buyerContactUserId",
          type: "select",
          opts: [],
        },
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
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

    //操作
    btnPeration(d) {
      
      let { item, type } = d;
      //查询
      if (type == "search") this.getList();

      //添加
      if (type == "add") {
        this.drawerShow = true;
        this.addForms = {};
        this.drawerTitle = "添加供应商";
        this.addFormLabel[0].disabled = false;
        //获取供应商列表
        this.enterpriseAll();
        //获取员工列表
        this.enterpriseCompany();
      }
      //编辑
      if (type == "编辑") {
        this.drawerShow = true;
        // this.addForms = item; //赋值
        this.addForms = Object.assign({}, item);
        this.drawerTitle = type + "供应商";
        this.addFormLabel[0].disabled = true;
        //获取供应商列表
        this.enterpriseAll();
        //获取员工列表
        this.enterpriseCompany();
      }
      let _this = this;
      if (type == "重新添加") {
        this.$confirm("是否确认重新添加？", type, {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            _this.addForms = Object.assign({}, item);
            _this.addForms.status = "INIT";
            _this.enterpriseAdd();
          })
          .catch(() => {});
      }

      if (type == "删除") {
        this.$confirm("是否确认删除？", type, {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            _this.enterpriseDel(item.id);
          })
          .catch(() => {});
      }

      if (type == "禁用" || type == "启用") {
        _this.addForms = Object.assign({}, item); //赋值
        _this.addForms.isEnable = !item.isEnable;
     
        this.openMessageBox(`是否${type}该供应商关联？`, type);
      }

      //拒绝原因
      if (type == "record") {
        this.drawerRecordShow = true;
        this.drawerTitle = "拒绝说明";
        this.enterpriseRecord(item.id);
      }
    },
    //启用|禁用-询问弹框
    openMessageBox(text, title) {
      let _this = this;
      this.$confirm(text, title, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          _this.enterpriseUpdate();
        })
        .catch(() => {});
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
    //提交
    submitAddForms(e) {
      if (
        this.addForms.avgDeliverTime != "" &&
        this.addForms.avgDeliverTime == 0
      ) {
        this.$message.error("运输周期天数不能为0");
        return false;
      }

    
      if (this.drawerTitle == "添加供应商") this.enterpriseAdd();
      if (this.drawerTitle == "编辑供应商") this.enterpriseUpdate();
    },
    //添加|重新添加
    enterpriseAdd() {
      //删除赋加字段
      delete this.addForms.bnt;
      delete this.addForms.statusName;
      delete this.addForms.isEnableName;
      this.addForms.status = "INIT";
      enterpriseAdd(this.addForms).then(({ data: res }) => {
        if (res.code == 200) {
          this.$message.success("添加成功!");
          this.getList(); //更新列表
          this.addForms = {}; //清空值
          this.drawerShow = false; //关闭弹框
        } else {
          this.$message.error(res.message);
        }
      });
    },
    //编辑|启用|禁用
    enterpriseUpdate() {
      //删除赋加字段
      delete this.addForms.bnt;
      delete this.addForms.statusName;
      delete this.addForms.isEnableName;
      let d = { id: this.addForms.id, saveDTO: this.addForms };
      enterpriseUpdate(d).then(({ data: res }) => {
        if (res.code == 200) {
          this.getList(); //更新列表
          this.addForms = {}; //清空值
          this.drawerShow = false; //关闭弹框
        } else {
          this.$message.error(res.message);
        }
      });
    },
    //删除
    enterpriseDel(id) {
      enterpriseDel({ id }).then(({ data: res }) => {
        if (res.code == 200) {
          this.getList(); //更新列表
          this.addForms = {}; //清空值
        } else {
          this.$message.error(res.message);
        }
      });
    },

    //生成状态...
    reversedStatus(val, e) {
      //标识
      val.isEnableName = val.isEnable ? "启用" : "禁用";
      //INIT-未关联 | REFUSED-已拒绝 | RELATED-已关联 | ABROGATION-已解除关联
      if (e == "INIT") val.statusName = "未关联";
      if (e == "REFUSED") val.statusName = "已拒绝";
      if (e == "RELATED") val.statusName = "已关联";
      if (e == "ABROGATION") val.statusName = "已解除关联";
      //按钮显示
      if (val.isEnable && e == "INIT") val.bnt = ["删除"]; //启用-未关联
      if (val.isEnable && e == "RELATED") val.bnt = ["编辑", "禁用"]; //启用-已关联
      if (val.isEnable && e == "REFUSED") val.bnt = ["重新添加"]; //启用-已拒绝
      if (!val.isEnable && e == "RELATED") val.bnt = ["启用"]; //禁用-已关联
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
        } else {
          this.$message.error(res.message);
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
  },
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.purchaser-supplier {
  .el-card {
    margin-bottom: 20px;
  }
  @{deep}.search-head {
    .el-card__body {
      padding: 10px 15px;
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

 @{deep} .no-data {
    line-height: 480px;
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
    padding: 0 20px;
  }
}
</style>
