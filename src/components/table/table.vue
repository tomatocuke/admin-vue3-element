<template>
  <!-- 搜索栏 -->
  <el-form id="searchbar" :inline="true" :model="searchForm" @submit.prevent>
    <el-row>
      <el-col v-for="(item, i) in (config.search || [])" :key="i" :span="item.span || (item.ui === 'daterange' ? 7.5 : 4.5)">
        <el-form-item :label="`${item.label}：`">
          <!-- 输入框 -->
          <el-input v-if="item.ui === 'input' || item.ui === undefined" v-model="searchForm[item.prop]" :placeholder="item.placeholder ?? `请输入${item.label}`" />
          <!-- 下拉选择：如果开启multiple则该字段自动变为数组 -->
          <el-select v-if="item.ui === 'select'" v-model="searchForm[item.prop]" :fit-input-width="true" :multiple="item.multiple || false" :placeholder="item.placeholder ?? '请选择'" :clearable="item.clearable || true" :filterable="item.filterable">
            <el-option v-for="(obj, id) in item.options" :key="id" :label="obj.label" :value="computeOptionValue(id)" :disabled="obj.disabled || false"></el-option>
          </el-select>
          <!-- 单选 -->
          <el-radio-group v-if="item.ui === 'radio'" v-model="searchForm[item.prop]" class="ml5">
            <el-radio v-for="(o, j) in item.options" :key="j" :label="o.value">{{ o.label }}</el-radio>
          </el-radio-group>
          <!-- 开关 -->
          <el-switch v-if="item.ui === 'switch'" v-model="searchForm[item.prop]" :active-value="1" :inactive-value="0" :active-text="item.activetext" :inactive-text="item.inactivetext" />
          <!-- 日期选择器 -->
          <Daterange v-if="item.ui === 'daterange'" :form="searchForm" :prop="item.prop" />
        </el-form-item>
      </el-col>

      <el-col :span="(config?.search?.length || 0) * 0.8 + (func?.Create ? 0.8 : 0)">
        <button v-show="config.search?.length > 0" @click="handleSearch" class="btn-primary">搜索</button>
        <button v-show="config.search?.length > 0" @click="handleReset" class="btn">重置</button>
        <button v-show="func.Create" @click="handleStoreShow(null, -1)" class="btn-primary">新增</button>
      </el-col>
    </el-row>
  </el-form>

  <!-- 工具栏 -->
  <div id="toolbar" >
    <!-- 下载 -->
    <Download id="icon-export" @click="toobarExport" v-if="func.Export" disabled />
    <!-- 刷新 -->
    <Refresh id="icon-refresh" @click="toolbarRefresh" />
  </div>
  
  <!-- 表格 -->
  <el-table :data="tableList" border stripe v-loading="tableLoading" 
    @sort-change="sortChange" ref="refTable" row-key="id" >
    <el-table-column v-for="(item, i) in (config.table || [])" :key="i" :label="item.label" :prop="item.prop"
      :fixed="item.fixed ? true : (item.label === '操作' ? 'right' : false)"
      :sortable="item.sortable ? 'custom' : false" 
      :min-width="getMinWidth(item)"
      >
      <template #default="scope">
        <!-- 数组类型以标签形式展示 -->
        <span v-if="(scope.row[item.prop] instanceof Array)">
          <el-tag class="mr5" v-for="(c, j) in scope.row[item.prop]" :key="j"
            :type="['', 'success', 'warning'][j % 3]">{{ item.options && item.options[c] ? item.options[c].label : c }}</el-tag>
        </span>
        <!-- 切换按钮 -->
          <el-switch v-else-if="item.ui === 'switch'" v-model.number="scope.row[item.prop]" :active-value="1" :inactive-value="0" :active-text="item.activetext" :inactive-text="item.inactivetext" :before-change="handleTableSwitchChange.bind(this, item.api, scope.row)" :disabled="item.api === undefined" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
        <!-- 过长隐藏/可复制的 -->
        <span v-else-if="item.ui === 'tooltip' || item.ui === 'copy'">
          <Tooltip :content="scope.row[item.prop].toString()" :copy="item.ui === 'copy'" />
        </span>
        <!-- 图片 -->
        <span v-else-if="item.ui === 'image'">
          <el-image style="max-width: 60px;" :src="scope.row[item.prop]" :preview-src-list="[scope.row[item.prop]]"
            :preview-teleported="true" :hide-on-click-modal="true" :teleported="true" fit="cover" />
        </span>
        <!-- 视频 -->
        <span v-else-if="item.ui === 'video'" style="width: 70px; overflow: hidden;">
          <video :src="scope.row[item.prop]" style="max-height: 130px;" class="cursor-pointer"
            @click="playVideo(scope.row[item.prop])"></video>
        </span>
        <!-- 枚举变形 -->
        <span v-else-if="item.options">{{ item.options[scope.row[item.prop]] ? item.options[scope.row[item.prop]].label : "未知" }}</span>
        <!-- 函数变形 -->
        <span v-else-if="item.func" v-html="item.func(scope.row[item.prop])"></span>
        <!-- 操作栏 -->
        <span v-else-if="item.ui === 'operate'">
          <!-- 编辑 -->
          <span v-if="func.Update" @click="handleStoreShow(scope.row, scope.$index)"
            class="color-blue operate-btn">编辑</span>
          <!-- 删除 -->
          <el-popconfirm v-if="func.Delete" title="确认删除?" @confirm="handleDelete(scope.row, scope.$index)">
            <template #reference>
              <span type="warning" class="color-red operate-btn">删除</span>
            </template>
          </el-popconfirm>
          <!-- 自定义操作 -->
          <span v-for="(op, j) in (item.items || [])" :key="j">
            <span v-if="op.show ? op.show(scope.row) : true" @click="handleOperate(scope.row, op.api)"
              class="color-blue operate-btn">{{ op.label }}</span>
          </span>
        </span>
        <!-- 直接展示 -->
        <span v-else>{{ scope.row[item.prop] }}</span>
      </template>
    </el-table-column>

  </el-table>

  <!-- 分页 -->
  <el-pagination :hide-on-single-page="tableTotal == 0" layout="->, total, sizes, prev, pager, next, jumper"
    :total="Number(tableTotal)" :current-page="tablePage" :page-size="tableSize" :page-sizes="[10, 20, 50]"
    @current-change="pageChange" @size-change="sizeChange" style="margin: 15px 0;" />

  <!-- 弹窗 编辑/新增 -->
  <el-dialog v-model="storeVisiable" :title="formTitle" width="560" destroy-on-close>
    <Form :config="config.store" :api="submitForm" :data="formData" />
  </el-dialog>

  <!-- 视频播放 -->
  <el-dialog v-model="videoVisiable" width="50%" top="20px" @close="$refs.videoRef.pause()">
    <video controls :src="videoUrl" style="width:100%; max-height:800px" ref="videoRef" class="cursor-pointer"></video>
  </el-dialog>
