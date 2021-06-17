<template>
  <div class="dispatchBillQueryMain">
    <el-card class="searchCard">
      <div style="margin-top: 10px; max-width: 1600px">
        <el-form label-width="110px" :inline="true" class="demo-form-inline">
          <el-form-item class="formRight" label="采购订单号：">
            <el-input
              v-model="queryData.purchaseCode"
              class="inputWidth"
              prefix-icon="el-icon-search"
              placeholder="请输入采购订单号"
            ></el-input>
          </el-form-item>
          <el-form-item class="formRight" label="到货通知单号：">
            <el-input
              v-model="queryData.requirementCode"
              class="inputWidth"
              prefix-icon="el-icon-search"
              placeholder="请输入到货通知单号"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item class="formRight" label="客户名称：">
            <el-input
              v-model="queryData.buyerCompanyName"
              class="inputWidth"
              prefix-icon="el-icon-search"
              placeholder="请输入关键字搜索"
            ></el-input>
          </el-form-item> -->
          <el-form-item class="formRight" label="客户名称：">
            <el-select
                v-model="queryData.buyerCompanyId" 
                placeholder="请选择客户名称"
                filterable
                clearable
                class="inputWidth">
              <el-option
                v-for="item in enterpriseList"
                :key="item.companyId"
                :label="item.companyName"
                :value="item.companyId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="labelWidth" label="制单时间：">
            <div class="block">
              <el-date-picker
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                class="inputWidth"
                v-model="receiptTime"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="timeChange"
                align="right"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item class="formRight" label="状态：">
            <el-select v-model="queryData.status" class="inputWidth">
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="(item, i) in statusList"
                :key="i"
                :label="item.statusName"
                :value="item.statusId"
              ></el-option>
            </el-select>
          </el-form-item>
            <el-form-item class="formRight" label="发货单号：">
            <el-input
                v-model="queryData.cargoCode"
                class="inputWidth"
                prefix-icon="el-icon-search"
                placeholder="请输入发货单号"
            ></el-input>
            </el-form-item>
          <div class="btn">
            <el-button
              type="primary"
              style="margin-left: 10px"
              @click="getMenuList('init')"
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
        <el-collapse>
          <el-collapse-item v-for="(item, i) in tableList" :key="i">
            <template slot="title">
              <div class="orderNumber">
                <div class="titleContentleft">
                  <div class="titleContent">
                    <div>
                      <span>发货单号：</span>
                      <span :title="item.cargoCode">{{ item.cargoCode }}</span>
                    </div>
                    <div class="clickOrder" @click.stop="clickOrder(item.purchaseId)">
                      <span>采购订单号：</span>
                      <span :title="item.purchaseCode">{{ item.purchaseCode }}</span>
                    </div>
                    <div>
                      <span>到货通知单号：</span>
                      <span :title="item.requirementCode">{{ item.requirementCode }}</span>
                    </div>
                    <div>
                      <span>客户名称：</span>
                      <span :title="item.buyerCompanyName">{{ item.buyerCompanyName }}</span>
                    </div>
                    <div>
                      <span>联系人：</span>
                      <span :title="item.linkmanRealName?item.linkmanRealName+' '+item.linkmanPhone:''">{{ item.linkmanRealName?item.linkmanRealName+' '+item.linkmanPhone:''}}</span>
                    </div>
                    <div>
                      <span>收货地址：</span>
                      <span :title="item.deliveryAddress">{{ item.deliveryAddress }}</span>
                    </div>
                  </div>
                  <div class="titleContent">
                    <div>
                      <span>制单人：</span>
                      <span :title="item.creatorName">{{ item.creatorName }}</span>
                    </div>
					          <div>
                      <span>制单时间：</span>
                      <span :title="item.createdAt">{{ item.createdAt }}</span>
                    </div>
                    
					          <div v-if="item.status===1||item.status===0">
                      <span>发货时间：</span>
                      <span :title="item.sendAt">{{ item.sendAt }}</span>
                    </div>
					          <div v-if="item.status===1">
                      <span>收货时间：</span>
                      <span :title="item.receivedAt">{{ item.receivedAt }}</span>
                    </div>
                    <div v-if="item.status===1">
                      <span>收货人：</span>
                      <span :title="item.receiverRealName?item.receiverRealName+' '+item.receiverUserPhone:''">{{ item.receiverRealName?item.receiverRealName+' '+item.receiverUserPhone:'' }}</span>
                    </div>
                  </div>
                </div>
                <div class="titleContentright">
                  <div
                    :style="{
                      color: orderStatus(item.status).color + '!important',
                    }"
                  >
                    {{item.statusName }}
                  </div>
                </div>
              </div>
            </template>
            <div style="width：100%;">
              <el-table
                ref="multipleTable"
                :key="item.id"
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
                  type="index"
                  label="序号"
                  width="100"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  sortable
                  prop="materialCode"
                  label="物料编号"
                  min-width="2"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  sortable
                  prop="materialName"
                  label="物料名称"
                  min-width="2"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  sortable
                  prop="specification"
                  label="规格/型号"
                  min-width="2"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  sortable
                  prop="sendNumber"
                  label="送货数量"
                  min-width="2"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  sortable
                  prop="unit"
                  label="单位"
                  min-width="2"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  sortable
                  prop="remark"
                  label="备注"
                  min-width="2"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  sortable
                  prop="receiveNumber"
                  label="实收合格数量"
                  min-width="2"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  sortable
                  prop="refusedNumber"
                  label="拒收数量"
                  min-width="2"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  sortable
                  prop="refusedReason"
                  label="拒绝原因"
                  min-width="2"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
              </el-table>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div
          v-show="tableList.length < 1"
          class="none"
        >
          暂无数据
        </div>
      </div>
    </el-card>
    <div class="pageBottom" v-show="tableList.length > 0">
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

    <el-drawer
      class="addoredit  drawer-box"
      title="采购订单详情"
      :visible.sync="drawerorder"
      size="90%"
    >
      <OrderDetail :detailData="detailData"> </OrderDetail>
    </el-drawer>
  </div>
