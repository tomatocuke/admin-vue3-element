<template>
  <!-- 通过dialog最高层级z-index覆盖真实页面 -->
  <div  id="dialog-login" class="absolute-full"></div>

  <div id="login" class="absolute-center">
    <p>后台管理系统</p>
    <el-input v-model="form.username" type="text" size="large" placeholder="账号"></el-input>
    <el-input v-model="form.password" type="password" size="large" placeholder="密码" class="mt20"></el-input>
    <el-button class="mt20" type="primary" size="large" @click="submit" :loading="loading">登&nbsp;&nbsp;录</el-button>
  </div>

</template>

<script>

import { ref, reactive } from 'vue'
import { API_Login } from '@/config/api'
import auth from '@/util/auth'
import helper from '@/util/helper'

export default {
  setup() {
    return {
      loading: ref(false),
      form: reactive({
        username: '',
        password: '',
      }),
    }
  },
  methods: {
    async submit() {
      if (this.form.username == '' || this.form.password == '') {
        helper.AlertWarning("请填写账号密码")
        return
      }
      this.loading = true
      let resp = await API_Login(this.form)
      if (resp.success) {
        // 记录token
        auth.Set(resp.data.token, resp.data.expires_at)

        helper.AlertSuccess("登录成功")
        location.reload()
      }

    }
  }
}

</script>
  
<style lang="scss" scoped>
#dialog-login {
  background: linear-gradient(120deg, #E971AE, #3C96E4);
}

#login {
  z-index: 1000;
  top: 40%;
  width: 360px;
  background-color: rgba(0, 0, 0, 0.45);
  padding: 20px 40px 35px;
  border-radius: 5px;
  p {
    font-size: 24px;
    color: #fff;
  }
  .el-button {
    width: 100%;
  }
}

</style>