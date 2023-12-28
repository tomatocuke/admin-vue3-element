<template>
  <Table :config="config" :func="func"></Table>
</template>

<script>
import {reactive} from 'vue'
import Table from '@/components/table/table.vue'
import { API_ADMIN } from '@/config/api'

export default {
  components: { Table },
  setup() {

    const state = reactive({
      roles: {},
    })

    API_ADMIN.Role.List().then(resp => {
      if (resp.success) {
        for (let i = 0; i < resp.data.list.length; i++) {
          state.roles[resp.data.list[i].id] = {label: resp.data.list[i].name}
        }
      }
    })

    return {
      func: API_ADMIN.Account,
      config: {
        store: [
          { label: '账号', prop: 'username'},
          { label: '密码', prop: 'password', default: '123456', required: false},
          { label: '角色', prop: 'roles', default: [], ui: 'select', multiple: true, options: state.roles},
        ],
        table: [
          { label: 'ID', prop: 'id'},
          { label: '账号', prop: 'username'},
          { label: '角色', prop: 'roles', options: state.roles},
          { label: '操作', prop: '', ui: 'operate', items: []},
        ],
      },
    }
  },
}
</script>