</template>

<script>

import { ref, reactive, toRefs } from 'vue'
import Form from '@/components/table/form.vue'
import Tooltip from '@/components/table/tooltip.vue'
import Tag from '@/components/table/tag.vue'
import Daterange from '@/components/table/daterange.vue'
import helper from '@/util/helper'
import timer from '@/util/timer'


// Dom元素，需要在mounted里查找
var element = {
  export: null, // 工具栏导出
  refresh: null, // 工具栏刷新表格
}

const Vue = {
  components: { Form, Tooltip, Tag, Daterange },
  props: {
    config: { type: Object, default() { return {} } }, // store, search, table
    func: { type: Object, default() { return {} } },  // List、Create、Update、Delete ...
  },
  setup(props, { emit }) {

     // 比较重要的变量
    const _1 = reactive({
      formData: {},
      formTitle: '',
      searchForm: {},
      tableTotal: 0,
      tableList: [],
      tablePage: 1,
      tableSize: 10,
      tableUpdateRowId: null,
    })

    // 不太重要的变量
    const _2 = reactive({
      storeVisiable: false, // 新增&编辑的弹窗
      tableLoading: false, // 表格loading
      videoVisiable: false, // 视频弹窗
      videoUrl: '', // 视频弹窗链接
      isGettingList: false, // 是否正在获取表格数据
    })

    return {
      ...toRefs(_1),
      ...toRefs(_2),
      initSearchForm : {},
    }
  },

  // 页面被缓存后，仅此函数重新执行
  activated() {
    

  },
  mounted() {
    this.pageChange(1)
    element.export = document.querySelector('#icon-export')
    element.refresh = document.querySelector('#icon-refresh')

  },

  methods: {
    // 重新获取表格数据
    async getTableList() {
      if (!this.func?.List) {
        console.error("未定义获取表格函数")
        return
      }
      if (this.isGettingList) {
        return false
      }
      this.isGettingList = true
      this.tableLoading = true
      let start = timer.Unix()
      let params = { page: this.tablePage, limit: this.tableSize }
      for (let key in this.searchForm) {
        if (this.searchForm[key] !== undefined && this.searchForm[key] !== null && this.searchForm[key] !== '') {
          params[key] = this.searchForm[key]
        }
      }
      let resp = await this.func.List(params)
      // 接口太快，增加一个延迟效果
      setTimeout(_ => {
        if (resp.success) {
          if (Array.isArray(resp.data)) {
            this.tableList = resp.data
          } else {
            this.tableList = resp.data.list
            this.tableTotal = resp.data.total || 0
          }
        }
        this.tableLoading = false
        this.isGettingList = false
      }, timer.Unix() - start < 100 ? 100 : 0)
    },
    // page改变
    pageChange(page) {
      this.tablePage = page
      this.getTableList()
    },
    sizeChange(size) {
      this.tablePage = 1
      this.tableSize = size
      this.getTableList()
    },
    // 字段排序 TODO
    sortChange(column) {
      this.getTableList()
    },
    // 表格内switch滑块改变
    async handleTableSwitchChange(api, row) {
      let resp = await api(row)
      if (resp.success) {
        helper.AlertSuccess("修改成功")
      }
      return resp.success
    },
    // 搜索
    handleSearch() {
      this.tablePage = 1
      this.getTableList()
    },
    // 重置
    handleReset() {
      this.searchForm = helper.Copy(this.initSearchForm)
      this.handleSearch()
    },
    // 自定义操作
    async handleOperate(row, api) {
      await api(row)
      this.getTableList()
    },
    //新增&编辑的弹出
    handleStoreShow(row) {
      if (row) {
        this.formTitle = "编辑"
        this.formData = row
        this.tableUpdateRowId = row.id
      } else {
        this.formTitle = "新增"
        this.formData = {}
        this.tableUpdateRowId = null
      }
      this.storeVisiable = true
    },
    // 提交表单
    async submitForm(data) {
      let resp
      if (this.tableUpdateRowId === null) {
        resp = resp = await this.func.Create(data)
      } else {
        if (Object.keys(data).length > 0) {
          data.id = this.tableUpdateRowId
          resp = await this.func.Update(data)
        }
      }
      if (resp && resp.success) {
        this.getTableList()
      }
      if (resp.success) {
        this.storeVisiable = false
      }
    },
    // 删除
    async handleDelete(row, index) {
      let resp = await this.func.Delete(row)
      if (resp.success) {
        this.getTableList()
        helper.AlertSuccess("已删除")
      }
    },
    // 下载
    async toobarExport() {
      let resp = await this.func.Export(this.searchForm)
      if (resp.success) {
        helper.AlertSuccess("导出完成")
      }
    },
    // 刷新表格
    async toolbarRefresh() {
      element.refresh.classList.add("rotate")
      await this.getTableList()
      setTimeout(_ => {
        element.refresh.classList.remove("rotate")
      }, 500)
    },
    // 播放视频
    playVideo(url) {
      this.videoUrl = url
      this.videoVisiable = true
    },
    // 解决类型导致的回显问题
    computeOptionValue(val) {
      if (isNaN(val) || val > Number.MAX_SAFE_INTEGER) {
        return val
      }
      return val * 1
    },
    getMinWidth(item) {
      if (item.width !== undefined) {
        return item.width
      }
      if (item.label === '操作') {
        return 120
      }
      let width = 25 + item.label.length * 17
      if (item.label.indexOf("时间") > -1) {
        return width > 155 ? width : 155
      }
      return width
    }
  },


}



export default Vue


</script>

<style lang="scss" scoped>
.el-form {
  padding: 0 10px 5px;
}

.operate-btn {
  margin: 0 5px;
  cursor: pointer;
}

#toolbar {
  float: right;
  padding: 3px 0;
  svg {
    display: inline-block;
    width: 20px;
    margin-right: 10px;
    color: #bbb;
    cursor: pointer;
    &:hover {
      color: $blue;
    }
  }
}

.el-table {
  border-radius: 5px;
  &:deep(th) {
    height: 66px;
    font-size: 15px;
    color: rgba(0, 0, 0, 0.8);
    background-color: #FAFAFA !important;
  }
  &:deep(td) {
    height: 60px;
  }
}

</style>