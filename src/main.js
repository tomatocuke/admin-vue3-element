import ElementPlus from 'element-plus'
import * as ElementIcons from '@element-plus/icons-vue'
import { createApp } from 'vue'
import App from '@/components/framework/App.vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
import '@/assets/css/common.scss' // 全局样式
import router from '@/router.js'


const app = createApp(App)

// 错误捕捉
app.config.errorHandler = (err) => {
  console.error(err)
}

// 挂载到vue
// app.config.globalProperties.xxx = xxx

// 注册icon
for (const [key, component] of Object.entries(ElementIcons)) {
  app.component(key, component)
}

app.use(ElementPlus, {locale: zhCn})  // https://element-plus.org/zh-CN/component/button.html
  .use(router)
  .mount('#app')
