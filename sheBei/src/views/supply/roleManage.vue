<template>
  <div>
    <el-card class="searchCard">
      <div class="serchContainer">
        <el-form ref="searchform" :model="searchform" label-width="120px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="角色名称：" prop="name">
                <el-input
                  placeholder="角色名称"
                  v-model.trim="searchform.name"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建时间：" prop="createTime">
                <div class="block">
                  <el-date-picker
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    v-model="searchform.createTime"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="timeChange"
                    align="center"
                    :default-time="['00:00:00', '23:59:59']"
                  >
                  </el-date-picker>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态：" prop="isEnable">
                <el-select v-model="searchform.isEnable" placeholder="全部">
                  <el-option label="全部" value="null"></el-option>
                  <el-option label="启用" value="ENABLE"></el-option>
                  <el-option label="禁用" value="DISABLE"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" style="position: relative">
              <div style="position: absolute; right: 34px">
                <el-button type="primary" @click="addRole">新增</el-button>
                <el-button type="primary" @click="searchRoleList"
                  >查询</el-button
                >
                <!-- <el-button type="primary" @click="deleteAll" >批量删除</el-button> -->
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
          <el-table-column prop="code" label="角色编码"> </el-table-column>
          <el-table-column label="角色名称" prop="name"> </el-table-column>
          <el-table-column prop="isEnable" label="状态">
            <template slot-scope="scope">
              <span
                :class="scope.row.isEnable ? 'disabledFalse' : 'disabledTrue'"
                >{{ scope.row.isEnable ? "启用" : "禁用" }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope"> {{ scope.row.createdAt }}</template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="310">
            <template slot-scope="scope">
              <el-button type="text" @click="editRole(scope.row)"
                >编辑</el-button
              >
              <el-button type="text" @click="selectRole(scope.row)"
                >分配用户</el-button
              >
              <el-button
                v-show="!scope.row.isNormalRoot"
                type="text"
                @click="deleteRole(scope.row)"
                >删除</el-button
              >
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
    <!-- 分配用户 -->
    <div class="drawerContainer">
      <el-drawer
        title="分配用户"
        size="50%"
        :visible.sync="addRoleDrawer"
        direction="rtl"
        :before-close="handleClose"
      >
        <div class="contentInfo">
          <el-form :model="roleForm">
            <el-form-item
              label="选择指定用户："
              label-width="120px"
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
              >提 交</el-button
            >
          </div>
        </div>
      </el-drawer>
    </div>
    <!-- 新增 编辑 -->
    <div class="addEditDrawer">
      <el-drawer
        :title="drawerTitle"
        direction="rtl"
        size="50%"
        custom-class="demo-drawer"
        ref="drawerTree"
        :before-close="handleAddEditClose"
        :visible.sync="drawerTree"
      >
        <el-form
          :model="menuRulesData"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <div class="contentInfo">
            <el-form-item label="角色名称:" prop="name">
              <el-input
                v-model.trim="menuRulesData.name"
                maxlength="30"
              ></el-input>
            </el-form-item>
            <el-form-item label="状态：" prop="isEnable">
              <el-select v-model="menuRulesData.isEnable" placeholder="请选择">
                <el-option label="禁用" value="disabled"></el-option>
                <el-option label="启用" value="undisabled"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="18px">
              <label class="labelStyle"
                ><i style="color: red">*</i> 角色权限：</label
              >
              <div class="tree">
                <el-tree
                  :data="treedata"
                  show-checkbox
                  highlight-current
                  node-key="id"
                  ref="tree"
                  @check-change="handleCheckChange"
                  :default-expanded-keys="[1]"
                  :default-checked-keys="checked"
                  :props="defaultProps"
                >
                </el-tree>
              </div>
            </el-form-item>
          </div>
          <el-form-item class="btnStyle">
            <el-button @click="resetUserTreeMenu">取消</el-button>
            <el-button type="primary" @click="userTreeMenu('ruleForm')"
              >确定</el-button
            >
          </el-form-item>
        </el-form>
      </el-drawer>
    </div>
    <!-- 删除 -->
    <div class="disableDialog">
      <el-dialog
        title="删除"
        :visible.sync="deleteDialog"
        width="34%"
        :before-close="handleDeleteClose"
      >
        <div class="contentContainer">
          <div class="tips">
            <span><img :src="deleteImg" alt="" /></span> 你确认要删除该角色吗？
          </div>
        </div>
        <div class="comfirmBtn">
          <el-button type="primary" @click="comfirmDeleteRole">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { windowHeight } from "@/utils/setSize.js";
import { powerApi } from "../../api/user.js";
export default {
  data() {
    return {
      selections: [],
      checked: [1],
      tableHight: null,
      detailDrawer: false,
      detaileTitle: "系统公告",
      total: 0,
      drawerTitle: "添加角色",
      addRoleDrawer: false,
      deleteDialog: false,
      singleDeleteId: "",
      treedata: [],
      selectRoleId: "",
      deleteImg: require("../../assets/images/icon_delete.png"),
      roleDrawerObj: {
        searchVal: "",
      },
      transferList: [],
      oldDataList: [],
      selectTransfer: [],
      roleForm: {
        roleDialogVisible: false,
        role: "aa",
      },
      defaultProps: {
        children: "children",
        label: "name",
      },
      menuRulesData: {
        id: "",
        name: "",
        status: "",
        menuIds: [],
        roleId: "",
        isEnable: "undisabled",
      },
      drawerTree: false,
      rules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        isEnable: [
          { required: true, message: "请选择角色状态", trigger: "change" },
        ],
      },
      searchform: {
        name: "",
        createTime: "",
        isEnable: "",
        page: 1,
        pageSize: 10,
      },
      tableData: [],
    };
  },

  methods: {
    getRoleList() {
      let params = {
        name: this.searchform.name,
        createdAtStart: this.searchform.createTime
          ? this.searchform.createTime[0]
          : "",
        createdAtEnd: this.searchform.createTime
          ? this.searchform.createTime[1]
          : "",
        isEnable: this.searchform.isEnable,
        page: this.searchform.page,
        pageSize: this.searchform.pageSize,
      };
      if (params.isEnable == "DISABLE") {
        params.isEnable = false;
      } else if (params.isEnable == "ENABLE") {
        params.isEnable = true;
      } else {
        params.isEnable = "";
      }
      powerApi.getAllRole(params).then((res) => {
        if (res.data.code === 200) {
          this.tableData = res.data.data.content;
          this.total = res.data.data.total;
        }
      });
    },
    // 查询列表数据
    searchRoleList() {
      this.searchform.page = 1;
      this.getRoleList();
    },
    // 获取所有角色权限---新增
    getAllPower() {
      powerApi.getAllRolePower().then((res) => {
        if (res.data.code === 200) {
          this.treedata = res.data.data;
        }
      });
    },
    // 添加角色
    addRole() {
      this.drawerTitle = "添加角色";
      this.getAllPower();
      this.menuRulesData = {};
      this.menuRulesData.isEnable = "undisabled";
      this.menuRulesData = JSON.parse(JSON.stringify(this.menuRulesData));
      this.checked = [1];
      this.drawerTree = true;
      this.$nextTick(() => {
        this.$refs["ruleForm"].clearValidate();
      });
    },
    // 新增编辑弹框关闭
    handleAddEditClose(done) {
      // this.$refs['ruleForm'].resetFields();
      done();
    },
    // 改变树结构
    handleCheckChange() {},
    resetUserTreeMenu() {
      this.drawerTree = false;
      this.$refs.tree.setCheckedKeys([]);
    },
    // 新增，点击确定按钮
    userTreeMenu(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let menu = this.$refs.tree.getCheckedNodes();
          if (menu.length > 0) {
            let menuId = [];
            menu.forEach((item) => {
              menuId.push(item.id);
            });
            // 半选状态的顶级树形结构的id
            let getHalfNodes = this.$refs.tree
              .getHalfCheckedNodes()
              .filter((item) => {
                return item.pid == -1;
              });
            getHalfNodes.forEach((item) => {
              menuId.push(item.id);
            });
            // console.log(typeof menuId)
            let paramaList = [];
            if (menuId.length > 0) {
              menuId.forEach((item) => {
                paramaList.push({
                  menuId: item,
                });
              });
            }
            let params = {
              id: this.menuRulesData.id,
              name: this.menuRulesData.name,
              list: paramaList,
              isEnable: this.menuRulesData.isEnable,
            };
            // console.log(params)
            if (params.isEnable == "disabled") {
              params.isEnable = false;
            } else if (params.isEnable == "undisabled") {
              params.isEnable = true;
            }
            if (this.menuRulesData.id) {
              powerApi.editRole(params).then((res) => {
                if (res.data.code === 200) {
                  this.getRoleList();
                  this.drawerTree = false;
                  this.$message({ message: "编辑成功", type: "success" });
                } else {
                  this.$message({
                    message: res.data.message,
                    type: "warning",
                  });
                }
              });
            } else {
              powerApi.addRoleConfirm(params).then((res) => {
                if (res.data.code === 200) {
                  this.searchRoleList();
                  this.drawerTree = false;
                  this.$message({ message: "新增成功", type: "success" });
                } else {
                  this.$message({
                    message: res.data.message,
                    type: "warning",
                  });
                }
              });
            }
          } else {
            this.$message({ message: "请先选择角色权限", type: "warning" });
            return;
          }
        }
      });
    },
    // 删除用户
    deleteRole(row) {
      this.singleDeleteId = row.id;
      this.deleteDialog = true;
    },
    comfirmDeleteRole() {
      powerApi.deleteRole({ id: this.singleDeleteId }).then((res) => {
        if (res.data.code === 200) {
          this.$message({ message: "删除成功!", type: "success", offset: 150 });
          this.getRoleList();
          this.deleteDialog = false;
        } else {
          this.$message({
            message: res.data.message,
            type: "warning",
            offset: 150,
          });
          this.deleteDialog = false;
        }
      });
    },
    // 编辑角色
    editRole(row) {
      this.drawerTitle = "编辑角色";
      this.getAllPower();
      this.menuRulesData.name = row.name;
      this.menuRulesData.id = row.id;
      if (row.isEnable) {
        this.menuRulesData.isEnable = "undisabled";
      } else {
        this.menuRulesData.isEnable = "disabled";
      }
      this.checked = [];
      if (row.list.length > 0) {
        row.list.map((item) => {
          this.checked.push(item.menuId);
        });
      }
      this.drawerTree = true;
      this.$nextTick(() => {
        this.$refs["ruleForm"].clearValidate();
      });
    },
    // 分配用户
    selectRole(row) {
      this.getUserAll();
      this.selectTransfer = row.checkedUserIdList;
      this.selectRoleId = row.id;
      this.addRoleDrawer = true;
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
      this.transferList = [];
      this.roleDrawerObj.searchVal = "";
      powerApi.getUserData().then((res) => {
        if (res.data.code === 200) {
          let data = res.data.data;
          data.map((item) => {
            this.transferList.push({
              key: item.id,
              label: item.realName ? item.realName : item.username,
              telephone: item.phone,
            });
          });
          this.oldDataList = this.transferList;
        }
      });
    },
    comfirmEmployeeRole() {
      // if (this.selectTransfer.length > 0) {
      let userList = [];
      this.selectTransfer.map((item) => {
        userList.push({
          userId: item,
        });
      });
      let params = {
        id: this.selectRoleId,
        list: userList,
      };
      powerApi.assignUser(params).then((res) => {
        if (res.data.code === 200) {
          this.addRoleDrawer = false;
          this.getRoleList();
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
      // } else {
      //   this.$message({ message: "请先选择用户再提交", type: "warning" });
      // }
    },
    timeChange() {
      if (
        this.searchform.createTime != null &&
        this.searchform.createTime.length > 0
      ) {
        this.searchform.startTime = this.searchform.createTime[0];
        this.searchform.endTime = this.searchform.createTime[1];
      } else {
        this.searchform.startTime = "";
        this.searchform.endTime = "";
      }
    },
    handleSizeChange(val) {
      this.searchform.page = 1;
      this.searchform.pageSize = val;
      this.getRoleList();
    },
    handleCurrentChange(val) {
      this.searchform.page = val;
      this.getRoleList();
    },
    handleDeleteClose(done) {
      done();
    },
    handleClose(done) {
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
    this.getRoleList();
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
/deep/ .el-transfer-panel {
  width: 280px !important;
}
/deep/.el-drawer {
  border-bottom-left-radius: 10px !important;
  border-top-left-radius: 10px !important;
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
    /deep/.el-button {
      padding: 0px !important;
    }
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
.disableDialog {
  .contentContainer {
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    img {
      width: 40px;
      height: 40px;
      vertical-align: middle;
      margin-right: 10px;
    }
  }
  .comfirmBtn {
    text-align: center;
    margin-top: 40px;
    /deep/.el-button {
      display: inline-block;
      width: 200px;
    }
  }
}
.addEditDrawer {
  // padding: 20px;
  /deep/ .el-select {
    display: block !important;
  }
  .contentInfo {
    padding: 20px;
    .labelStyle {
      text-align: right;
      vertical-align: middle;
      float: left;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
      box-sizing: border-box;
    }
    .tree {
      height: 600px;
      padding: 10px 20px;
      border: 1px solid #efefef;
      overflow: auto;
    }
  }
  .btnStyle {
    text-align: center;
  }
}
</style>
