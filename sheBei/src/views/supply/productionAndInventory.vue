<template>
  <div class="productionAndInventoryMain">
    <div class="btnChange">
      <div
        @click="planOrInventory('plan')"
        class="wordsBtn"
        :style="{ color: active == 'plan' ? '#43a0fe' : 'black' }"
      >
        生产计划
      </div>
      <div
        @click="planOrInventory('inventory')"
        class="wordsBtn"
        :style="{ color: active == 'inventory' ? '#43a0fe' : 'black' }"
      >
        库存
      </div>
    </div>
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
              v-model="queryData.companyName"
              class="inputWidth"
              prefix-icon="el-icon-search"
              placeholder="请输入关键字搜索"
            ></el-input>
          </el-form-item> -->
          <el-form-item class="formRight" label="客户名称：">
            <el-select
                v-model="queryData.companyId" 
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
          <el-form-item label="下达时间：">
            <div class="block">
              <el-date-picker
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                class="inputWidth"
                v-model="receiptTime"
                type="datetimerange"
                change="datachange"
                :picker-options="pickerOptions"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="timeChange('下达时间')"
                align="right"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item class="formRight" label="联系人：">
            <el-input
              v-model="queryData.contactName"
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
          <el-form-item class="formRight" label="交货日期：">
            <el-date-picker
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              class="inputWidth"
              v-model="sureTime"
              type="datetimerange"
              change="datachange"
              :picker-options="pickerOptions"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="timeChange('交货日期')"
              align="right"
            ></el-date-picker>
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
      <div class="btnBox">
        <el-button type="primary" @click="addOrEditPlanOrInventory('add')" v-if="active === 'plan'" >新增生产计划</el-button>
        <el-button type="primary" @click="addOrEditPlanOrInventory('add')" v-if="active !== 'plan'" >
          <span style="visibility:hidden">占</span>新增入库<span style="visibility:hidden">位</span>
          </el-button>
      </div>
      <div class="tableMainQin">
        <el-collapse>
          <el-collapse-item v-for="(item, i) in tableList" :key="i">
            <template slot="title">
              <div class="orderNumber">
                <div class="titleContentleft">
                  <div class="titleContent">
                    <div class="clickOrder" @click.stop="clickOrder(item.purchaseId)">
                      <span>采购订单号：</span>
                      <span :title="item.purchaseCode">{{
                        item.purchaseCode
                      }}</span>
                    </div>
                    <div>
                      <span>下达时间：</span>
                      <span :title="item.issuedAt">{{ item.issuedAt }}</span>
                    </div>
                    <div>
                      <span>交货日期：</span>
                      <span :title="item.deliveredAt">{{
                        item.deliveredAt
                      }}</span>
                    </div>
                    <div>
                      <span>客户名称：</span>
                      <span :title="item.supplierCompanyName">{{
                        item.supplierCompanyName
                      }}</span>
                    </div>
                    <div>
                      <span>联系人：</span>
                      <span :title="item.contactName?item.contactName+' '+item.phone:''">{{
                       item.contactName?item.contactName+' '+item.phone:''
                      }}</span>
                    </div>
                  </div>
                  <div class="titleContent">
                    <div>
                      <span>地址：</span>
                      <span :title="item.deliveryAddress">{{
                        item.deliveryAddress
                      }}</span>
                    </div>
                    <div v-if="active === 'plan'">
                      <span>生产计划更新时间：</span>
                      <span :title="item.updatedAt">{{ item.updatedAt }}</span>
                    </div>
                    <div v-if="active === 'inventory'">
                      <span>入库更新时间：</span>
                      <span :title="item.updatedAt">{{ item.updatedAt }}</span>
                    </div>
                  </div>
                </div>
                <div class="titleContentright">
                  <div class="downLoad" @click.stop="downLoad">
                    <!-- 下载附件 -->
                  </div>
                  <!-- <div
                    :style="{
                      color: orderStatus(item.status).color + '!important',
                    }"
                  >
                    {{ orderStatus(item.status).name }}
                  </div> -->
                </div>
              </div>
            </template>
            <div style="width：100%;">
              <el-table
                ref="multipleTable"
                :key="i"
                :data="item.list"
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
                  type="index"
                  label="序号"
                  width="100"
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
                  width="250"
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
                  prop="unit"
                  label="单位"
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
                  v-if="active == 'plan'"
                  sortable
                  prop="manufactureDate"
                  label="计划生产日期"
                  min-width="2"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  v-if="active == 'plan'"
                  sortable
                  prop="manufactureNum"
                  label="计划生产数量"
                  min-width="2"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  v-if="active == 'plan'"
                  sortable
                  prop="completeNum"
                  label="计划完成数量"
                  min-width="2"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  v-if="active == 'inventory'"
                  sortable
                  prop="storageNum"
                  label="入库数量"
                  min-width="2"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  sortable
                  prop="remarks"
                  label="备注"
                  min-width="2"
                  align="center"
                  show-overflow-tooltip
                ></el-table-column>
              </el-table>
              <div class="editAndDelBtnBox">
                <el-button @click="addOrEditPlanOrInventory('edit',item)">编辑</el-button>
                <el-button @click="delPlanOrInventory(item.id)">删除</el-button>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div class="none" v-show="tableList.length < 1" >暂无数据</div>
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

    <!-- 新增/编辑生产计划/入库 -->
    <el-drawer
      :title="planTitle"
      :visible.sync="planDrawer"
      direction="rtl"
      size="90%"
      :before-close="handleClose"
      class="addoredit"
    >
      <div class="planDrawer">
        <el-form
          :model="fromData"
          :inline="true"
          :rules="Rules"
          ref="fromData"
          label-width="100px"
          class="fromData"
          :key="active"
        >
          <el-card class="planTitleBox">
          <div class="placeHolder">请选择客户名称，再选择采购订单，全部单选</div>
            <el-form-item label="客户名称" prop="purchaserCompanyId" class="planName">
              <el-select
                v-model="fromData.purchaserCompanyId"
                placeholder="请选择客户名称"
                filterable
                clearable
              >
                <el-option
                  v-for="item in purchaserCompanyNameList"
                  :key="item.companyId"
                  :label="item.companyName"
                  :value="item.companyId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="采购订单号" prop="purchaseCode" class="planName" >
              <el-select
                v-model="fromData.purchaseCode"
                placeholder="采购订单号"
              >
              <el-option :label="fromData.purchaseCode" :value="fromData.purchaseCode"></el-option>
              </el-select>
            <div class="zhezhaoceng" @click="clickInput"></div>
            </el-form-item>
            <!-- <el-form-item label="采购订单号" prop="purchaseCode">
              <div class="downBtn" @click="clickInput">
                <div class="flex">{{this.pageInfo.purchaseCode? this.pageInfo.purchaseCode:'采购订单号'}} </div>
                <i class="el-icon-caret-bottom"></i>
              </div>
            </el-form-item> -->
          </el-card>

          <el-card class="containerBox">
            <span>{{active==='plan' ? '生产计划信息':'入库信息'}}</span>
            <div class="planDrawerTableBtnBox">
              <el-button type="primary" @click="addData" class="btnLengAndHeight"
                >新增</el-button
              >
              <el-button type="primary" @click="handleDelete('more')" class="btnLengAndHeight"
                >批量删除</el-button
              >
            </div>
            <el-table
              class="mytable"
              ref="fromDataTable"
              :data="fromData.list"
              :row-style="{ height: '40px' }"
              :header-row-style="{ height: '40px' }"
              :cell-style="{ padding: '1px' }"
              style="width: 100%"
              :header-cell-style="{
                background: '#eef1f6',
                color: '#606266',
              }"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55"> </el-table-column>
              <el-table-column
                align="center"
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
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                sortable
                prop="materialName"
                label="物料名称"
              ></el-table-column>
              <el-table-column
                sortable
                prop="specification"
                label="规格/型号"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                sortable
                prop="unit"
                label="单位"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                sortable
                prop="orderingNumber"
                label="订货数量"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable label="计划生产日期"  v-if="active==='plan'">
                <template slot-scope="scope">
                  <el-form-item :prop="`list.${scope.$index}.manufactureDate`" :rules="Rules.manufactureDate">
                    <!-- <el-input
                      v-model="scope.row.manufactureDate"
                      placeholder="手动填写"
                      class="inputBorder"
                    ></el-input> -->
                    <div class="block">
                      <el-date-picker
                        class="inputBorder"
                        placeholder="手动填写"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        v-model="scope.row.manufactureDate"
                        type="datetime"
                        align="right"
                      ></el-date-picker>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column sortable label="计划生产数量" v-if="active==='plan'" >
                <template slot-scope="scope">
                  <el-form-item :prop="`list.${scope.$index}.manufactureNum`" :rules="Rules.manufactureNum">
                    <el-input
                      v-model="scope.row.manufactureNum"
                      placeholder="手动填写"
                      :maxlength="11"
                      class="inputBorder"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column sortable label="计划完成数量" v-if="active==='plan'">
                <template slot-scope="scope">
                  <el-form-item :prop="`list.${scope.$index}.completeNum`"  :rules="Rules.completeNum">
                    <el-input
                      v-model="scope.row.completeNum"
                      :maxlength="11"
                      placeholder="手动填写"
                      class="inputBorder"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column sortable label="入库数量" v-if="active==='inventory'" >
                <template slot-scope="scope">
                  <el-form-item :prop="`list.${scope.$index}.storageNum`" :rules="Rules.storageNum">
                    <el-input
                      v-model="scope.row.storageNum"
                      :maxlength="11"
                      placeholder="手动填写"
                      class="inputBorder"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column sortable label="备注">
                <template slot-scope="scope">
                  <el-form-item prop="remarks">
                    <el-input
                      v-model="scope.row.remarks"
                      :maxlength="200"
                      placeholder="手动填写"
                      class="inputBorder"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column sortable label="操作">
                <template slot-scope="scope">
                  <el-button
                     type="text"
                    @click="handleDelete(scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-form>
        <div class="planSureBox">
          <el-button @click="planDrawer = false" class="btnLengAndHeight">取消</el-button>
          <el-button type="primary" @click="saveData" class="btnLengAndHeight">保存</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 新增行-->
    <el-dialog
      :title="active==='plan'?'新增物料生成计划':'新增物料入库'"
      :visible.sync="planDialogVisible"
      width="30%"
      :before-close="AddSure"
      class="addhang"
    >
    <div slot="title" class="dialog-title">
      <span class="xian1"></span>
      <span>{{active==='plan'?'新增物料生成计划':'新增物料入库'}}</span>
    </div>
      <el-form
        label-width="125px"
        :model="planAddItem"
        :rules="Rules"
        ref="planAddItem"
        class="planAddItem"
      >
        <el-form-item label="物料编码：" prop="purchaseMaterialId">
          <el-select
            v-model="planAddItem.purchaseMaterialId"
            class="inputWidth"
            @change="changeMaterialCode"
          >
            <el-option
              v-for="(item, i) in materialCodeList"
              :key="i"
              :label="item.materialCode"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库量：" prop="storageNum" v-if="active==='inventory'">
          <el-input
            v-model="planAddItem.storageNum"
            class="inputWidth"
            :maxlength="11"
          ></el-input>
        </el-form-item>
        <el-form-item label="物料名称：" prop="materialName">
          <el-input
            v-model="planAddItem.materialName"
            disabled
            class="inputWidth"
          ></el-input>
        </el-form-item>
        <el-form-item label="计划生产日期：" prop="manufactureDate" v-if="active==='plan'">
          <div class="block">
            <el-date-picker
              class="inputWidth"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              v-model="planAddItem.manufactureDate"
              type="datetime"
              align="right"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="计划生产数量：" prop="manufactureNum" v-if="active==='plan'">
          <el-input
            v-model="planAddItem.manufactureNum"
            :maxlength="11"
            class="inputWidth"
          ></el-input>
        </el-form-item>
        <el-form-item label="计划完成数量：" prop="completeNum" v-if="active==='plan'">
          <el-input
            v-model="planAddItem.completeNum"
            class="inputWidth"
            :maxlength="11"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input
            v-model.trim="planAddItem.remarks"
            type="textarea"
            class="inputWidth"
            :maxlength="200"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="AddSure('取消')">取 消</el-button>
        <el-button type="primary" @click="AddSure('确定')">确 定</el-button>
      </span> -->
      <div class="dialog-footer">
        <el-button @click="AddSure('取消')" class="btnLengAndHeight">取 消</el-button>
        <el-button type="primary" @click="AddSure('确定')" class="btnLengAndHeight">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 采购订单号弹出窗 -->
    <el-drawer
        class="addoredit"
        title="选择采购订单号"
        :append-to-body="true"
        :visible.sync="showDrawer"
        size="85%"
        direction="rtl">
      <selectOrder @closeDialog="closeDialog"></selectOrder>
    </el-drawer>

    <!-- 订单详情 -->
    <el-drawer
      class="drawer addoredit"
      title="采购订单详情"
      :visible.sync="drawerorder"
      size="90%"
    >
      <OrderDetail :detailData="detailData"> </OrderDetail>
    </el-drawer>

  </div>
