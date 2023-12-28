<template>
  <Table :config="config" :func="func" ></Table>
</template>

<script>
import Table from '@/components/table/table.vue'
import {reactive, toRefs } from 'vue'
import {API_User} from '@/config/api'
import {UserState} from '@/config/enums'
import timer from '@/util/timer'

export default {
  components: { Table },
  setup() {
    // 可变变量
    const $ = reactive({
      
    }) 

    return {
      ...toRefs($),
      config: {
        store: [
          {label: '账号', prop: 'account'},
          {label: '昵称', prop: 'nickname'},
          {label: '头像', prop: 'account', ui: 'upload', config: {type: 'image'}},
          {label: '手机号', prop: 'phone'},
          {label: '年龄', prop: 'age', ui: 'number', required: false, min: 18, max: 100},
          {label: '喜欢', prop: 'likes', ui: 'tags', default: [], required: false,},
          {label: '状态', prop: 'state', ui: 'select', default: 1, options: UserState},
        ],
        search: [
          {label: '注册时间', prop: 'create_time', ui: 'daterange'},
          {label: '用户ID', prop: 'id', span: 4.5},
        ],
        table: [
          {label: 'ID', prop: 'id', ui: 'copy'},
          {label: '账号', prop: 'account'},
          {label: '昵称', prop: 'nickname'},
          {label: '头像', prop: 'avatar', ui: 'image'},
          {label: '手机号', prop: 'phone'},
          {label: '年龄', prop: 'age'},
          {label: '注册时间', prop: 'create_time', func: timer.Datetime},
          {label: '状态', prop: 'state', ui: 'switch', activetext: '', inactivetext: '', api: (row) => { return API_User.Update({id: row.id, state: row.state == 1 ? 2 : 1})} },
          {label: '操作', ui: 'operate', width: 150, items: [
            // 【编辑】和【删除】由 func里的 Update 和 Delele 方法决定是否展示。 此处只写自定义操作
            {label: '显示昵称', show: (row) => {return row.id > 1}, api: (row) => { alert(row.nickname)}},
          ]}
        ],
      },
      func: API_User,

    }
  },
  // 由于标签页加入了缓存，所以每次重新进入，setup和mounted等不会重新执行，而此函数会重新执行
  activated() {
    
  },
}


</script>
