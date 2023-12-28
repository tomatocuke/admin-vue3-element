<template>
  <div id="logo" >
    后台管理系统
  </div>
  <el-menu
    id="menubar"
    unique-opened
    background-color="transparent"
    active-text-color="#FFF"
    :default-active="data.current"
    >
    <!-- 菜单来源于App.vue -->
    <template v-for="(item, i) in data.menus">
      <!-- 带展开栏的 -->
      <el-sub-menu v-if="!item.hidden && item.children && item.children.length > 0" class="menu-item" :key="i" :index="item.path || i.toString()">
        <template #title>
          <component class="el-icon" :is="item.icon??''"></component>
          <span>{{item.name}}</span>
        </template>
        <el-menu-item v-for="(child, j) in item.children" class="menu-item" :key="j" :index="child.path || j.toString()"  @click="matchTab">
          <span>{{child.name}}</span>
        </el-menu-item>
      </el-sub-menu>
      <!-- 不带展开栏的 -->
      <el-menu-item v-else-if="!item.hidden" :key="0-i" class="menu-item" :index="item.path"  @click="matchTab">
        <component class="el-icon" :is="item.icon??''"></component>
        <span>{{item.name}}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script>
import { AddCache } from '@/router'

export default {
  name: 'menubar',
  props: {
    data: Object,
  },
  mounted() {
    this.matchTab({index: location.pathname })
  },
  methods: {
    // 当前菜单匹配标签页
    matchTab(menu) {
      // 从后端接口获取menu第一次匹配不到
      if (this.data.menus.length === 0) {
        setTimeout(() => {this.matchTab(menu)}, 100)
        return
      }

      let path = menu.index
      let match
      for (let i = 0; i < this.data.menus.length; i++) {
        let menus = this.data.menus[i].children?.length > 0 ? this.data.menus[i].children : [this.data.menus[i]]
        for (let j = 0; j < menus.length; j++) {
          if (path === menus[j].path) {
            match = menus[j]
            break
          }
        }
        if (match) {
          break
        }
      }
      
      if (match) {
        this.data.tabs[path] = match
        this.data.current = path
      } else {
        VITE_DEBUG && console.log("未匹配到menu" + path)
      }

      // 添加页面缓存
      AddCache(path)
    }
  },
}
</script>

<style lang="scss" scoped>
#logo {
  height: 60px;
  line-height: 60px;
  width: 100%;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  background: #002140;
  text-align: center;
}
#menubar {
  border-right: 1px solid #001628;
  .menu-item {
    * {
      color: #FFF;
      opacity: 0.7;
      font-weight: 500;
      font-size: 15px;
    }
    svg {
      font-size: 20px;
      margin-left: 10px;
    }
    &:hover > * {
      opacity: 1;
      font-weight: 800;
    }
    &:deep(.el-sub-menu__icon-arrow) {
      font-size: 15px;
      color: rgba(255, 255, 255, 0.7);
    }
    .el-menu-item {
      background: #000D17;
      padding-left: 62px; /*右移*/
    }
    
  }
  .el-menu-item.is-active {
    background: #1890ff;
    border-radius: 5px;
    opacity: 1;
  }
}
</style>