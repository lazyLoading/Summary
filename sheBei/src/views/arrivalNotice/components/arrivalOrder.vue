<template>
  <div class="drawer_container">
    <div class="drawer_header">
      <el-form label-width="110px" :inline="true">
        <el-form-item label="到货通知单号：">
          <el-input
              v-model="searchParams.requirementCode"
              prefix-icon="el-icon-search"
              placeholder="请输入关键字搜索"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户名称：">
          <el-input
              v-model="searchParams.purchaserCompanyName"
              prefix-icon="el-icon-search"
              placeholder="请输入关键字搜索"
          ></el-input>
        </el-form-item>
        <el-form-item label="接收时间：">
          <el-date-picker
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              class="inputWidth"
              v-model="deliveredTime"
              type="datetimerange"
              change="datachange"
              :picker-options="pickerOptions"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="timeChange()"
              align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="状态：">
          <el-input
              v-model="searchParams.status"
              prefix-icon="el-icon-search"
              placeholder="请输入关键字搜索"
          ></el-input>
        </el-form-item>
        <div class="header_btn_search">
          <el-button
              type="primary"
          >查询</el-button>
          <el-button
              type="primary"
          >重置</el-button>
        </div>
      </el-form>
    </div>
    <div class="drawer_body">
      <div class="body_left">
        <el-table
            :border="true"
            :data="pageInfo.records"
            highlight-current-row
            @current-change="handleChange"
            :header-cell-style="{background:'#f3f3f5',color:'#65727e'}"
            style="width: 100%">
          <el-table-column
              prop="purchaseCode"
              label="到货通知单号">
          </el-table-column>
          <el-table-column
              prop="receivedAt"
              label="接收时间">
          </el-table-column>
          <el-table-column
              prop="deliveredAt"
              label="交货日期">
          </el-table-column>
          <el-table-column
              prop="purchaserCompanyName"
              label="客户名称">
          </el-table-column>
        </el-table>
        <div class="table_pagination">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="searchParams.page"
              background
              prev-text="上一页 "
              next-text="下一页 "
              :page-sizes="[10, 20, 50, 100]"
              :page-size="searchParams.pageSize"
              layout="total,prev, pager, next,sizes,jumper"
              :total="pageInfo.total"
          ></el-pagination>
        </div>
      </div>
      <div style="width: 20px"></div>
      <div class="body_right">
        <el-table
            :border="true"
            :data="tableData"
            :header-cell-style="{background:'#f3f3f5',color:'#65727e'}"
            style="width: 100%">
          <el-table-column
              prop="materialCode"
              label="物料编号">
          </el-table-column>
          <el-table-column
              prop="materialName"
              label="物料名称">
          </el-table-column>
          <el-table-column
              prop="specification"
              label="规格/型号">
          </el-table-column>
          <el-table-column
              prop="orderingNumber"
              label="订货数量">
          </el-table-column>
          <el-table-column
              prop="receiveNumber"
              label="送货数量">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="drawer_footer">
      <el-button plain @click="handleConfirm(0)">取消</el-button>
      <el-button type="primary" @click="handleConfirm(1)">确认</el-button>
    </div>
  </div>
</template>

<script>
import { windowHeight } from "@/utils/setSize.js";
import { getList } from '@/api/arrivalNotice'
import { mapActions } from 'vuex'
export default {
  computed: {},
  data() {
    return {
      cardHeight: windowHeight,
      total: 0,
      pageInfo: {},
      activedItem: {},
      deliveredTime: [],
      searchParams: {
        requirementCode: '',
        purchaserCompanyName: '',
        receivedAtStart: '',
        receivedAtEnd: '',
        status: '',
        page: 1,
        pageSize: 10
      },
      currentRow: null,
      tableData: [
        {}
      ],
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
    this.getList()
  },
  methods: {
    ...mapActions({
      handleList: 'selectedList/handleAList',
    }),
    timeChange() {
      this.searchParams.receivedAtStart =  this.deliveredTime ? this.deliveredTime[0] : ''
      this.searchParams.receivedAtEnd =  this.deliveredTime ? this.deliveredTime[1] : ''
    },
    handleChange (val) {
      this.currentRow = val;
      this.activedItem = val
      this.tableData = val.materialList
    },
    handleConfirm (index) {
      if (index === 1) {
        this.handleList(this.activedItem)
      }
      this.$emit('closeDialog', 'dhtzd')
    },
    // 分页
    handleSizeChange(val) {
      this.searchParams.pageSize = val
      this.getList()
    },
    // 分页
    handleCurrentChange(val) {
      this.searchParams.page = val
      this.getList()
    },
    getList () {
      getList(this.searchParams).then(res => {
        this.pageInfo = res.data.data
      }).catch(err => {
        console.log(err)
      }).finally()
    }
  },
};
</script>

<style lang="less" type="text/less" scoped>
@import '../../../less/base.less';
@{deep} .el-drawer{
  border-bottom-left-radius: 20px;
  border-top-left-radius: 20px;
}
.drawer_container {
  width: 100%;
  height: 100%;
  padding: 0 20px 20px 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .drawer_header{
    width: 100%;
    padding: 20px 0 0 20px;
    background-color: @white;
    box-shadow: 0px 6px 18px 0px
    rgba(199, 209, 219, 0.35);
    border-radius: 10px;
    border: solid 1px #f0f2f4;
    @{deep} .el-form-item{
      margin-right: 20px;
      width: calc(25% - 20px );
      .el-form-item__content{
        width: calc(100% - 100px );
      }
      .el-date-editor.el-input, .el-date-editor.el-input__inner{
        width: 100%;
      }
    }

    .header_btn_search{
      float: right;
      padding-right: 20px;
      @{deep} .el-button{
        width: 100px;
      }
      @{deep} .el-button+.el-button{
        margin-left: 20px;
      }
    }
  }
  .drawer_body{
    margin-top: 20px;
    flex: 1;
    width: 100%;
    padding: 20px 20px 0 20px;
    background-color: @white;
    box-shadow: 0px 6px 18px 0px
    rgba(199, 209, 219, 0.35);
    border-radius: 10px;
    border: solid 1px #f0f2f4;
    display: flex;
    flex-direction: row;
    @{deep} .el-table{
      height: calc(100% - 60px);
    }
    .body_left, .body_right{
      flex: 1;
      .table_pagination{
        margin-top: 10px;
        width: 100%;
      }
    }
  }
  .drawer_footer{
    margin-top: 20px;
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
