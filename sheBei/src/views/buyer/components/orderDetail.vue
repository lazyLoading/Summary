<template>
  <el-card class="detail-order">
    <div class="content">
      <el-collapse class="collapse-detail" v-model="activDetail">
        <div
          v-for="(item, index) in detailData"
          :key="index"
          style="margin-bottom: 15px"
        >
          <!--大标题 -->
          <el-collapse-item
            v-if="item.data.length > 0"
            :title="item.title"
            :name="index"
          >
            <!--大标题 -->
            <div class="detail-box" v-for="(curr, i) in item.data" :key="i">
              <div class="sub-title" v-if="item.data.length > 1">
                <strong>
                  {{ item.title }}{{ i + 1 }}
                </strong>
              </div>
              <!-- 一级信息 -->
              <el-row :gutter="10">
                <el-col
                  :span="4"
                  v-for="(row, v) in headeLabel(curr.status, item)"
                  :key="v"
                >
                  <div class="text-overflow" :title="curr[row.prop]">
                    {{ row.label }}：<span>{{ curr[row.prop] }}</span>
                  </div>
                </el-col>
              </el-row>
              <!-- 物料信息 -->
              <div class="materiel-info">
                <div class="tit-head" v-if="item.statusList.length > 0">
                  <p>物料信息</p>
                  <p :class="reversedStatus(curr.status, item).color">
                    {{ reversedStatus(curr.status, item).name }}
                  </p>
                </div>
                <OrderList
                  :tableData="curr.materialList"
                  :tableLabel="item.materielLabel"
                >
                </OrderList>
              </div>
            </div>
          </el-collapse-item>
        </div>
      </el-collapse>
    </div>
  </el-card>
</template>

<script>
import OrderList from "@/components/table/OrderList";
export default {
  components: {
    OrderList,
  },
  props: {
    detailData: Array,
    inline: Boolean,
    form: Object,
    rules: Object,
  },

  data() {
    return {
      activDetail: [0],
    };
  },
  computed: {},
  created() {},
  method() {},
  methods: {
    headeLabel(e, item) {
      let list = [];
      let tit = item.title;
      let baseLabel = item.baseLabel;

      let refusedArr = [
        {
          prop: "refusedAt",
          label: "拒绝时间",
        },
        {
          prop: "refusedOperatorName",
          label: "拒绝人",
        },
        {
          prop: "refuseReason",
          label: "拒绝原因",
        },
      ];
      let confirmedArr = [
        {
          prop: "confirmedAt",
          label: "确认时间",
        },
        {
          prop: "confirmedOperatorName",
          label: "确认人",
        },
      ];

      let abortArr = [
        {
          prop: "abortAt",
          label: "中止时间",
        },
        {
          prop: "abortOperatorName",
          label: "中止人",
        },
        {
          prop: "abortReason",
          label: "中止原因",
        },
      ];

      if (tit == "基础信息") {
        if (e == 3 || e == 4) list = baseLabel.concat(refusedArr);
        else if (e == 5) list = baseLabel.concat(confirmedArr);
        else if (e == 7) list = baseLabel.concat(abortArr);
        else list = baseLabel;
      }

      if (tit == "变更记录") {
        if (e == 4) list = baseLabel.concat(refusedArr);
        else if (e == 5) list = baseLabel.concat(confirmedArr);
        else list = baseLabel;
      }

      if (tit == "客户到货通知单") {
        if (e == 3) list = baseLabel.concat(refusedArr);
        else if (e == 2) list = baseLabel.concat(confirmedArr);
        else list = baseLabel;
      }

      if (tit == "退货信息") {
        if (e == 1) list = baseLabel.concat(confirmedArr);
        else if (e == 2) list = baseLabel.concat(refusedArr);
        else list = baseLabel;
      }
      if (tit == "发货/客户收货") list = baseLabel;

      return list;
    },
    //获取状态文字|颜色
    reversedStatus(e, item) {
      let d = item.statusList.find((val) => val.status == e);
      return d;
    },
    //取消
    onCancel() {
      this.$emit("onCancel", false);
    },
    //确认
    onConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("onConfirm", this.form);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less">
@deep: ">>>";

.detail-order {
  padding: 0 0 20px 0;
  border-radius: 10px;

  .content {
    height: 85vh;
    overflow-y: auto;

    .detail-box {
      margin-bottom: 20px;
      line-height: 50px;
    }
    .sub-title {
      margin-top: 10px;
      strong {
        border-left: 5px solid #666;
        padding-left: 10px;
        color: #333;
        font-weight: bold;
      }
    }

    .collapse-detail {
      .el-collapse-item__wrap {
        padding: 15px;
        border: 0;
      }

      .el-collapse-item__header {
        background-color: #ddd;
        padding-left: 15px;
      }
    }
  }
}
</style>
