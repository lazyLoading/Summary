<template>
  <div class="page_container" :style="{ height: cardHeight }">
    <div class="page_title">
      <div class="header_rectangle"></div>
      <div class="m-l-10">新增对账</div>
    </div>
    <div class="page_header">
      <div class="header_title">申请对账单号</div>
      <el-form :inline="true">
        <el-form-item label="客户名称：">
          <el-select v-model="value" filterable placeholder="请选择">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="对账起止时间段：">
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
      </el-form>
    </div>
    <div class="page_body">
      <div class="body_title">
        <div class="flex">申请对账物料信息</div>
        <el-button type="primary">选择发货单</el-button>
        <el-button type="primary">选择退货单</el-button>
      </div>
      <el-table
          :data="tableData"
          :header-cell-style="{background:'#f3f3f5',color:'#65727e'}"
          style="width: 100%">
        <el-table-column
            prop="date"
            label="序号">
        </el-table-column>
        <el-table-column
            prop="date"
            label="发货单号">
        </el-table-column>
        <el-table-column
            prop="date"
            label="退货单号">
        </el-table-column>
        <el-table-column
            prop="name"
            label="物料编号">
        </el-table-column>
        <el-table-column
            prop="address"
            label="物料名称">
        </el-table-column>
        <el-table-column
            prop="address"
            label="规格/型号">
        </el-table-column>
        <el-table-column
            prop="address"
            label="单位">
        </el-table-column>
        <el-table-column
            prop="address"
            label="单价">
        </el-table-column>
        <el-table-column
            prop="address"
            label="实收合格数量">
        </el-table-column>
        <el-table-column
            prop="address"
            label="拒收数量">
        </el-table-column>
        <el-table-column
            prop="address"
            label="退货数量">
        </el-table-column>
        <el-table-column
            prop="address"
            label="备注">
        </el-table-column>
      </el-table>
    </div>
    <div class="page_header">
      <div class="header_title">填写对账信息</div>
      <el-form :inline="true">
        <el-form-item label="申请对账金额：">
          <el-input
              v-model="searchParams.orderNo"
              class="inputWidth"
              prefix-icon="el-icon-search"
              placeholder="请输入关键字搜索"
          ></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="11">
            <el-form-item label="对账说明：">
              <el-input type="textarea" v-model.trim="form"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="page_footer">
      <el-button plain>取消</el-button>
      <el-button type="primary">保存</el-button>
    </div>
    <el-drawer
        :title="drawerTitle"
        :visible.sync="showDrawer"
        size="85%"
        direction="rtl">
      <selectOrder></selectOrder>
    </el-drawer>
  </div>
</template>

<script>
import { windowHeight } from "@/utils/setSize.js";
import selectOrder from "@views/dispatchBill/components/selectOrder";
export default {
  computed: {},
  data() {
    return {
      cardHeight: windowHeight,
      showDrawer: false, // 是否弹出抽屉
      drawerTitle: '', // 抽屉标题
      searchParams: {
        orderNo: ''
      },
      tableData: [
        {}
      ]
    };
  },
  components: {
    selectOrder
  },
  created() {

  },
  methods: {
    // 编辑物料
    handleEdit () {

    },
    // 操作抽屉
    handleDrawer () {
      this.showDrawer = true
      this.drawerTitle = '选择采购订单'
    }
  },
};
</script>

<style lang="less" type="text/less" scoped>
@import '../../less/base.less';
@{deep} .el-form-item{
  margin-right: 20px;
}
@{deep} .el-drawer{
  border-bottom-left-radius: 20px;
  border-top-left-radius: 20px;
}
.page_container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  .page_title{
    width: 100%;
    font-size: 16px;
    color: #122332;
    display: flex;
    flex-direction: row;
    align-items: center;
    .header_rectangle{
      width: 3px;
      height: 16px;
      background-color: @blue;
      border-radius: 2px;
    }
  }
  .page_header{
    margin-top: 20px;
    width: 100%;
    padding: 20px 20px 0 20px;
    background-color: @white;
    box-shadow: 0px 6px 18px 0px
    rgba(199, 209, 219, 0.35);
    border-radius: 10px;
    border: solid 1px #f0f2f4;
    .header_title{
      font-size: 16px;
      color: @black_title;
      margin-bottom: 20px;
    }
    .downBtn{
      padding: 0 12px;
      width: 265px;
      height: 40px;
      border-radius: 4px;
      border: solid 1px #e6eaee;
      display: flex;
      flex-direction: row;
      align-items: center;
      color: @gray_text;
    }
  }
  .page_body{
    margin-top: 20px;
    width: 100%;
    min-height: 400px;
    padding: 20px 20px 0 20px;
    background-color: @white;
    box-shadow: 0px 6px 18px 0px
    rgba(199, 209, 219, 0.35);
    border-radius: 10px;
    border: solid 1px #f0f2f4;
    .body_title{
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 16px;
      color: @black_title;
      margin-bottom: 20px;
      @{deep} .el-button{
        width: 140px;
      }
    }
    @{deep} .el-table{
      height: calc(100% - 80px);
    }
  }
  .page_footer{
    margin-top: 10px;
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
</style>
