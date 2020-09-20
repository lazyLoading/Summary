## 什么是TypeScript
Javascript的超集，可以编译成纯javascript.   
它可以在任何浏览器、计算机、操作系统上运行，并且是开源的（不能直接运行，属于间接运行）。

它属于强类型语言。

## 类型系统

https://www.tslang.cn/index.html#download-links   


```
安装：npm install -g typescript
```

```
编译：tsc ./src/helloworld.ts		(会生成并级helloworld.js)
保存编译文件：tsc ./src/helloworld.ts --outfile ./dist/helloworld.ts
```

- 声明类型

```javascript
var str:string;
str='必需为字符串类型（类型约束）';
```

- tsconfig.json配置统一编译文件
- 

