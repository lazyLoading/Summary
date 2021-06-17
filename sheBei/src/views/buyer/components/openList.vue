<template>
  <div>
    <el-card class="open-list" style="min-height: 480px">
      <!-- 批量操作 -->
      <div class="operation-head">
        <p>
          <el-checkbox v-model="checkAll" @change="onCheckAll"
            >全选/全不选</el-checkbox
          >
        </p>
        <p class="batch-head">
          <span v-for="(item, index) in btnBatch" :key="index">
            <el-upload
              v-if="item.type == 'import'"
              name="uploadFile"
              :action="expImport"
              :headers="headers"
              :file-list="fileList"
              :show-file-list="false"
              :on-success="handleSuccess"
              :on-change="handleChange"
              ><el-button size="medium" type="primary">
                {{ item.label }}</el-button
              >
            </el-upload>
            <el-button
              v-else
              type="primary"
              size="medium"
              @click="onBtnBatch(item)"
              >{{ item.label }}</el-button
            >
          </span>
        </p>
      </div>
      <div class="no-data" v-if="listData.length == 0">暂无数据</div>
      <!-- 列表 -->
      <div v-else class="collapse-box">
        <el-collapse v-model="activeList">
          <el-collapse-item
            v-for="(item, index) in listData"
            :key="index"
            :name="index"
          >
            <!-- 父列表 -->
            <template slot="title">
              <el-row class="parent-list">
                <!-- 左 -->
                <el-col :span="1">
                  <div class="text-center" @click.stop>
                    <el-checkbox
                      :label="item.id"
                      v-model="checkedCities"
                      @change="onChecked"
                    ></el-checkbox>
                  </div>
                </el-col>
                <!-- 中 -->
                <el-col :span="20">
                  <el-row>
                    <el-col :span="4">
                      <div
                        class="text-overflow"
                        :title="item.purchaseCode"
                        @click.stop="onDetails(item)"
                      >
                        <a class="order-text" href="javascript:;">
                          采购订单号：{{ item.purchaseCode }}</a
                        >
                      </div></el-col
                    >
                    <el-col
                      :span="4"
                      v-for="(row, index) in item.listLabel"
                      :key="index"
                    >
                      <div class="text-overflow" :title="item[row.prop]">
                        {{ row.label }}：{{ item[row.prop] }}
                      </div></el-col
                    >
                  </el-row>
                </el-col>
                <!-- 右 -->
                <el-col :span="3">
                  <el-row>
                    <el-col :span="12">
                      <div :class="{ 'is-show': item.fileList.length == 0 }">
                        <el-link type="primary" @click.stop="onDownload(item)"
                          >下载附件</el-link
                        >
                      </div></el-col
                    >
                    <el-col :span="12">
                      <div :class="item.statusColor">{{ item.statusName }}</div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>

            <!-- 子列表 -->
            <div class="children-list">
              <OrderList
                :tableData="item.materialList"
                :tableLabel="materielLabel"
              >
              </OrderList>

              <!-- 单操作 -->
              <div class="batch-head text-right">
                <el-button
                  v-for="(val, i) in item.bnt"
                  :key="i"
                  type="primary"
                  size="medium"
                  @click="onBtnRadio(item, val)"
                >
                  {{ val }}
                </el-button>
                <el-button
                  type="primary"
                  size="medium"
                  @click="onBtnRadio(item, '导出')"
                >
                  导出订单
                </el-button>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>
    <div class="common-pagination">
      <el-pagination
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
        :current-page.sync="config.page"
        background
        prev-text="上一页 "
        next-text="下一页 "
        :page-sizes="[10, 20, 50, 100]"
        :page-size="config.pageSize"
        layout="total,prev, pager, next,sizes,jumper"
        :total="listTotal"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import router from "@/router";
import OrderList from "@/components/table/OrderList";
import { expImport } from "@/api/order.js";

export default {
  name: "openList",
  components: {
    OrderList,
  },
  props: {
    btnBatch: Array,
    listData: Array,
    listLabel: Array,
    materielLabel: Array,
    config: Object,
    listTotal: Number,
  },
  data() {
    return {
      checkAll: false,
      checkedCities: [],
      activeList: [0],
      expImport,
      fileList: [],
    };
  },
  computed: {
    headers() {
      let token = localStorage.getItem("jwt-token");
      let types = localStorage.getItem("types");
      let direction = "";
      if (types == "procurement") direction = "buyer";
      else direction = "supplier";
      let d = { direction, "jwt-token": token };
      return d;
    },
  },
  mounted() {},
  methods: {
    checkParentHandel() {
      this.checkAll = false;
      this.checkedCities = [];
    },
    //导入改变
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-1);
    },
    //导入成功
    handleSuccess(response, file, fileList) {
      if (response.code == 200) {
        this.fileList = file;
        this.$message.success(response.message);
        this.$emit("onImportSuccess");
      } else if (response.code == 401) {
        router.push({ path: "/login" });
      } else {
        this.$emit("onImportError", response.data);
      }
    },
    //全选
    onCheckAll() {
      if (this.checkAll) {
        this.listData.forEach((item) => {
          this.checkedCities.push(item.id);
        });
      } else {
        this.checkedCities = [];
      }
      this.$emit("onCheckAll", this.checkedCities);
    },
    //单选
    onChecked() {
      this.checkAll =
        this.checkedCities.length == this.listData.length ? true : false;
      this.$emit("onChecked", this.checkedCities);
    },
    //详情
    onDetails(e) {
      this.$emit("onDetails", e);
    },
    //批量操作
    onBtnBatch(e) {
      this.$emit("onBtnBatch", e);
    },
    //单按钮操作
    onBtnRadio(row, e) {
      let d = { item: row, e };
      this.$emit("onBtnRadio", d);
    },
    //附件下载
    onDownload(e) {
      this.$emit("onDownload", e);
    },
    //当前页
    onCurrentChange(e) {
      this.checkAll = false;
      this.checkedCities = [];
      this.$emit("onCurrentChange", e);
    },
    //页码
    onSizeChange(e) {
      this.checkAll = false;
      this.checkedCities = [];
      this.$emit("onSizeChange", e);
    },
  },
};
</script>

<style lang="less" scoped>
@deep: ~">>>";

.open-list {
  .el-card__body {
    > .no-data {
      text-align: center;
      color: #999;
      line-height: 480px;
    }
  }

  .operation-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .batch-head {
      padding-bottom: 15px;
      text-align: right;
      > span {
        display: inline-block;
        margin-left: 10px;
      }
    }
  }

  .is-show {
    visibility: hidden;
  }

  @{deep} .collapse-box {
    .el-checkbox {
      .el-checkbox__label {
        display: none;
      }
    }
    .el-collapse-item__header {
      height: 100%;
      background: #ddd;
      &.is-active {
        background: #dfeafa;
      }
      .parent-list {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        width: 100%;
        padding: 10px 0;

        .order-text {
          // text-decoration: underline;
          color: #409eff;
        }
        .status-box {
          display: flex;
          align-items: center;
        }
        .el-col {
          > div {
            padding-right: 5px;
            line-height: 22px;
          }
        }
      }
    }
    .el-collapse-item__wrap {
      border: 0;
    }

    .el-collapse-item {
      margin-bottom: 20px;
    }

    .children-list {
      width: 100%;
      .batch-head {
        padding: 15px 0 0;
      }
    }
  }
}
</style>
