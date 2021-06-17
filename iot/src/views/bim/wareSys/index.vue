<template>
  <div class="container">
    <div class="left-tree">
      <house-tree :tree="tree" @selectTree="selectTree" />
    </div>
    <div class="right-cont">
      <!-- 查询和其他操作 -->
      <div class="filter-container">
        <el-input
          v-model="listQuery.username"
          clearable
          class="filter-item"
          style="width: 200px;"
          placeholder="用户名"
        />
        <el-input
          v-model="listQuery.mobile"
          clearable
          class="filter-item"
          style="width: 200px;"
          placeholder="手机号"
        />
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >
          查找
        </el-button>
      </div>

      <!-- 查询结果 -->
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="正在查询中。。。"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="用户名" prop="username" />
        <el-table-column align="center" label="手机号" prop="mobile" />

        <el-table-column align="center" label="昵称" prop="nickname" />
        <el-table-column align="center" label="职位">
          <template slot-scope="scope">
            <div>
              {{ scope.row.userType | userTypeToName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="240">
          <template slot-scope="scope">
            <div class="bt">
              <div v-permission="['POST /admin/user/wareUpdate']">
                <span
                  v-show="scope.row.userType === 1"
                  @click="wareUpdateApi(scope.row, 1)"
                >设置为骑手</span>
              </div>
              <div v-permission="['POST /admin/admin/wareBigUpdate']">
                <span
                  v-show="scope.row.userType === 1"
                  @click="wareUpdateApi(scope.row)"
                >设置为大骑手</span>
              </div>
              <div
                v-permission="[
                  'POST /admin/admin/wareBigCancel',
                  'POST /admin/admin/wareCancel'
                ]"
              >
                <span
                  v-show="scope.row.userType === 3 || scope.row.userType === 4"
                  @click="wareCancelApi(scope.row)"
                >恢复为顾客</span>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total && total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="wareListApi"
      />
    </div>

    <el-dialog :visible.sync="visible" title="填写手机号" width="520px">
      <el-input
        v-model="mobile"
        oninput="value=value.replace(/[^\d]/g,'')"
        placeholder="请填写手机号"
        maxlength="11"
        show-word-limit
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submitMobile()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  wareList,
  getWarehouseTree,
  wareUpdate,
  wareCancel,
  updateMobile
} from '@/api/wareSys'

import HouseTree from './houseTree'
import Pagination from '@/components/Pagination'
export default {
  name: 'WareSys',
  components: { HouseTree, Pagination },
  filters: {
    userTypeToName(v) {
      const t = ['普通顾客', '管理', '骑手', '大骑手']
      return t[v - 1]
    }
  },
  data() {
    return {
      tree: [],
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        warehouse: '',
        page: 1,
        limit: 20,
        username: '',
        mobile: ''
      },
      mobile: '',
      rowId: '', // 修改手机的行id
      visible: false
    }
  },
  created() {
    this.getWarehouseTreeApi()
  },
  methods: {
    // 树点击事件
    selectTree(data) {
      this.$set(this.listQuery, 'warehouse', data.id)
      this.readyGetTableData()
    },
    // 初始化
    readyGetTableData() {
      this.listQuery.page = 1
      this.listQuery.limit = 20
      this.wareListApi()
    },
    // 设置骑手、大骑手 type1代表骑手2大骑手
    async wareUpdateApi({ mobile, id, userType }, type = 0) {
      if (mobile) {
        const param = {
          id,
          userType,
          warehouse: this.listQuery.warehouse
        }
        const res = await wareUpdate(param, type)
        console.log(res)
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.wareListApi()
      } else {
        this.$confirm(`当前顾客没有填写手机号信息，是否立即添加?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log('手机号添加手机号')
          this.visible = true
          this.rowId = id
        })
      }
    },
    // 取消骑手、大骑手
    wareCancelApi({ username, mobile, id, userType }) {
      const t = userType === '3' ? '骑手' : '大骑手'
      this.$confirm(`确定将“${username}”从${t}改为普通顾客吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          id,
          userType
        }
        this.cancelFunc(param)
      })
    },
    // 取消接口
    async cancelFunc(param) {
      const res = await wareCancel(param)
      this.$message({
        type: 'success',
        message: '操作成功!'
      })
      this.wareListApi()
      console.log(res)
    },
    // 手机号提交
    async submitMobile() {
      const params = {
        id: this.rowId,
        mobile: this.mobile
      }
      const res = await updateMobile(params)
      console.log(res)
      this.$message({
        type: 'success',
        message: '修改成功!'
      })
      this.visible = false
      this.wareListApi()
    },
    // 仓库树菜单
    async getWarehouseTreeApi() {
      const { data } = await getWarehouseTree()
      this.tree = data
      // 赋值第一个
      if (!this.listQuery.warehouse) {
        this.listQuery.warehouse = this.tree[0].id
        this.readyGetTableData()
      }
    },
    // 获取tableData
    async wareListApi() {
      this.listLoading = true
      const {
        data: { data }
      } = await wareList(this.listQuery)
      console.log(data)
      this.listLoading = false
      this.list = data.list
      this.total = data.total
    },
    // 查询
    handleFilter() {
      this.listQuery.page = 1
      this.wareListApi()
    },

    // 充值记录
    handleLog() {
      this.visible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  flex-flow: row nowrap;
  margin-top: 20px;
  padding-left: 20px;
  height: calc(100% - 40px);
  .left-tree {
    width: 200px;
    height: 100%;
    overflow: hidden;
    margin-right: 20px;
    border: 1px solid #c1c1c1;
  }
  .right-cont {
    flex: 1;
    .bt {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      span {
        padding: 5px 8px;
        color: #409eff;
        cursor: pointer;
        border-radius: 3px;
      }
      span:hover {
        background: #409eff;
        color: #fff;
      }
    }
  }
}
</style>
