<template>
  <div class="mainwrap">
    <div class="main-content">
      <div class="main-btn">
        <div
          class="btn"
          @click="handleLink('supplier')"
        >
          <div class="icon">
            <img :src="buyerMain" alt="" />
          </div>
          <div class="txt">
            <p>供应协同</p>
            <button
              class="info"
              :class="{ finish: userInfo.enterpriseInfo.isSupplier }"
            >
              {{ userInfo.enterpriseInfo.isSupplier ? "已入驻" : "未入驻" }}
            </button>
          </div>
          <button class="inset">
            <img :src="useImg" />
          </button>
        </div>
        <div
          class="btn"
          @click="handleLink('procurement')"
        >
          <div class="icon">
            <img :src="supplyMain" alt="" />
          </div>
          <div class="txt">
            <p>采购协同</p>
            <button
              class="info"
              :class="{ finish: userInfo.enterpriseInfo.isBuyer }"
            >
              {{ userInfo.enterpriseInfo.isBuyer ? "已入驻" : "未入驻" }}
            </button>
          </div>
          <button class="inset">
            <img :src="useImg" />
          </button>
        </div>
      </div>
      <button class="apply" @click="applicationInt">申请入驻</button>
    </div>
    <el-dialog title="申请入驻" width="30%" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules">
        <el-form-item prop="resource" label="入驻角色">
          <el-radio-group v-model="form.resource">
            <el-radio
              v-for="(item, index) in resource"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">申 请</el-button>
      </div>
    </el-dialog>
    <CommonDialog
      :isShow="isShow"
      :content="txtContent"
      @cancel="cancel"
      @apply="apply"
    />
  </div>
</template>