</template>

<script>
import {supplyApi} from "../../api/user.js"
import OrderDetail from "@/views/buyer/components/orderDetail";
import { purchaseDetail } from "@/api/order.js";
export default {
  components: {
    OrderDetail,
  },
  data() {
    return {
      //订单详情
      detailData: [
        {
          title: "基础信息",
          baseLabel: [
            {
              label: "采购订单号",
              prop: "purchaseCode",
            },
            {
             label: "客户名称",
              prop: "purchaserCompanyName",
            },
            {
              label: "联系人",
              prop: "linkmanName",
            },
            {
              label: "联系方式",
              prop: "linkmanPhone",
            },
            {
              label: "下达日期",
              prop: "issuedAt",
            },
            {
              label: "收货地址",
              prop: "deliveryAddress",
            },
            {
              label: "接收日期",
              prop: "receivedAt",
            },
            {
              label: "交货日期",
              prop: "deliveredAt",
            },
            {
              label: "制单人",
              prop: "creatorName",
            },
            {
              label: "制单日期",
              prop: "createdAt",
            },
          ],
          statusList: [
            { status: 0, name: "待下发", color: "color-purple1" },
            { status: 1, name: "订单待确认", color: "color-orange1" },
            { status: 2, name: "变更待确认", color: "color-orange1" },
            { status: 3, name: "订单已拒绝", color: "color-purple2" },
            { status: 4, name: "变更已拒绝", color: "color-purple2" },
            { status: 5, name: "已确认", color: "color-blue2" },
            { status: 6, name: "已完成", color: "color-blue2" },
            { status: 7, name: "已中止", color: "color-red5" },
          ],
          materielLabel: [
            {
              prop: "index",
              label: "序号",
              width: "55px",
            },
            {
              prop: "materialCode",
              label: "物料编号",
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
              prop: "refuseNumber",
              label: "拒收数量",
            },
            {
              prop: "rejectNumber",
              label: "退货数量",
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
          data: [],
        },
        {
          title: "变更记录",
          baseLabel: [
            {
              label: "采购订单号",
              prop: "purchaseCode",
            },
            {
            label: "客户名称",
              prop: "purchaserCompanyName",
            },
            {
              label: "联系人",
              prop: "linkmanName",
            },
            {
              label: "联系方式",
              prop: "linkmanPhone",
            },
            {
              label: "下达日期",
              prop: "issuedAt",
            },
            {
              label: "收货地址",
              prop: "deliveryAddress",
            },
            {
              label: "接收日期",
              prop: "receivedAt",
            },
            {
              label: "变更人",
              prop: "creatorName",
            },
            {
              label: "变更日期",
              prop: "createdAt",
            },
          ],
          statusList: [
            { status: 0, name: "待下发", color: "color-purple1" },
            { status: 1, name: "订单待确认", color: "color-orange1" },
            { status: 2, name: "变更待确认", color: "color-orange1" },
            { status: 3, name: "订单已拒绝", color: "color-purple2" },
            { status: 4, name: "变更已拒绝", color: "color-purple2" },
            { status: 5, name: "已确认", color: "color-blue2" },
            { status: 6, name: "已完成", color: "color-blue2" },
            { status: 7, name: "已中止", color: "color-red5" },
          ],
          materielLabel: [
            {
              prop: "index",
              label: "序号",
              width: "55px",
            },
            {
              prop: "materialCode",
              label: "物料编号",
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
              prop: "unit",
              label: "单位",
            },
            {
              prop: "remark",
              label: "备注",
            },
          ],
          data: [],
        },
        {
          title: "客户到货通知单",
          baseLabel: [
            {
              label: "到货通知单编号",
              prop: "requirementCode",
            },
            {
              label: "到货时间",
              prop: "deliveredAt",
            },
            {
              label: "到货地址",
              prop: "deliveryAddress",
            },
            {
              label: "制单人",
              prop: "creatorOperatorName",
            },
          ],
          statusList: [
            { status: 0, name: "待下发", color: "color-purple1" },
            { status: 1, name: "待确认", color: "color-orange1" },
            { status: 2, name: "已确认", color: "color-blue2" },
            { status: 3, name: "已拒绝", color: "color-purple2" },
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
              prop: "arrivalNumber",
              label: "到货数量",
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
          data: [],
        },
        {
          title: "退货信息",
          baseLabel: [
            {
              label: "退货单编号",
              prop: "rejectedCode",
            },
            {
              label: "退货人",
              prop: "creatorName",
            },
            {
              label: "退货时间",
              prop: "createdAt",
            },
          ],
          statusList: [
            { status: -1, name: "待下发", color: "color-purple1" },
            { status: 0, name: "待确认", color: "color-orange1" },
            { status: 1, name: "已确认", color: "color-blue2" },
            { status: 2, name: "已拒绝", color: "color-purple2" },
            { status: 3, name: "已完成", color: "color-blue2" },
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
              prop: "rejectedNumbers",
              label: "退货数量",
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
          data: [],
        },
        {
          title: "发货/客户收货",
          baseLabel: [
            {
              label: "发货单编号",
              prop: "cargoCode",
            },
            {
              label: "发货人",
              prop: "creatorName",
            },
            {
              label: "发货时间",
              prop: "sendAt",
            },
            {
              label: "发货地址",
              prop: "deliveryAddress",
            },
          ],
          statusList: [
            { status: -1, name: "待发货", color: "color-red2" },
            { status: 0, name: "待收货", color: "color-red5" },
            { status: 1, name: "已收货", color: "color-blue2" },
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
              prop: "sendNumber",
              label: "发货数量",
            },
            {
              prop: "receiveNumber",
              label: "实收数量",
            },
            {
              prop: "refusedNumber",
              label: "拒收数量",
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
          data: [],
        },
      ],
      enterpriseList:[],
      drawerorder: false,
      infoLabel: [
        {
          list: [
            {
              label: "采购订单号",
              prop: "purchaseCode",
            },
            {
              label: "客户名称",
              prop: "supplierCompanyName",
            },
            {
              label: "联系人",
              prop: "linkmanName",
            },
            {
              label: "联系方式",
              prop: "linkmanPhone",
            },
            {
              label: "下达日期",
              prop: "issuedAt",
            },
            {
              label: "收货地址",
              prop: "deliveryAddress",
            },
            {
              label: "接收日期",
              prop: "receivedAt",
            },
            {
              label: "交货日期",
              prop: "deliveredAt",
            },
            {
              label: "制单人",
              prop: "creatorName",
            },
            {
              label: "制单日期",
              prop: "createdAt",
            },
          
          ],
          statusList: [
            { status: 0, name: "待下发", color: "color-purple1" },
            { status: 1, name: "下发待确认", color: "color-orange1" },
            { status: 2, name: "变更待确认", color: "color-orange1" },
            { status: 3, name: "订单已拒绝", color: "color-purple2" },
            { status: 4, name: "变更已拒绝", color: "color-purple2" },
            { status: 5, name: "已确认", color: "color-blue2" },
            { status: 6, name: "已完成", color: "color-blue2" },
            { status: 7, name: "已中止", color: "color-red5" },
          ],
        },
        {
          list: [
            {
              label: "采购订单号",
              prop: "purchaseCode",
            },
            {
              label: "客户名称",
              prop: "supplierCompanyName",
            },
            {
              label: "联系人",
              prop: "linkmanName",
            },
            {
              label: "联系方式",
              prop: "linkmanPhone",
            },
            {
              label: "下达日期",
              prop: "issuedAt",
            },
            {
              label: "收货地址",
              prop: "deliveryAddress",
            },
            {
              label: "接收日期",
              prop: "receivedAt",
            },
            {
              label: "变更人",
              prop: "abortOperatorName",
            },
            {
              label: "变更日期",
              prop: "abortAt",
            },
           
          ],
          statusList: [
            { status: 0, name: "待下发", color: "color-purple1" },
            { status: 1, name: "下发待确认", color: "color-orange1" },
            { status: 2, name: "变更待确认", color: "color-orange1" },
            { status: 3, name: "订单已拒绝", color: "color-purple2" },
            { status: 4, name: "变更已拒绝", color: "color-purple2" },
            { status: 5, name: "已确认", color: "color-blue2" },
            { status: 6, name: "已完成", color: "color-blue2" },
            { status: 7, name: "已中止", color: "color-red5" },
          ],
        },
        {
          list: [
            {
              label: "到货通知单编号",
              prop: "requirementCode",
            },
            {
              label: "到货时间",
              prop: "deliveredAt",
            },
            {
              label: "到货地址",
              prop: "deliveryAddress",
            },
            {
              label: "制单人",
              prop: "creatorName",
            },

           
          ],
          statusList: [
            { status: 0, name: "待下发", color: "color-purple1" },
            { status: 1, name: "待确认", color: "color-orange1" },
            { status: 2, name: "已确认", color: "color-blue2" },
            { status: 3, name: "已拒绝", color: "color-purple2" },
          ],
        },
        {
          list: [
            {
              label: "退货单编号",
              prop: "rejectedCode",
            },
            {
              label: "退货人",
              prop: "rejectedName",
            },
            {
              label: "退货时间",
              prop: "rejectedTime",
            },
           
          ],
          statusList: [
            { status: -1, name: "待下发", color: "color-purple1" },
            { status: 0, name: "待收货", color: "color-red5" },
            { status: 1, name: "已收货", color: "color-blue2" },
          ],
        },
        {
          list: [
            {
              label: "发货单编号",
              prop: "cargoCode",
            },
            {
              label: "发货人",
              prop: "cargoName",
            },
            {
              label: "发货时间",
              prop: "sendAt",
            },
            {
              label: "发货地址",
              prop: "deliveryAddress",
            },
          ],
          statusList: [
            { status: -1, name: "待发货", color: "color-red2" },
            { status: 0, name: "待收货",color: "color-red5" },
            { status: 1, name: "已收货",color: "color-blue2"  },
          ],
        },
      ],
      baseTableLabel: [
        {
          prop: "materialCode",
          label: "物料编号",
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
          prop: "rejectNumber",
          label: "拒收数量",
        },
        {
          prop: "returnsNumber",
          label: "退货数量",
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
      materielLabel: [
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
      queryData: {
        status: "",
      },
      receiptTime: "",
      tableList: [],
      statusList: [
        {
          statusName: "待发货",
          statusId: -1,
        },
        {
          statusName: "已收货",
          statusId: 1,
        },
        {
          statusName: "待收货",
          statusId: 0,
        },
      ],
      pageNum: 1,
      pageSize: 10,
      total: 100,
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
    this.getEnterpriseList()
  },
  methods: {
    timeChange() {
        if (this.receiptTime != null && this.receiptTime.length > 0) {
          this.queryData.createdAtStart = this.receiptTime[0];
          this.queryData.createdAtEnd = this.receiptTime[1];
        } else {
          this.queryData.createdAtStart = "";
          this.queryData.createdAtEnd = "";
        }
    },
     clickOrder(id) {
      this.drawerorder = true;
      purchaseDetail({ id }).then(({ data: res }) => {
        if (res.code == 200) {
          let {
            cargoList,
            changeLogList,
            purchaseBaseInfoVo,
            rejectedList,
            requirementList,
          } = res.data;
          //转成组件数据格式
          this.detailData[0].data = [purchaseBaseInfoVo];//基础信息
          this.detailData[1].data = changeLogList;//变更记录
          this.detailData[2].data = requirementList;//客户到货通知单
          this.detailData[3].data = rejectedList;//退货信息
          this.detailData[4].data = cargoList;//发货/客户收货
        } else {
          this.$message.error(res.message);
        }
      });
    },

    //获取企业列表
    getEnterpriseList() {
      supplyApi.getEnterpriselist().then((res) => {
        if (res.data.code === 200) {
          this.enterpriseList = res.data.data;
        }
      });
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize=val;
      this.getMenuList()
    },
    // 分页
    handleCurrentChange(val) {
      this.pageNum=val;
      this.getMenuList()
    },
    // 订单状态
    orderStatus(val) {
      let status = {};
	    if (val === -1) {
        status = { name: "待发货", color: "#FB94D6" };
      }else if (val === 1) {
        status = { name: "已收货", color: "#25B6FF" };
      } else if (val === 0) {
        status = { name: "待收货", color: "#F43E3E" };
      }
      return status;
    },
    //查询
    getMenuList(str) {
      if(str==='init'){
        this.pageNum=1
      }
      this.queryData.pageNum=this.pageNum
      this.queryData.pageSize=this.pageSize
      this.queryData.entranceMark='SUPPLIER'
      supplyApi.getDispatchBillQuery(this.queryData).then(res=>{
        if(res.data.code===200){
          this.total=res.data.data.total
          this.tableList=res.data.data.content
        }
      })
    },
    //重置
    clearSearch() {
      this.queryData = {status:''};
      this.receiptTime = "";
      this.getMenuList('init')
    },
  },
};
</script>

<style lang="less" scoped>
.dispatchBillQueryMain {
  // height: calc(100vh - 198px);
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
    // .demo-form-inline {
    //   .labelWidth {
    //     /deep/.el-form-item__label {
    //       width: 140px !important;
    //     }
    //   }
    // }
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
       .none {
        // width：100%;
        height: 300px;
        text-align: center;
        line-height: 300px;
        color: #909399;
        font-size: 14px;
      }
      .orderNumber {
        padding: 0 20px;
        width: 100%;
        height: 100%;
        display: flex;
        box-sizing: border-box;
        .titleContentleft {
          width: 85%;
          height: 70px;
          padding: 5px 0;
          .titleContent {
            height: 30px;
            line-height: 30px;
            display: flex;
            div {
              max-width: 300px;
              width: 16%;
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
          width: 15%;
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
        margin-top: 20px;
      }
      /deep/.el-collapse
        .el-collapse-item:nth-child(1)
        div
        .el-collapse-item__header {
        background: #dfeafa;
      }
      // .pageBottom {
      //   text-align: center;
      //   margin-top: 15px;
      // }
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
}
.addoredit{
  /deep/ .el-drawer{
    border-radius: 20px 0 0 20px;
  }
}
</style>
