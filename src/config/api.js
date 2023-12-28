import http from '@/util/http'
import auth from '@/util/auth'
import helper from '@/util/helper'

// ############# 此页面的所有 helper.Promise 都为模拟请求接口。 开发时使用 http 发起真实请求 #############



var users = [
  {id: 3, account: 'sunshanshan', nickname: '孙姗姗', avatar: 'https://kikia.cc/what.png', phone: '13333333333', age: 22, create_time: '2019-01-02 12:20:12', state: 2},
  {id: 2, account: 'qianerer', nickname: '钱尔尔', avatar: 'https://kikia.cc/what.png', phone: '13222222222', age: 22, create_time: '2019-01-02 12:12:12', state: 1},
  {id: 1, account: 'zhaoyiyi', nickname: '赵依依', avatar: 'https://kikia.cc/what.png', phone: '13111111111', age: 22, create_time: '2019-01-01 12:00:00', state: 1},
]

// 用户管理
export const API_User = {
  // 正式 HTTP请求
  // List: (data) => http.Get("/users", data),

  // 模拟请求 Promise
  List: (params) => helper.Promise(()=>{
    VITE_DEBUG && helper.Log("模拟请求【列表】", params)
    return {
      success: true,
      msg: 'ok',
      data: {
        total: users.length,
        list: users,
      }
    }
  },100),

  Create: (data) => helper.Promise(() => {
    VITE_DEBUG && helper.Log("模拟请求【创建】", data)
    data.id = users.length + 1
    users.unshift(JSON.parse(JSON.stringify(data)))
    return {success: true, msg: 'ok'}
  }),

  Update: (data) => helper.Promise(() => {
    VITE_DEBUG && helper.Log("模拟请求【更新】", data)
    return {success: true, msg: 'ok'}
  }),

  Delete: (data) => helper.Promise(() => {
    VITE_DEBUG && helper.Log("模拟请求【删除】", data)
    return {success: true, msg: 'ok'}
  }),
}

// 模拟登录接口。 返回token。 具体格式更改 auth.js 和 login.vue
export const API_Login = (data) => helper.Promise(() => {
  return {success: true, msg: 'ok', data: {token: 'xxx', expires_at: parseInt(Date.now() / 1000) + 60 * 10 }}
})

// 自动带上token
http.UseBefore((url, req) => {
  let token = auth.Get()
  if (token != null) {
    Object.assign(req.headers, {"token": token} )
  }
})



// 上传
// export const API_Upload = (formData, headers, attr) => http.Request("POST", "/upload", formData, headers, attr)
export const API_Upload = (formData, headers, attr) => helper.Promise(() => {
  return {success: true, msg: 'ok', data: {url: 'xxx'}}
}, 2000)


export const API_Account = {

  // 模拟请求： 登录者信息 & 菜单信息
  Info: (params) => helper.Promise({
    success: true,
    msg: 'ok',
    data: {
      info: {username: 'admin', avatar: ''},
      menus: [
        {path: '/user', name: '用户列表', icon: 'User'},
        {path: '', name: '系统管理', icon: 'Setting', children: [
          {path: '/admin/account', name: '账号管理'},
          {path: '/admin/role', name: '角色管理'},
          {path: '/admin/menu', name: '菜单管理'},
        ]}
      ]
    }
  }),
  ChangePassword: (data) => helper.Promise({success: true, msg: 'ok'}),
}

// 订单
export const API_Order = {
  List: (data) => http.Get("/tock/order/order/page", data),
  Resend: (data) => http.Post("/tock/order/order/send", data),
}

export const API_ADMIN = {
  Account: {
    List: () => helper.Promise({success: true, msg: '', data: [{id: 1, username: 'admin', roles: [111]}]})
  },
  Role: {
    List: () => helper.Promise({success: true, msg: '', data: {total: 0, list: [{id: 111, name: '管理员', menus: [0]}] }}) // 0为全部权限，否则为具体权限ID
  },
  Menu: {
    List: () => helper.Promise({success: true, msg: '', data: {total: 0, list: [
      {id: 222, name: '用户管理', path: '/user', icon: 'User', sort: 1},
      {id: 333, name: '系统管理',  icon: 'Setting', sort: 2, children: [
        {id: 444, name: '账号管理', path: '/admin/account', sort: 1},
        {id: 555, name: '角色管理', path: '/admin/role', sort: 2},
        {id: 666, name: '菜单管理', path: '/admin/menu', sort: 3},
      ]},
    ]}})
  },
}