<template>
  <div class="page_container" :style="{ height: cardHeight }">
    <el-form :model="pageParams" :rules="rules2" ref="ruleForm2" :inline="true" label-width="110px">
    <div class="page_header">
      <div class="header_title">发货单信息</div>
        <el-form-item label="采购订单号：" prop="purchaseCode">
          <div class="downBtn" @click="handleDrawer(0)">
            <div class="flex text-l-1">{{pageParams.purchaseCode}}</div>
            <i class="el-icon-caret-bottom"></i>
          </div>
        </el-form-item>
        <el-form-item label="到货通知单号：">
          <div class="downBtn" @click="handleDrawer(1)">
            <div class="flex">{{pageParams.requirementCode}}</div>
            <i class="el-icon-caret-bottom"></i>
          </div>
        </el-form-item>
        <el-form-item label="客户名称：">
          <div class="downBtn" >
            <div class="flex">{{pageParams.purchaserCompanyName}}</div>
          </div>
        </el-form-item>
        <el-form-item label="联系人：">
          <div class="downBtn">
            <div class="flex">{{pageParams.linkmanName}}</div>
          </div>
        </el-form-item>
        <el-form-item label="发货单号：">
          <div class="downBtn">
            <div class="flex">{{pageParams.cargoCode}}</div>
          </div>
        </el-form-item>
        <el-form-item label="收货地址：" prop="deliveryAddress">
          <el-autocomplete
              class="inline-input"
              v-model="pageParams.deliveryAddress"
              :fetch-suggestions="querySearch"
              placeholder="请输入收货地址"
          ></el-autocomplete>
        </el-form-item>
    </div>
    <div class="page_body">
      <div class="body_title">
        <div class="flex">物料信息</div>
        <el-button type="primary" @click="handleDialog">新增</el-button>
      </div>
        <el-table
            :data="pageParams.materialList"
            :header-cell-style="{background:'#f3f3f5',color:'#65727e'}"
            style="width: 100%">
          <el-table-column
              align="center"
              type="index"
              label="序号">
          </el-table-column>
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
              prop="unit"
              label="单位">
          </el-table-column>
          <el-table-column
              prop="orderingNumber"
              label="订货数量">
          </el-table-column>
          <el-table-column
              sortable
              label="送货数量">
            <template slot-scope="scope">
              <el-form-item :prop="`materialList[${scope.$index}].sendNumber`" :rules="rules2.sendNumber">
                <el-input
                    v-model.trim="scope.row.sendNumber"
                    placeholder="请输入送货数量"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
              sortable
              label="备注">
            <template slot-scope="scope">
              <el-form-item prop="remark">
                <el-input
                    v-model="scope.row.remark"
                    :maxlength="200"
                    placeholder="请输入备注"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
              label="操作">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
              <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div>
    </el-form>
    <div class="page_footer">
      <el-button plain @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </div>
    <el-drawer
        :title="drawerTitle"
        :append-to-body="true"
        :visible.sync="showDrawer"
        size="85%"
        direction="rtl">
      <selectOrder v-if="drawerType === 0" @closeDialog="closeDialog"></selectOrder>
      <arrivalOrder v-else @closeDialog="closeDialog"></arrivalOrder>
    </el-drawer>
    <el-drawer title="发货单信息" size="30%" direction="rtl" :append-to-body="true" :visible.sync="dialogTableVisible">
      <div class="dialog_container">
        <el-form :model="materialParams" :rules="rules" ref="ruleForm" label-width="100px" label-position="left">
          <el-form-item label="物料编号：" prop="materialId">
            <div class="downBtn2">
              <el-select v-model="materialParams.materialCode" filterable placeholder="请选择" @change="handleMaterialIdChange">
                <el-option
                    v-for="item in handleOptions()"
                    :key="item.materialCode"
                    :label="item.materialCode"
                    :value="item.materialCode">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="物料名称：" prop="materialName">
            <div class="downBtn">
              <div class="flex text-l-1">{{materialParams.materialName}}</div>
            </div>
          </el-form-item>
          <el-form-item label="规格/型号：">
            <div class="downBtn">
              <div class="flex text-l-1">{{materialParams.specification}}</div>
            </div>
          </el-form-item>
          <el-form-item label="单位：">
            <div class="downBtn">
              <div class="flex text-l-1">{{materialParams.unit}}</div>
            </div>
          </el-form-item>
          <el-form-item label="订货数量：">
            <div class="downBtn">
              <div class="flex text-l-1">{{materialParams.orderingNumber}}</div>
            </div>
          </el-form-item>
          <el-form-item label="实收数量：">
            <div class="downBtn">
              <div class="flex text-l-1">{{materialParams.receiveNumber}}</div>
            </div>
          </el-form-item>
          <el-form-item label="送货数量：" prop="sendNumber">
            <el-input
                class="downBtn2"
                v-model="materialParams.sendNumber"
                placeholder=""
            ></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input
                class="downBtn2"
                type="textarea"
                :rows="4"
                v-model.trim="materialParams.remark"
                placeholder=""
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog_footer">
          <el-button plain @click="closeDialog2">取消</el-button>
          <el-button type="primary" @click="showDialog">保存</el-button>
        </div>
      </div>
    </el-drawer>
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible2"
        :append-to-body="true"
        width="430px">
      <div>
        <span style="color: #2f82ff">覆盖</span>
        <span>：替换已有的物料信息</span>
      </div>
      <div class="m-t-10">
        <span style="color: #2f82ff">累计</span>
        <span>：累计已有的物料数量</span>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="handleAddMaterial(0)">累计</el-button>
    <el-button type="primary" @click="handleAddMaterial(1)">覆盖</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { windowHeight } from "@/utils/setSize.js";
