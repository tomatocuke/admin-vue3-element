<template>
  <el-upload
    action="#"
    :list-type="type === 'image' ? 'picture-card' : 'text'"
    :on-change="onChange"
    :on-preview="onPreview"
    :before-remove="beforeRemove"
    :before-upload="beforeUpload"
    :http-request="httpRequest"
    :file-list="fileList"
    :accept="accept"
    :show-file-list="true"
    :limit="limit"
    ref="uploadFile"
  >

    <div v-if="type === 'image'">
      <Loading :loading="uploading" text="上传中..." />
      <el-icon ><Plus /></el-icon>
    </div>

    <div v-else>
      <el-button :loading="uploading" :disabled="disabled">&nbsp;点击上传</el-button>
      <!-- <el-progress v-show="percentage > 0 && percentage < 100" :percentage="percentage" /> -->
    </div>

  </el-upload>

  <el-dialog v-model="dialogVisible" style="text-align: center; background-color: transparent; margin-top: 40px; " >
    <img :src="dialogImageUrl" alt="Preview Image"  />
  </el-dialog>
</template>


<script>

import { reactive, toRefs, watch } from 'vue'
import { API_Upload } from '@/config/api'
import helper from '@/util/helper'
import Loading from '@/components/loading.vue'

const defaultConf = {
  type: '*', // 图片传image，视频传video，
  accept: '*', // 限制可选择的类型  image/png ...
  limit: 1, // 限制1张
  size: 5, // 限制5M
  timeout: 10, // 上传超时时间s
  filepath: '', // 上传的路径
}

const getFileList = (data) => {
  if (data == '') {
    return []
  }
  if (!Array.isArray(data)) {
    let name = data.slice(data.lastIndexOf('/') + 1)
    return [{name: name, url: data}]
  }
  return data.map(item => {
    let name = item.slice(item.lastIndexOf('/') + 1)
    return {name: name, url: item}
  })
}


export default {
  name: 'upload',
  components: {Loading},
  props: {
    config: Object, // 配置 type、accept、limit、size、timeout
    form: Object, // 因为不能直接修改props，所以传入整个 form + prop
    prop: String, // 该字段名
  },
  setup(props) {
    // 合并默认配置
    const confs = Object.assign(defaultConf, props.config)
    // 限制选择的文件类型
    if (!props.config?.accept && props.config?.type) {
      confs.accept = `${props.config.type}/*`
    }

    VITE_DEBUG && helper.Log("上传组件", confs)

    // 初始化组件内的文件列表
    const fileList = getFileList(props.form[props.prop])

    const $ = reactive({
      dialogImageUrl: '',
      dialogVisible: false,
      // percentage: 0,
      uploading: false,
      disabled: fileList.length === confs.limit,
      fileList,
    })
    
    return {
      ...toRefs($),
      ...confs,
    }
  },
  mounted() {
    // 如果是图片类型，达到限制数量时，隐藏原UI卡片类型带的一个增加框
    if (this.type === 'image') {
      const imageAddEle = document.querySelector('.el-upload--picture-card')
      let fn = this.disabled ? 'add' : 'remove'
      imageAddEle.classList[fn]('none')
      watch(() => this.disabled, (newValue, oldValue) => {
        let fn = newValue ? 'add' : 'remove'
        imageAddEle.classList[fn]('none')
      })
    }
    
  },
  methods: {
    getText() {
      if (Array.isArray(this.data)) {
        return this.data.length === this.limit ? '重新上传' : '点击上传'
      }
      return this.data !== '' ? '重新上传' : '点击上传'
    },
    // 上传前校验
    beforeUpload(rawFile) {
      if (this.size > 0 && rawFile.size / 1024 / 1024 > this.size) {
        helper.AlertError("文件大小不能超过" + this.size + "MB")
        return false
      }
      
      return true
    },
    // 控制数量
    onChange(file, fileList) {
      this.disabled = fileList.length === this.limit
    },
    // 删除
    beforeRemove(file, fileList) {
      this.disabled = (fileList.length - 1) === this.limit

      if (!Array.isArray(this.form[this.prop])) {
        this.form[this.prop] = ''
        return
      }

      let srcs = []
      this.form[this.prop].forEach(src => {
        if (src != file.url[0]) {
          srcs.push(src)
        }
      })
      this.form[this.prop] = srcs
    },
    // 预览
    onPreview(file) {
      this.dialogImageUrl = file?.url
      this.dialogVisible = true
    },
    // 上传进度 fetch不支持上传进度
    // onUploadProgress(progressEvent) {
    //   this.percentage = progressEvent.loaded / progressEvent.total * 99 | 0; 
    // },
    // 接管自动上传
    async httpRequest(option) {
      VITE_DEBUG && console.log("准备上传", option)
      this.uploading = true

      const formData = new FormData(); 
      formData.append("file", option.file) 
      formData.append("filepath", this.filepath)
    
      // 执行上传
      let resp = await API_Upload(formData, {}, {timeout: this.timeout * 1000})

      if (resp.success) {
        VITE_DEBUG && console.log("上传成功", resp.data)
        // this.percentage = 0
        const link = resp.data.url || resp.data.src || resp.data.urls || resp.data.srcs
        if (link === undefined) {
          alert("请确认上传后的返回数据格式")
          return
        }
        
        if (Array.isArray(this.form[this.prop])) {
          let srcs = Array.from(this.form[this.prop])
          srcs.push(link)
          this.form[this.prop] = srcs
        } else {
          this.form[this.prop] = link
        }
      } else {
        // this.percentage = 0
        option.onError("上传失败")
      }

      this.uploading = false
    }
   

  }

}


</script>

<style scoped>
.el-progress--line {
  display: inline-block; 
  vertical-align: bottom; 
  width: 170px;
  margin-left: 10px;
}
</style>