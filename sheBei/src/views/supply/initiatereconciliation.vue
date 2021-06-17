<template>
  <div class="statementquery">
    <el-card class="searchCard">
      <div style="margin-top: 10px; max-width: 100%">
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
          <el-form-item label="客户名称：">
            <el-select
              filterable
              class="inputWidth"
              v-model="searchContent.companyId"
              placeholder="请选择客户名称"
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
          <br />
          <!-- <el-form-item class="formRight" label="客户名称：">
            <el-input
              v-model="searchContent.purchaserCompanyName"
              class="inputWidth"
              prefix-icon="el-icon-search"
              placeholder="请输入关键字搜索"
            ></el-input>
          </el-form-item> -->
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
          <div>
            <el-button
              type="primary"
              size="small"
              @click="initiatereconciliation"
              >发起对账</el-button
            ><el-button type="primary" size="small" @click="print0"
              >打 印</el-button
            >
          </div>
        </div>
        <el-collapse v-show="tableList.length > 0">
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
                    <div :title="item.purchaserCompanyName">
                      <span>客户名称：</span>
                      <span>{{ item.purchaserCompanyName }}</span>
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
              <div class="btn" v-if="item.status == '0'">
                <el-button
                  type="primary"
                  size="small"
                  style="margin-left: 10px"
                  @click="changeStatus('申请对账', item.id, item.status)"
                  >申请对账</el-button
                >
                <el-button
                  type="primary"
                  size="small"
                  style="margin-left: 10px"
                  @click="changeStatus('编辑', item.id, item.status)"
                  >编 辑</el-button
                >
                <el-button
                  type="primary"
                  size="small"
                  style="margin-left: 10px"
                  @click="changeStatus('删除', item.id, item.status)"
                  >删 除</el-button
                >
              </div>
              <div class="btn" v-if="item.status == '1'">
                <el-button
                  type="primary"
                  size="small"
                  style="margin-left: 10px"
                  @click="changeStatus('撤回', item.id, item.status)"
                  >撤 回</el-button
                >
                <el-button
                  type="primary"
                  size="small"
                  style="margin-left: 10px"
                  @click="changeStatus('编辑', item.id, item.status)"
                  >编 辑</el-button
                >
                <el-button
                  type="primary"
                  size="small"
                  style="margin-left: 10px"
                  @click="changeStatus('删除', item.id, item.status)"
                  >删 除</el-button
                >
              </div>
              <div class="btn" v-if="item.status == '2'">
                <el-button
                  type="primary"
                  size="small"
                  style="margin-left: 10px"
                  @click="myPayStaus0(item.id, item.status)"
                  >付款状态</el-button
                >
              </div>
              <div class="btn" v-if="item.status == '3'">
                <el-button
                  type="primary"
                  size="small"
                  style="margin-left: 10px"
                  @click="changeStatus('重新发起申请', item.id, item.status)"
                  >重新发起申请</el-button
                >
                <el-button
                  type="primary"
                  size="small"
                  style="margin-left: 10px"
                  @click="changeStatus('编辑', item.id, item.status)"
                  >编辑</el-button
                >
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <el-dialog
          top="10vh"
          class="detail"
          width="500px"
          title="付款状态"
          :destroy-on-close="true"
          :close-on-click-modal="false"
          :visible.sync="dialogFormVisible"
        >
          <div slot="title" class="header-title">
            <div>
              <div class="greyline"></div>
              &nbsp;付款状态
            </div>
            <div class="blueline"></div>
          </div>
          <el-form
            :rules="rules"
            ref="ReasonsRejection"
            :model="ReasonsRejection"
            label-width="130px"
          >
            <el-form-item label="付款状态：" prop="paidStatus">
              <el-select
                style="width: 300px"
                v-model="ReasonsRejection.paidStatus"
                placeholder="请选择付款状态"
              >
                <el-option
                  v-for="(item, i) in payStatusList"
                  :key="i"
                  :label="item.statusName"
                  :value="item.statusId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="付款进度/金额：" prop="paidProgress">
              <el-input
                style="width: 300px"
                maxlength="200"
                v-model="ReasonsRejection.paidProgress"
              ></el-input>
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              <el-input
                style="width: 300px"
                type="textarea"
                show-word-limit
                maxlength="200"
                v-model.trim="ReasonsRejection.remark"
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
              @click="submitForm('ReasonsRejection', '付款状态')"
              >确 定</el-button
            >
          </div>
        </el-dialog>
        <el-dialog
          top="10vh"
          class="detail"
          width="500px"
          title="删除确认"
          :destroy-on-close="true"
          :close-on-click-modal="false"
          :visible.sync="dialogDel"
        >
          <div slot="title" class="header-title">
            <div>
              <div class="greyline"></div>
              &nbsp;删除确认
            </div>
            <div class="blueline"></div>
          </div>
          <div style="text-align: center">是否确定删除?</div>
          <div slot="footer" class="dialog-footer">
            <el-button style="width: 120px" @click="dialogDel = false"
              >取 消</el-button
            >
            <el-button
              style="width: 120px"
              type="primary"
              @click="sureDel(mystatus, '删除')"
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
    <!-- 发起对账 -->
    <el-drawer
      class="drawer"
      :title="addOrEdit"
      :visible.sync="drawer"
      :before-close="clearContent"
      size="90%"
    >
      <div>
        <el-card class="searchone">
          <div class="top">
            <div>
              申请对账单号：<span>{{ editOrAdd.compareCode }}</span>
            </div>
            <div class="tip">
              请选择客户名称，再选择发货通知单和退货单，发货通知单和退货单可以多选，客户名称只能单选
            </div>
          </div>
          <div class="search">
            <el-form>
              <el-form-item
                label="客户名称："
                :rules="{
                  required: true,
                }"
              >
                <el-select
                  filterable
                  style="width: 300px"
                  v-model="purchaserCompanyId"
                  placeholder="输入客户名称/支持下拉和搜索"
                  @change="companyIdChange"
                >
                  <el-option
                    v-for="(item, i) in companyList"
                    :key="i"
                    :label="item.companyName"
                    :value="item.companyId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <el-card class="searchtwo">
          <div class="top">
            <div>申请对账物料信息</div>
            <div class="tip">
              <el-button
                type="primary"
                size="small"
                style="margin-left: 10px"
                @click="chooseDelivery('delivery')"
                >选择发货单</el-button
              >
              <el-button
                type="primary"
                size="small"
                style="margin-left: 10px"
                @click="chooseDelivery('return')"
                >选择退货单</el-button
              >
            </div>
          </div>
          <div class="bottom">
            <el-form
              :model="editOrAdd"
              ref="editOrAdd"
              size="small"
              :rules="rules"
            >
              <el-table
                class="mytable"
                ref="table"
                :data="editOrAdd.materialList"
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
                  label="序号"
                  width="100"
                >
                  <template slot-scope="scope">
                    <div>{{ scope.$index + 1 }}</div>
                  </template>
                </el-table-column>

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
                  width="100"
                ></el-table-column>
                <el-table-column
                  sortable
                  prop="unitPrice"
                  label="单价（￥）"
                  width="160"
                >
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="`materialList.${scope.$index}.unitPrice`"
                      :rules="rules.unitPrice"
                    >
                      <el-input
                        v-model="scope.row.unitPrice"
                        placeholder="请手动填写"
                        maxlength="11"
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  sortable
                  prop="receiveNumber"
                  label="实收数量"
                  width="140"
                  align="center"
                >
                  <!-- <template slot-scope="scope">
                    <el-form-item
                      :prop="`materialList.${scope.$index}.receiveNumber`"
                      :rules="rules.receiveNumber"
                    >
                      <el-input
                        v-model.number="scope.row.receiveNumber"
                        placeholder="请手动填写"
                      ></el-input>
                    </el-form-item>
                  </template> -->
                </el-table-column>
                <el-table-column
                  sortable
                  prop="refuseNumber"
                  label="拒收数量"
                  width="140"
                  align="center"
                >
                  <!-- <template slot-scope="scope">
                    <el-form-item
                      :prop="`materialList.${scope.$index}.refuseNumber`"
                      :rules="rules.refuseNumber"
                    >
                      <el-input
                        v-model.number="scope.row.refuseNumber"
                        placeholder="请手动填写"
                      ></el-input>
                    </el-form-item>
                  </template> -->
                </el-table-column>
                <el-table-column
                  sortable
                  prop="rejectNumber"
                  label="退货数量"
                  width="140"
                  align="center"
                >
                  <!-- <template slot-scope="scope">
                    <el-form-item
                      :prop="`materialList.${scope.$index}.rejectNumber`"
                      :rules="rules.rejectNumber"
                    >
                      <el-input
                        v-model.number="scope.row.rejectNumber"
                        placeholder="请手动填写"
                      ></el-input>
                    </el-form-item>
                  </template> -->
                </el-table-column>
                <el-table-column
                  sortable
                  prop="remark"
                  label="备注"
                  width="220"
                >
                  <template slot-scope="scope">
                    <el-form-item>
                      <el-input
                        v-model="scope.row.remark"
                        placeholder="请手动填写（不超过50字）"
                        maxlength="50"
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column sortable prop="remark" label="操作" width="80">
                  <template slot-scope="scope">
                    <span
                      style="color: red; cursor: pointer"
                      @click="delIndex(scope)"
                      >删除</span
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </div>
        </el-card>
        <el-card class="searchthree">
          <div class="top">
            <div>填写对账信息</div>
          </div>
          <div class="search">
            <el-form label-width="140px" :inline="true">
              <el-form-item label="申请对账金额：" :rules="{ required: true }">
                <el-input
                  v-model="editOrAdd.compareAmount"
                  style="width: 250px"
                  placeholder="请输入对账金额"
                  maxlength="11"
                ></el-input>
              </el-form-item>
              <el-form-item label="申请对账周期：">
                <el-date-picker
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  style="width: 250px"
                  v-model="compareTime"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="timeChange1"
                  align="right"
                ></el-date-picker>
              </el-form-item>
              <br />
              <el-form-item label="对账说明：" prop="other">
                <el-input
                  style="width: 650px"
                  type="textarea"
                  show-word-limit
                  maxlength="50"
                  placeholder="输入说明0-50个字"
                  v-model.trim="editOrAdd.compareStatement"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <div style="text-align: center">
          <el-button
            type="primary"
            style="margin-left: 10px"
            plain
            @click="giveUpEdit"
            >取 消</el-button
          >
          <el-button
            type="primary"
            style="margin-left: 10px"
            @click="submitForm('editOrAdd')"
            >保 存</el-button
          >
        </div>
      </div>
    </el-drawer>
    <el-drawer
      class="drawer"
      :title="titleName"
      :visible.sync="drawerDelivery"
      :before-close="clearSendSearch"
      size="90%"
    >
      <el-card class="searchCard">
        <div style="margin-top: 10px">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item
              v-if="showOrHide == 'delivery'"
              class="formRight"
              label="发货单号："
            >
              <el-input
                v-model="sendSearch.cargoCode"
                class="inputWidth"
                prefix-icon="el-icon-search"
                placeholder="请输入关键字搜索"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-if="showOrHide == 'return'"
              class="formRight"
              label="退货单号："
            >
              <el-input
                v-model="sendSearch.rejectedCode"
                class="inputWidth"
                prefix-icon="el-icon-search"
                placeholder="请输入关键字搜索"
              ></el-input>
            </el-form-item>
            <el-form-item label="下达时间：">
              <div class="block">
                <el-date-picker
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  class="inputWidth"
                  v-model="timeXiada"
                  type="datetimerange"
                  change="datachange"
                  :picker-options="pickerOptions"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="timeChange2"
                  align="right"
                ></el-date-picker>
              </div>
            </el-form-item>
            <el-form-item v-if="showOrHide == 'delivery'" label="交货日期：">
              <div class="block">
                <el-date-picker
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  class="inputWidth"
                  v-model="timeJiaohuo"
                  type="datetimerange"
                  change="datachange"
                  :picker-options="pickerOptions"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="timeChange3"
                  align="right"
                ></el-date-picker>
              </div>
            </el-form-item >
            <el-form-item v-if="showOrHide == 'return'" label="退货日期：">
              <div class="block">
                <el-date-picker
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  class="inputWidth"
                  v-model="timeJiaohuo"
                  type="datetimerange"
                  change="datachange"
                  :picker-options="pickerOptions"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="timeChange3"
                  align="right"
                ></el-date-picker>
              </div>
            </el-form-item >
            <!-- <el-form-item class="formRight" label="状态：">
              <el-select v-model="sendSearch.status" class="inputWidth">
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="(item, i) in sendStatus"
                  :key="i"
                  :label="item.statusName"
                  :value="item.statusId"
                ></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item>
              <el-button
                type="primary"
                style="margin-left: 10px"
                @click="searchIs"
                >查询</el-button
              >
              <el-button
                type="primary"
                style="margin-left: 10px"
                @click="clearsent"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </el-card>
      <el-card class="searchfour">
        <el-table
          v-if="showOrHide == 'delivery'"
          ref="sentTableList"
          :data="sentTableList"
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
          <el-table-column
            type="selection"
            :selectable="checkSelectable"
            width="55"
          >
          </el-table-column>
          <el-table-column
            align="center"
            sortable
            prop="orderId"
            label="序号"
            width="100"
          ></el-table-column>
          <el-table-column
            sortable
            prop="purchaseCode"
            label="采购订单号"
            min-width="2"
          ></el-table-column>
          <el-table-column
            sortable
            prop="buyerCompanyName"
            label="客户名称"
            min-width="2"
          ></el-table-column>
          <el-table-column
            sortable
            prop="cargoCode"
            label="发货单号"
            min-width="2"
          ></el-table-column>
          <el-table-column
            sortable
            prop="sendAt"
            label="发货时间"
            min-width="2"
          ></el-table-column>
          <el-table-column
            sortable
            prop="statusName"
            label="发货单状态"
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
            prop="sendNumber"
            label="送货数量"
            width="100"
          ></el-table-column>
          <el-table-column
            sortable
            prop="receiveNumber"
            label="实收数量"
            width="140"
          ></el-table-column>
          <el-table-column
            sortable
            prop="refusedNumber"
            label="拒收数量"
            width="100"
          ></el-table-column>
          <el-table-column
            sortable
            prop="unit"
            label="单位"
            width="80"
          ></el-table-column>
        </el-table>
        <el-table
          v-if="showOrHide == 'return'"
          ref="rejectedTableList"
          :data="rejectedTableList"
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
          <el-table-column
            type="selection"
            :selectable="checkSelectable"
            width="55"
          >
          </el-table-column>
          <el-table-column
            align="center"
            sortable
            prop="orderId"
            label="序号"
            width="100"
          ></el-table-column>
          <el-table-column
            sortable
            prop="purchaseCode"
            label="采购订单号"
            min-width="2"
          ></el-table-column>
          <el-table-column
            sortable
            prop="buyerCompanyName"
            label="客户名称"
            min-width="2"
          ></el-table-column>
          <el-table-column
            sortable
            prop="rejectedCode"
            label="退货单号"
            min-width="2"
          ></el-table-column>
          <el-table-column
            sortable
            prop="rejectedTime"
            label="退货时间"
            min-width="2"
          ></el-table-column>
          <el-table-column
            sortable
            prop="statusName"
            label="退货单状态"
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
            prop="rejectedNumbers"
            label="退货数量"
            min-width="2"
          ></el-table-column>
          <el-table-column
            sortable
            prop="unit"
            label="单位"
            min-width="1"
          ></el-table-column>
        </el-table>
        <div class="pageBottom">
          <el-pagination
            @size-change="handleSizeC"
            @current-change="handleChange"
            :current-page.sync="sendSearch.pageNum"
            background
            prev-text="上一页 "
            next-text="下一页 "
            :page-sizes="[10, 20, 50, 100]"
            :page-size="sendSearch.pageSize"
            layout="total,prev, pager, next,sizes,jumper"
            :total="sentTotal"
          ></el-pagination>
        </div>
      </el-card>
      <div style="text-align: center">
        <el-button
          type="primary"
          plain
          style="margin-left: 10px"
          @click="closeDrawer"
          >取消</el-button
        >
        <el-button type="primary" style="margin-left: 10px" @click="addSure"
          >确定</el-button
        >
      </div>
    </el-drawer>
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
      <td  class='width-12'>型号</td >
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
import { supplyApi } from "@/api/user.js";
export default {
  computed: {},
  data() {
    return {
      searchContent: {
        page: 1,
        pageSize: 10,
        compareCode: "",
        status: "",
        companyId: "",
        createdAtEnd: "",
        createdAtStart: "",
        purchaserCompanyName: "",
        entranceMark: "SUPPLIER",
        paidStatus: "",
      },
      sendSearch: {
        pageNum: 1,
        pageSize: 10,
        sendAtEnd: "",
        sendAtStart: "",
        status: "",
        deliveredTimeEnd: "",
        deliveredTimeStart: "",
        cargoCode: "",
        rejectedCode: "",
        companyId: "",
      },
      ReasonsRejection: {
        paidProgress: "", //付款进度，用户手写的字符串
        paidStatus: "", //付款状态的数字
        remark: "", //备注
        idList: [],
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
      sendStatus: [
        {
          statusName: "待发货",
          statusId: -1,
        },
        {
          statusName: "待收货",
          statusId: 0,
        },
        {
          statusName: "已收货",
          statusId: 1,
        },
      ],
      mylistfa: [],
      companyList: [],
      tableList: [],
      total: 0,
      sentTotal: 0,
      timeValue: "",
      timeXiada: "",
      timeJiaohuo: "",
      compareTime: "",
      checked: false,
      checkedId: [],
      dialogFormVisible: false,
      dialogDel: false,
      isShow: false,
      drawer: false,
      drawerDelivery: false,
      drawerReturn: false,
      purchaserCompanyId: "",
      sentTableList: [],
      rejectedTableList: [],
      titleName: "",
      showOrHide: "",
      mystatus: "",
      myPayStaus: "",
      addOrEdit: "",
      updateId: "",
      editOrAdd: {
        compareAmount: "",
        compareCode: "",
        compareEndAt: "",
        compareStartedAt: "",
        compareStatement: "",
        createdAt: "",
        creatorId: "",
        id: "",
        materialList: [],
        purchaserCompanyId: "",
        status: "",
      },
      targetList: [],
      dialogVisible2: false,
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
        paidStatus: [
          { required: true, message: "请选择付款状态", trigger: "change" },
        ],
        other: [
          { required: true, message: "请输入其它原因", trigger: "change" },
        ],
        unitPrice: [
          { required: true, message: "单价不能为空", trigger: "blur" },
          // { validator: this.val0, trigger: "blur" },
          {
            pattern: /(^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$)/,
            message: "输入数字最多两位小数",
            trigger: "blur"
          },
        //  { validator: this.validate00, trigger: "blur" },
          // { required: false, message: "单价不能为空", trigger: "blur" },
          // { type: "number", message: "请输入数字", trigger: "change" },
        ],
        // receiveNumber: [
        // { required: false, message: "实收数量不能为空", trigger: "blur" },
        // { type: "number", message: "请输入数字", trigger: "blur" },
        // ],
        // refuseNumber: [
        // { required: false, message: "拒收数量不能为空", trigger: "blur" },
        // { type: "number", message: "请输入数字", trigger: "blur" },
        // ],
        // rejectNumber: [
        // { required: false, message: "退货数量不能为空", trigger: "blur" },
        // { type: "number", message: "请输入数字", trigger: "blur" },
        // ],
      },
    };
    // 目标数量
  //  var val0 = (rule, value, callback) => {
  //   if (
  //     this.editOrAdd.materialList.unitPrice === "0." ||
  //     this.editOrAdd.materialList.unitPrice === "0.0" ||
  //     this.editOrAdd.materialList.unitPrice === "0.00"
  //   ) {
  //     callback(new Error("为正数且最多两位小数"));
  //   }
  //   callback();
  // }
  },
  created() {
    this.getMenuList();
    this.getRelatedEnterprise();
  },
  methods: {
    addSure() {
      this.editOrAdd.materialList = [
        ...this.editOrAdd.materialList,
        ...this.mylistfa,
      ];
      this.drawerDelivery = false;
    },
    //表格静止选择
    checkSelectable(row) {
      return this.editOrAdd.materialList.every((item) => {
        return (
          item.cargoMcId != row.cargoMcId &&
          item.rejectedMcId != row.rejectedMcId
        );
      });
    },
    handleSelectionChange(val) {
      this.mylistfa = val.map((item) => {
        let list = {
          cargoCode: item.cargoCode ? item.cargoCode : "",
          rejectCode: item.rejectedCode ? item.rejectedCode : "",
          materialCode: item.materialCode ? item.materialCode : "",
          materialName: item.materialName ? item.materialName : "",
          specification: item.specification ? item.specification : "",
          unit: item.unit,
          unitPrice: "",
          receiveNumber: item.receiveNumber,
          refuseNumber: item.refusedNumber,
          rejectNumber: item.rejectedNumbers,
          remark: "",
          cargoMcId: item.cargoMcId ? item.cargoMcId : "",
          rejectedMcId: item.rejectedMcId ? item.rejectedMcId : "",
        };
        return list;
      });
    },
    //删除行
    delIndex(val) {
      this.editOrAdd.materialList.splice(val.$index, 1);
    },
    companyIdChange(val) {
      this.sendSearch.companyId = val;
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
    timeChange1() {
      if (this.compareTime != null && this.compareTime.length > 0) {
        this.editOrAdd.compareStartedAt = this.compareTime[0];
        this.editOrAdd.compareEndAt = this.compareTime[1];
      } else {
        this.editOrAdd.compareStartedAt = "";
        this.editOrAdd.compareEndAt = "";
      }
    },
    timeChange2() {
      if (this.timeXiada != null && this.timeXiada.length > 0) {
        this.sendSearch.sendAtStart = this.timeXiada[0];
        this.sendSearch.sendAtEnd = this.timeXiada[1];
      } else {
        this.sendSearch.sendAtStart = "";
        this.sendSearch.sendAtEnd = "";
      }
    },
    timeChange3() {
      if (this.timeJiaohuo != null && this.timeJiaohuo.length > 0) {
        this.sendSearch.deliveredTimeStart = this.timeJiaohuo[0];
        this.sendSearch.deliveredTimeEnd = this.timeJiaohuo[1];
      } else {
        this.sendSearch.deliveredTimeStart = "";
        this.sendSearch.deliveredTimeEnd = "";
      }
    },
    moneyChange(){
      var reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/
      if(!reg.test(this.editOrAdd.compareAmount)){
        this.$message({
          message: "申请对账金额为数字且最多保留两位小数！",
          type: "warning",
        });
        }
    },
    //发起对账
    initiatereconciliation() {
      this.drawer = true;
      this.addOrEdit = "新增发起对账";
      this.clearAddNewCreate()
      // this.getCompareDetail();
      this.getRelatedEnterprise();
      this.getCompareCode();
    },
    //申请对账单
    getCompareCode() {
      supplyApi.getCompareCode().then(({ data: res }) => {
        if (res.code == 200) {
          this.editOrAdd.compareCode = res.data;
        }
      });
    },
    //对账单详情
    getCompareDetail(val) {
      supplyApi.getCompareDetail(val).then(({ data: res }) => {
        if (res.code == 200) {
          this.drawer = true;
          this.purchaserCompanyId = res.data[0].purchaserCompanyId;
          this.editOrAdd.compareAmount = res.data[0].compareAmount;
          this.editOrAdd.compareStatement = res.data[0].compareStatement;
          this.editOrAdd.materialList =
            res.data[0].materialList == null ? [] : res.data[0].materialList;
          this.editOrAdd.compareCode = res.data[0].compareCode;
          this.compareTime = this.getData(
            res.data[0].compareStartedAt,
            res.data[0].compareEndAt
          );
        }
      });
    },
    //截取日期
    getData(val1, val2) {
      let start =
        val1.slice(0, 4) + "-" + val1.slice(5, 7) + "-" + val1.slice(8, 10);
      let end =
        val2.slice(0, 4) + "-" + val2.slice(5, 7) + "-" + val2.slice(8, 10);
      console.log(start, end);
      return [start, end];
    },
    //获取关联的企业信息
    getRelatedEnterprise() {
      supplyApi.getRelatedEnterprise().then(({ data: res }) => {
        if (res.code == 200) {
          this.companyList = res.data;
        }
      });
    },
    submitForm(formName) {
      //表单提交
      if (formName == "ReasonsRejection") {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.payStatus("付款状态");
          } else {
            console.log("error submit!!");
            return false;
          }
        });
        //表格提交
      } else if (formName == "editOrAdd") {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.purchaserCompanyId) {
              if(this.editOrAdd.materialList.length<1){
                this.$message({
                  message: "申请对账物料信息不能为空！",
                  type: "warning",
                });
                return
              }
              if (this.editOrAdd.compareAmount) {
                var reg = /(^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$)/
                if(!reg.test(this.editOrAdd.compareAmount)){
                  this.$message({
                    message: "申请对账金额为正数且最多保留两位小数！",
                    type: "warning",
                   });
                   return
                }
                let addcontent = {
                  purchaserCompanyId: this.purchaserCompanyId,
                  compareAmount: this.editOrAdd.compareAmount,
                  compareEndAt: this.editOrAdd.compareEndAt,
                  compareStartedAt: this.editOrAdd.compareStartedAt,
                  compareStatement: this.editOrAdd.compareStatement,
                  materialList: this.editOrAdd.materialList,
                  compareCode: this.editOrAdd.compareCode,
                  id: this.updateId,
                };
                this.addNewCreate([addcontent]);
              } else {
                this.$message({
                  message: "申请对账金额不能为空！",
                  type: "warning",
                });
              }
            } else {
              this.$message({
                message: "客户名称不能为空！",
                type: "warning",
              });
            }
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    //清空对账单
    clearAddNewCreate() {
      this.purchaserCompanyId = "";
      this.editOrAdd.compareAmount = "";
      this.editOrAdd.compareEndAt = "";
      this.editOrAdd.compareStartedAt = "";
      this.editOrAdd.compareStatement = "";
      this.editOrAdd.materialList = [];
      this.editOrAdd.compareCode = "";
      this.compareTime = "";
    },
    clearContent() {
      this.clearAddNewCreate();
      this.drawer = false;
    },
    closeDrawer() {
      this.drawerDelivery = false;
      // this.drawerReturn = false;
    },
    //取消申请
    giveUpEdit() {
      this.clearAddNewCreate();
      this.drawer = false;
    },
    //新增对账单
    addNewCreate(val) {
      if (this.addOrEdit === "新增发起对账") {
        supplyApi.addNewCreate(val).then(({ data: res }) => {
          if (res.code == 200) {
            this.drawer = false;
            this.getMenuList();
            this.$message({
              message: "对账单新增成功！",
              type: "success",
            });
          }
        });
      } else if (this.addOrEdit === "编辑发起对账") {
        supplyApi.editCreate(val).then(({ data: res }) => {
          if (res.code == 200) {
            this.drawer = false;
            this.getMenuList();
            this.$message({
              message: "对账单编辑成功！",
              type: "success",
            });
          }
        });
      }
    },
    // 确 认
    makeSure(val, val1) {
      let statusSure = {
        id: val,
        status: val1,
      };
      supplyApi.getCheckStatus(statusSure).then(({ data: res }) => {
        if (res.data == true) {
          this.$message({
            message: "对账单确认成功！",
            type: "success",
          });
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
      this.searchContent.companyId = "";
      this.searchContent.paidStatus = "";
      this.searchContent.page = 1;
      this.searchContent.pageSize = 10;
      this.timeValue = "";
      this.getMenuList();
    },
    //选择发货单
    chooseDelivery(val) {
      if (this.purchaserCompanyId) {
        if (val == "delivery") {
          this.showOrHide = "delivery";
          this.titleName = "选择发货单";
          this.drawerDelivery = true;
          this.getSentList();
        } else if (val == "return") {
          this.showOrHide = "return";
          this.titleName = "选择退货单";
          this.drawerDelivery = true;
          this.getReturnList();
        }
      } else {
        this.$message({
          message: "请输入客户名称",
          type: "warning",
        });
      }
    },
    //发货单查询
    getSentList() {
      supplyApi.getSentList(this.sendSearch).then(({ data: res }) => {
        if (res.code == 200) {
          this.sentTableList = res.data.content;
          this.sentTotal = res.data.total;
        }
      });
    },
    //退货单查询
    getReturnList() {
      this.sendSearch.rejectedTimeEnd = this.sendSearch.deliveredTimeEnd
        this.sendSearch.rejectedTimeStart = this.sendSearch.deliveredTimeStart
         this.sendSearch.issuedAtEnd = this.sendSearch.sendAtEnd
        this.sendSearch.issuedAtStart = this.sendSearch.sendAtStart
      supplyApi.getReturnList(this.sendSearch).then(({ data: res }) => {
        if (res.code == 200) {
          this.rejectedTableList = res.data.content;
          this.sentTotal = res.data.total;
        }
      });
    },
    // 分页
    handleSizeC(val) {
      this.sendSearch.pageSize = val;
      if (this.showOrHide == "delivery") {
        this.getSentList();
      } else if (this.showOrHide == "return") {
        this.getReturnList();
      }
    },
    // 分页
    handleChange(val) {
      this.sendSearch.pageNum = val;
      if (this.showOrHide == "delivery") {
        this.getSentList();
      } else if (this.showOrHide == "return") {
        this.getReturnList();
      }
    },
    searchIs() {
      if (this.showOrHide == "delivery") {
        this.getSentList();
      } else if (this.showOrHide == "return") {
        this.getReturnList();
      }
    },
    clearSendSearch(){
      this.drawerDelivery = false
      this.clearsent()
    },
    //发货单重置
    clearsent() {
      this.sendSearch.cargoCode = "";
      this.sendSearch.rejectedCode = "";
      this.sendSearch.status = "";
      this.sendSearch.deliveredTimeStart = "";
      this.sendSearch.deliveredTimeEnd = "";
      this.sendSearch.sendAtStart = "";
      this.sendSearch.sendAtEnd = "";
      this.sendSearch.pageNum = 1;
      this.sendSearch.pageSize = 10;
      this.timeJiaohuo = "";
      this.timeXiada = "";
      if (this.showOrHide == "delivery") {
        this.getSentList();
      } else if (this.showOrHide == "return") {
        this.getReturnList();
      }
    },
    changeStatus(val, val1, val2) {
      let statusSure = {
        id: val1,
        status: val2,
      };
      //判断编辑前订单状态是否改变
      supplyApi.getCheckStatus(statusSure).then(({ data: res }) => {
        if (res.data == true) {
          if (val === "申请对账") {
            this.mystatus = {
              idList: [val1], //当前对账单的id，用个数组，防止有批量的功能
              statusAfter: 1, //从 0 - 待申请 变为 1 - 待确认
              statusBefore: 0,
            };
            this.getUpdateStatus(this.mystatus, val);
          } else if (val === "删除") {
            this.dialogDel = true;
            this.mystatus = {
              idList: [val1], //当前对账单的id，用个数组，防止有批量的功能
              isDeleted: 1, //删除
            };
          } else if (val === "撤回") {
            this.mystatus = {
              idList: [val1], //当前对账单的id，用个数组，防止有批量的功能
              statusAfter: 0, //从1 - 待确认变为 0 - 待申请
              statusBefore: 1,
            };
            this.getUpdateStatus(this.mystatus, val);
          } else if (val === "重新发起申请") {
            this.mystatus = {
              idList: [val1], //当前对账单的id，用个数组，防止有批量的功能
              statusAfter: 1, //从3 - 已拒绝变为 0 - 待申请
              statusBefore: 3,
            };
            this.getUpdateStatus(this.mystatus, val);
          } else if (val === "付款状态") {
            this.getUpdateStatus(this.ReasonsRejection, val);
          } else if (val === "编辑") {
            let data = {
              idList: [val1], //当前对账单的id，用个数组，防止有批量的功能
            };
            this.addOrEdit = "编辑发起对账";
            this.updateId = val1;
            this.getRelatedEnterprise();
            this.getCompareDetail(data.idList);
          }
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
    // 付款状态提出
    payStatus(val){
       this.getUpdateStatus(this.ReasonsRejection, val);
    },
    // 修改状态
    getUpdateStatus(val, val1) {
      supplyApi.getUpdateStatus(val).then(({ data: res }) => {
        if (res.code == 200) {
          if (val1 === "申请对账") {
            this.$message({
              showClose: true,
              message: "发起申请成功！",
              type: "success",
            });
          } else if (val1 === "删除") {
            this.dialogDel = false;
            this.$message({
              showClose: true,
              message: "删除成功！",
              type: "success",
            });
          } else if (val1 === "撤回") {
            this.$message({
              showClose: true,
              message: "申请对账撤回成功！",
              type: "success",
            });
          } else if (val1 === "重新发起申请") {
            this.$message({
              showClose: true,
              message: "重新发起申请成功！",
              type: "success",
            });
          } else if (val1 === "付款状态") {
            this.dialogFormVisible = false;
            this.$message({
              showClose: true,
              message: "付款状态提交成功！",
              type: "success",
            });
          }
          this.getMenuList();
        }
      });
    },
    // 删除确认
    sureDel(val, val1) {
      this.getUpdateStatus(val, val1);
    },
    // 付款状态
    myPayStaus0(val, val1) {
      let statusSure = {
        id: val,
        status: val1,
      };
      supplyApi.getCheckStatus(statusSure).then(({ data: res }) => {
        if (res.data == true) {
          this.dialogFormVisible = true;
          this.ReasonsRejection.idList[0] = val;
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
    //对账单详情
    getCompareDetail0(val) {
      supplyApi.getCompareDetail(val).then(({ data: res }) => {
        if (res.code == 200) {
          this.targetList = res.data;
        }
      });
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
    print0() {
      if (this.checkedId.length > 0) {
        this.getCompareDetail0(this.checkedId);
        this.dialogVisible2 = true;
      } else {
        this.$message({
          showClose: true,
          message: "请选择需要打印的对账单！",
          type: "warning",
        });
      }
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
        /deep/.el-textarea .el-input__count {
          background: transparent !important;
        }
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
    text-align: center;
    margin-top: 15px;
  }
  // /deep/.el-form-item__error {
  //   text-indent: 100px;
  // }
  .drawer {
    /deep/.el-drawer__header > :first-child {
      border-left: 4px solid #2d94ff;
      padding: 2px 10px;
      font-size: 22px;
    }
    /deep/.el-drawer__body {
      padding: 0 20px !important;
    }
    /deep/.el-drawer {
      border-bottom-left-radius: 20px !important;
      border-top-left-radius: 20px !important;
    }
    .searchone {
      margin-bottom: 15px;
      border-radius: 10px;
      /deep/.el-form-item {
        margin-bottom: 20px !important;
      }
      .top {
        display: flex;
        justify-content: space-between;
        .tip {
          font-size: 12px;
          color: red;
        }
      }
      .search {
        margin-top: 20px;
        /deep/.el-form-item {
          margin-bottom: 0px !important;
        }
      }
    }
    .searchtwo {
      margin-bottom: 15px;
      border-radius: 10px;
      .top {
        display: flex;
        justify-content: space-between;
      }
      .bottom {
        margin-top: 20px;
        width: 100%;
        .mytable {
          /deep/.el-table__body-wrapper {
            height: 250px;
            overflow-y: auto;
          }
        }
      }
    }
    .searchthree {
      margin-bottom: 15px;
      border-radius: 10px;
      .search {
        margin-top: 20px;
        width: 100%;
      }
      .bottom {
        margin-top: 20px;
        width: 100%;
      }
    }
    .searchfour {
      margin-bottom: 15px;
      border-radius: 10px;
      .search {
        margin-top: 20px;
        width: 100%;
      }
      .bottom {
        margin-top: 20px;
        width: 100%;
      }
      .pageBottom {
        text-align: center;
        margin: 15px 0;
      }
      /deep/.el-table__body-wrapper {
        height: 450px;
        overflow-y: auto;
      }
    }
  }
  /deep/.el-button--primary.is-plain {
    color: #409eff;
    background: transparent !important;
    border-color: #409eff;
  }
}
</style>
