<template>
  <div class="home-index">
    <div class="search-box text-right">
      <el-form :inline="true" :model="formsData" class="demo-form-inline">
        <el-form-item>
          <el-date-picker
            v-model="times"
            @change="timesChange"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="">
          <el-select
            v-model="formsData.companyId"
            placeholder="输入客户名称"
            filterable
            @change="formSearchHandle()"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.companyName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <dl class="list-box">
      <dt><div class="title">订单数据</div></dt>
      <dd>
        <el-card class="box-card order">
          <div
            class="item"
            v-for="(item, index) in orderData"
            :class="'bg' + (index + 1)"
            :key="index"
          >
            <p class="name">{{ item.name }}</p>
            <p class="num">{{ item.num }}</p>
          </div>
        </el-card>
      </dd>
    </dl>

    <dl class="list-box">
      <dt><div class="title">业务事项</div></dt>
      <dd>
        <el-card class="box-card business">
          <div class="item" v-for="(item, index) in businessData" :key="index">
            <p class="name">
              <img
                :src="
                  require(`../../assets/images/busines-icon${index + 1}.png`)
                "
              />{{ item.name }}
            </p>
            <p class="num" :class="businessColor[index]">{{ item.num }}</p>
          </div>
        </el-card>
      </dd>
    </dl>

    <dl class="list-box">
      <dt><div class="title">功能区域</div></dt>
      <dd>
        <el-card class="box-card entrance">
          <CommonMenu></CommonMenu>
        </el-card>
      </dd>
    </dl>
  </div>
</template>

<script>
import CommonMenu from "../../components/CommonMenu";
import { byName, dataHome } from "@/api/home";
import { purchaseRelated } from "@/api/order";

