# mysterious-web
```
分布式压测平台前端服务，提供性能相关的服务
```
<br> 

**启动**
<br>
1. npm install
2. npm run dev

**说明**
<br>
1. 启动后，进入注册登录页面，是需要后端服务的，并没有写死一些用户进行登录
<br>
2. 目前前后端分离，已经是跨域，如果是想npm run build；dist放在springboot的static目录下整体启动，需要修改vite.config.ts和springboot里拦截器类里的方法
<br>
3. 目前只写了用户管理页面，所以整体是没法玩耍的