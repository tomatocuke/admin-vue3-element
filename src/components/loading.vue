<template>
  <div v-show="loading" v-loading="true" class="absolute-full" :element-loading-text="text"></div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String, 
      default: 'Loading...'
    },
  },
}
</script>

<style scoped>
div {
  z-index: 999;
}
</style>