<template>
  <div>
    <el-card class="searchCard">
      <div class="serchContainer">
        <el-form ref="searchform" :model="searchform" label-width="100px">
          <el-row>
            <el-col :span="5">
              <el-form-item label="用户名：" prop="username">
                <el-input
                  placeholder="用户名"
                  v-model.trim="searchform.username"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="手机号码：" prop="phone">
                <el-input
                  placeholder="手机号码"
                  v-model.trim="searchform.phone"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="姓名：" prop="realName">
                <el-input
                  placeholder="姓名"
                  v-model.trim="searchform.realName"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="状态：" prop="isEnable">
                <el-select v-model="searchform.isEnable" placeholder="全部">
                  <el-option label="全部" value="null"></el-option>
                  <el-option label="启用" value="ENABLE"></el-option>
                  <el-option label="禁用" value="DISABLE"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4" style="position: relative">
              <div style="position: absolute; right: 34px">
                <el-button type="primary" @click="addStaff">新增</el-button>
                <el-button type="primary" @click="searchData">查询</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-card class="contentCard">
      <div class="tableContainer">
        <el-table
          :data="tableData"
          highlight-current-row
          :height="tableHight"
          :header-cell-style="{
            'background-color': '#e6eaf0',
            color: '#142133',
          }"
        >
          <el-table-column label="用户名" prop="username">
            <!-- <template slot-scope="scope">
                            <span class="titleStyle" @click="checkDetail(scope.row.id)">{{[scope.row.flag]}}{{scope.row.title}}</span>
                        </template> -->
          </el-table-column>
          <el-table-column prop="phone" label="手机号"> </el-table-column>
          <el-table-column prop="realName" label="姓名"> </el-table-column>
          <el-table-column prop="relatedEnterpriseCount" label="指定客户">
          </el-table-column>
          <el-table-column prop="isRoot" label="角色">
            <template slot-scope="scope" width="400px">
              <span v-if="!scope.row.isRoot">
                <span v-for="(item, index) in scope.row.roleList" :key="item.id"
                  >{{ index + 1 }}.{{ item.name }}&nbsp;&nbsp;&nbsp;&nbsp;</span
                >
              </span>
              <span v-else>管理员</span>
            </template>
          </el-table-column>
          <el-table-column prop="isEnable" label="状态">
            <template slot-scope="scope">
              <span
                v-show="!scope.row.isRoot"
                :class="scope.row.isEnable ? 'disabledFalse' : 'disabledTrue'"
                >{{ scope.row.isEnable ? "启用" : "禁用" }}</span
              >
              <span v-show="scope.row.isRoot">管理员</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="310">
            <template slot-scope="scope">
              <div v-show="!scope.row.isRoot">
                <el-button type="text" @click="isDisabled(scope.row)"
                  >{{ scope.row.isEnable ? "禁用" : "启用" }}
                </el-button>
                <el-button type="text" @click="editRole(scope.row)"
                  >编辑</el-button
                >
                <!-- <el-button plain v-show="scope.row.status == '启用'" @click="checkDetail(scope.row)" type="primary" size="small">指定客户</el-button> -->
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <div class="pageContainer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchform.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="searchform.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <div class="disableDialog">
      <el-dialog
        :title="disabledObj.disabledTitle"
        :visible.sync="disabledObj.disabledDialogVisible"
        width="34%"
        :before-close="handleDisabledClose"
      >
        <div class="contentContainer">
          <div class="leftIcon"><img :src="selectImg" /></div>
          <div class="rightDes">
            <div class="tips">{{ disabledObj.disabledContentTip }}</div>
            <div class="comfirmStyle">{{ disabledObj.disabledContentDes }}</div>
          </div>
        </div>
        <div class="comfirmBtn">
          <el-button type="primary" @click="changeStatus">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="roleDialog">
      <el-dialog
        title="编辑"
        :visible.sync="roleDialogVisible"
        :before-close="handleRoleClose"
        width="34%"
      >
        <el-form
          :model="roleForm"
          :rules="rules"
          ref="roleForm"
          label-width="100px"
        >
          <el-form-item label="姓名：" prop="realName">
            <el-input
              placeholder="请输入姓名"
              v-model.trim="roleForm.realName"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户角色：" prop="roleIds">
            <el-select
              v-model="roleForm.roleIds"
              multiple
              @change="changeRoleValue"
              placeholder="请选择"
            >
              <el-option
                v-for="item in roleSelectList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
                :disabled="!item.isEnable"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer footBtn">
          <el-button @click="cancelEditRole('roleForm')">取 消</el-button>
          <el-button type="primary" @click="editRoleComfirm('roleForm')"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
    <div class="drawerContainer">
      <el-drawer
        title="新增企业员工"
        size="50%"
        :visible.sync="addRoleDrawer"
        direction="rtl"
        :before-close="handleClose"
      >
        <div class="contentInfo">
          <el-form :model="roleForm">
            <el-form-item
              label="请选择企业员工："
              label-width="130px"
              prop="role"
            >
              <el-input
                v-model.trim="roleDrawerObj.searchVal"
                @blur="searchValue"
                placeholder="请输入名称或手机号"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="transferStyle">
            <el-transfer
              v-model="selectTransfer"
              :titles="['待选择', '已选择']"
              :data="transferList"
            ></el-transfer>
          </div>
          <div class="footBtn">
            <el-button @click="addRoleDrawer = false">取 消</el-button>
            <el-button type="primary" @click="comfirmEmployeeRole"
              >提交</el-button
            >
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import { windowHeight } from "@/utils/setSize.js";
import { powerApi } from "../../api/user.js";
export default {
  data() {
    return {
      tableHight: null,
      disabledObj: {
        detailDrawer: false,
        disabledDialogVisible: false,
        disabledContentTip: "",
        disabledContentDes: "",
        disabledTitle: "启用",
        detaileTitle: "系统公告",
      },
      selectTransfer: [],
      disabledParams: {
        id: "",
        isEnable: "",
      },
      useImg: require("../../assets/images/use.png"),
      disabledImg: require("../../assets/images/icon_disabled.png"),
      selectImg: "",
      roleDialogVisible: false,
      roleForm: {
        roleIds: [],
        realName: "",
      },
      editRoleId: "",
      addRoleDrawer: false,
      roleDrawerObj: {
        searchVal: "",
      },
      total: 0,
      searchform: {
        username: "",
        phone: "",
        realName: "",
        isEnable: "",
        page: 1,
        pageSize: 10,
      },
      rules: {
        roleIds: [
          {
            type: "array",
            required: true,
            message: "请选择用户角色",
            trigger: "change",
          },
        ],
        realName: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
        ],
      },
      transferList: [],
      oldDataList: [],
      roleSelectList: [],
      tableData: [],
    };
  },
  methods: {
    getEmployeeData() {
      let params = JSON.parse(JSON.stringify(this.searchform));
      if (params.isEnable == "ENABLE") {
        params.isEnable = true;
      } else if (params.isEnable == "DISABLE") {
        params.isEnable = false;
      } else {
        params.isEnable = "";
      }
      powerApi.getEmployeeManageList(params).then((res) => {
        if (res.data.code === 200) {
          this.tableData = res.data.data.content;
          this.total = res.data.data.total;
        }
      });
    },
    comfirmEmployeeRole() {
      if (this.selectTransfer.length > 0) {
        let params = [];
        this.selectTransfer.map((item) => {
          params.push({
            originUserId: item,
          });
        });
        powerApi.batchImportUser(params).then((res) => {
          if (res.data.code === 200) {
            this.addRoleDrawer = false;
            this.searchData();
            this.$message({
              message: "提交成功！",
              type: "success",
              offset: 150,
            });
          } else {
            this.$message({
              message: res.data.message,
              type: "success",
              offset: 150,
            });
          }
        });
      } else {
        this.$message({ message: "请先选择企业员工再提交", type: "warning" });
      }
    },
    searchData() {
      this.searchform.page = 1;
      this.getEmployeeData();
    },
    checkDetail(detailId) {
      this.detailDrawer = true;
    },
    // 启用禁用弹框
    isDisabled(row) {
      if (row.isEnable) {
        this.selectImg = this.disabledImg;
        this.disabledObj.disabledTitle = "禁用";
        this.disabledObj.disabledContentTip = "您确定要禁用该企业用户吗？";
        this.disabledObj.disabledContentDes =
          "禁用后该用户将不可以再登录平台。";
      } else if (!row.isEnable) {
        this.selectImg = this.useImg;
        this.disabledObj.disabledTitle = "启用";
        this.disabledObj.disabledContentTip = "您确定要启用该企业用户吗？";
        this.disabledObj.disabledContentDes = "启用后该用户可以登录平台。";
      }
      this.disabledParams.id = row.id;
      this.disabledParams.isEnable = !row.isEnable;
      this.disabledObj.disabledDialogVisible = true;
    },
    // 确定---启用禁用
    changeStatus() {
      powerApi.changeEmployeeStatus(this.disabledParams).then((res) => {
        if (res.data.code === 200) {
          this.disabledObj.disabledDialogVisible = false;
          this.getEmployeeData();
        } else {
          this.disabledObj.disabledDialogVisible = false;
          this.$message({
            message: res.data.message,
            type: "warning",
            offset: 150,
          });
        }
      });
    },
    // 编辑角色
    editRole(row) {
      this.getAllRole();
      this.roleForm.roleIds = [];
      this.roleForm.realName = row.realName;
      if (row.roleList) {
        row.roleList.map((item) => {
          this.roleForm.roleIds.push(item.id);
        });
      }
      this.roleDialogVisible = true;
      this.editRoleId = row.id;
      this.$nextTick(() => {
        this.$refs["roleForm"].clearValidate();
      });
    },
    // 获取所有用户角色
    getAllRole() {
      let params = {
        page: 1,
        pageSize: 999999999,
      };
      powerApi.getAllRole(params).then((res) => {
        if (res.data.code === 200) {
          this.roleSelectList = res.data.data.content;
        }
      });
    },
    //  查询制造云用户
    searchValue() {
      this.transferList = this.oldDataList;
      let _search = this.roleDrawerObj.searchVal.toLowerCase();
      let newListData = []; // 用于存放搜索出来数据的新数组
      if (_search) {
        this.transferList.filter((item) => {
          if (
            item.label.toLowerCase().indexOf(_search) !== -1 ||
            item.telephone.indexOf(_search) !== -1
          ) {
            newListData.push(item);
          }
        });
        this.transferList = newListData;
      } else {
        this.transferList = this.oldDataList;
      }
    },
    // 新增-编辑获取制造云用户
    getUserAll() {
      this.selectTransfer = [];
      this.transferList = [];
      this.roleDrawerObj.searchVal = "";
      powerApi.getUserList().then((res) => {
        if (res.data.code === 200) {
          let data = res.data.data;
          data.map((item) => {
            this.transferList.push({
              key: item.userId,
              label: item.userName,
              telephone: item.telephone,
            });
          });
          this.oldDataList = this.transferList;
        }
      });
    },
    // 角色选择
    changeRoleValue(val) {
      // console.log(val)
      this.searchform.roleIds = val;
    },
    // 编辑角色--确定
    editRoleComfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            id: this.editRoleId,
            realName: this.roleForm.realName,
            roleIds: this.roleForm.roleIds,
          };
          powerApi.editEmployee(params).then((res) => {
            if (res.data.code === 200) {
              this.roleDialogVisible = false;
              this.$message({
                message: "编辑成功",
                type: "success",
                offset: 150,
              });
              this.getEmployeeData();
            } else {
              this.$message({
                message: res.data.message,
                type: "warning",
                offset: 150,
              });
            }
          });
        }
      });
    },
    // 取消角色编辑
    cancelEditRole() {
      this.roleDialogVisible = false;
    },
    addStaff() {
      this.addRoleDrawer = true;
      this.getUserAll();
    },
    handleRoleClose(done) {
      this.$refs["roleForm"].resetFields();
      done();
    },
    handleSizeChange(val) {
      this.searchform.page = 1;
      this.searchform.pageSize = val;
      this.getEmployeeData();
    },
    handleCurrentChange(val) {
      this.searchform.page = val;
      this.getEmployeeData();
    },
    handleClose(done) {
      done();
    },
    handleDisabledClose(done) {
      done();
    },
  },
  mounted() {
    let _this = this;
    window.addEventListener("resize", function () {
      return (() => {
        _this.tableHight = windowHeight() - 500;
      })();
    });
    this.getEmployeeData();
  },
  created() {
    this.tableHight = windowHeight() - 500;
  },
};
</script>
<style lang="less" scoped>
/deep/ .el-dialog__title {
  border-left: 6px solid #409eff;
  padding: 0px 10px;
  font-size: 22px;
  color: #000;
}
/deep/ .el-drawer__header {
  border-left: 6px solid #409eff;
  padding: 0px 10px;
  margin: 10px;
  font-size: 22px;
  color: #000;
}
/deep/.el-dialog {
  border-radius: 10px;
}
/deep/.el-drawer {
  border-bottom-left-radius: 10px !important;
  border-top-left-radius: 10px !important;
}
/deep/ .el-transfer-panel {
  width: 280px !important;
}
.searchCard {
  margin-bottom: 15px;
  border-radius: 10px;
  /deep/.el-card__body {
    padding: 0px !important;
  }
  .serchContainer {
    width: 100%;
    padding: 22px 10px 0px 10px;
    background-color: #fff;
  }
}
.contentCard {
  padding: 0px 5px 10px 5px;
  margin-bottom: 15px;
  border-radius: 10px;
  .tableContainer {
    margin-top: 20px;
    .disabledTrue {
      color: #ffba00;
    }
    .disabledFalse {
      color: #48df85;
    }
  }
}
.pageContainer {
  margin-top: 30px;
  text-align: center;
}
.disableDialog {
  .contentContainer {
    text-align: center;
    .leftIcon {
      display: inline-block;
      width: 40px;
      height: 40px;
    }
    .rightDes {
      display: inline-block;
      margin-left: 20px;
      text-align: left;
      .tips {
        font-size: 18px;
        font-weight: 600;
        padding-bottom: 20px;
      }
      .comfirmStyle {
      }
    }
  }
  .comfirmBtn {
    text-align: center;
    margin-top: 40px;
    /deep/.el-button {
      display: inline-block;
      width: 260px;
    }
  }
}
.roleDialog {
  /deep/.el-select {
    width: 100%;
  }
  .footBtn {
    text-align: center;
    /deep/.el-button {
      display: inline-block;
      width: 120px;
    }
  }
}
.drawerContainer {
  .contentInfo {
    // height: 100%;
    padding: 10px 30px;
    .transferStyle {
      margin: 50px 0px 0px 130px;
    }
    .footBtn {
      margin-top: 50px;
      text-align: center;
      /deep/.el-button {
        display: inline-block;
        width: 120px;
      }
    }
  }
}
</style>
