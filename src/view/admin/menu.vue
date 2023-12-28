<template>
  <Table :config="config" :func="func"></Table>
</template>

<script>
import { reactive } from 'vue'
import Table from '@/components/table/table.vue'
import { API_ADMIN } from '@/config/api'

export default {
  components: { Table },
  setup() {
    const state = reactive({
      parents: {0: {label: '顶级'}},
    })

    // 从获取到的菜单列表中筛选出顶级菜单作为 可选择的pid
    const menuList = API_ADMIN.Menu.List 
    API_ADMIN.Menu.List = async (data) => {
      let resp = await menuList(data)
      if (resp.success) {
        for (let i = 0; i < resp.data.list.length; i++) {
          if (resp.data.list[i].pid == 0) {
            state.parents[resp.data.list[i].id] = {label: resp.data.list[i].name}
          }
        }
      }
      return resp
    }

    return {
      func: API_ADMIN.Menu,
      config: {
        store: [
          { label: '父节点ID',  prop: 'pid', ui: 'select', default: 0, options: state.parents},
          { label: '名称', prop: 'name'},
          { label: '路径', prop: 'path', required: false},
          { label: '图标', prop: 'icon', required: false},
          { label: '排序', prop: 'sort', ui: 'number', default: 100, min: 1, max: 100},
        ],
        table: [
          { label: '名称', prop: 'name'},
          { label: '路径', prop: 'path'},
          { label: '图标', prop: 'icon'},
          { label: '排序', prop: 'sort'},
          { label: '操作', prop: '', ui: 'operate', items: []},
        ],
      },
    }
  },
}
</script>
