<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.searchKey"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="模糊查询"
      />
      <el-select v-model="listQuery.flag" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查找
      </el-button>
      <el-button
        v-permission="['POST /admin/syxsoftGrouponInfo/add']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleAdd"
      >
        新增
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
      <el-table-column align="center" label="团购标题" prop="groupTitle" />

      <el-table-column align="center" label="团购过期时间" prop="expireTime" />

      <el-table-column align="center" label="配送小区" prop="sendArea" />

      <el-table-column align="center" label="配送时间" prop="sendTime" />
      <el-table-column
        align="center"
        label="操作"
        width="300"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['POST /admin/syxsoftGrouponInfo/update']"
            type="primary"
            size="mini"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            v-permission="['POST /admin/syxsoftGrouponInfo/add']"
            type="primary"
            size="mini"
            @click="handleClone(scope.row)"
          >
            克隆
          </el-button>
          <el-button
            v-permission="['POST /admin/syxsoftGrouponInfo/delete']"
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total && total > 0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />

    <!-- 新增编辑克隆 -->
    <submit-form
      :row="row"
      :visible="addAlert"
      :alert-title="alertTitle"
      @cancel="cancel"
      @success="success"
    />
  </div>
</template>

<script>
import { syxsoftGrouponInfoList, syxsoftGrouponInfoDelete } from '@/api/group'
import SubmitForm from './submitForm'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'Group',
  components: { Pagination, SubmitForm },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        searchKey: '',
        flag: '2' // 0未过期1过期2全部
      },
      options: [
        { value: '2', label: '全部' },
        { value: '0', label: '未过期' },
        { value: '1', label: '已过期' }
      ],
      downloadLoading: false,
      row: {},
      alertTitle: '新增',
      addAlert: false
    }
  },
  created() {
    this.getList()
  },

  methods: {

    cancel() {
      this.addAlert = false
    },
    success() {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      this.addAlert = false
      this.getList()
    },
    async getList() {
      this.listLoading = true
      const {
        data: { data }
      } = await syxsoftGrouponInfoList(this.listQuery)
      this.listLoading = false
      this.list = data.list
      this.total = data.total || data.data.length
    },
    // 查询
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    // 编辑
    handleEdit(row) {
      this.alertTitle = '编辑'
      this.row = row
      this.addAlert = true
      console.log('编辑')
    },
    // 克隆
    handleClone(row) {
      this.alertTitle = '克隆'
      this.row = row
      this.addAlert = true
    },
    // 新增
    handleAdd() {
      this.alertTitle = '新增'
      this.row = {}
      this.addAlert = true
    },

    // 删除
    handleDelete(row) {
      syxsoftGrouponInfoDelete(row.id).then(res => {
        console.log(res)
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      })
    }
  }
}
</script>