import selectOrder from "@views/dispatchBill/components/selectOrder";
import arrivalOrder from "@views/dispatchBill/components/arrivalOrder";
import { getCreate, getUpdate, getCargoCode } from '@/api/arrivalNotice'
import { mapGetters } from "vuex";
import {goodsPriceCheck,testTwoSmallNum} from "@/utils/verification";
export default {
  data() {
    return {
      cardHeight: windowHeight,
      drawerType: 0,
      showDrawer: false, // 是否弹出抽屉
      dialogTableVisible: false, // 是否弹出新增物料窗口
      dialogVisible2: false, // 是否弹出新增物料窗口
      drawerTitle: '', // 抽屉标题
      pageType: '', // 选择的是采购订单 还是 到货通知单
      planFormTableInput: {},
      pageParams: {
        cargoCode: '',
        buyerCompanyId: '',
        supplierCompanyId: '',
        purchaseCode: '',
        purchaseId: '',
        requirementCode: '',
        purchaserCompanyName: '',
        linkmanName: '',
        deliveryAddress: '',
        materialList: []
      },
      materialParams: {
        materialCode: '',
        materialName: '',
        sendNumber: ''
      },
      materialId: '',
      Rules: {},
      rules2: {
        purchaseCode: [
          { required: true, message: '请选择采购订单号', trigger: 'blur' }
        ],
        deliveryAddress: [
          { required: true, message: '请填写收货地址', trigger: 'blur' }
        ],
        sendNumber: [
          { required: true, message: "送货数量不能为空", trigger: "blur" },
          { validator:goodsPriceCheck, trigger: "blur" },
          { validator:testTwoSmallNum, trigger: "blur" },
        ],
      },
      rules: {
        materialCode: [
          { required: true, message: '请选择物料编号', trigger: 'blur' }
        ],
        materialName: [
          { required: true, message: '请选择物料名称', trigger: 'blur' }
        ],
        sendNumber: [
          { required: true, message: '请输入送货数量', trigger: 'blur' },
          { validator:goodsPriceCheck, trigger: "blur" },
          { validator:testTwoSmallNum, trigger: "blur" },
        ]
      },
    };
  },
  computed: {
    ...mapGetters({
      getPurchaseList: 'selectedList/getPurchaseList',
      getArrivalList: 'selectedList/getArrivalList',
      getEditList: 'selectedList/getEditList',
      getPageType: 'selectedList/getPageType',
    }),
  },
  components: {
    selectOrder,
    arrivalOrder
  },
  mounted() {
    if (this.getPageType === 'edit') {
      this.pageParams.buyerCompanyId = this.getEditList.buyerCompanyId
      this.pageParams.cargoCode = this.getEditList.cargoCode
      this.pageParams.supplierCompanyId = this.getEditList.supplierCompanyId
      this.pageParams.purchaseCode = this.getEditList.purchaseCode
      this.pageParams.purchaseId = this.getEditList.id
      this.pageParams.requirementCode = this.getEditList.requirementCode
      this.pageParams.purchaserCompanyName = this.getEditList.buyerCompanyName
      this.pageParams.linkmanName = this.getEditList.linkmanRealName
      this.pageParams.deliveryAddress = this.getEditList.deliveryAddress
      this.pageParams.materialList = this.getEditList.materialList
    } else {
      this.getCargoCode()
    }
  },
  methods: {
    querySearch(queryString, cb) {
      let results = []
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    getCargoCode () {
      const _self = this
      getCargoCode().then(res => {
        if (res.data.code === 200) {
          _self.pageParams.cargoCode = res.data.data
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
    showDialog() {
      const _self = this
      _self.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.dialogVisible2 = true
        } else {
          return false;
        }
      })
    },
    handleAddMaterial (index) {
      let targetIndex = this.pageParams.materialList.findIndex(item => item.materialCode === this.materialParams.materialCode)
      if (index === 0) {
        let num = this.pageParams.materialList[targetIndex].sendNumber ? this.pageParams.materialList[targetIndex].sendNumber : 0
        this.$set(this.pageParams.materialList[targetIndex], 'sendNumber', parseInt(num) + parseInt(this.materialParams.sendNumber) )
      } else {
        this.$set(this.pageParams.materialList, targetIndex, this.materialParams )
      }
      this.dialogVisible2 = false
      this.dialogTableVisible = false
    },
    handleMaterialIdChange (event) {
      let targetList = this.pageParams.materialList
      this.materialParams = Object.assign({}, targetList.filter(item => item.materialCode === event)[0])
    },
    // 删除
    handleDelete (event) {
      let targetIndex = this.pageParams.materialList.findIndex(item => item.materialCode === event.materialCode)
      this.pageParams.materialList.splice(targetIndex, 1)
    },
    // 编辑
    handleEdit (event) {
      this.materialParams = Object.assign({}, event)
      this.dialogTableVisible = true
    },
    handleDialog () {
      if (this.pageParams.purchaseCode !== '' || this.pageParams.requirementCode !== '') {
        this.dialogTableVisible = true
        this.materialParams = {}
        this.materialId = ''
      } else {
        this.$message({
          showClose: true,
          message: '请先选择采购订单或到货通知单!',
          type: 'warning'
        });
      }
    },
    handleOptions () {
      return this.pageParams.materialList
    },
    handleClose () {
      this.$emit('closeCreate')
    },
    // 新增
    handleConfirm () {
      let _self = this
      if (this.pageParams.materialList.length === 0) {
        _self.$message({
          showClose: true,
          message: '请选择物料!',
          type: 'warning'
        });
        return
      }
      _self.$refs['ruleForm2'].validate((valid) => {
        if (valid) {
          if (_self.getPageType === 'create') {
            getCreate(this.pageParams).then(res => {
              if (res.data.code === 200) {
                _self.handleClose()
                _self.$message({
                  showClose: true,
                  message: res.data.message,
                  type: 'success'
                });
              }
            }).catch(err => {
              _self.$message({
                showClose: true,
                message: err.message,
                type: 'error'
              });
            })
          } else {
            getUpdate(this.pageParams, this.getEditList.id).then(res => {
              if (res.data.code === 200) {
                _self.handleClose()
                _self.$message({
                  showClose: true,
                  message: res.data.message,
                  type: 'success'
                });
              }
            }).catch(err => {
              _self.$message({
                showClose: true,
                message: err.message,
                type: 'error'
              });
            })
          }
        } else {
          return false;
        }
      })
    },
    closeDialog (event) {
      if (event === 'cancel') {
        this.showDrawer = false
      } else {
        this.pageType = event
        if (event === 'cgdd') {
          this.pageParams.buyerCompanyId = this.getPurchaseList.purchaserCompanyId
          this.pageParams.supplierCompanyId = this.getPurchaseList.supplierCompanyId
          this.pageParams.purchaseCode = this.getPurchaseList.purchaseCode
          this.pageParams.purchaseId = this.getPurchaseList.id
          this.pageParams.purchaserCompanyName = this.getPurchaseList.purchaserCompanyName
          this.pageParams.linkmanName = this.getPurchaseList.linkmanName
          this.pageParams.materialList = this.getPurchaseList.materialList
        } else {
          this.pageParams.materialList = this.getArrivalList.materialList
          this.pageParams.deliveryAddress = this.getArrivalList.deliveryAddress
          this.pageParams.requirementCode = this.getArrivalList.requirementCode
        }
        this.showDrawer = false
      }
    },
    closeDialog2 () {
      this.dialogTableVisible = false
    },
    // 操作抽屉
    handleDrawer (index) {
      this.drawerType = index
      this.showDrawer = true
      this.drawerTitle = index === 0 ? '选择采购订单号' : '选择到货通知单号'
    }
  },
};
</script>

<style lang="less" type="text/less" scoped>
@import '../../../less/base.less';
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
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  @{deep} .el-form{
    width: 100%;
    height: 100%;
  }
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
    width: 100%;
    padding: 20px 20px 0 20px;
    background-color: @white;
    box-shadow: 0px 6px 18px 0px
    rgba(199, 209, 219, 0.35);
    border-radius: 10px;
    border: solid 1px #f0f2f4;
    @{deep} .el-form-item__content{
      width: 265px !important;
      height: 40px !important;
      .el-autocomplete{
        width: 100%;
      }
    }
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
    height: calc(100% - 220px);
    width: 100%;
    padding: 20px 20px 0 20px;
    background-color: @white;
    box-shadow: 0px 6px 18px 0px
    rgba(199, 209, 219, 0.35);
    border-radius: 10px;
    border: solid 1px #f0f2f4;
    @{deep} .el-form-item{
      margin-bottom: 0px;
      .el-input{
        width: 160px;
      }
    }
    .body_title{
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 16px;
      color: @black_title;
      margin-bottom: 20px;
      @{deep} .el-button{
        width: 100px;
      }
    }
    /deep/ .el-form-item__error{
      position: static;
    }
    // @{deep} .el-table{
    //   height: calc(100% - 80px);
    // }
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
.dialog_container{
  width: 100%;
  padding: 0 20px;
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
  .downBtn2{
    @{deep} .el-input__inner{
      width: 295px !important;
      height: 32px !important;
    }
    @{deep} .el-textarea__inner{
      width: 295px !important;
    }
  }
  .dialog_footer{
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