<script>
import { enterprise, getUserDetail } from "@/api/user.js";
import { Message } from "element-ui";
import CommonDialog from "@/components/CommonDialog";
export default {
  name: "mainwrap",
  components: {
    CommonDialog,
  },
  data() {
    return {
      isShow: false,
      queryNo: "",
      isInset: false,
      serveType: "供应协同",
      userInfo: {
        enterpriseInfo: {
          isSupplier: false,
          isBuyer: false,
        },
      },
      content: [
        {
          iconSrc: require("../assets/images/hint.png"),
          text: "您还未企业入驻，请先申请企业入驻！",
          showBtn: true,
        },
        {
          iconSrc: require("../assets/images/fail.png"),
          text: "您申请企业入驻未审批成功，请重新申请企业入驻",
          showBtn: true,
        },
        {
          iconSrc: require("../assets/images/succeed.png"),
          text: "",
          iphone: process.env.VUE_APP_BASE_PHONE,
          showBtn: false,
        },
      ],
      txtContent: {},
      supplyMain: require("../assets/images/supply_main.jpg"),
      buyerMain: require("../assets/images/buyer_main.jpg"),
      useImg: require("../assets/images/use.png"),
      dialogFormVisible: false,
      form: {
        resource: "",
      },
      rules: {
        resource: [
          { required: true, message: "请选择入驻角色", trigger: "change" },
        ],
      },
      resource: [
        {
          label: "供应协同",
          value: "SUPPLIER",
        },
        {
          label: "采购协同",
          value: "BUYER",
        },
      ],
    };
  },
  mounted() {
    this.getUserInfo();
  },
  computed: {},
  methods: {
    // 申请入驻
    applicationInt() {
      this.dialogFormVisible = true;
      this.form.resource = "";
    },
    // 获取用户详细信息
    getUserInfo(cb) {
      getUserDetail().then(async (res) => {
        if (res.data.code === 200) {
          // 保存用户信息
          this.userInfo = res.data.data;
          localStorage.setItem("userInfo", JSON.stringify(res.data.data));
          cb && cb()
        } else {
          Message.info(res.data.message);
        }
      });
    },
    cancel() {
      this.isShow = false;
    },
    // 弹框回调
    apply(bool) {
      this.isShow = bool;
      this.dialogFormVisible = true;
      this.form.resource = "";
    },
    handleLink(s) {
      // 从新获取用户数据
      let status = ''
      this.getUserInfo(()=>{
        // 判断是否已经入驻
        if(s=="supplier") {
          status = JSON.parse(localStorage.getItem("userInfo")).enterpriseInfo.isSupplier
        } else {
          status = JSON.parse(localStorage.getItem("userInfo")).enterpriseInfo.isBuyer
        }
        if (status) {
          localStorage.setItem("types", s);
          this.$store.commit("tab/clearTabList");
          this.$router.push({ path: "/home" });
        } else {
          this.getStatus(s);
          this.isShow = true;
        }
      })
    },
    //获取入驻状态
    getStatus(s) {
      let newStatus = "";
      let newUserInfo = JSON.parse(localStorage.getItem("userInfo"))
      let arr = newUserInfo.enterpriseCheckinList.filter((item) => {
        if (s == "procurement") {
          this.content[2].text =
            "您已申请开通采购协同服务，请耐心等待审批！联系电话：";
          return item.checkinType == "BUYER";
        } else {
          this.content[2].text =
            "您已申请开通供应协同服务，请耐心等待审批！联系电话：";
          return item.checkinType == "SUPPLIER";
        }
      });
      if (arr[0]) {
        newStatus = arr[0].status;
        switch (newStatus) {
          case "INIT":
            this.txtContent = JSON.parse(JSON.stringify(this.content[2]));

            break;
          case "REJECT":
            this.txtContent = JSON.parse(JSON.stringify(this.content[1]));
            this.txtContent.reason = arr[0].reason;
            break;
          case "SUCCESS":
            this.txtContent = JSON.parse(JSON.stringify(this.content[2]));
            break;
          default:
            this.txtContent = JSON.parse(JSON.stringify(this.content[0]));
        }
      } else {
        this.txtContent = JSON.parse(JSON.stringify(this.content[0]));
      }
    },
    onSubmit() {
      let checkinType = "";
      if (this.form.resource == "供应协同") {
        checkinType = "SUPPLIER";
      } else if (this.form.resource == "采购协同") {
        checkinType = "BUYER";
      } else {
        Message.error("请选择入驻角色");
        return;
      }
      let obj = {
        checkinType,
        companyId: JSON.parse(localStorage.getItem("userInfo")).companyId,
      };

      enterprise(obj).then((res) => {
        if (res.data.code == 200) {
          Message.success("申请成功");
        } else if (res.data.code === 20001) {
          Message.success(res.data.message);
        } else {
          Message.info("申请失败");
        }
      });

      this.dialogFormVisible = false;
    },
  },
};
</script>
<style lang="less" scoped>
.mainwrap {
  height: 100vh;
  width: 100%;
  display: flex;
  background: url("../assets/images/main_bg.jpg") no-repeat;
  background-size: cover;
  justify-content: center;
  align-items: center;
  .main-content {
    width: 1040px;
    height: 370px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    div.main-btn {
      display: flex;
      justify-content: space-between;
      width: 100%;
      .btn {
        width: 480px;
        height: 188px;
        border-radius: 8px;
        background: #fff;
        display: flex;
        justify-content: space-around;
        align-items: center;
        overflow: hidden;
        .icon {
          height: 140px;
          box-sizing: border-box;
          img {
            height: 100%;
          }
        }
        .txt {
          p {
            font-size: 36px;
            color: #1b2b3a;
          }
          .info {
            margin-top: 28px;
            height: 37px;
            width: 90px;
            color: #fff;
            font-size: 20px;
            background: #bad4b1;
            border-radius: 5px;
            border: 0;
          }
          .finish {
            background: #fea957;
          }
        }
        .inset {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: transparent;
          border: 0;
          img {
            width: 40px;
            height: 40px;
          }
        }
      }
    }
    .apply {
      width: 240px;
      height: 82px;
      background: #75abff;
      color: #fff;
      font-size: 36px;
      border: 0;
      border-radius: 8px;
    }
  }
}
</style>
