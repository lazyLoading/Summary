<template>
  <!-- 新增订单 -->
  <div class="add-order">
    <el-form
      ref="formRef"
      :model="addForms"
      :rules="rules"
      label-width="auto"
      :inline="true"
    >
      <el-card>
        <div class="tit-head">订单信息</div>
        <el-form-item
          v-for="(item, index) in formLabel"
          :key="index"
          :prop="item.prop"
          :label="item.label ? item.label + '：' : ''"
        >
          <el-upload
            v-if="item.label == '上传附件'"
            class="upload-demo"
            :file-list="addForms[item.prop]"
            :action="upFiles"
            :headers="headers"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :before-upload="handleUpload"
            :on-exceed="handleExceed"
            :limit="3"
            name="fileObjs"
            :data="{ folderName: 'purchase', fileNames: '' }"
            multiple
          >
            <el-button size="small" type="primary" plain>点击上传</el-button>
            <span slot="tip" class="el-upload__tip color-red4">
              支持文件格式：.jpg .jpeg .bmp .png .xls .xlsx .pdf
              .ppt，单个文件不能超过30MB，最多可上传3个文件!
            </span>
          </el-upload>

          <formItem v-else v-model="addForms[item.prop]" :itemOptions="item" />
        </el-form-item>
      </el-card>

      <el-card class="materiel-info">
        <div class="tit-head">
          <p>物料信息</p>
          <el-button v-show="addOff" type="primary" size="medium" @click="onAdd"
            >新增</el-button
          >
        </div>

        <el-table
          :data="addForms.materialList"
          :header-cell-style="{
            'background-color': '#e6eaf0',
            color: '#142133',
          }"
          height="40vh"
          stripe
        >
          <el-table-column
            label="序号"
            width="55"
            type="index"
          ></el-table-column>
          <template v-for="(item, index) in tableLabel">
            <!-- 输入框 -->
            <el-table-column
              v-if="item.slot == 'orderingNumber'"
              :key="index"
              :label="item.label"
              :width="item.width ? item.width : ''"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="'materialList.' + scope.$index + '.orderingNumber'"
                  :rules="[
                    {
                      required: true,
                      message: '请输入订货数量',
                      trigger: 'blur',
                    },
                    {
                      pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
                      message: '最多保留两位小数',
                      trigger: 'blur',
                    },
                    { validator: testTwoSmallNum, trigger: 'blur' },
                  ]"
                >
                  <el-input
                    type="number"
                    v-model="scope.row[item.prop]"
                    :placeholder="'请输入' + item.label"
                    size="medium"
                    oninput="if(value.length>11)value=value.slice(0,11)"
                    :disabled="!addOff"
                  >
                  </el-input>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column
              v-else-if="item.slot == 'finalOrderingNumber'"
              :key="index"
              :label="item.label"
              :width="item.width ? item.width : ''"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="
                    'materialList.' + scope.$index + '.finalOrderingNumber'
                  "
                  :rules="[
                    {
                      required: true,
                      message: '请输入最终订货数量',
                      trigger: 'blur',
                    },
                    {
                      pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
                      message: '最多保留两位小数',
                      trigger: 'blur',
                    },
                    { validator: testTwoSmallNum, trigger: 'blur' },
                    { validator: compareNum, row: scope.row, trigger: 'blur' },
                  ]"
                >
                  <el-input
                    type="number"
                    v-model="scope.row[item.prop]"
                    :placeholder="'请输入' + item.label"
                    size="medium"
                    oninput="if(value.length>11)value=value.slice(0,11)"
                  >
                  </el-input>
                </el-form-item>
              </template>
            </el-table-column>

            <!-- 文本框 -->
            <el-table-column
              v-else-if="item.slot == 'text'"
              :key="item.prop"
              :label="item.label"
              :width="item.width ? item.width : ''"
            >
              <template slot-scope="scope">
                <el-form-item>
                  <el-input
                    type="text"
                    v-model="scope.row[item.prop]"
                    size="medium"
                    maxlength="200"
                  />
                </el-form-item>
              </template>
            </el-table-column>

            <!-- 纯文字 -->
            <el-table-column
              v-else
              :key="item.prop"
              :label="item.label"
              :width="item.width ? item.width : ''"
            >
              <template slot-scope="scope">
                <span class="text-overflow" :title="scope.row[item.prop]">
                  {{ scope.row[item.prop] }}</span
                >
              </template>
              ></el-table-column
            >
          </template>
          <!-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div class="operation-btn">
                <el-link
                  type="primary"
                  @click.stop="onEdit(scope.row, scope.$index)"
                  >编辑</el-link
                >
                <el-link
                  v-show="addOff"
                  type="primary"
                  @click.stop="onDel(scope.row, scope.$index)"
                  >删除</el-link
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div class="text-center bnt-box">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click.stop="onConfirm('formRef')"
          >保存</el-button
        >
      </div>
    </el-form>
  </div>
