<template>
  <div class="submit">
    <el-dialog
      :visible.sync="subvisible"
      :title="alertTitle"
      width="920px"
      @close="cancel('addForm')"
    >
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="rules"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="团购标题" prop="groupTitle">
          <el-input v-model="addForm.groupTitle" />
        </el-form-item>
        <el-form-item label="过期时间" prop="expireTime">
          <el-date-picker
            v-model="addForm.expireTime"
            type="date"
            placeholder="选择日期"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="配送地点" prop="sendArea">
          <el-select
            v-model="addForm.sendArea"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in options"
              :key="item.areaCode"
              :label="item.areaName"
              :value="item.areaName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="配送时间" prop="sendTime">
          <el-date-picker
            v-model="addForm.sendTime"
            type="date"
            placeholder="选择日期"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="团购详细描述" class="editor">
          <editor ref="editor" />
        </el-form-item>
      </el-form>
      <div class="product-box">
        <div class="product">关联产品</div>
        <div>
          <el-table
            ref="table"
            :data="products"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="brandName" label="供应商" width="280" />
            <el-table-column prop="goodName" label="产品名称" width="520" />
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('addForm')">取消</el-button>
        <el-button type="primary" @click="submitForm('addForm')">
          确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  syxsoftGrouponInfoAdd,
  pnpAreaList,
  syxsoftGrouponInfoUpdate,
  syxsoftGrouponInfoGet,
  listAllGoods
} from '@/api/group'
import Editor from './editor'
export default {
  name: 'SubmitForm',
  components: { Editor },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {
        return { detail: '' }
      }
    },
    alertTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      subvisible: false,
      options: [],
      loading: false,
      products: [], // 所有商品
      multipleTable: [],
      addForm: {
        groupTitle: '',
        expireTime: '',
        sendArea: '',
        sendTime: '',
        detail: ''
      },
      rules: {
        groupTitle: [
          { required: true, message: '请输入团购标题', trigger: 'blur' }
        ],
        expireTime: [
          {
            required: true,
            message: '请选择团购过期时间',
            trigger: 'change'
          }
        ],
        sendArea: [
          { required: true, message: '请选择配送地点', trigger: 'change' }
        ],
        sendTime: [
          {
            required: true,
            message: '请选择配送时间',
            trigger: 'change'
          }
        ]
      }
    }
  },
  watch: {
    visible(newV) {
      if (newV) {
        this.subvisible = newV
        if (this.alertTitle === '克隆' || this.alertTitle === '编辑') {
          this.getProds(this.row.id) // 查询关联商品
          const {
            groupTitle,
            expireTime,
            sendArea,
            sendTime,
            detail
          } = this.row
          this.addForm = {
            groupTitle,
            expireTime,
            sendArea,
            sendTime,
            detail
          }
          this.$nextTick(() => {
            // 初始化赋值到富文本
            const e = this.$refs.editor._data
            e.editorContent = detail
            e.editor.txt.html(detail)
          })
        } else {
          this.listAllGoodsApi()
          this.$nextTick(() => {
            // 初始化赋值到富文本
            const e = this.$refs.editor._data
            e.editorContent = ''
            e.editor.txt.html('')
          })
        }
      } else {
        this.addForm = {
          groupTitle: '',
          expireTime: '',
          sendArea: '',
          sendTime: '',
          detail: ''
        }
      }
    }
  },

  methods: {
    async listAllGoodsApi() {
      const {
        data: { data }
      } = await listAllGoods()
      this.products = data
      console.log(this.products)
      this.$nextTick(() => {
        this.setChecked()
      })
    },
    async getProds(id) {
      const { data } = await syxsoftGrouponInfoGet(id)
      this.products = data.list
      this.$nextTick(() => {
        this.setChecked()
      })
    },
    setChecked() {
      if (this.products.length) {
        if (this.alertTitle === '新增') {
          console.log('Xinzeng关联')
          console.log(this.products)
          this.multipleTable = this.products
        } else {
          this.multipleTable = this.products.filter(item => {
            return item.groupId && item.groupId > 0
          })
          console.log('编辑关联')
          console.log(this.multipleTable.length)
        }
      }
      if (this.multipleTable.length) {
        console.log(this.multipleTable.length)
        for (let i = 0; i < this.multipleTable.length; i++) {
          this.$refs.table.toggleRowSelection(this.multipleTable[i], true)
        }
      }
    },
    handleSelectionChange(val) {
      this.multipleTable = val
    },
    cancel(formName) {
      this.$refs[formName].resetFields()
      this.$emit('cancel')
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        const params = {
          pageNum: 1,
          pageSize: 20,
          searchKey: query
        }
        pnpAreaList(params).then(res => {
          const {
            data: { data }
          } = res
          this.options = data.list
          this.loading = false
        })
      } else {
        this.options = []
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.addForm)
          const e = this.$refs.editor._data
          this.addForm.detail = e.editorContent
          const arr = this.multipleTable.map(item => {
            return item.goodsId
          })
          const params = {
            ...this.addForm,
            goodIds: arr.toString()
          }
          if (this.alertTitle === '编辑') {
            params.id = this.row.id
            this.syxsoftGrouponInfoUpdateApi(params)
          } else {
            this.syxsoftGrouponInfoAddApi(params)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // 新增
    async syxsoftGrouponInfoAddApi(params) {
      const res = await syxsoftGrouponInfoAdd(params)
      this.subvisible = false
      this.$emit('success')
      console.log(res)
    },
    async syxsoftGrouponInfoUpdateApi(params) {
      const res = await syxsoftGrouponInfoUpdate(params)
      this.$emit('success')
      this.subvisible = false
      console.log(res)
    }
  }
}
</script>
<style lang="scss" scoped>
.submit {
  width: 100%;
  .editor {
    min-width: 800px;
  }
}
.product-box {
  padding: 0 5px;
}
.product {
  display: flex;
  flex-flow: row nowrap;
  height: 60px;
  align-items: center;
  font-size: 16px;
}
</style>
