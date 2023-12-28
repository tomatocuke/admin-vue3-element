
import { ref } from 'vue' 
import { createRouter,createWebHistory } from 'vue-router'

const Routes = [
  // 未知页面跳转到主页
  // {
  //   path: '/:pathMatch(.*)',
  //   redirect: 
  // }

];

// 自动扫描文件夹加载路由
const modules = import.meta.glob(`@/view/**/*.vue`);
// console.log(modules)

// 组件命名
function renameComponent (name, component) {
  return () => {
    return component().then(res => {
      res.default.name = name
      return res
    })
  }
}

const len = ("/src/view").length

Object.keys(modules).forEach(key => {
  let filename = key.slice(len, -4)

  // 禁止index起名
  if (filename === "index") {
    alert("禁止文件起名index")
  }

  let component = renameComponent(filename, modules[key])
  Routes.push({
    path: filename,
    name: filename.slice(1),
    component: component,
    // meta: {}
  })

})

VITE_DEBUG && console.log("加载路由", Routes)

var router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: Routes,
})


// 路由改变监听函数
// router.beforeEach((to, from, next) => {
//   next()
// })


export default router



// 路由缓存，添加的是组件的name属性
export const RouterCache = ref([])

// 添加缓存
export function AddCache (componentName) {
  if (componentName && !RouterCache.value.includes(componentName)) {
    RouterCache.value.push(componentName)
  }
}

// 删除缓存
export function RemoveCache (componentName) {
  let index = RouterCache.value.indexOf(componentName)
  if (index > -1) {
    RouterCache.value.splice(index, 1)
  }
}