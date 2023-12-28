<template>
  <!-- 登录页面 -->
  <Login v-if="!isLogin" />

  <!-- 侧边栏 -->
  <div id="left" v-if="isReady">
    <Menubar :data="menutab" />
  </div>
  <!-- 主体 -->
  <div id="right" v-if="isReady">
    <!-- 头部 -->
    <Headbar :data="info" />
    <!-- 页面选项卡 -->
    <MenuTab :data="menutab" />
    <!-- 主体 有缓存的路由页面-->
    <div class="p15 m15 bg-white" >
      <router-view v-slot="{ Component }">
        <keep-alive :include="RouterCache">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>

  <!-- 全局loading -->
  <Loading :loading="isLogin && !isReady" />
</template>


<script>
import { reactive, toRefs } from 'vue'
import router, { RouterCache } from '@/router'
import { API_Account } from '@/config/api'
import Login from '@/components/framework/login.vue'
import Loading from '@/components/loading.vue'
import Menubar from '@/components/framework/menubar.vue'
import Headbar from '@/components/framework/headbar.vue'
import MenuTab from '@/components/framework/menutab.vue'
import auth from '@/util/auth'

export default {
  name: "app",
  // 组件
  components: { Login, Loading, Menubar, Headbar, MenuTab },
  // 用setup取代data
  setup() {

    VITE_DEBUG && console.log("debug模式开启")

    const state = reactive({
      // 登录者信息
      info: {},
      // 菜单组件数据
      menutab: {
        menus: [], // 菜单列表
        tabs: {}, // 标签页路径
        current: '', // 当前页面路径
      },
      isReady: false,
    })

    // 判断登录状态
    var isLogin = auth.IsLogin()
    // /login路由不存在，自动跳转到HomePage，但是这里强制显示登录页面. 
    if (location.pathname === '/login') {
      isLogin = false
      router.push('/')
    }

    return {
      isLogin,
      RouterCache,
      ...toRefs(state),
    }
  },
  methods: {

  },
  async beforeCreate() {
    // 请求登录信息
    if (this.isLogin) {
      let resp = await API_Account.Info()
      if (resp.success) {
        // 登录者信息
        this.info = resp.data.info

        // 菜单栏
        this.menutab.menus = resp.data.menus
        let allowPath = {}
        this.menutab.menus.forEach(menu => {
          if (menu.children?.length > 0) {
            menu.children.forEach(child => {
              allowPath[child.path] = 1
            })
          } else {
            allowPath[menu.path] = 1
          }
        })
        // console.log(allowPath)
        // 防止菜单越权
        router.beforeEach((to, from, next) => {
          if (!allowPath[to.path]) {
            VITE_DEBUG && console.log("越权访问", to.path)
            next(this.menutab.menus[0].path)
            return
          }
          next()
        })
        
        if (!allowPath[location.pathname]) {
          router.push( this.menutab.menus[0].path)
        }
        // 显示页面
        this.isReady = true
      }
    }
  },
  mounted() {

  }
}

</script>

<style lang="scss">
#app {
  display: flex;
  height: 100%;
}

#left {
  height: 100%;
  width: $sidebarWidth;
  background: #001628;
}

#right {
  overflow-x: hidden;
  flex: 1;
}

</style>