<template lang="">
  <div id="headbar" >
    <!-- 头像和昵称 -->
    <div class="account cursor-pointer">
      <el-dropdown @command="handleCommand">
        <span class="flex-center">
          <!-- 头像 -->
          <el-avatar :src="data.avatar || avatar"></el-avatar>
          <!-- 昵称 -->
          <span class="username size16 ml10 mr10"> {{data.username}} </span>
        </span>

        <template #dropdown>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="changePassword" v-if="canChangePassword">更改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 修改密码 -->

    <el-dialog id="changepwd" title="修改密码" v-model="dialogVisible" width="450px">
      <el-form label-width="100px" >
        <el-form-item label="账号">
          <span>{{data.username}}</span>
        </el-form-item>
        <!-- <el-form-item label="原密码">
          <el-input v-model="dialogData.old" type="password"></el-input>
        </el-form-item> -->
        <el-form-item label="新密码">
          <el-input v-model="dialogData.new" type="password"></el-input>
        </el-form-item>
        <el-form-item label="重复密码">
          <el-input v-model="dialogData.repeat" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="mt30">
        <span class="mr60"></span>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changePassword">确 定</el-button>
      </div>
    </el-dialog>
  </div>

  <div id="headbar-clear"></div>
</template>

<script>

import {ref, reactive} from 'vue'
import auth from '@/util/auth'
import avatar from '@/assets/img/avatar.png'
import { API_Account } from '@/config/api'
import helper from '@/util/helper'

export default {
  props: {
    data: Object,
  },
  setup(props) {

    return {
      dialogVisible: ref(false),
      dialogData: ref({}),
      avatar: avatar,
      canChangePassword: API_Account.ChangePassword !== undefined,
    }
  },
  methods: {
    handleCommand(command) {
      if (command === 'logout') {
        auth.Remove()
        location.reload()
      } else if (command === 'changePassword') {
        this.dialogVisible = true
      }
    },
    async changePassword() {
      if (this.dialogData.new !== this.dialogData.repeat) {
        helper.AlertWarning("两次密码不一致")
        return
      }

      let resp = await API_Account.ChangePassword({password: this.dialogData.new})
      if (resp.success) {
        this.dialogVisible = false
        this.dialogData = {}
        helper.AlertSuccess("修改成功")
      }
    }
  },

}
</script>

<style lang="scss" scoped>
#headbar {
  position: fixed;
  top: 0;
  left: $sidebarWidth;
  right: 0;
  padding: 10px;
  background: #FFF;
  border-bottom: 1px solid #DFDFDF;
  z-index: 998;
  .account {
    float: right;
  }
}

#headbar-clear {
  margin-top: 60px;
}

#changepwd {
  .el-input {
    max-width: 250px;
  }
}
</style>