export default {
  components: {
    CommonMenu,
  },

  data() {
    return {
      times: [], //日期集合
      companyName: "", //客户名称初始值
      options: [], //客户列表
      formsData: {
        companyId: "",
        createdStartAt: "",
        createdEndAt: "",
      },
      orderData: [],     //订单业务
      businessData: [],   //业务事项
      businessColor: [
        "color-blue2",
        "color-orange1",
        "color-purple1",
        "color-red2",
        "color-green1",
        "color-red4",
        "color-purple2",
      ],
    };
  },
  created() {},
  mounted() {
    this.purchaseRelated();
    this.formSearchHandle();
  },
  methods: {
    //供应商列表
    purchaseRelated() {
      purchaseRelated({ companyName: this.companyName }).then(
        ({ data: res }) => {
          if (res.code == 200) this.options = res.data;
        }
      );
    },
    //日期改变
    timesChange(e) {
      if (e != null && e.length > 0) {
        this.formsData.createdStartAt = e[0];
        this.formsData.createdEndAt = e[1];
        this.formSearchHandle();
      }
    },
    //搜索
    formSearchHandle() {
      let types = localStorage.getItem("types");
      dataHome(this.formsData).then(({ data: res }) => {
        if (res.code == 200) {
          let {buyerMattersVo,orderDataVO,supplierMattersVo}=res.data
          //订单业务
          this.orderData = [
            {
              name: "订单总数",
              num: orderDataVO.allNum,
            },
            {
              name: "完成订单数",
              num: orderDataVO.finishNum,
            },
            {
              name: "未关闭订单",
              num: orderDataVO.notClosedNum,
            },
            {
              name: "中止订单",
              num: orderDataVO.abortNum,
            },
            {
              name: "已拒绝订单数",
              num: orderDataVO.refuseNum,
            },
          ];

          //业务事项
          //采购
          if (types == "procurement") {
            this.orderData[0].name = "下单总数";
            this.businessData = [
              {
                name: "待提交订单",
                num: buyerMattersVo.purchaseCommit,
              },
              {
                name: "待确认订单",
                num: buyerMattersVo.purchaseConfirmed,
              },
              {
                name: "已拒绝到货通知单",
                num: buyerMattersVo.requirementRefuse,
              },
              {
                name: "未完成到货通知单",
                num: buyerMattersVo.requirementUnfinish,
              },
              {
                name: "待收货",
                num: buyerMattersVo.cargo,
              },
              {
                name: "待确认退货",
                num: buyerMattersVo.rejectedConfirmed,
              },
              {
                name: "待确认对账",
                num: buyerMattersVo.compareConfirmed,
              },
            ];
          }

          //供应协同
          if (types == "supplier") {
            this.orderData[0].name = "订单总数";
            this.businessData = [
              {
                  name: "待确认订单",
                  num: supplierMattersVo.purchaseNum,
                },
                 {
                  name: "待确认到货通知单",
                  num: supplierMattersVo.requirementNum,
                },
                //  {
                //   name: "未发货到货通知单",
                //   num: supplierMattersVo.purchaseNum,
                // },
                 {
                  name: "客户待收货",
                  num: supplierMattersVo.cargoNum,
                },
                 {
                  name: "待确认退货",
                  num: supplierMattersVo.rejectNum,
                },
                 {
                  name: "待提交对账",
                  num: supplierMattersVo.compareToBeCommit,
                },
                 {
                  name: "待确认对账",
                  num: supplierMattersVo.compareToBeConfirmed,
                },
            ];
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/style/home";
@deep: ~">>>";
.home-index {
  .search-box {
    height: 20px;
    position: relative;
    .el-form {
      position: absolute;
      top: 0px;
      right: 0;
      z-index: 10;
    }
  }

  @{deep}.list-box {
    margin-bottom: 40px;
    .title {
      margin-bottom: 20px;
      padding-left: 10px;
      border-left: 5px solid #2d94ff;
    }

    .box-card {
      .el-card__body {
        display: flex;
        justify-content: space-between;
      }
      .item {
        box-sizing: border-box;
        width: 20%;
        margin: 0 1%;
        border-radius: 5px;

        &:first-child {
          margin-left: 0;
        }
        &:last-child {
          margin-right: 0;
        }
        .num {
          font-weight: bold;
        }
      }

      &.order {
        .item {
          padding: 18px 20px;
          color: #fff;
          p {
            line-height: 50px;
          }
          .num {
            font-size: 40px;
          }
        }
      }

      &.business {
        .item {
          padding: 15px;
          border: 1px solid #eee;

          i {
            display: inline-block;
            margin-right: 10px;
          }

          .num {
            margin-top: 20px;
            font-size: 25px;
            text-align: right;
          }
          .name {
            display: flex;
            align-items: center;
            img {
              margin-right: 10px;
              width: 36px;
              height: 36px;
            }
          }
        }
      }

      &.entrance {
        .el-card__body {
          display: inherit;
          padding: 15px 20px;
        }
      }
    }
    .order {
      .bg1 {
        background: url("../../assets/images/total-order.png") no-repeat;
        background-size: cover;
      }
      .bg2 {
        background: url("../../assets/images/finish-order.png") no-repeat;
        background-size: cover;
      }
      .bg3 {
        background: url("../../assets/images/close-order.png") no-repeat;
        background-size: cover;
      }
      .bg4 {
        background: url("../../assets/images/suspend-order.png") no-repeat;
        background-size: cover;
      }
      .bg5 {
        background: url("../../assets/images/reject-order.png") no-repeat;
        background-size: cover;
      }
    }
  }

  .orderData {
    border: @border;
    background: @white-bg;
    margin-top: @num-20;
  }
  .databox {
    display: flex;
    padding: 20px;
    .data-item {
      width: 260px;
      height: 120px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      border-radius: 5px;
      margin: 20px;
      color: #fff;
      span {
        font-size: 16px;
        letter-spacing: 2px;
      }
      p {
        padding: 10px 0;
        font-size: 20px;
      }
    }
  }
  .matter-item {
    display: flex;
    margin: 20px;
    padding: 0 20px;
    .icon-box {
      font-size: 32px;
    }
    .matter-data {
      padding-left: 10px;
      p {
        font-size: 14px;
        color: #666;
        padding-bottom: 10px;
      }
    }
  }
}
</style>
