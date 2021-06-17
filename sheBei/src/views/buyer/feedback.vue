<template>
  <div class="statementquery">
    <el-card class="searchCard">
      <div style="margin-top: 10px;">
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
          <!-- <el-form-item class="formRight" label="供应商名称：">
            <el-input
              v-model="searchContent.supplierCompanyName"
              class="inputWidth"
              prefix-icon="el-icon-search"
              placeholder="请输入关键字搜索"
            ></el-input>
          </el-form-item> -->
          <el-form-item label="供应商名称：">
            <el-select
              filterable
              class="inputWidth"
              v-model="searchContent.companyId"
              placeholder="请选择供应商名称"
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
          <br>
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
        <div class="topChoose">
          <el-checkbox v-model="checked" @change="checkedChange"
            >全选/全不选</el-checkbox
          >
          <el-button type="primary" size="small" @click="print"
            >打 印</el-button
          >
        </div>
        <el-collapse>
          <el-collapse-item v-for="(item, i) in tableList" :key="i">
            <template slot="title">
              <div class="orderNumber">
                <span
                  ><el-checkbox
                    :label="item.id"
                    class="checkbox"
                    :key="i"
                    v-model="checkedId"
                    @change="checkedIdList"
                  ></el-checkbox>
                </span>
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
                    <div :title="item.supplierCompanyName">
                      <span>供应商名称：</span>
                      <span>{{ item.supplierCompanyName }}</span>
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
                    <div :title="item.remark">
                      <span v-show="item.remark">备注：</span>
                      <span>{{ item.remark }}</span>
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
                  <!-- <div class="titleContent" v-if="item.status == 3">
                    <div :title="item.confirmedOperatorName">
                      <span>拒绝原因：</span>
                      <span>{{ item.confirmedOperatorName }}</span>
                    </div>
                    <div :title="item.confirmedAt">
                      <span>拒绝人：</span>
                      <span>{{ item.confirmedAt }}</span>
                    </div>
                    <div :title="item.paidProgress">
                      <span>拒绝时间：</span>
                      <span>{{ item.paidProgress }}</span>
                    </div>
                  </div> -->
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
            <div class="collapseTable" style="width：100%;">
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
              <div class="btn" v-if="item.status == '1'">
                <el-button
                  type="primary"
                  size="small"
                  style="margin-left: 10px"
                  @click="rejection(item.id, item.status)"
                  >拒 收</el-button
                >
                <el-button
                  type="primary"
                  size="small"
                  style="margin-left: 10px"
                  @click="makeSure(item.id, item.status)"
                  >确 认</el-button
                >
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <el-dialog
          top="10vh"
          class="detail"
          width="500px"
          title="拒绝确认对账单"
          :destroy-on-close="true"
          :close-on-click-modal="false"
          :visible.sync="dialogFormVisible"
        >
          <div slot="title" class="header-title">
            <div>
              <div class="greyline"></div>
              &nbsp;拒绝确认对账单
            </div>
            <div class="blueline"></div>
          </div>
          <el-form
            :rules="rules"
            ref="ReasonsRejection"
            :model="ReasonsRejection"
          >
            <el-form-item label="拒绝原因：" prop="rejection">
              <el-select
                @change="select"
                style="width: 350px"
                v-model="ReasonsRejection.rejection"
                placeholder="请选择活动区域"
              >
                <el-option
                  v-for="(item, index) in list"
                  :key="index"
                  :label="item.rejectReason"
                  :value="item.rejectReason"
                ></el-option>
                <el-option label="其它" value="其它"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="isShow" label="其它原因：" prop="other">
              <el-input
                style="width: 350px"
                type="textarea"
                show-word-limit
                maxlength="200"
                v-model.trim="ReasonsRejection.other"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button style="width: 120px" @click="dialogFormVisible = false"
              >取 消</el-button
            >
            <el-button
              style="width: 120px"
              type="primary"
              @click="submitForm('ReasonsRejection')"
              >确 定</el-button
            >
          </div>
        </el-dialog>
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
        <div class="table_title0">对账单</div >
    <table border="1" class="f-s-12 font-purple" style="border-collapse: collapse;">
    <tr class="padding-10 border-color">
      <td colspan="10">
        <div class="padding-10">
      <div class="d-F">
        <div class="flex1 line-h-20">
          <span>对账单号：</span>
          <span class="font-grey">{{ item.compareCode }}</span >
        </div >
        <div class="flex1 line-h-20">
          <span>对账日期：</span>
          <span class="font-grey">{{ item.createdAt }}</span >
        </div >
      </div >
      <div class="d-F">
        <div class="flex1 line-h-20">
          <span>客户名称：</span>
          <span class="font-grey">{{ item.purchaserCompanyName }}</span >
        </div >
        <div class="flex1 line-h-20">
          <span>联系人：</span>
          <span class="font-grey">{{ item.linkmanName }}</span >
        </div >
      </div >
      <div class="d-F">
        <div class="flex1 line-h-20">
          <span>对账起止日期：</span>
          <span class="font-grey">{{ item.compareStartedAt }}-{{ item.compareEndAt }}</span >
        </div >
        <div class="flex1 line-h-20">
          <span>联系方式：</span>
          <span class="font-grey">{{ item.linkmanPhone }}</span >
        </div >
      </div >
      </div >
      </td>
    </tr  >
    <tr v-show="getfaList(item.materialList).length>0" class="align-c">
      <td class='width-8'>序号</td >
      <td class='width-12'>发货单号</td >
      <td  class='width-12'>物料编号</td >
      <td  class='width-12'>物料名称</td >
      <td  class='width-12'>规格/型号</td >
      <td  class='width-8'>单位</td >
      <td  class='width-8'>实收数</td >
      <td  class='width-8'>拒收数</td >
      <td  class='width-8'>单价</td >
      <td  class='width-12'>备注</td >
    </tr  >
    <tr class="align-c"  v-for="(eitem, eindex) in getfaList(item.materialList)" :key="eindex + '_1'">
      <td class='width-8 font-grey'>{{ eindex + 1 }}</td >
      <td  class='width-12 font-grey'>{{ eitem.cargoCode }}</td >
      <td  class='width-12 font-grey'>{{ eitem.materialCode }}</td >
      <td  class='width-12 font-grey'>{{ eitem.materialName }}</td >
      <td  class='width-12 font-grey'>{{ eitem.specification }}</td >
      <td  class='width-8 font-grey'>{{ eitem.unit }}</td >
      <td  class='width-8 font-grey'>{{ eitem.receiveNumber }}</td >
      <td  class='width-8 font-grey'>{{ eitem.refuseNumber }}</td >
      <td  class='width-8 font-grey'>{{ eitem.unitPrice }}</td >
      <td  class='width-12 font-grey'>{{ eitem.remark }}</td >
    </tr >
    <tr v-show="gettuiList(item.materialList).length>0 && getfaList(item.materialList).length>0"  style="height:18px" class="align-c">
      <td colspan='10' class='width-8'></td >
    </tr   >
    <tr v-show="gettuiList(item.materialList).length>0" style="margin-top:20px" class="align-c">
      <td class='width-8'>序号</td >
      <td  class='width-12'>退货单号</td >
      <td  class='width-12'>物料编号</td >
      <td  class='width-12'>物料名称</td >
      <td  class='width-12'>规格/型号</td >
      <td  class='width-8'>单位</td >
      <td colspan='2' class='width-8'>退货数</td >
      <td  class='width-8'>单价</td >
      <td  class='width-12'>备注</td >
    </tr   >
     <tr class="align-c" v-for="(item0, index0) in gettuiList(item.materialList)" :key="index0 + '_1'">
      <td class='width-8 font-grey'>{{ index0 + 1 }}</td >
      <td valign:middle class='width-12 font-grey'>{{ item0.rejectCode }}</td >
      <td  class='width-12 font-grey'>{{ item0.materialCode }}</td >
      <td  class='width-12 font-grey'>{{ item0.materialName }}</td >
      <td  class='width-12 font-grey'>{{ item0.specification }}</td >
      <td  class='width-8 font-grey'>{{ item0.unit }}</td >
      <td colspan='2' class='width-8 font-grey'>{{ item0.rejectNumber }}</td  >
      <td  class='width-8 font-grey'>{{ item0.unitPrice }}</td >
      <td  class='width-12 font-grey'>{{ item0.remark }}</td >
    </tr >
    <tr style="height:18px" class="align-r">
      <td colspan='10' class='width-8'>
        <div>
          <span>对账金额合计：</span>
          <span class="font-grey">{{ item.compareAmount ? item.compareAmount : "/" }}元</span >
        </div>
      </td >
    </tr>
    <tr>
      <td colspan='4'>
        <div class="padding-10">
        <div>
          <span>申请人:</span>
          <span class="font-grey">{{ item.creatorName }}</span >
        </div>
        <div>
          <span>联系方式:</span>
          <span class="font-grey">{{ item.creatorPhone }}</span >
        </div>
        <div>
          <span>申请日期:</span>
          <span class="font-grey">{{ item.createdAt }}</span >
        </div>
        </div >
      </td >
       <td colspan='6'>
       <div class="padding-10">
        <div>
          <span>客户方: (盖章)</span>
        </div>
        <div>
          <span>客户方: (签字)</span>
        </div>
        </div >
      </td >
    </tr   >
     </table>
     </div >
        </div>
        <div class="table_footer0">
          <el-button plain @click="dialogVisible2 = false">取消</el-button>
          <el-button type="primary" @click="printBtn">打印</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { windowHeight } from "@/utils/setSize.js";
