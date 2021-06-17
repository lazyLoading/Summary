<template>
  <el-form
    :inline="inline"
    label-width="100px"
    :model="form"
    ref="form"
    :rules="rules"
  >
    <el-form-item
      v-for="item in formLabel"
      :key="item.model"
      :label="item.label"
      :prop="item.model"
    >
      <el-input
        v-model="form[item.model]"
        :placeholder="'请输入' + item.label"
        v-if="!item.type"
      ></el-input>

      <el-input
        v-model.trim="form[item.model]"
        type="textarea"
        :placeholder="'请输入' + item.label"
        v-if="item.type === 'textarea'"
        :maxlength="item.max"
      ></el-input>

      <el-select
        v-model="form[item.model]"
        placeholder="请选择"
        v-if="item.type === 'select'"
      >
        <el-option
          v-for="item in item.opts"
          :key="item.value"
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
    <el-form-item><slot></slot></el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    inline: Boolean,
    form: Object,
    formLabel: Array,
    rules: Object,
  },
};
</script>

<style lang="less" scoped></style>
