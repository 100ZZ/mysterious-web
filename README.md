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

如果是本地玩耍直接启动如下
```
1. npm install
2. npm run dev
```

<br> 

**部署**

如果是搭建整个平台，前后端部署，就直接执行
```
npm run build
```
生成dist目录，放在nginx的html目录下即可；这里并没有放在后端springboot服务的static目录下，原因是平台还有压测报告的在线预览功能，因此直接起一个nginx，配置代理查看静态页面
<br>
具体完整的部署，可在后端服务文档：https://github.com/100ZZ/mysterious 里查看