</template>

<script>
import router from "@/router";
import formItem from "@/components/FormItem";
import { upFiles } from "@/api/order.js";
let token = localStorage.getItem("jwt-token");
export default {
  name: "orderSubmiit",
  components: {
    formItem,
  },
  props: {
    inline: Boolean,
    formLabel: Array,
    rules: Object,
    addForms: Object,
    tableLabel: Array,
    drawerTitle: String,
    addOff: Boolean,
  },
  data() {
    return {
      headers: { "jwt-token": token, direction: "buyer" },
      upFiles,
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    testTwoSmallNum(rule, value, callback) {
      if (isNaN(value)) {
        callback(new Error("请输入数字"));
      } else if (value[0] === "0" && value[1] !== ".") {
        callback(new Error("请输入正确的数字"));
      } else if (value === "0." || value === "0.0" || value === "0.00") {
        callback(new Error("请输入正确的数字"));
      } else {
        callback();
      }
    },
    //对比实收数
    compareNum(rule, value, callback) {
      if (value < rule.row.receiveNumber) {
        callback(new Error("不能小于实收数"));
      } else {
        callback();
      }
    },
    //新增-物料
    onAdd() {
      this.$emit("onAdd", true);
    },
    //编辑物料
    onEdit(item, index) {
      let d = { item, index };
      this.$emit("onEdit", d);
    },
    //删除物料
    onDel(item, index) {
      let d = { item, index };
      this.$emit("onDel", d);
    },
    //取消
    onCancel() {
      this.$emit("onCancel");
    },
    //上传-验证
    handleUpload(file) {
      let _this = this;
      if (file.size > Number(30 * 1024 * 1024)) {
        _this.$message.error("单个文件大小不得超过30MB!");
        return false;
      } else {
        let splitArr = file.name.split(".");
        let type = splitArr[splitArr.length - 1].toLowerCase();

        let allowType = [
          "jpg",
          "jpeg",
          "bmp",
          "png",
          "xls",
          "xlsx",
          "pdf",
          "ppt",
        ];

        if (!allowType.includes(type)) {
          _this.$message.error(
            "附件格式不正确,仅支持.jpg .jpeg .bmp .png .xls .xlsx .pdf .ppt格式文件!"
          );

          return false;
        }
      }
    },
    // 上传-超出限制
    handleExceed(files, fileList) {
      this.$message.warning("最多可上传3个文件!");
    },
    //上传-移除文件
    handleRemove(file, fileList) {
      this.$emit("onUpChange", fileList);
    },
    //上传-成功
    handleSuccess(response, file, fileList) {
      if (response.code == 401) {
        this.$message.error(response.message); //文件上传错误提示
        router.push({ path: "/login" });
      } else if (response.code == 200) {
        this.$emit("onUpChange", fileList);
      } else {
        this.$message.error(response.message); //文件上传错误提示
      }
    },
    //提交订单
    onConfirm(formName) {
      let _this = this;
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.$emit("onConfirm", _this.addForms);
        } else {
          console.log("error submit!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
@deep: ~">>>";

.add-order {
  .el-upload__tip {
    padding-left: 10px;
    color: red;
  }
  @{deep}.operation-btn {
    .el-link {
      margin-right: 10px;
    }
  }
  .el-table {
    // @{deep}.el-form-item{ margin-bottom: 0;}
  }
}
</style>
