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
tsconfig.json：配置进行统一编译文件
```

- 声明类型

```javascript
var str:string;
str='必需为字符串类型（类型约束）';

//首字大写声明的是字符串对象
var str1:String=new String('lili');
```

- 类型

基本类型：Boolean|Number|String|Null|Undefined

特殊类型：Array|Tuple|Enum|Any|Void|Never

```javascript
//数组，一组具有相同类型特征的数据有序集合
let arr:number[]=[1,2,3];
let arr1:Array<number>=[1,2,3];
```

```javascript
//枚举
enum Obj{no=0,yes=1}
enum Obj1{a=1,b,c};//后面值根据第一个已有值累计1,2,3

enum Colors{red,pink,black}
let r:Colors=Color.red
```

```javascript
//任意类型
let notSure:any=5;
let list:any[]=[1,'a',5];
```

- 高级类型

```javascript
//联合类型
function getData():string|string[]{
  if(// ...条件){ 
     return 'a';
     }else{
    return ['a','b','c'];
  } 
}
var result:string|string[]=getData();

//类型断言
(<string>result).substring(0);
(<string[]>result).push();

```

- 函数与类



