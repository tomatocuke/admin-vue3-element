
### 技术栈
- [Vue3](https://cn.vuejs.org/guide/introduction.html) 代码还是使用了类Vue2的书写方式
- [ElementUI Plus](https://element-plus.org/zh-CN/components/button.html) 
- [Vite4](https://vitejs.dev/config/) 比 webpack 快很多
- JS


### 部署
> npm也可以，其它命令参考 package.json
- `pnpm install` 安装
- `pnpm run local` 运行
- `pnpm run build:dev` 打包


### 封装
- 封装表格。 全配置方式，不用写html，相当友好。
- 自动路由。 自动以`/目录名/文件名`作为路由。 可以通过接口控制权限。
- 工具函数。 封装了常用函数 `/src/util/helper.js`


### vscode 推荐插件
- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar) 这个有一些上边插件没有的跳转


### 后端代理配置
- 本地开发通过更改 `vite.config.js` 配置代理
- 非本地开发配置 
  ```conf
  server {
    listen 80;
    server_name http://xxx.com; #页面访问的

    root /var/www/xxx/dist;
    index index.html;

    location / {
      try_files $uri $uri/ /index.html;
    }

    # 代理同域名的
    location /api/ {
      # rewrite ^/api(.*) $1 break; # 如果接口格式不是/api/ ，则去除掉
      proxy_pass http://127.0.0.1:端口号/;
    }
  }
  ```