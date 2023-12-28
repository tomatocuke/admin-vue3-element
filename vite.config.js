import { defineConfig, loadEnv } from 'vite'
import { resolve } from "path"
import vue from '@vitejs/plugin-vue'

// 此文件拿不到 import.meta.env
export default (({ mode }) => {
  // .env默认加载，自动加载 .env.xxx 配置文件
  const env = loadEnv(mode, process.cwd())

  let define = {}
  for (let key in env) {
    if (env[key] == "true") {
      define[key] = true
    } else if (env[key] == "false") {
      define[key] = false
    } else {
      define[key] = `'${env[key]}'`
    }
  }

  return defineConfig({
    // 定义常量
    define: define,
    resolve: {
      alias: {
        // vscode 跳转依赖 jsconfig.json
        "@": resolve(__dirname, "./src"),
      }
    },
    open: true,
    plugins: [
      vue(),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          // 为每个样式内容都引用sass的变量文件，但是不引入common，在main.js引入common
          // 如果这里引入common，则common里的样式在组件中使用会多打包出 .xxx[data-v-b1bd27dc]
          additionalData: `@import '@/assets/css/variable.scss';`
        }
      }
    },
    esbuild:{
      // 生产环境删除所有的console和debugger
      // drop: isProd ? ['console', 'debugger'] : [],
    },
    // 本地开发反向代理后端接口。
    server: {
      port: env.VITE_PROXY_PORT || 8080,
      host: "0.0.0.0",
      https: false, // 是否开启 https
      cors: true, // 默认启用并允许任何源
      open: true, // 在服务器启动时自动在浏览器中打开应用程序
      proxy: {
        '/api': {
          target: env.VITE_PROXY_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },

      },
    },
  })
}) 
