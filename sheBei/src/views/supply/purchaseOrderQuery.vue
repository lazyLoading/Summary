<template>
  <div class="arrivalNoticeQueryMain">
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
          <!-- <el-form-item class="formRight" label="客户名称：">
            <el-input
              v-model="queryData.purchaserCompanyName"
              class="inputWidth"
              prefix-icon="el-icon-search"
              placeholder="请输入关键字搜索"
            ></el-input>
          </el-form-item> -->
          <el-form-item class="formRight" label="客户名称：">
            <el-select
                v-model="queryData.purchaserCompanyName" 
                placeholder="请选择客户名称"
                filterable
                clearable
                class="inputWidth">
              <el-option
                v-for="item in enterpriseList"
                :key="item.companyId"
                :label="item.companyName"
                :value="item.companyName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="labelWidth" label="下达时间：">
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
                @change="timeChange('接收时间')"
                align="right"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item class="formRight" label="联系人：">
            <el-input
              v-model="queryData.linkman"
              class="inputWidth"
              prefix-icon="el-icon-search"
              placeholder="请输入联系人/联系人手机号"
            ></el-input>
          </el-form-item>
          <el-form-item class="formRight" label="订单状态：">
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
          <el-form-item class="labelWidth" label="交货日期：">
            <div class="block">
              <el-date-picker
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                class="inputWidth"
                v-model="sureTime"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="timeChange('确认时间')"
                align="right"
              ></el-date-picker>
            </div>
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
                    <div class="clickOrder" @click.stop="clickOrder(item.id)">
                      <span>采购订单号：</span>
                      <span :title="item.purchaseCode">{{ item.purchaseCode }}</span>
                    </div>
                    <div>
                      <span>下达时间：</span>
                      <span :title="item.issuedAt">{{ item.issuedAt }}</span>
                    </div>
                    <div>
                      <span>交货日期：</span>
                      <span :title="item.deliveredAt">{{ item.deliveredAt }}</span>
                    </div>
                    <div>
                      <span>客户名称：</span>
                      <span :title="item.purchaserCompanyName">{{ item.purchaserCompanyName }}</span>
                    </div>
                    <div>
                      <span>联系人：</span>
                      <span :title="item.linkmanName?item.linkmanName+' '+item.linkmanPhone:''">{{ item.linkmanName?item.linkmanName+' '+item.linkmanPhone:''}}</span>
                    </div>
                  </div>
                  <div class="titleContent">
                    <div>
                      <span>地址：</span>
                      <span :title="item.deliveryAddress">{{ item.deliveryAddress }}</span>
                    </div>
                    <div v-if="item.status===3||item.status===4">
                      <span>拒绝时间：</span>
                      <span :title="item.refusedAt">{{ item.refusedAt }}</span>
                    </div>
                    <div v-if="item.status === 3||item.status === 4">
                      <span>拒绝原因：</span>
                      <span :title="item.refuseReason">{{ item.refuseReason }}</span>
                    </div>
                    <div v-if="item.status === 3||item.status === 4">
                      <span>拒绝人：</span>
                      <span :title="item.refusedOperatorName">{{ item.refusedOperatorName }}</span>
                    </div>
                    <div v-if="item.status === 5 || item.status === 6">
                      <span>确认时间：</span>
                      <span :title="item.confirmedAt">{{ item.confirmedAt }}</span>
                    </div>
                    <div v-if="item.status === 5 || item.status === 6">
                      <span>确认人：</span>
                      <span :title="item.confirmedOperatorName">{{ item.confirmedOperatorName }}</span>
                    </div>
                    <div v-if="item.status===7">
                      <span>中止时间：</span>
                      <span :title="item.abortAt">{{ item.abortAt }}</span>
                    </div>
                    <div v-if="item.status === 7">
                      <span>中止原因：</span>
                      <span :title="item.abortReason">{{ item.abortReason }}</span>
                    </div>
                    <div v-if="item.status === 7">
                      <span>中止人：</span>
                      <span :title="item.abortOperatorName">{{ item.abortOperatorName }}</span>
                    </div>
                    <div v-if="item.status===6">
                      <span>完成时间：</span>
                      <span :title="item.finishAt">{{ item.finishAt }}</span>
                    </div>
                  </div>
                </div>
                <div class="titleContentright">
                  <div>
                    <span class="downLoad" @click.stop="downLoad(item)" v-show="item.fileList.length">
                      下载附件
                    </span>
                  </div>
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
                  type='index'
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
                  prop="orderingNumber"
                  label="订货数量"
                  min-width="2"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  sortable
                  prop="receiveNumber"
                  label="实收数量"
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
              </el-table>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div
          v-show="tableList.length < 1"
          class='none'
        >
          暂无数据
        </div>
      </div>
    </el-card>
    <div class="pageBottom"  v-show="tableList.length > 0">
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
      enterpriseList: [],
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
      sureTime: "",
      tableList: [],
      statusList: [
        {
          statusName: "订单待确认",
          statusId: 1,
        },
        {
          statusName: "变更待确认",
          statusId: 2,
        },
        {
          statusName: "订单已拒绝",
          statusId: 3,
        },
        {
          statusName: "变更已拒绝",
          statusId: 4,
        },
        {
          statusName: "已确认",
          statusId: 5,
        },
        {
          statusName: "已完成",
          statusId: 6,
        },
        {
          statusName: "已中止",
          statusId: 7,
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
    timeChange(str) {
      if (str === "接收时间") {
        if (this.receiptTime != null && this.receiptTime.length > 0) {
          this.queryData.issuedAtStart = this.receiptTime[0]+' 00:00:00';
          this.queryData.issuedAtEnd = this.receiptTime[1]+' 23:59:59';
        } else {
          this.queryData.issuedAtStart = "";
          this.queryData.issuedAtEnd = "";
        }
      } else if (str === "确认时间") {
        if (this.sureTime != null && this.sureTime.length > 0) {
          this.queryData.deliveredAtStart = this.sureTime[0]+' 00:00:00';
          this.queryData.deliveredAtEnd = this.sureTime[1]+' 23:59:59';
        } else {
          this.queryData.deliveredAtStart = "";
          this.queryData.deliveredAtEnd = "";
        }
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

    downLoad(item) {
      supplyApi.purchaseDownload(item).then(res=>{
        const type = 'application/zip' // zip文件
        const blob = new Blob([res.data], { type: type })
        const createA = document.createElement('a')
        const href = window.URL.createObjectURL(blob)
        createA.href = href
        createA.download = item.purchaseCode + '.zip'
        document.body.appendChild(createA)
        createA.click()
        document.body.removeChild(createA) // 下载完成后移除标签
        window.URL.revokeObjectURL(href) // 释放url
      })
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
       if (val ===0) {
        status = { name: "待下发", color: "#3F26B0" };
      } else if (val === 1) {
        status = { name: "订单待确认", color: "#F96208" };
      } else if (val === 2) {
        status = { name: "变更待确认", color: "#F96208" };
      } else if (val === 3) {
        status = { name: "订单已拒绝", color: "#3E16EF" };
      } else if (val === 4) {
        status = { name: "变更已拒绝", color: "#3E16EF" };
      } else if (val === 5) {
        status = { name: "已确认", color: "#3083FF" };
      } else if (val === 6) {
        status = { name: "已完成", color: "#40A933" };
      } else if (val === 7) {
        status = { name: "已中止", color: "#999" };
      }
      return status;
    },
    //查询
    getMenuList(str) {
      if(str==='init'){
        this.pageNum=1
      }
      this.queryData.page=this.pageNum
      this.queryData.pageSize=this.pageSize
      supplyApi.getPurchaseOrderQuery(this.queryData).then(res=>{
        if(res.data.code===200){
          this.total=res.data.data.total
          this.tableList=res.data.data.records
        }
      })
    },
    //重置
    clearSearch() {
      this.queryData = { status: "" };
      this.receiptTime = "";
      this.sureTime = "";
      this.getMenuList('init')
    },
  },
};
</script>

<style lang="less" scoped>
.arrivalNoticeQueryMain {
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
          width: 70%;
          height: 70px;
          padding: 5px 0;
          .titleContent {
            height: 30px;
            line-height: 30px;
            display: flex;
            div {
              max-width: 300px;
              width: 20%;
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
      /deep/.el-table__header th {
        padding: 0;
        height: 50px;
        line-height: 50px;
      }
    }
  }
  .pageBottom {
    text-align: center;
    // margin-top: 15px;
    margin-top: 60px;
  }
}
.addoredit{
  /deep/ .el-drawer{
    border-radius: 20px 0 0 20px;
  }
}
</style>
