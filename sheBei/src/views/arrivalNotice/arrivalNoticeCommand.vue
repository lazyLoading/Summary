<template>
  <div class="statementquery">
    <el-card class="searchCard">
      <div style="margin-top: 10px; width: 100%">
        <el-form label-width="110px" :inline="true" class="demo-form-inline">
          <el-form-item class="formRight" label="到货通知单号：">
            <el-input
                v-model="searchParams.requirementCode"
                class="inputWidth"
                placeholder="请输入到货通知单号"
            ></el-input>
          </el-form-item>
          <el-form-item class="formRight" label="供应商名称：">
            <el-select
            v-model="searchParams.supplierCompanyId"
            placeholder="请选择供应商名称"
            filterable
            >
            <el-option
                v-for="item in list"
                :key="item.companyId"
                :label="item.companyName"
                :value="item.companyId"
            >
            </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="formRight" label="下达时间：">
            <div class="block">
              <el-date-picker
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  class="inputWidth"
                  v-model="receivedTimeValue"
                  type="datetimerange"
                  change="datachange"
                  :picker-options="pickerOptions"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="timeChange('issuedAt')"
                  align="right"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item class="formRight" label="采购订单号：">
            <el-input
                v-model="searchParams.purchaseCode"
                class="inputWidth"
                placeholder="请输入采购订单号"
            ></el-input>
          </el-form-item>
          <el-form-item class="formRight" label="状态：">
            <el-select v-model="searchParams.status" filterable placeholder="请选择">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="formRight" label="交货时间：">
            <div class="block">
              <el-date-picker
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  class="inputWidth"
                  v-model="comfirmTimeValue"
                  type="datetimerange"
                  change="datachange"
                  :picker-options="pickerOptions"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="timeChange('deliveredAt')"
                  align="right"
              ></el-date-picker>
            </div>
          </el-form-item>
          <div class="btn">
            <el-button
                type="primary"
                style="margin-left: 10px;width: 100px"
                @click="handleSearch"
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
    <el-card class="contentCard">
      <div class="view_operation">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选/全不选</el-checkbox>
        <div class="flex"></div>
        <el-button type="primary" @click="handleCreate">新增到货通知单</el-button>
        <el-button type="primary" @click="handleConfirmBatch">批量下发</el-button>
        <el-button type="primary" @click="showDialog('alldelete', '')">批量删除</el-button>
        <el-button type="primary" @click="handleDownLoad()">下载模板</el-button>
        <el-upload
            name="uploadFile"
            :action="expRImport"
            :headers="headers"
            :file-list="fileList"
            :show-file-list="false"
            :on-success="handleSuccess"
            :on-change="handleChange1">
          <el-button class="margin-10" size="primary" type="primary">导入到货通知单</el-button >
        </el-upload>
        <!--      <el-button type="primary" @click="exportExcel()">导入到货通知单</el-button>-->
        <el-button type="primary" @click="handlePrint">打印</el-button>
      </div>
      <div class="tableMainQin">
        <el-checkbox-group v-model="checkedCities" @change="handleChange">
          <el-collapse>
            <el-collapse-item v-for="(item, i) in pageInfo.records" :key="i">
              <template slot="title">
                <el-checkbox class="m-l-10" :label="item.id"></el-checkbox>
                <div class="orderNumber">
                  <div class="titleContentleft">
                    <div class="titleContent">
                      <div>
                        <span>到货通知单号：</span>
                        <span>{{ item.requirementCode }}</span>
                      </div>
                      <div class="clickOrder" @click.stop="clickOrder(item)">
                        <span>采购订单号：</span>
                        <span>{{ item.purchaseCode }}</span>
                      </div>
                      <div>
                        <span>下达时间：</span>
                        <span>{{ item.issuedAt }}</span>
                      </div>
                      <div>
                        <span>交货日期：</span>
                        <span>{{ item.deliveredAt }}</span>
                      </div>
                      <div>
                        <span>供应商名称：</span>
                        <span>{{ item.supplierCompanyName }}</span>
                      </div>
                    </div>
                    <div class="titleContent">
                      <div>
                        <span>收货联系人：</span>
                        <span>{{ item.receiveUserName }}</span>
                      </div>
                      <div>
                        <span>到货地址：</span>
                        <span>{{ item.deliveryAddress }}</span>
                      </div>
                      <div>
                        <span>到货日期：</span>
                        <span>{{ item.requirementAt }}</span>
                      </div>
                      <div v-if="item.status === 2 || item.status === 3">
                        <span>{{item.status === 2 ? '确认日期：' : '拒绝原因：'}}</span>
                        <span>{{ item.status === 2 ? item.confirmedAt : item.refuseReason }}</span>
                      </div>
                      <div v-if="item.status === 2 || item.status === 3">
                        <span>{{item.status === 2 ? '确认人：' : '拒绝人：'}}</span>
                        <span>{{item.status === 2 ? item.confirmedOperatorName : item.refusedOperatorName }}</span>
                      </div>
                      <div v-if="item.status === 3">
                        <span>拒绝日期：</span>
                        <span>{{ item.refusedAt }}</span>
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
                      sortable
                      align="center"
                      type="index"
                      label="序号"
                      width="100"
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
                      prop="arrivalNumber"
                      label="到货数量"
                      min-width="1"
                  ></el-table-column>
                  <el-table-column
                      sortable
                      prop="unit"
                      label="单位"
                      min-width="1"
                  ></el-table-column>
                  <el-table-column
                      sortable
                      show-overflow-tooltip
                      prop="remark"
                      label="备注"
                      min-width="3"
                  ></el-table-column>
                </el-table>
                <div v-if="item.status === 0" class="w-full text-right m-t-20">
                  <el-button type="primary" @click="handleDispatch(item)">下发</el-button>
                  <el-button type="primary" @click="handleEdit(item)">编辑</el-button>
                  <el-button type="primary" @click="showDialog('delete', item.id)">删除</el-button>
                </div>
                <div v-if="item.status === 1" class="w-full text-right m-t-20">
                  <el-button type="primary" @click="handleBack(item)">撤回</el-button>
                </div>
                <div v-if="item.status === 3" class="w-full text-right m-t-20">
                  <el-button type="primary" @click="handleDispatch(item)">下发</el-button>
                  <el-button type="primary" @click="handleEdit(item)">编辑</el-button>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-checkbox-group>
        <div class="none" v-show="pageInfo.records.length < 1" style="">暂无数据</div>
      </div>
    </el-card>
     <div class="pageBottom">
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
    <el-dialog title="拒绝" width="430px" :visible.sync="dialogTableVisible">
      <div class="dialog_container">
        <el-form label-width="90px" label-position="left">
          <el-form-item label="拒绝原因：">
            <el-select v-model="refuseReason" filterable placeholder="请选择">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="dialog_footer">
          <el-button plain @click="cancelRefuse">取消</el-button>
          <el-button type="primary" @click="handleRefuseTwo">确认</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="确认" width="430px" :visible.sync="dialogVisible">
      <div class="dialog_container">
        <div class="flex-row items-center justify-center w-full">
          <el-image
              :src="require('@/assets/images/icon_affirm.png')"
              fit="fill"></el-image>
          <div class="m-l-15 f-s-16">{{dialogType === 0? '到货通知单下发成功!' : dialogType === 1? '到货通知单撤回成功!' : '到货通知单删除成功!'}}</div>
        </div>
        <div class="dialog_footer">
          <el-button type="primary" @click="dialogVisible = false">确认</el-button>
        </div>
      </div>
    </el-dialog>
  <el-dialog
      class="myTable"
      :show-close="false"
      :center="true"
      :visible.sync="dialogVisible2"
    >
      <div style="position: relative">
        <div id="subOutputRank-print0">
          <div class="table_container0"  v-for="(item, index) in targetList"
            :key="index">
        <div class="table_title0 font-green">到货通知单</div >
    <table border="1" class="f-s-12 font-green" style="border-collapse: collapse;">
    <tr class="padding-10 border-color">
      <td colspan="7">
        <div class="padding-10">
      <div class="d-F">
        <div class="flex1 line-h-20">
          <span>采购订单号：</span>
          <span class="font-grey">{{ item.purchaseCode }}</span >
        </div >
        <div class="flex1 line-h-20">
          <span>到货通知单号:</span>
          <span class="font-grey">{{ item.requirementCode }}</span >
        </div >
      </div >
      <div class="d-F">
        <div class="flex1 line-h-20">
          <span>客户名称：</span>
          <span class="font-grey">{{ item.purchaserCompanyName }}</span >
        </div >
        <div class="flex1 line-h-20">
          <span>联系人：</span>
          <span class="font-grey">{{ item.receiveUserName }}</span >
        </div >
      </div >
      <div class="d-F">
        <div class="flex1 line-h-20">
          <span>到货地址：</span>
          <span class="font-grey">{{ item.deliveryAddress }}</span >
        </div >
        <div class="flex1 line-h-20">
          <span>联系方式：</span>
          <span class="font-grey">{{ item.linkmanPhone }}</span >
        </div >
      </div >
      <div class="d-F">
        <div class="flex1 line-h-20">
          <span>到货日期：</span>
          <span class="font-grey">{{ item.requirementAt }}</span >
        </div >
      </div >
      </div >
      </td>
    </tr  >
    <tr class="align-c">
      <td class='width-10'>序号</td >
      <td  class='width-15'>物料编号</td >
      <td  class='width-15'>物料名称</td >
      <td  class='width-15'>规格/型号</td >
      <td  class='width-15'>单位</td >
      <td  class='width-15'>到货数量</td >
      <td  class='width-15'>备注</td >
    </tr>
    <tr style="height:18px" v-show="item.materialList.length<1">
      <td colspan="7"></td >
    </tr >
    <tr class="align-c"  v-for="(eitem, eindex) in item.materialList" :key="eindex + '_1'">
      <td class='width-10 font-grey'>{{ eindex + 1 }}</td >
      <td  class='width-15 font-grey'>{{ eitem.materialCode }}</td >
      <td  class='width-15 font-grey'>{{ eitem.materialName }}</td >
      <td  class='width-15 font-grey'>{{ eitem.specification }}</td >
      <td  class='width-15 font-grey'>{{ eitem.unit }}</td >
      <td  class='width-15 font-grey'>{{ eitem.yieldRate }}</td >
      <td  class='width-15 font-grey'>{{ eitem.remark }}</td >
    </tr >
    <tr>
      <td style="height:60px" class="min-h-60" colspan='5'>
        <div class="padding-10">
        <div>
          <span>备注:</span>
          <span class="font-grey">{{ item.creatorName }}</span >
        </div>
        </div >
      </td   >
       <td class="min-h-60" colspan='2'>
       <div class="padding-10">
        <div>
          <span>下达日期：</span>
          <span class="font-grey">{{item.issuedAt}}</span >
        </div>
        </div >
      </td  >
    </tr>
     </table>
     </div >
        </div>
        <div class="table_footer0">
          <el-button plain @click="dialogVisible2 = false">取消</el-button>
          <el-button type="primary" @click="printBtn">打印</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="删除确认" width="430px" :visible.sync="dialogVisible3">
      <div class="dialog_container">
        <div class="flex-row items-center justify-center w-full">
          <el-image
              :src="require('@/assets/images/icon_delete.png')"
              fit="fill"></el-image>
          <div class="m-l-15 f-s-16">是否确认删除!</div>
        </div>
        <div class="dialog_footer">
          <el-button type="primary" plain @click="dialogVisible3 = false">取消</el-button>
          <el-button type="primary" @click="handleDelete">确认</el-button>
        </div>
      </div>
    </el-dialog >
    <el-drawer
        :title="type === 'create' ? '新增到货通知单' : '编辑到货通知单'"
        :visible.sync="showDrawer"
        size="85%"
        class="drawer-box"
        @close="closeDrawer"
        direction="rtl">
      <template slot="title">
        <div class="drawer-title">
          <strong>{{type === 'create' ? '新增到货通知单' : '编辑到货通知单'}}</strong>
        </div>
      </template>
      <operatorBill v-if="showDrawer" @closeCreate="closeCreate"></operatorBill>
    </el-drawer>
    <!-- 订单详情 -->
    <el-drawer class="drawer-box" :visible.sync="drawerShowDetail" size="90%">
      <template slot="title">
        <div class="drawer-title">
          <strong>订单详情</strong>
          <el-tag v-if="statusName" :type="statusTag">{{ statusName }}</el-tag>
        </div>
      </template>
      <OrderDetail :detailData="detailData"></OrderDetail>
    </el-drawer>
    <!-- 导入错误提示 -->
    <el-dialog
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
import { windowHeight } from "@/utils/setSize.js";
import {getList, updateItem, getDown, getRCheckStatus} from '@/api/arrivalNotice'
import {expRImport, purchaseRelated} from "@/api/order.js";
import operatorBill from "@views/arrivalNotice/components/operatorBill.vue";
import {mapActions} from "vuex";
import OrderDetail from "@views/buyer/components/orderDetail";
import orderDtailsMixin from '@/assets/mixins/orderDtails'
export default {
  mixins:[orderDtailsMixin],
  data() {
    return {
      expRImport,
      fileList: [],
      dialogImport: false,
      drawerShowDetail: false,
      statusName: '',
      checkedCities: [],
      targetList: [],
      dialogType: 0,
      refuseId: 0,
      type: 'create',
      showDrawer: false,
      dialogVisible3: false,
      refuseType: 0,
      refuseReason: '',
      dialogTableVisible: false,
      isIndeterminate: false,
      checkAll: false,
      dialogVisible: false,
      dialogVisible2: false,
      cardHeight: windowHeight,
      searchParams: {
        requirementCode: '',
        purchaseCode: '',
        supplierCompanyId: '',
        issuedAtStart: '',
        issuedAtEnd: '',
        deliveredAtStart: '',
        deliveredAtEnd: '',
        status: '',
        page: 1,
        pageSize: 10,
      },
      list: [],
      tableList: [],
      importList: [],
      pageInfo: {},
      pageNum: 1,
      pageSize: 10,
      total: 100,
      startTime: "",
      endTime: "",
      comfirmTimeValue: [],
      receivedTimeValue: [],
      options: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '待下发',
          value: '0'
        },
        {
          label: '待确认',
          value: '1'
        },
        {
          label: '已确认',
          value: '2'
        },
        {
          label: '已拒绝',
          value: '3'
        }
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
    this.getMenuList()
    this.purchaseRelated()
  },
  components: {
    operatorBill,
    OrderDetail
  },
  computed: {
    headers() {
      let token = localStorage.getItem("jwt-token");
      let types = localStorage.getItem("types");
      let direction='';
      if(types=='procurement') direction='buyer'
      else direction='supplier'
      let d = { direction, "jwt-token": token };
      return d;
    }
  },
  methods: {
    ...mapActions({
      handleEditList: 'selectedList/handleEditList',
      handlePageType: 'selectedList/handlePageType',
      handlePList: 'selectedList/handlePList',
      handleAList: 'selectedList/handleAList',
    }),
    // 按钮状态校验
    getCheckStatus (type, event) {
      const _self = this
      getRCheckStatus ({id: event.id, currentStatus: event.status}).then(res => {
        if (res.data.code === 200) {
          if (type === 'xf') {
            _self.handleDispatch2(event)
          } else if (type === 'ch') {
            _self.handleBack2(event)
          } else if (type === 'delete') {
            _self.handleDelete2()
          }
        } else {
          _self.$message({
            showClose: true,
            message: res.data.message,
            type: 'warning'
          });
          return false
        }
      }).catch(err => {
        _self.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        });
        return false
      })
    },
    //供应商列表
    purchaseRelated() {
      purchaseRelated({ companyName: this.companyName }).then(
          ({ data: res }) => {
            if (res.code == 200) this.list = res.data;
          }
      );
    },
    cancelRefuse () {
      this.refuseReason = ''
      this.reason = ''
      this.dialogTableVisible = false
    },
    // 编辑到货通知单
    handleEdit (event) {
      this.type = 'edit'
      this.handlePageType('edit')
      this.handleEditList(event)
      this.showDrawer = true
    },
    // 新增到货通知单
    handleCreate () {
      this.type = 'create'
      this.handlePageType('create')
      this.showDrawer = true
    },
    // 关闭新增 或 编辑 页面
    closeCreate () {
      this.showDrawer = false
      this.getMenuList()
    },
    closeDrawer () {
      this.handlePList({})
      this.handleAList({})
    },
    //导入改变
    handleChange1(file, fileList) {
      this.fileList = fileList.slice(-1);
    },
    //导入成功
    handleSuccess(response, file) {
      console.log(response)
      if (response.code == 200) {
        this.fileList = file;
        this.$message.success(response.message);
        this.getMenuList()
      } else {
        this.dialogImport = true;
        this.importList = response.data;
      }
    },
    // 删除
    handleDelete () {
      if (this.btnType === 'delete') {
        this.getCheckStatus('delete',{id: this.refuseId, status: -1})
      } else {
        this.handleDelete2()
      }
    },
    handleDelete2 () {
      let list = []
      if (this.btnType === 'delete') {
        list.push(this.refuseId)
      } else {
        list = this.checkedCities
      }
      this.dialogVisible3 = false
      this.updateItem({idList: list, isDeleted: 1}, 2)
    },
    handleDispatch (event) {
      this.getCheckStatus('xf', event)
    },
    handleDispatch2 (event) {
      let list = []
      list.push(event.id)
      this.updateItem({idList: list, statusBefore: 0, statusAfter: 1}, 0)
    },
    // 撤回
    handleBack (event) {
      this.getCheckStatus('ch', event)
    },
    handleBack2 (event) {
      let list = []
      list.push(event.id)
      this.updateItem({idList: list, statusBefore: 1, statusAfter: 0}, 1)
    },
    handleDownLoad () {
      const _self = this
      getDown({fileName: '到货通知单导入模板.xlsx'}).then(res => {
        if (res.data.code === 200) {
          let d = res.data.data[0].fileUrl
          window.open(d);
        } else {
          _self.$message({
            showClose: true,
            message: res.data.message,
            type: 'warning'
          });
        }
      }).catch(err => {
        _self.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        });
      })
    },
    showDialog (type, id) {
      this.btnType = type
      if (type === 'delete') {
        this.dialogVisible3 = true
        this.refuseId = id
      } else if (type === 'alldelete') {
        if (this.checkedCities.length > 0) {
          this.dialogVisible3 = true
        } else {
          this.$message({
            showClose: true,
            message: '请选择到货通知单！',
            type: 'warning'
          });
        }
      }
    },
    handleSearch () {
      this.searchParams.page = 1
      this.getMenuList()
    },
    handleConfirmBatch () {
      if (this.checkedCities.length > 0) {
        this.updateItem({idList: this.checkedCities, statusBefore: 0, statusAfter: 1}, 0)
      } else {
        this.$message({
          showClose: true,
          message: '请选择到货通知单！',
          type: 'warning'
        });
      }
    },
    handleChange (event) {
      let checkedCount = event.length;
      this.checkAll = checkedCount === this.pageInfo.records.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.pageInfo.records.length;
    },
    handleCheckAllChange (value) {
      let targetList = this.pageInfo.records.map(item => {
        return item.id
      })
      this.checkedCities = value ? targetList : [];
      this.isIndeterminate = false
    },
    printBtn() {
      let subOutputRankPrint = document.getElementById('subOutputRank-print0');
      let newContent =subOutputRankPrint.innerHTML;
      let oldContent = document.body.innerHTML;
      document.body.innerHTML = newContent;
      window.print();
      window.location.reload();
      document.body.innerHTML = oldContent;
      return false;
    },
    handlePrint () {
      if (this.checkedCities.length > 0) {
        this.dialogVisible2 = true
        const targetList = this.pageInfo.records.filter(item => {
          return this.checkedCities.some(eitem => item.id === eitem)
        })
        this.targetList = targetList
        console.log(targetList)
      } else {
        this.$message({
          showClose: true,
          message: '请选择到货通知单！',
          type: 'warning'
        });
      }
    },
    closeDialog () {
      this.dialogVisible2 = false
    },
    handleRefuse (id) {
      this.refuseId = id
      this.refuseType = 0
      this.dialogTableVisible = true
    },
    handleRefuseTwo () {
      this.dialogTableVisible = false
      let idList = []
      if (this.refuseType === 0) {
        idList.push(this.refuseId)
      } else {
        idList = this.checkedCities
      }
      this.updateItem({idList: idList, refuseReason: this.refuseReason, statusBefore: 1, statusAfter: 2}, 1)
    },
    handleRefuseThree () {
      this.refuseType = 1
      this.dialogTableVisible = true
    },
    handleAffirm (id) {
      let idList = []
      idList.push(id)
      this.updateItem({idList: idList, statusBefore: 1, statusAfter: 2}, 0)
    },
    updateItem (params, index) {
      this.dialogType = index
      let _self = this
      updateItem(params).then(res => {
        if (res.data.code === 200) {
          _self.checkedCities = []
          _self.clearSearch()
          _self.dialogVisible = true
        }
      }).catch(err => {
        _self.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        });
      })
    },
    timeChange(event) {
      if (event === 'deliveredAt') {
        this.searchParams.deliveredAtStart =  this.comfirmTimeValue ? this.comfirmTimeValue[0] + ' 00:00:00' : ''
        this.searchParams.deliveredAtEnd =  this.comfirmTimeValue ? this.comfirmTimeValue[1] + ' 23:59:59' : ''
      } else {
        this.searchParams.issuedAtStart =  this.receivedTimeValue ? this.receivedTimeValue[0] + ' 00:00:00' : ''
        this.searchParams.issuedAtEnd =  this.receivedTimeValue ? this.receivedTimeValue[1] + ' 23:59:59' : ''
      }
    },
    clickOrder(e) {
      this.drawerShowDetail = true;
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
      this.getListDetail(e.purchaseId);
    },
    // 分页
    handleSizeChange(val) {
      this.searchParams.pageSize = val
      this.checkedCities = []
      this.getMenuList()
    },
    // 分页
    handleCurrentChange(val) {
      this.checkedCities = []
      this.searchParams.page = val
      this.getMenuList()
    },
    downLoad() {
      alert("下载附件");
    },
    // 订单状态
    orderStatus(val) {
      let status = {};
      if (val == 0) {
        status = { name: "待下发", color: "#3183FF" };
      } else if (val == 1) {
        status = { name: "待确认", color: "#F95E00" };
      } else if (val == 2) {
        status = { name: "已确认", color: "#3183FF" };
      } else if (val == 3) {
        status = { name: "已拒绝", color: "#f5503c" };
      }
      return status;
    },
    //查询
    getMenuList() {
      getList(this.searchParams).then(res => {
        this.pageInfo = res.data.data
      }).catch(err => {
        console.log(err)
      }).finally()
    },
    //重置
    clearSearch() {
      this.searchParams = {
        requirementCode: '',
        purchaseCode: '',
        supplierCompanyId: '',
        issuedAtStart: '',
        issuedAtEnd: '',
        deliveredAtStart: '',
        deliveredAtEnd: '',
        status: '',
        page: 1,
        pageSize: 10,
      }
      this.comfirmTimeValue = []
      this.receivedTimeValue = []
      this.getMenuList()
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../less/base.less";
@import "../../less/mybase.less";
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
 table, tbody, tfoot, thead, tr, th, td{
    border:1px solid #1ab394!important;
  }
  table{
    width: 100%;
  }
   .tableMainQin{
  /deep/.el-checkbox__label {
            display: none;
          }
        }
@{deep} .el-dialog__title{
  font-size: 16px;
}
@{deep} .el-dialog__body{
  padding: 0 40px 26px 40px;
}
@{deep} .el-drawer{
  border-bottom-left-radius: 20px;
  border-top-left-radius: 20px;
  padding: 0 20px;
}
@{deep} .el-upload{
  height: 40px;
  margin: 0 10px;
  .el-button{
    height: 40px;
  }
}
.statementquery {
  // height: 750px;
  .view_operation{
    display: flex;
    flex-direction: row;
    margin-top: 20px;
    padding-left: 10px;
    .flex{
      flex: 1;
    }
    .margin-10{
      margin:0 10px;
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
      @{deep} .el-checkbox__label{
        display: none !important;
      }
      @{deep} .el-checkbox-group{
        min-height: 400px;
      }
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
              width: 245px;
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
  .pageBottom {
        text-align: center;
        margin-top: 15px;
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
