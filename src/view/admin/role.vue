<template>
  <Table :config="config" :func="func"></Table>
</template>

<script>
import {reactive,ref} from 'vue'
import Table from '@/components/table/table.vue'
import { API_ADMIN } from '@/config/api'

export default {
  components: { Table },
  setup() {

    const state = reactive({
      menus: {0: {label: '所有权限'}},
    })

    API_ADMIN.Menu.List().then(resp => {
      if (resp.success) {
        for (let i = 0; i < resp.data.list.length; i++) {
          state.menus[resp.data.list[i].id] = {label: resp.data.list[i].name}
        }
      }
    })

    return {
      func: API_ADMIN.Role,
      config: {
        store: [
          { label: '名称', prop: 'name'},
          { label: '权限', prop: 'menus', ui: 'select', multiple: true, default: [], options: state.menus},
        ],
        table: [
          { label: 'ID', prop: 'id'},
          { label: '名称', prop: 'name'},
          { label: '菜单', prop: 'menus', options: state.menus},
          { label: '操作', prop: '', ui: 'operate', items: []},
        ],
      },
    }
  },
}
</script>
