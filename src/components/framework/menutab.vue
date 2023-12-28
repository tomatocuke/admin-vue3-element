<template>
  <el-tabs
    v-model="data.current"
    type="card"
    closable
    @tab-remove="removeTab"
    @tab-change="clickTab"
    style="background-color: #FFF;"
  >
    <template v-for="item in data.tabs" :key="item.name">
      <el-tab-pane :label="item.name" :name="item.path">
        <!-- {{ item.content }} -->
      </el-tab-pane>
      
    </template>
    
  </el-tabs>
</template>

<script>

import { RemoveCache } from '@/router'

export default {
  props: {
    data: Object,
  },
  methods: {
    clickTab(path) {
      this.$router.push(path)
    },
    removeTab (path) {
      let paths = Object.keys(this.data.tabs)
      // 移除当前标签时, 优先进入右边的标签页，次选进入左边的标签页
      let idx = paths.indexOf(path)
      let leftIdx = idx-1, rightIdx = idx+1
      if (rightIdx < paths.length) {
        this.data.current = paths[rightIdx]
      } else if (leftIdx >= 0) {
        this.data.current = paths[leftIdx]
      }

      // 删除tab
      delete(this.data.tabs[path])

      // 删除页面缓存
      RemoveCache(path)
    }
  }
}

</script>
