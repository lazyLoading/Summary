## 框架

https://taro-docs.jd.com/taro/docs/README/index.html

```html
脚手架：npm install -g @tarojs/cli
创建项目：taro init 项目名   
//注：如报错未找到文件命令，需修改/增加环境变量
安装依赖：npm install
启动：
npm run dev:weapp（h5|swan|alipay|tt|qq|rn）
打包：
npm run build:weapp
```

#### 实现原理

AST(抽象语法树)，磨平多端(除授权、支付)。

### 组件库

https://taro-ui.jd.com/#/

1、报错 Can’t resolve ‘nervjs’ in...

安装：npm install taro-ui@3.0.0-alpha.1 -S

### 支付

微信：wx.requestPayment(Object object)

支付宝：my.tradePay

#### 判断环境

```javascript
console.log(Taro.getEnv())
```



