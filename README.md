# element-plus-admin
基于element-plus搭建的后台管理UI
该模板使用无状态权限管理token认证
须准备api接口数据
## 验证码获取接口
GET  /api/login/captcha
### 请求数据(无)
响应数据
### 注意：token必须
### captcha为验证码的base64数据
```
{"code":200,"msg":"","data":{"captcha":"data:img/jpg;base64,R0lGODlhyABGAI...","token": "309c65a6bd7a217f1b1954b6bff4fbf26e2ecf78"}}
```
## 登录接口
POST /api/login/login
请求数据
```
{username: "admin", password: "admin", code: "sdias"}
```
响应数据
```
{"code":200,"token":"ecb08ed8ba11393552f56b5848f5170c703974ac"}
```

## 获取权限接口
get /api/admins/info
### 请求数据(无)
响应数据
```
{"code":200,"msg":"","data":{"roles":{"configs":["index","new","edit","del","issystem","img","file"],"configsets":["indexall","setvalue","img","file"],"admins":["index","new","edit","del","roles","isenable"],"apps":["index","new","edit","del","roles"],"roles":["index","new","edit","del","admin","isenable","contset"]},"name":"后台管理员","avatar":""}}
```

## 项目安装命令
```
npm install
```

### 运行命令
```
npm run serve
```

### 生成发布包
```
npm run build
```

### Lints和fixes文件
```
npm run lint
```

### 自定义配置
See [Configuration Reference](https://cli.vuejs.org/config/).
