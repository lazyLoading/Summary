<template>
  <div class="dailog-wrap" v-if="isShow">
    <div class="modal">
      <div class="content">
        <div class="dialog-header">
          <span>提示</span>
          <i class="el-icon-close" @click.stop="cancel"></i>
        </div>
        <div class="dialogInfo">
          <img :src="content.iconSrc" alt="" />
          <div>
            {{ content.text }}
            <span>{{ content.iphone ? content.iphone : "" }}</span>
            <!-- <a v-if="content.reason" :alt="content.reaso">
              <span class="reason" v-if="content.reason"
                >原因：{{ content.reason }}</span
              >
            </a> -->
          </div>
        </div>
        <el-tooltip placement="top" v-if="content.reason">
          <div class="tooltips" slot="content">{{ content.reason }}</div>
          <div class="reason" v-if="content.reason"
            >驳回原因：{{ content.reason }}</div
          >
        </el-tooltip>
        <div class="dfooter" v-if="content.showBtn">
          <el-button class="btn" type="primary" @click="apply"
            >企业入驻</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "commondialog",
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    content: {
      type: Object,
      default: () => {
        return {
          iconSrc: "",
          text: "",
          showBtn: true,
        };
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    apply() {
      this.$emit("apply", false);
    },
  },
};
</script>

<style lang="less" scoped>
.tooltips{
  width:400px;
}
.dailog-wrap {
  position: fixed;
  font-size: 16px;
  width: 100%;
  height: 100%;
  .modal {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    .content {
      width: 400px;
      min-width: 300px;
      min-height: 218px;
      position: relative;
      background: #fff;
      border-radius: 8px;

      .dialog-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 5px 15px;
        border-bottom: 1px solid #f2f2f2;
        span {
          padding-left: 5px;
          border-left: 4px solid #2f82ff;
        }
        i {
          padding: 5px;
        }
      }
      .dialogInfo {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        padding: 0 20px;
        min-height: 100px;
        line-height: 1.8;
        img {
          width: 43px;
          height: 43px;
          margin-right: 15px;
        }
        span {
          color: #2f82ff;
        }
      }
      .reason {
        color: #f00;
        width:100%;
        padding: 0 30px;
        margin-top:-10px;
        margin-bottom:68px;
        word-break: break-all;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .dfooter {
        position: absolute;
        bottom: 20px;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        .btn {
          height: 36px;
          width: 220px;
          line-height: 1;
          padding: 0 16px;
        }
      }
    }
  }
}
</style>