</template>

<script>
import { goodsPriceCheck,testTwoSmallNum } from "@/utils/verification.js";
import { supplyApi } from "@/api/user.js";
import selectOrder from "@views/dispatchBill/components/selectOrder";
import OrderDetail from "@/views/buyer/components/orderDetail";
import { purchaseDetail } from "@/api/order.js";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      getPurchaseList: 'selectedList/getPurchaseList',
    }),
  },
  components: {
    selectOrder,
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
      planTitle: "新增生产计划",
      planDrawer: false,
      planDialogVisible: false,
      fromData: {},
      planFormTableInput: {},
      list: [],
      planAddItem: {},
      materialCodeList: [],
      showDrawer: false, // 是否弹出抽屉
      pageInfo:{},
      edit:{},
      val: {},
      tanchuanStatue:'',
      multipleSelection: [],
      purchaserCompanyNameList: [],
      receiptTime: "",
      sureTime: "",
      queryData: { status: "" },
      statusList: [
        {
          statusName: "待下发",
          statusId: 0,
        },
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
      tableList: [],
      active: "plan",
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
      Rules: {
        purchaserCompanyId: [
          { required: true, message: "请选择客户名称", trigger: "change" },
        ],                                   //客户名称
        purchaseCode: [{ required: true, message: "请选择采购订单编码",trigger: "change"  }], //采购订单编码
        purchaseMaterialId: [
          { required: true, message: "请选择物料编码", trigger: "change" },
        ],                                    //物料编码
        materialName: [{ required: true, message: " " ,trigger: "change"}],   //物料名称
        manufactureDate: [
          { required: true, message: "计划生产日期不能为空", trigger: "blur" },
        ],                                    //计划生产日期
        manufactureNum: [
          { required: true, message: "计划生产数量不能为空", trigger: "blur" },
          { validator:goodsPriceCheck, trigger: "blur" },
          { validator:testTwoSmallNum, trigger: "blur" },
        ],                                     //计划生产数量
        completeNum: [
          { validator:goodsPriceCheck, trigger: "blur" },
          { validator:testTwoSmallNum, trigger: "blur" },
        ],                                     //计划完成数量
        storageNum: [
          { required: true, message: "入库数量不能为空", trigger: "blur" },
          { validator:goodsPriceCheck, trigger: "blur" },
          { validator:testTwoSmallNum, trigger: "blur" },
        ],                                     //入库量
      },
    };
  },
  created() {
    this.getMenuList();
    this.getEnterpriseList();
  },
  methods: {
    timeChange(str) {
      if (str === "下达时间") {
        if (this.receiptTime != null && this.receiptTime.length > 0) {
          this.queryData.issuedAtStartTime = this.receiptTime[0];
          this.queryData.issuedAtEndTime = this.receiptTime[1];
        } else {
          this.queryData.issuedAtStartTime = "";
          this.queryData.issuedAtEndTime = "";
        }
      } else if (str === "交货日期") {
        if (this.sureTime != null && this.sureTime.length > 0) {
          this.queryData.deliveredAtStartTime = this.sureTime[0];
          this.queryData.deliveredAtEndTime = this.sureTime[1];
        } else {
          this.queryData.deliveredAtStartTime = "";
          this.queryData.deliveredAtEndTime = "";
        }
      }
    },

    //获取企业列表
    getEnterpriseList() {
      supplyApi.getEnterpriselist().then((res) => {
        if (res.data.code === 200) {
          this.enterpriseList = res.data.data;
        }
      });
    },
    
    //打开新增计划//入库
    addOrEditPlanOrInventory(str,item) {
      this.tanchuanStatue=str
      this.pageInfo={}
      this.fromData={}
      this.materialCodeList=[]
      if (str === "add") {
        if(this.active==='plan'){
          this.planTitle = "新增生产计划";
        }else{
          this.planTitle = "新增入库";
        }
        this.fromData.list=[];
      } else {
        if(this.active==='plan'){
          this.planTitle = "编辑生产计划";
        }else{
          this.planTitle = "编辑入库";
        }
        console.log(item,333);
        this.fromData=item
        this.getEditMaterial(item.purchaseId)
      }
      this.planDrawer = true;
      this.$nextTick(()=>{
        this.$refs.fromData.clearValidate()
      })
      this.getPurchaserCompanyNameList();
      //
      // this.fromData.purchaserCompanyId=3
    },

    //获取客户名称列表
    getPurchaserCompanyNameList() {
      supplyApi.getPurchaserCompanyName().then((res) => {
        if (res.data.code === 200) {
          this.purchaserCompanyNameList = res.data.data;
        }
      });
    },

    //选择物料编码
    changeMaterialCode(e) {
      this.val={}
      this.materialCodeList.forEach(item=>{
        if(item.id===e){
          this.val = item;
          console.log(this.val);
          this.planAddItem.materialName = item.materialName;
        }
      })
      this.planAddItem=JSON.parse(JSON.stringify(this.planAddItem))
    },

    //获取编辑时的物料编码
    getEditMaterial(id){
      supplyApi.getEditMaterial(id).then(res=>{
        if(res.data.code===200){
          this.materialCodeList = res.data.data
        }
      })
    },

    //保存新增计划/入库数据
    saveData() {
      this.$refs.fromData.validate((valid) => {
        if(valid){
          let api=''
          if(this.active==='plan'){
            if(this.tanchuanStatue==='add'){
              api = "getProductionAdd";
            }else{
              api = "getProductionEdit";
            }
          }else{
            if(this.tanchuanStatue==='add'){
              api = "getInventoryAdd";
            }else{
              api = "getInventoryEdit";
            }
          }
          supplyApi[api](this.fromData).then(res=>{
            if(res.data.code===200){
              this.$message({
                message: res.data.message,
                type: "success",
              });
              this.handleClose()
              this.getMenuList()
            }
          })
        }
      })
    },

    //删除计划/入库
    delPlanOrInventory(id){
      let api=''
      if(this.active==='plan'){
        api='getProductionDel'
      }else{
        api='getInventoryDel'
      }
      supplyApi[api]({id}).then((res) => {
        if (res.data.code === 200) {
          this.$message({
              message: res.data.message,
              type: "success",
            });
            this.getMenuList()
        }
      });
    },

    //关闭计划弹窗//入库
    handleClose() {
      this.planDrawer = false;
      this.getMenuList()
    },

    //打开新增行小弹窗
    addData() {
      this.planDialogVisible = true;
      this.planAddItem ={},
      this.val = {};
      this.$nextTick(()=>{
        this.$refs.planAddItem.clearValidate()
      })
    },

    //关闭新增行弹窗
    AddSure(str) {
      if (str === "确定") {
        this.$refs.planAddItem.validate((valid) => {
          if(valid){
            let flag=false
            this.fromData.list.forEach(item=>{
              if(item.purchaseMaterialId==this.val.id){
                flag=true
              }
            })
            if(flag){
              this.$message({
                message: "不可重复添加物料，请编辑物料",
                type: "warning",
              });
              return
            }
              // this.planAddItem.specification = this.val.specification;
              // this.planAddItem.unit = this.val.unit;
              // this.planAddItem.orderingNumber = this.val.orderingNumber;
              // this.planAddItem.materialCode = this.val.materialCode;
              Object.assign(this.planAddItem,this.val)
              this.planAddItem.completeNum=this.planAddItem.completeNum?this.planAddItem.completeNum:''
              this.planAddItem=JSON.parse(JSON.stringify(this.planAddItem))
              this.fromData.list.push(this.planAddItem);
              console.log(this.fromData.list);
              this.planDialogVisible = false;
          }
        })
      }else{
        this.planDialogVisible = false;
      }
    },

    //(批量)删除行
    handleDelete(e) {
      console.log(this.fromData,this.multipleSelection);
      if (e === "more") {
        if (!this.multipleSelection.length) {
          this.$message({
            message: "请勾选要删除的数据",
            type: "warning",
          });
          return;
        }
        let multipleSelectionIdArr=this.multipleSelection.map(item=>{
          return item.purchaseMaterialId
        })
        let list=this.fromData.list.filter(item=>{
          return !multipleSelectionIdArr.includes(item.purchaseMaterialId)
        })
        // this.fromData=JSON.parse(JSON.stringify(this.fromData))
        let purchaseId=this.fromData.purchaseId
        let purchaseCode=this.fromData.purchaseCode
        let purchaserCompanyId=this.fromData.purchaserCompanyId
        let id=this.fromData.id
        this.fromData={}
        this.fromData.list=list
        this.fromData.purchaseId=purchaseId
        this.fromData.purchaseCode=purchaseCode
        this.fromData.purchaserCompanyId=purchaserCompanyId
        if(id){
          this.fromData.id=id
        }

      } else {
        this.fromData.list.forEach((item, index) => {
          if (item.purchaseMaterialId === e.purchaseMaterialId) {
            this.fromData.list.splice(index, 1);
          }
        });
      }
    },

    //打开采购订单号
    clickInput() {
      console.log(111);
      this.showDrawer=true;
    },

    //选择了采购订单号
    closeDialog () {
      this.pageInfo = this.getPurchaseList
      this.fromData.purchaseId=this.getPurchaseList.id
      this.fromData.purchaseCode=this.getPurchaseList.purchaseCode
      this.fromData=JSON.parse(JSON.stringify(this.fromData))
      this.materialCodeList=this.getPurchaseList.materialList
      console.log(this.getPurchaseList);
      this.showDrawer = false
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

    //选择列表选项
    handleSelectionChange(val) {
      console.log(val, 99);
      this.multipleSelection = val;
    },

    // 分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getMenuList();
    },

    // 分页
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getMenuList();
    },

    downLoad() {
      alert("下载附件");
    },
    // 订单状态
    orderStatus(val) {
      let status = {};
      if (val === 0) {
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
      if (str === "init") {
        this.pageNum = 1;
      }
      this.queryData.current = this.pageNum;
      this.queryData.size = this.pageSize;
      let api = "getProductionQuery";
      if (this.active === "plan") {
        api = "getProductionQuery";
      } else {
        api = "getInventoryQuery";
      }
      supplyApi[api](this.queryData).then((res) => {
        if (res.data.code === 200) {
          this.total = res.data.data.total;
          this.tableList = res.data.data.records;
        }
      });
    },

    //重置
    clearSearch() {
      this.queryData = { status: "" };
      this.receiptTime = "";
      this.sureTime = "";
      this.getMenuList('init')
    },

    // table切换
    planOrInventory(val) {
      if (this.active === val) {
        return;
      }
      this.active = val;
      this.pageNum = 1;
      this.tableList = [];
      this.getMenuList();
      if (this.active === "plan") {
        console.log(this.active, "paln");
      } else if (this.active === "inventory") {
        console.log(this.active, "inventory");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.productionAndInventoryMain {
  // height: 750px;
  // overflow-y: auto;
  .btnChange {
    width: 100%;
    display: flex;
    .wordsBtn {
      padding: 5px 30px 10px 15px;
      font-size: 14px;
      cursor: pointer;
      font-weight: 600;
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
  // .btnBox {
  //   text-align: right;
  //   padding: 0 30px 15px;
  // }
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
    .btnBox {
      text-align: right;
      padding: 15px 0 0;
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
        // border-top: 0px;
        border:none
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
      // .pageBottom {
      //   text-align: center;
      //   margin-top: 15px;
      // }
      // .none {
      //   // width：100%;
      //   height: 150px;
      //   text-align: center;
      //   line-height: 150px;
      //   color: #909399;
      //   font-size: 14px;
      // }
      /deep/.el-table__header th {
        padding: 0;
        height: 50px;
        line-height: 50px;
      }
      .editAndDelBtnBox {
        text-align: right;
        padding-top: 20px;
      }
    }
  }
  .pageBottom {
    text-align: center;
    margin-top: 15px;
  }
  .planDrawer {
    padding: 0 30px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .planTitleBox {
      margin-bottom: 30px;
      border-radius: 10px;
      .placeHolder{
        font-size: 14px;
        color: red;
        margin: 0 0 20px 20px;
      }
      .planName{
        position:relative;
        /deep/.el-form-item__content .el-select{
          width: 295px;
          height: 36px;
        }
        .zhezhaoceng{
          width: 295px;
          height: 40px;
          position: absolute;
          z-index: 10;
          top: 0;
        }
      }
      .downBtn{
        padding: 0 12px;
        width: 295px;
        height: 36px;
        border-radius: 4px;
        border: solid 1px #e6eaee;
        display: flex;
        flex-direction: row;
        align-items: center;
        color:#c4cad0;
      }
      .flex{
        flex: 1;
      }
    }
    .containerBox{
      border-radius: 10px;
    }
    .planDrawerTableBtnBox {
      text-align: right;
      margin-bottom: 20px;
    }
    .inputBorder{
      /deep/ input{
        border: none;
      }
    }
    .planSureBox {
      margin: 50px 0;
      text-align: center;
    }
  }
  .planAddItem {
    .inputWidth {
      width:calc(100% - 60px) !important;
    }
  }
  .btnLengAndHeight{
    height: 40px;
    width: 100px;
  }
  .btnLengAndHeight:nth-of-type(1){
    margin-right: 20px;
  }
}
.addoredit{
  /deep/ .el-drawer{
    border-radius: 20px 0 0 20px;
  }
  .mytable {
    /deep/.el-table__body-wrapper {
      height: 250px;
    }
  }
}
.addhang{
  /deep/ .el-dialog{
    border-radius: 15px;
    /deep/ .el-dialog__header{
      padding: 20px;
      border-bottom: 1px solid #E7ECF1;
    }
  }
  .dialog-title{
    text-align: left;
    .xian1{
      border-left: 5px solid #409EFF;
      margin-right: 20px;
    }
  }
  .dialog-footer{
    text-align: center;
    margin-top: 40px;
  }
}
</style>
