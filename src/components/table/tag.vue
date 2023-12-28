<template>
  <el-tag
    v-for="(tag, idx) in tags"
    :key="tag"
    closable
    size="large"
    :type="getType(idx)"
    :disable-transitions="false"
    @close="handleClose(tag)"
    class="mr5"
  >
    {{ tag }}
  </el-tag>
  <el-input
    v-if="inputVisible"
    ref="InputRef"
    size="large"
    v-model="inputValue"
    @keyup.enter="handleInputConfirm"
    @blur="handleInputConfirm"
  />
  <el-button v-else type="primary" @click="showInput">+ 添加</el-button>
</template>

<script>
import { nextTick, reactive, toRefs } from 'vue'

export default {
  props: {
    tags: Array,
  },
  setup(props) {

    const _ = reactive({
      inputValue: '',
      inputVisible: false,
      InputRef: {},
    })

    return {
      ...toRefs(_),
    }
  },
  methods: {
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      nextTick(() => {
        this.InputRef.input.focus()
      })
    },
    handleInputConfirm() {
      if (this.inputValue) {
        this.tags.push(this.inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    getType(idx) {
      let x = idx % 3
      return ['', 'success', 'warning'][x]
    }
  }
}
</script>
