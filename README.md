# mysterious-web
```
分布式压测平台前端服务，Vue3+TypeScript，提供性能相关的服务
```
<br> 

**依赖**
<br>
后端服务：https://github.com/100ZZ/mysterious
<br>
前端服务：https://github.com/100ZZ/mysterious-web
<br>
JMeter工具包：https://github.com/100ZZ/mysterious-jmeter
<br>
数据库：MySQL，Redis，Nginx

<br> 

**启动**
```
1. npm install
2. npm run dev
```

<br> 

**说明**
<br>
1. 启动后，进入注册登录页面，是需要后端服务的，并没有写死一些用户进行登录
2. 目前前后端分离，已经是跨域，如果是想npm run build；dist放在springboot的static目录下整体启动，需要修改vite.config.ts和springboot里拦截器类里的方法
3. 10月份随便找了个前端工程开始撸，第一次玩前端，目前所有功能还没完成，所以整体是没法玩耍的