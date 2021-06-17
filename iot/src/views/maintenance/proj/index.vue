<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.content"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="项目内容"
      />
      <el-date-picker
        v-model="time"
        value-format="yyyy-MM-dd"
        type="daterange"
        start-placeholder="发生开始日期"
        end-placeholder="发生结束日期"
        :picker-options="pickerOptions"
      />
      <el-date-picker
        v-model="stopTime"
        value-format="yyyy-MM-dd"
        type="daterange"
        start-placeholder="截止开始日期"
        end-placeholder="截止结束日期"
        :picker-options="pickerOptions"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查找
      </el-button>
      <el-button
        v-permission="['POST /admin/event/add']"
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
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
      <el-table-column align="center" label="项目标题" prop="title" />
      <el-table-column align="center" label="项目内容" prop="content" />
      <el-table-column align="center" label="发生时间" prop="happendTime" />

      <el-table-column align="center" label="截止时间" prop="deadline" />

      <el-table-column
        align="center"
        label="操作"
        width="300"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['POST /admin/event/update']"
            type="primary"
            size="mini"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            v-permission="['POST /admin/event/listParam']"
            type="primary"
            size="mini"
            @click="handleDetail(scope.row)"
          >
            详情
          </el-button>
          <el-button
            v-permission="['POST /admin/event/eventDelete']"
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
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- 新增编辑克隆 -->
    <!-- <submit-form
      :row="row"
      :visible="addAlert"
      :alert-title="alertTitle"
      @cancel="cancel"
      @success="success"
    /> -->
  </div>
</template>

<script>
import { eventDelete, list } from '@/api/proj'
import { formatDate } from '@/utils/date'
// import SubmitForm from './submitForm'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'Proj',
  components: { Pagination },
  data() {
    return {
      time: [],
      stopTime: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        content: '',
        haStartTime: '',
        haEndTime: '',
        deadliStart: '',
        deadliEnd: ''
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
    this.ready()
  },

  methods: {
    ready() {
      this.listQuery.page = 1
      const date = new Date()
      if (this.time && this.time.length) {
        this.listQuery.haStartTime = `${this.time[0]} 00:00:00`
        this.listQuery.haEndTime = `${this.time[1]} 23:59:59`
      } else {
        if (!this.listQuery.haStartTime) {
          const m = formatDate(date, 'yyyy')
          this.listQuery.haStartTime = `${m}-01-01 00:00:00`
          this.time[0] = `${m}-01`
        }
        if (!this.listQuery.haEndTime) {
          const d = formatDate(date, 'yyyy-MM-dd')
          this.listQuery.haEndTime = `${d} 23:59:59`
          this.time[1] = d
        }
      }
      if (this.stopTime && this.stopTime.length) {
        this.listQuery.deadliStart = `${this.stopTime[0]} 00:00:00`
        this.listQuery.deadliEnd = `${this.stopTime[1]} 23:59:59`
      } else {
        if (!this.listQuery.deadliStart) {
          const m = formatDate(date, 'yyyy')
          this.listQuery.deadliStart = `${m}-01-01 00:00:00`
          this.stopTime[0] = `${m}-01`
        }
        if (!this.listQuery.deadliEnd) {
          const d = formatDate(date, 'yyyy-MM-dd')
          this.listQuery.deadliEnd = `${d} 23:59:59`
          this.stopTime[1] = d
        }
      }
      this.getList()
    },
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
      } = await list(this.listQuery)
      this.listLoading = false
      this.list = data.list
      this.total = data.total || data.data.length
    },
    // 查询
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 编辑
    handleEdit(row) {
      this.alertTitle = '编辑'
      this.row = row
      this.addAlert = true
      console.log('编辑')
    },
    // 详情
    handleDetail(row) {
      this.alertTitle = '详情'
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
      eventDelete(row.id).then(res => {
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
