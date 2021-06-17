<template>
  <el-form
    class="order-forms"
    ref="formRef"
    :inline="inline"
    :model="form"
    :rules="rules"
    label-width="110px"
  >
    <el-form-item
      v-for="(item, index) in formLabel"
      :key="index"
      :label="item.label"
      :prop="item.model"
    >
      <el-input
        v-model.trim="form[item.model]"
        :placeholder="'请输入' + item.label"
        v-if="!item.type"
        :maxlength="item.max"
        :disabled="item.disabled"
      ></el-input>

      <el-input
        v-model.trim="form[item.model]"
        type="textarea"
        :placeholder="'请输入' + item.label"
        v-if="item.type === 'textarea'"
        :maxlength="item.max"
        show-word-limit
      ></el-input>

      <el-input
        type="number"
        v-model="form[item.model]"
        oninput="if(value.length>11)value=value.slice(0,11)"
        :placeholder="'请输入' + item.label"
        v-if="item.type === 'number'"
        :disabled="item.disabled"
      ></el-input>

      <el-select
        style="width: 100%"
        v-model="form[item.model]"
        placeholder="请选择"
        v-if="item.type === 'select'"
        :disabled="item.disabled"
        @change="onChange($event, item.label)"
        filterable
      >
        <el-option
          v-for="(item, i) in item.opts"
          :key="i"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-switch
        v-model="form[item.model]"
        v-if="item.type === 'switch'"
      ></el-switch>
      <el-date-picker
        v-model="form[item.model]"
        type="date"
        placeholder="选择日期"
        v-if="item.type === 'date'"
        value-format="yyyy-MM-dd"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <div class="text-center">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onConfirm('formRef')"
          >确 定</el-button
        >
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "orderForms",
  props: {
    inline: Boolean,
    form: Object,
    formLabel: Array,
    rules: Object,
  },
  created() {},
  method() {},
  methods: {
    onChange(e, name) {
      let d = { e, name };
      this.$emit("onChange", d);
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

<style lang="less" scoped></style>