import { supplyApi, buyerApi } from "@/api/user.js";
export default {
  computed: {},
  data() {
    return {
      companyList:[],
      searchContent: {
        page: 1,
        pageSize: 10,
        compareCode: "",
        status: "",
        createdAtEnd: "",
        createdAtStart: "",
        companyId:"",
        purchaserCompanyName: "",
        supplierCompanyName: "",
        entranceMark: "SUPPLIER",
        paidStatus: "",
      },
      ReasonsRejection: {
        rejection: "",
        other: "",
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
      targetList: [],
      total: 0,
      timeValue: "",
      checked: false,
      checkedId: [],
      dialogFormVisible: false,
      dialogVisible2: false,
      isShow: false,
      list: [],
      myId: "",
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
      // 验证表单
      rules: {
        rejection: [
          { required: true, message: "请选择拒绝原因", trigger: "change" },
        ],
        other: [
          { required: true, message: "请输入其它原因", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getMenuList();
    this.rejectionList();
    this.getRelatedEnterprise()
  },
  methods: {
    //获取关联的企业信息
    getRelatedEnterprise() {
      supplyApi.getRelatedEnterprise().then(({ data: res }) => {
        if (res.code == 200) {
          this.companyList = res.data;
        }
      });
    },
    getfaList(val) {
      if (val == null) {
        val = [];
      }
      let list = val.filter((item) => {
        return item.cargoCode != "";
      });
      return list;
    },
    gettuiList(val) {
      if (val == null) {
        val = [];
      }
      let list = val.filter((item) => {
        return item.rejectCode != "";
      });
      return list;
    },
    timeChange() {
      if (this.timeValue != null && this.timeValue.length > 0) {
        this.searchContent.createdAtStart = this.timeValue[0];
        this.searchContent.createdAtEnd = this.timeValue[1];
      } else {
        this.searchContent.createdAtStart = "";
        this.searchContent.createdAtEnd = "";
      }
    },
    // 拒 收
    rejection(val, val1) {
      let statusSure = {
        id: val,
        status: val1,
      };
      supplyApi.getCheckStatus(statusSure).then(({ data: res }) => {
        if (res.data == true) {
          this.dialogFormVisible = true;
          this.myId = val;
        } else if (res.data == false) {
          this.$message({
            showClose: true,
            message: "当前状态已变更，待刷新后操作",
            type: "success",
          });
          this.getMenuList();
        }
      });
    },
    // 拒收原因
    rejectionList() {
      buyerApi
        .rejectionList({ rejectType: "REJECT_COMPARE_BILL" })
        .then(({ data: res }) => {
          if (res.code == 200) {
            this.list = res.data;
          }
        });
    },
    select(val) {
      if (val === "其它") {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    },
    // 修改状态
    getUpdateStatus(val, val1) {
      supplyApi.getUpdateStatus(val).then(({ data: res }) => {
        if (res.code == 200) {
          if (val1 === "拒收") {
            this.dialogFormVisible = false;
            this.$message({
              showClose: true,
              message: "拒收成功！",
              type: "success",
            });
          } else if (val1 === "确认") {
            this.$message({
              showClose: true,
              message: "确认成功！",
              type: "success",
            });
          }
          this.getMenuList();
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let mystatue = {
            idList: [this.myId], //当前对账单的id，用个数组，防止有批量的功能
            refuseReason: "", //当选项为'其它'时，拒绝原因取用户手写的原因。选择选项时，拒绝原因取下拉
            statusAfter: 3, //从1 - 待确认 变为 3 - 已拒绝
            statusBefore: 1,
          };
          if (this.ReasonsRejection.rejection === "其它") {
            mystatue.refuseReason = this.ReasonsRejection.other;
          } else {
            mystatue.refuseReason = this.ReasonsRejection.rejection;
          }
          this.getUpdateStatus(mystatue, "拒收");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 确 认
    makeSure(val, val1) {
      let statusSure = {
        id: val,
        status: val1,
      };
      supplyApi.getCheckStatus(statusSure).then(({ data: res }) => {
        if (res.data == true) {
          let sure = {
            idList: [val], //当前对账单的id，用个数组，防止有批量的功能
            statusAfter: 2, //从1 - 待确认 变为 2 - 已确认
            statusBefore: 1,
          };
          this.getUpdateStatus(sure, "确认");
        } else if (res.data == false) {
          this.$message({
            showClose: true,
            message: "当前状态已变更，待刷新后操作",
            type: "success",
          });
          this.getMenuList();
        }
      });
    },

    checkedChange() {
      if (this.checked) {
        this.tableList.map((item) => {
          this.checkedId.push(item.id);
        });
      } else {
        this.checkedId = [];
      }
    },
    checkedIdList() {
      this.checked =
        this.checkedId.length == this.tableList.length ? true : false;
    },
    // 分页
    handleSizeChange(val) {
      this.checked= false
      this.checkedId=[]
      this.searchContent.pageSize = val;
      this.getMenuList();
    },
    // 分页
    handleCurrentChange(val) {
      this.checked= false
      this.checkedId=[]
      this.searchContent.page = val;
      this.getMenuList();
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
      this.checked= false
      this.checkedId=[]
      supplyApi.getCompareList(this.searchContent).then(({ data: res }) => {
        if (res.code == 200) {
          this.tableList = res.data.records;
          this.total = res.data.total;
          this.tableList.map((item) => {
            if (item.materialList == null) {
              item.materialList = [];
            }
            item.materialList.map((item0, index) => {
              item0.orderId = index + 1;
            });
          });
        }
      });
    },
    //重置
    clearSearch() {
      this.checked= false
      this.checkedId=[]
      this.searchContent.compareCode = "";
      this.searchContent.status = "";
      this.searchContent.createdAtEnd = "";
      this.searchContent.createdAtStart = "";
      this.searchContent.purchaserCompanyName = "";
      this.searchContent.paidStatus = "";
      this.searchContent.page = 1;
      this.searchContent.pageSize = 10;
      this.searchContent.companyId="";
      this.timeValue = "";
      this.getMenuList();
    },
    printBtn() {
      let subOutputRankPrint = document.getElementById("subOutputRank-print0");
      let newContent = subOutputRankPrint.innerHTML;
      let oldContent = document.body.innerHTML;
      document.body.innerHTML = newContent;
      window.print();
      window.location.reload();
      document.body.innerHTML = oldContent;
      return false;
    },
    // 打印
    print() {
      if (this.checkedId.length > 0) {
        this.getCompareDetail(this.checkedId);
        this.dialogVisible2 = true;
      } else {
        this.$message({
          showClose: true,
          message: "请选择需要打印的对账单！",
          type: "warning",
        });
      }
    },
    //对账单详情
    getCompareDetail(val) {
      supplyApi.getCompareDetail(val).then(({ data: res }) => {
        if (res.code == 200) {
          this.targetList = res.data;
        }
      });
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
@import "../../less/mybase.less";
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
    // position: relative;
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
      .topChoose {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
        // /deeo/.el-checkbox {
        //   margin-top: 10px !important;
        // }
      }
      .orderNumber {
        .checkbox {
          line-height: 70px;
          margin-right: 10px;
          /deep/.el-checkbox__label {
            display: none;
          }
        }
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
              max-width: 300px;
              width: 16.5%;
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
      .detail {
        /deep/.el-dialog {
          border-radius: 10px !important;
        }
        .greyline {
          width: 3px;
          height: 13px;
          background: #409eff;
          display: inline-block;
        }
        .blueline {
          border-bottom: 1px solid #eee;
          height: 10px;
        }
        .dialog-footer {
          text-align: center;
          padding-bottom: 10px;
        }
      }

      /deep/.el-table__header th {
        padding: 0;
        height: 50px;
        line-height: 50px;
      }
      // /deep/.el-collapse-item__content {
      //   padding-bottom: 10px !important;
      // }
      .collapseTable {
        width: 100%;
        .btn {
          float: right;
          margin: 10px 0;
        }
      }
    }
  }
  .pageBottom {
    // position: relative;
    bottom: 0;
    text-align: center;
    margin-top: 15px;
  }
  /deep/.el-form-item__error {
    text-indent: 100px;
  }
}
</style>
