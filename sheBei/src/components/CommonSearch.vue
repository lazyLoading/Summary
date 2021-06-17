<template>
  <div class="search-form-box">
    <el-form
      :model="formData"
      ref="formRef"
      :rules="rules"
      label-width="auto"
      :inline="true"
    >
      <el-form-item
        v-for="(item, index) in formOptions"
        :key="newKeys[index]"
        :prop="item.prop"
        :label="item.label ? item.label + '：' : ''"
        :rules="item.rules"
      >
        <formItem v-model="formData[item.prop]" :itemOptions="item" />
      </el-form-item>
    </el-form>
    <!-- 提交按钮 -->
    <div class="btn-box">
      <el-button
        v-if="btnItems.includes('search')"
        size="medium"
        type="primary"
        class="btn-search"
        @click="onSearch"
        >查询
      </el-button>
      <el-button
        v-if="btnItems.includes('add')"
        size="medium"
        type="primary"
        class="btn-export"
        @click="onAdd"
        >新增
      </el-button>

      <el-button
        v-if="btnItems.includes('export')"
        size="medium"
        type="primary"
        class="btn-export"
        @click="onExport"
        >导出
      </el-button>

      <el-button
        v-if="btnItems.includes('import')"
        size="medium"
        type="default"
        class="btn-reset"
        @click="onImport"
        >导入
      </el-button>
      <el-button
        v-if="btnItems.includes('reset')"
        size="medium"
        type="primary"
        class="btn-reset"
        @click="onReset"
        >重置
      </el-button>
    </div>
  </div>
</template>

<script>
import formItem from "./FormItem";
import tools from "@/utils/tools";

export default {
  props: {
    /**
     * 表单配置
     * 示例：
     * [{
     * label: '用户名', // label文字
     * prop: 'username', // 字段名
     * element: 'el-input', // 指定elementui组件
     * initValue: '阿黄', // 字段初始值
     * placeholder: '请输入用户名', // elementui组件属性
     * rules: [{ required: true, message: '必填项', trigger: 'blur' }], // elementui组件属性
     * events: { // elementui组件方法
     *  input (val) {
     *  console.log(val)
     *  },
     *  ...... // 可添加任意elementui组件支持的方法
     * }
     * ...... // 可添加任意elementui组件支持的属性
     * }]
     */
    formOptions: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
    // 提交按钮项，多个用逗号分隔（query, export, reset）
    btnItems: {
      type: String,
      default() {
        return "";
      },
    },
    rules: Object,
  },
  components: { formItem },
  data() {
    return {
      formData: {},
    };
  },

  computed: {
    newKeys() {
      return this.formOptions.map(() => {
        return tools.createUniqueString();
      });
    },
  },

  created() {
    this.addInitValue();
  },

  methods: {
    // 校验
    onValidate(callback) {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          console.log(this.formData);
          callback();
        }
      });
    },
    // 新增
    onAdd() {
      this.$emit("onAdd");
    },
    // 搜索
    onSearch() {
      this.onValidate(() => {
        this.$emit("onSearch", this.formData);
      });
    },
    //重置
    onReset() {
      this.onValidate(() => {
        this.$emit("onReset", this.formData);
      });
    },
    // 导出
    onExport() {
      this.onValidate(() => {
        this.$emit("onExport", this.formData);
      });
    },
    // 导入
    onImport() {
      this.$emit("onImport");
    },
    // 添加初始值
    addInitValue() {
      const obj = {};
      this.formOptions.forEach((val) => {
        if (val.initValue !== undefined) {
          obj[val.prop] = val.initValue;
        }
      });
      this.formData = obj;
    },
  },
};
</script>

<style lang="less" scoped>
.search-form-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  // background: #fff;
  // padding: 10px;
  // margin: 10px 0;

  .btn-box {
    display: flex;

    button {
      height: auto;
    }
  }

  .el-form {
    /deep/ .el-form-item__label {
      padding-right: 0;
    }

    .el-form-item {
      // display: flex;
      // margin-bottom: 0;

      &.is-error {
        margin-bottom: 22px;
      }
    }

    /deep/.el-range-separator {
      width: 10%;
    }
    // el-input宽度
    /deep/ .form-item {
      > .el-input:not(.el-date-editor) {
        width: 120px;
      }
    }

    /deep/ .el-select {
      width: 120px;
    }

    /deep/ .el-cascader {
      width: 200px;
    }
  }
}
</style>
