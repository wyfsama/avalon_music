<template>
  <div class="login-container">
    <el-tooltip
      class="item"
      effect="dark"
      content="游客模式 无需密码"
      placement="right-end"
    >
      <div class="mode el-icon-position" @click="tovisitormode"></div>
    </el-tooltip>
    <div class="login-main">
      <h1>Avalon Music</h1>
      <el-tooltip
        class="item"
        effect="dark"
        content="切换至邮箱登录，此功能开发中，敬请期待"
        placement="top"
      >
        <div class="login-icon el-icon-message"></div>
      </el-tooltip>

      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm">
        <el-form-item label="手机号码" prop="phonenum">
          <el-tooltip
            class="item"
            effect="dark"
            content="需网抑云手机账号登录~"
            placement="top"
          >
            <el-input
              prefix-icon="el-icon-mobile-phone"
              v-model="ruleForm.phonenum"
              autocomplete="off"
            ></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            type="password"
            v-model="ruleForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    var validatePhonenum = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else {
        // console.log(value)
        if (value.length !== 11) {
          callback(new Error('喂！手机号有11位~'))
        }
        callback()
      }
    }
    return {
      ruleForm: {
        phonenum: '',
        password: '',
      },
      rules: {
        password: [
          { validator: validatePass, trigger: 'blur', required: true },
        ],
        phonenum: [
          { validator: validatePhonenum, trigger: 'blur', required: true },
        ],
      },
      loginData: '',
    }
  },
  created() {
    // document.onkeydown = (e) => {
    // if (e.keyCode === 13) {
    //   console.log(e)
    //   this.submitForm(this.loginData)
    // }
    // }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        const { data } = await this.request({
          url: '/login/cellphone',
          params: {
            phone: this.ruleForm.phonenum,
            password: this.ruleForm.password,
          },
        })
        this.request('/login/refresh')
        if (valid && data.code === 200) {
          sessionStorage.setItem('userinfo', JSON.stringify(data.profile))
          this.$router.push('./')
          this.$message({
            message: '登录成功',
            type: 'success',
          })
        } else {
          this.$message.error('账号或者密码错误')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    tovisitormode() {
      sessionStorage.setItem('userinfo', JSON.stringify({ user: 'vistor' }))
      this.$router.push('/')
    },
  },
  components: {},
}
</script>

<style  lang="scss" scoped>
.login-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-repeat: no-repeat;
  background-image: url('../assets/cool-background.png');
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  .mode {
    cursor: pointer;
    font-size: 1.6rem;
    position: absolute;
    top: 10px;
    right: 10px;
    color: #eee;
  }
  .login-main {
    position: relative;
    padding: 30px 150px;
    box-shadow: 0 0 3px #555;
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.3);
    h1 {
      // width: 200px;
      color: #eee;
      text-align: center;
      // font: 700 2rem '';
      font-style: italic;
      letter-spacing: 10px;
    }
    .login-icon {
      font-size: 1.6rem;
      position: absolute;
      top: 10px;
      right: 10px;
      color: #eee;
    }
  }
}
</style>
