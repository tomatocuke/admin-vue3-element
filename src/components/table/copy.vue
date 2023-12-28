<template>
  <div @click="copy" >
    <el-tooltip :content="content" placement="top">
      <div type="text" class="color-blue cursor-pointer overflow-dot" >{{content}}</div>
    </el-tooltip>
  </div>
</template>

<script>
import helper from '@/util/helper';

export default {
  name: 'copy',
  props: {
    content: String || Number,
  },
  methods: {
    copy() {
      helper.Clipboard(this.content)
    }
  }
}
</script>
