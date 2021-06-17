<template>
  <div id="loginPage">
    <el-card class="login-form-layout">
      <el-row>
        <el-col :span="24">
          <div class="logo">
            <div class="logo-bg">
              <i class="el-icon-s-promotion" />
            </div>

          </div>
          <h2 class="login-title el-icon-s-platform">&nbsp;&nbsp;后台管理</h2>
          <el-form
            ref="loginForm"
            auto-complete="on"
            :model="loginForm"
            :rules="loginRules"
            label-position="left"
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                name="username"
                type="text"
                auto-complete="on"
                style="font-size: 16px;"
                placeholder="请输入用户名"
              >
                <span slot="prefix">
                  <i
                    class="el-icon-s-custom"
                    style="font-size: 16px; color: #1890ff; margin-left: 5px;"
                  />
                </span>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                name="password"
                :type="pwdType"
                auto-complete="on"
                placeholder="请输入密码"
                style="font-size: 16px;"
                @keyup.enter.native="handleLogin"
              >
                <span slot="prefix">
                  <i
                    class="el-icon-lock"
                    style="font-size: 16px; color: #1890ff; margin-left: 5px;"
                  />
                </span>
                <span slot="suffix" @click="showPwd">
                  <i
                    class="el-icon-view"
                    style="font-size: 16px; color: #1890ff; margin-right: 5px;"
                  />
                </span>
              </el-input>
            </el-form-item>
            <el-form-item style="margin-bottom: 40px; text-align: center;">
              <el-button
                style="width: 100%; font-size: 16px;"
                type="primary"
                :loading="loading"
                @click="handleLogin"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
      title="test"
      :visible.sync="dialogVisible"
      :show-close="false"
      :center="true"
      width="30%"
    >
      <div style="text-align: center;" />
      <span slot="footer" class="dialog-footer">
        <el-button
          v-loading="loading"
          type="primary"
          @click="dialogConfirm"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import { setSupport, setCookie, getCookie } from '@/utils/support'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error('密码不能小于3位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePass }
        ]
      },
      loading: false,
      pwdType: 'password',
      dialogVisible: false,
      supportDialogVisible: false
    }
  },
  created() {
    this.loginForm.username = getCookie('username')
    this.loginForm.password = getCookie('password')
    if (
      this.loginForm.username === undefined ||
      this.loginForm.username == null ||
      this.loginForm.username === ''
    ) {
      this.loginForm.username = 'admin'
    }
    if (
      this.loginForm.password === undefined ||
      this.loginForm.password == null
    ) {
      this.loginForm.password = ''
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('LoginByUsername', this.loginForm)
            .then(() => {
              this.loading = false
              setCookie('username', this.loginForm.username, 15)
              setCookie('password', this.loginForm.password, 15)
              this.$router.push({ path: this.redirect || '/' })
            })
            .catch((error) => {
              this.loading = false
              this.$notify.error({
                title: '失败',
                message: error
              })
            })
        } else {
          console.log('参数验证不合法！')
          return false
        }
      })
    },
    handleTry() {
      // this.dialogVisible =true
    },
    dialogConfirm() {
      this.dialogVisible = false
      setSupport(true)
    },
    dialogCancel() {
      this.dialogVisible = false
      setSupport(false)
    }
  }
}
</script>

<style scoped lang="scss">
#loginPage {
  width: 100%;
  height: 100%;
  background: #0e0a19 url("./../../assets/images/login_center_bg5.jpg")
    no-repeat 0% 0%;
  background-size: 100% 100%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-box-align: center;
  -webkit-box-pack: center;
  padding: 0 20%;
  .el-card {
    width: 400px;
    padding: 0 40px;
    background: rgba(255, 255, 255, 0.2);
    .login-title {
      text-align: center;
      color: #1890ff;
    }
  }
}
.logo{
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  &-bg{
    width: 60px;
    height: 60px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    color: rgb(255, 255, 255);
    transform: rotate(45deg);
    background: linear-gradient(blue, pink);
    padding: 7px;
    border-radius: 10px;
    box-shadow: 0 0 10px #000;
    i{
      transform: rotate(-45deg);
    }
  }
}
.el-icon-view{
  cursor: pointer;
}
</style>
