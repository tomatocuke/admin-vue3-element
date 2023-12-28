<template>
  <div @click="clipboard">
    <el-tooltip :content="content" placement="top" :show-after="600" >
      <div type="text" :class="{'color-blue': copy, 'cursor-pointer': copy, 'overflow-dot': true, }" >{{content}}</div>
    </el-tooltip>
  </div>
</template>

<script>
import helper from '@/util/helper';

export default {
  name: 'tooltip',
  props: {
    content: String || Number,
    copy: Boolean,
  },
  methods: {
    clipboard() {
      helper.Clipboard(this.content)
    }
  }
}
</script>

<style scoped>

</style>
