<template>
  <el-form :model="formData" ref="storeRef">
    <el-form-item 
      v-for="(item, i) in (config || [])" label-width="130px" class="" :key="i"  
      v-show="item.show ? item.show(formData) : true" :label="item.label" :prop="item.prop" :rules="item.rules"
      >
      <!-- 下拉选择：如果开启multiple则该字段自动变为数组 -->
      <el-select v-if="item.ui === 'select'" v-model="formData[item.prop]" :multiple="item.multiple || false" :placeholder="item.placeholder" :fit-input-width="true" clearable :filterable="item.filterable || false">
        <el-option v-for="(obj, id) in item.options" :key="id" :label="obj.label" :value="computeOptionValue(id)" :disabled="obj.disabled || false"></el-option>
      </el-select>
      <!-- 日期时间选择 -->
      <el-date-picker v-else-if="item.ui === 'datetime'" v-model="formData[item.prop]" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" />
      <el-date-picker v-else-if="item.ui === 'date'" v-model="formData[item.prop]" type="date" value-format="YYYY-MM-DD" />
      <!-- 单选 -->
      <el-radio-group v-else-if="item.ui === 'radio'" v-model="formData[item.prop]" class="ml5">
        <el-radio v-for="(o, j) in item.options" :key="j" :label="o.value">{{ o.label }}</el-radio>
      </el-radio-group>
      <!-- 开关 -->
      <el-switch v-else-if="item.ui === 'switch'" v-model.number="formData[item.prop]" :active-value="1" :inactive-value="0" :active-text="item.activetext" :inactive-text="item.inactivetext" />
      <!-- 文本框 -->
      <el-input v-else-if="item.ui === 'textarea'" v-model="formData[item.prop]" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" :placeholder="item.placeholder">{{ item.text }}</el-input>
      <!-- 图片/视频/文件上传 -->
      <el-col v-else-if="item.ui === 'upload'"><Upload :config="item.config" :form="formData" :prop="item.prop"></Upload></el-col>
      <!-- 隐藏值 -->
      <el-input v-else-if="item.ui === 'hidden'" type="hidden" v-model="formData[item.prop]" />
      <!-- 标签 -->
      <el-col v-else-if="item.ui === 'tags'"><Tag :tags="formData[item.prop]"></Tag></el-col>
      <!-- 数字输入框 -->
      <el-input v-else-if="item.ui === 'number'" v-model.number="formData[item.prop]" type="number" :min="item.rules.min" :max="item.rules.max" :placeholder="item.placeholder"  />
      <!-- 默认字符输入框 -->
      <el-input v-else v-model="formData[item.prop]" :placeholder="item.placeholder" />
    </el-form-item>

    <el-form-item label-width="130px" class="mt30">
      <el-button  @click="save" :loading="loading" type="primary">保存</el-button>
    </el-form-item>


    
  </el-form>
  

</template>

<script>

import { reactive, toRefs, watch } from 'vue'
import Tag from '@/components/table/tag.vue'
import Upload from '@/components/table/upload.vue'
import Daterange from '@/components/table/daterange.vue'
import helper from '@/util/helper'


const Vue = {
  components: { Tag, Upload, Daterange },
  props: {
    config: Array, // 字段配置
    data: Object, // 字段初始数据，须为可变对象，ref, reactive
    api: Function, // 保存接口
  },
  setup(props, { emit }) {

    // 自动补充配置
    formatConfig(props.config)

    const $ = reactive({
      formData: {},
      loading: false,
      editorVisiable: false,
    })

    // 过滤数据仅为配置字段
    const filterData = (data) => {
      props.config.forEach(item => {
        $.formData[item.prop] = data[item.prop] ?? ''
      })
    }

    // data可能有初始数据，也可能没有。 有的话用config过滤一下字段，没有需要初始化默认值
    if (Object.keys(props.data).length > 0) {
      filterData(props.data)
    } else {
      props.config.forEach(item => {
        $.formData[item.prop] = item.default ?? ''
      })
    }

    // 监听数据变化
    watch (props.data, (newData) => {
      VITE_DEBUG && console.log("表单数据变化", newData)
      filterData(newData)
    })

    return {
      ...toRefs($),
    }
  },

  methods: {
    async save() {
      // 检查表单
      let ok = await this.$refs["storeRef"].validate( (valid, fields) => {
        if (!valid) {
          let field = Object.keys(fields)[0]
          helper.Log('表单验证失败', this.formData,  fields[field][0], this.config.find(item => item.prop === field).rules) // 打印错误字段
          return false
        }
        return valid
      })

      if (!ok) {
        return false
      } 

      // 新增/更新
      this.loading = true
      let resp = await this.api(this.formData)
      if (resp && resp.success) {
        helper.AlertSuccess("保存成功")
      }
      this.loading = false
    },
    // 解决类型导致的回显问题
    computeOptionValue(val) {
      if (isNaN(val) || val > Number.MAX_SAFE_INTEGER) {
        return val
      }
      return val * 1
    },

  },


}

function formatConfig(config) {
  config = config ?? []
  config.forEach(item => {
    
    // 校验规则
    item.rules = {
      required: item.required !== undefined ? item.required : true, // 默认必填
      type: item.default !== undefined ? getType(item.default) : 'string', // 默认字符串类型
      message: `请输入${item.label}`,
      trigger: 'blur',
    }

    switch (item.ui) {
    case 'number':
      item.rules.type = 'number'
      item.rules.min = item.min ?? 0
      item.rules.max = item.max ?? 9999999
      item.rules.message = `请输入${ item.rules.min }-${ item.rules.max }`
      break
    case 'select':
      item.rules.type = item.default !== undefined ? getType(item.default) : 'number', // 默认数字类型
      item.rules.message = `请选择${item.label}`
      break
    case 'upload':
      item.rules.message = `请上传${item.label}`
      break
    default:

    }

    item.placeholder = item.rules.message
  })
  VITE_DEBUG && console.log("表单配置", config)
}

function getType(val) {
  let tp = typeof val
  if (tp === 'object') {
    if (Array.isArray(val)) {
      return 'array'
    }
    return 'object'
  }
  return tp
}


export default Vue


</script>

<style lang="scss" scoped>
.el-form {
  padding: 30px 80px 5px;
}

.el-input, .el-textarea, .el-select {
  width: 300px ;
}

</style>