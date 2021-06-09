# 什么是JS

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript

- 一门动态编程语言
- 实现了大量实用工具
  - 浏览器内置API
  - 第三方框架和库
  - 第三方API(Twitter、Facebook等)

# JS对象

- 浏览器对象
  - window|screen|event|form|location|link|button|submit|history|area|radio|reset...
- 内置对象 
  - Array|Boolean|Data|Math|Number|Object|String|Global|Function|RegExp
- 自定义对象（面向对象）
- 对象包含两个要素
  - 属性，描述对象特性
  - 方法，若干函数

# 数据

### 数据类型

- String|Number|Object|Symbol|Boolean|Null|Undefined|bigInt

### 数据结构

- Array|散列表|队列|树|栈|堆|链表|图

## 操作方法

### 类型转换

- parseInt()|parseFloat()字符数字转数字
  - 加法运算符(+"1.1") + (+"1.1")=2.2
- String()|toString()数字转字符串
- Nnmber()对象转数字
- JSON.stringify() 对象转字符串
- JSON.parse()字符串转JSON

### 对象方法

- for..in 遍历
- freeze()冻结
- assign()合并|浅拷贝
- delete 删除
  - delete myObj.name
- keys()返回键名数组
- create()创建
- is()比较值
- fromEntries()
  - [["a",1],["b",2]]转{a:1,b:2}

##  字符串方法

- substring()|substr()|slice()截取
- split()分割成数组
- indexOf()查找索引值
- includes()查找字符
- stratsWith()以什么开头
- endswith()以什么结尾
- chaAt()查找值

### 数组方法

- join()数组元素组成字符串
- sort()排序
- find()遍历数组
- Array.isArray()判断是否为数组
- Array.from()转数组
- Array.of()新数组
- splice()增删替
- push()|unshift()添加
- pop()|shift()删除

- concat()合并

- toString()数组转字符串

  

# 数据算法

- 数据驱动思想
- 递归
- 数组扁平化
- 排序算法
- 去重
- 迭代原理

## 递归

*实现数据扁平化*

- 遍历

```javascript
//直接产生一个数组，不需要第三方声明及拼接
$ul.innerHTML=datas.map(res=>{
	return`<li>${res.name}</li>`
}).join('')
```

- 递归
  - 函数自已调用自已
  - 注意循环条件的处理，避免出现无限循环

```javascript
$ul.innerHTML=createHTML(datas);

function createHTML(items,level=0){
  return items.map(item=>{
    let str=`<li style="pading-left:${level}*30">
							${item.name}
						 </li>`;
    if(Array.isArray(item.children)){
      str+=createHTML(item.children);
    } 
  })
  return str
}.join('');
```

- 数据扁平化
  - flat(  )

```javascript
//二维数组
let arr=[1,2,['a','b','c'],3];
console.log(arr.flat());//[1,2,'a','b','c',3]
//三维数组
let arr=[1,2,['a','b','c',['中','文'],3];
console.log(arr.flat(2));//[1,2,'a','b','c','中','文',3]
//多维数组，Infinity-无穷
let arr=[1,2,['a','b','c',['中','文'],3];
console.log(arr.flat(Infinity));
```

- 多维数组查找
  - 运用递归方法使数据转一维数组（扁平化）

```javascript
console.log(flat(datas))
//递归数据扁平化
function flat(d){
  let newArr=[];
  d.forEach(item=>{
    newArr.push(item);
    if(Arry.isArray(item.children)){
      newArr=newArr.concat(flat(item.children))
    }
  })
  return newArr;
}

//reduce数据扁平化
function flat(items){
  return items.reduce((prev,current)=>{
    return prev.concat(
      current,
      Array.isArray(current.children)?flat(current.children):[]
    )
  },[])
}

```

## 排序

- sort(  )

```javascript
//sort方法
datas.sort((a,b)=> a.chapter-b.chapter);

//冒泡实现
let arr=[6,7,8,3,4,1,10,9];
for(let j=0;j<arr.lenght-1;j++){
  //设定开关，避免多余的循环
  let isOff=true;
  //arr.length-1-j每循环一次减少一层范围
  for(let i=0;i<arr.length-1-j;i++){
    let a=arr[i];//取出当前值
    let b=arr[i+1];//取出一下位值
    //当前值a大于下一位值b时, 交换位置
    if(a > b){
     arr[i]=b;
     arr[i+1]=a;
     isOff=false;
    } 
  }
  if (isOff) break;//跳出外层  循环
}
console.log(arr);//[1,3,4,6,7,8,9,10]
```

## 去重

- new Set(  )
- 对象去重（利用key不能重）

```javascript
1.
//new Set()方法,值不能重
let arr=[1,1,2,3,3,2,7];
let s=new Set(arr);//{2,3,7}
let arr1=[...s1]//转回数组
console.log(arr1);//[2,3,7]
//简写：
console.log(...new Set(arr));//[2,3,7]

2.
//利用对象key不能重
let obj={};
arr1.forEach(item=>{
  obj[item]=1;
})
console.log(obj);//{1:1,2:1,3:1,7:1}//生成对象
console.log(Object.keys(obj));//["2","3","7"]//取键值
console.log(Object.keys(obj).map(o=>Number(o)));//[2,3,7]//转数组及转数字

3.
//reduce 数组去重
var arr = [3,9,4,3,6,0,9];
var newArr = arr.reduce(function (prev, cur) {
    prev.indexOf(cur) === -1 && prev.push(cur);
    return prev;
},[]);
```

##  对象遍历

- for...in
- defineProperty（vue 数据监听截持实现方法）

```javascript
//for in会遍历到原型链上的定义
Object.prototype.z=100;//原型定义
//自变量定义默认为true,可改|可输出
let obj={x:1,y:2};
for (let k in obj){
  conosle.log(k);//x,y,z
  console.log(obj[k]);//1,2,100
} 

//defineProperty定义默认为false,不可改|不输出
Object.defineProperty(obj,'y',{
  value:100,//值
  writable:false,//可写默认false,改定值无效
  enumerable:false,//可枚举默认false，不会输出值
})

obj.y=1000;//改定值无效
conosle.log(obj.y);//不会输出值
```

## 迭代器

- for...of 与for...in区别
  - for...in迭代键名
  - for...of迭代键值

```javascript
let list=[4,6,8]
for(let i in list){
  console.log(i)//'0','1','2'
}

for(let i of list){
    console.log(i)//'4','6','8'
}
```

## reduce

- 语法：arr.reduce(function(prev,cur,index,arr){...}, init)
  - **arr** 表示原数组
  - **prev** 表示上一次调用回调时的返回值，或者初始值 init
  - **cur** 表示当前正在处理的数组元素
  - **index** 表示当前正在处理的数组元素的索引，若提供 init 值，则索引为0，否则索引为1
  - **init** 表示初始值

### 去重

```javascript
//reduce 数组去重
var arr = [3,9,4,3,6,0,9];
var newArr = arr.reduce(function (prev, cur) {
    prev.indexOf(cur) === -1 && prev.push(cur);
    return prev;
},[]);
//基本原理如下：
① 初始化一个空数组
② 将需要去重处理的数组中的第1项在初始化数组中查找，如果找不到（空数组中肯定找不到），就将该项添加到初始化数组中
③ 将需要去重处理的数组中的第2项在初始化数组中查找，如果找不到，就将该项继续添加到初始化数组中
④ ……
⑤ 将需要去重处理的数组中的第n项在初始化数组中查找，如果找不到，就将该项继续添加到初始化数组中
⑥ 将这个初始化数组返回
```

### 最大值

```javascript
//求数组项最大值
var arr = [3,9,4,3,6,0,9];
var max = arr.reduce(function (prev, cur) {
    return Math.max(prev,cur);
});
//原理：
由于未传入初始值，所以开始时prev的值为数组第一项3，cur的值为数组第二项9，取两值最大值后继续进入下一轮回调
```

### 求和

```javascript
//求数组项最大值
var arr = [3,9,4,3,6,0,9];
var sum = arr.reduce(function (prev, cur) {
    return prev + cur;
},0);
//原理：
由于传入了初始值0，所以开始时prev的值为0，cur的值为数组第一项3，相加之后返回值为3作为下一轮回调的prev值，然后再继续与下一个数组项相加，以此类推，直至完成所有数组项的和并返回
```

## 操作数组

- .filter()、.map()、.forEach()、.find()、.findIndex()、.some()、.every()

```javascript
//.filter()
filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
是否改变原数组：否
是否对空数组进行检测：否
语法：
const arr= [32, 33, 16, 40];
const arr1 = arr.filter(item => item >= 18)
console.log(arr)  // [32, 33, 16, 40]
console.log(arr1)  // [32, 33, 40]

//.map()
map() 方法返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值。
map() 方法按照原始数组元素顺序依次处理元素。
是否改变原数组：否
是否对空数组进行检测：否
语法：
const arr= [4, 9, 16, 25];
const arr1 = arr.map(item => item+2)
console.log(arr)  // [4, 9, 16, 25]
console.log(arr1)  // [6, 11, 18, 27]

//.forEach()
forEach() 方法用于调用数组的每个元素，并将元素传递给回调函数。
注意: forEach() 对于空数组是不会执行回调函数的。
tips: forEach()中不支持使用break(报错)和return(不能结束循环)，有需要时可使用常规的for循环。
语法：
const arr= [4, 9, 16, 25];
const arr1 = [];
arr.forEach(item => arr1.push(item))
console.log(arr)  // [4, 9, 16, 25]
console.log(arr1)  // [4, 9, 16, 25]

//.find()
find() 方法返回通过测试（函数内判断）的数组的第一个元素的值。
find() 方法为数组中的每个元素都调用一次函数执行：
当数组中的元素在测试条件时返回 true 时, find() 返回符合条件的元素，之后的值不会再调用执行函数。
如果没有符合条件的元素返回 undefined
注意: find() 对于空数组，函数是不会执行的。
注意: find() 并没有改变数组的原始值。
语法：
const arr= [4, 9, 16, 25];
const b = arr.find(item => item>10)
const c = arr.find(item => item<1)
console.log(arr)  // [4, 9, 16, 25]
console.log(b)  // 16
console.log(c)  // undefined

//.findIndex()
findIndex() 方法返回传入一个测试条件（函数）符合条件的数组第一个元素位置。
findIndex() 方法为数组中的每个元素都调用一次函数执行：
当数组中的元素在测试条件时返回 true 时, findIndex() 返回符合条件的元素的索引位置，之后的值不会再调用执行函数。
如果没有符合条件的元素返回 -1
注意: findIndex() 对于空数组，函数是不会执行的。
注意: findIndex() 并没有改变数组的原始值。
语法：
const arr= [4, 9, 16, 25];
const b = arr.findIndex(item => item>10)
const c = arr.findIndex(item => item<1)
console.log(arr)  // [4, 9, 16, 25]
console.log(b)  // 2
console.log(c)  // -1

//.some()
some() 方法用于检测数组中的元素是否满足指定条件（函数提供）。
some() 方法会依次执行数组的每个元素：
如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测。
如果没有满足条件的元素，则返回false。
注意： some() 不会对空数组进行检测。
注意： some() 不会改变原始数组。
语法：
const arr= [4, 9, 16, 25];
const b = arr.some(item => item>10)
const c = arr.some(item => item<1)
console.log(arr)  // [4, 9, 16, 25]
console.log(b)  // true
console.log(c)  // false

//.every()
every() 方法用于检测数组所有元素是否都符合指定条件（通过函数提供）。
every() 方法使用指定函数检测数组中的所有元素：
如果数组中检测到有一个元素不满足，则整个表达式返回 false ，且剩余的元素不会再进行检测。
如果所有元素都满足条件，则返回 true。
注意： every() 不会对空数组进行检测。
注意： every() 不会改变原始数组。
语法：
const arr= [4, 9, 16, 25];
const b = arr.every(item => item>10)
const c = arr.every(item => item>1)
console.log(arr)  // [4, 9, 16, 25]
console.log(b)  // false
console.log(c)  // true
```



# 命名空间

**特殊函数**

- 首字母大写
- 内部声明和方法挂载在this下面
- 通过new关键字，执行方法

```javascript
function User(n){
	this.name=n;
  this.getUser=function(){
    return data.username
  }
}

var $user=new User();
$user.getUser('小米')
```



# 面向对象

用对象的思想去写代码。

--过程式

--面向对象

```javascript
//数组对象->对象下有各种使用方法
var arr=new Array();//[]
arr.push()
arr.sort()

//时间对象
var date=new date();
date.getDate();
```

## 编程(OOP)特点

抽象：抽取核心问题

封装：只能通过对象来访问方法

继承：从已有的对象上继承出新对象

多态：多对象的不同形态

## 对象写法

属性（变量）

方法（行为、操作）

```javascript
//对象
var arr=[];
//对象属性
arr.number=10;
//对象方法
arr.fn=function(){
  console.log(10)
}
arr.fn();


var obj={};
obj.name='小林';
obj.showName=function(){
  //this指向obj
  console.log(this.name);
};
obj.showName();//小林
```

### 工厂方式

```javascript
function createPerson(name){
  //原料
	var obj={};
  obj.name=name;
  //加工
  obj.showNanme=function(){
    console.log(this.name);
  }
  //出厂
  return obj;//return后,在外可以直接调用方法
}
createPerson('小明').showName();
createPerson('小林').showName();
//整理后写法
var p1=createPerson('小明');
p1.showName();
var p2=createPerson('小林');
p2..showName();
```

### 构造函数

当**new**去调用一个函数，函数中的this就是创建出来的对象，而且函数的返回值直接就是**this**(隐式返回)。

```javascript
/注:*new*后面调用的函数就是*构造函数*

//首字母必需为大写
function CreatePerson(name){
  this.name=name;
  this.showName=function(){
    console.log(this.name);
  }
}
var p1=new CreatePerson('小明');
p1.showName();
var p2=new CreatePerson('小林');
p2.showName();

/原型改写
function CreatePersom(name){
  	this.name=name;
}
CreatePersom.prototype.showName=function(){
 	console.log(this.name); 
}
var p1=new CreatePerson('小明')；
var p2=new CreatePerson('小林')；

//打印出的值与引用都相同
console.log(p1.showName==p2.showName);//true
```

## 对象的引用

### 基本类型

- String|Number|Boolean|Null|Undefind
  - 特点：赋值时，只是值的复制
  - 比较：值相同，返回true
  - typeof可以识别出基本类型，但不能识别null、对象类型，会统一归为object类型

```javascript
//a赋给b,然后修改b不会影响a,a只字复制给b而已
var a=5;
var b=a;
b+=3;
console.log(b);//8

//值相同，返回true
var a=5;
var b=5;
console.log(a==b);//true
```

### 对象类型

- Array|Objcet
  - 特点：赋值时，不仅是值的**复制**，而且也是**引用**(指变量名)的传递
  - 比较：值与引用名都相同，返回ture 
  - instanceof可以识出对象类型，如array、object、function，同时对于使用new声明类型，它还可以检测出多层继承关系，但是不能识别出基本类型

```javascript
var a=[1,2,3];
var b=a;
b.push(4);
console.log(a);//[1,2,3,4]
console.log(b);//[1,2,3,4]

//值与引用名都相同，返回ture 
var a=[1,2,3];
var b=a;
console.log(a==b);//true

//引用名不同，返回false
var a=[1,2,3];
var b=[1,2,3];
console.log(a==b);//false
```

## 原型

改写对象下公用方法或者属性，让公用的方法或者属性在内存中存在一份（提高性能）。

**概念理解：**

原型，css中的class    

普通，css中的style

```javascript
//原型与原型链?
_proto_对象的原型链
prototype构造函数的原型
实例化对象的_proto_指向构造函数的prototype
```

```javascript
/注：普通方法优先于原型方法
var arr=[];
//普通
arr.number=10;
//原型
Array.prototype.number=20;
console.log(arr.number);//10
```

### 写法

--prototype要写在构造函数的下面

--公用的写在prototype下

--非公用的写在构造函数中

```javascript
//等同写法arr=new Array(1,2,3)
var arr=[1,2,3];
var arr2=[1,2,3,4,5];
Array.prototype.sum=function(){
  var num=0;
  for(var i=0;this.length;i++){
    num+=this[i];
  }
  retrurn num;
}
console.log(arr.sum());
console.log(arr2.sum()); 
```

```javascript
//模板写法
function 构造函数(){
  this.属性
}

构造函数.prototype.方法=function(){
  //执行
}

var 对象1=new 构造函数();
对象1.方法();
```

## 继承

### 构造函数继承

- call(   )，修改this指向当前并继承父级

```javascript
//构造函数
function Person(name,age){
  this.name=name;
  this.age=age;
}
Person.prototype.sayName=function(){
  conosle.log(this.name);
}
Person.prototype.sayAge=function(){
  conosle.log(this.age);
}
//实例化
let leo=new Preson2('leo',43);
leo.sayName();
leo.sayAge();

//继承
function Person1(name,age,skill){
  //修改this指向当前并继承父级
  Person.call(this,name,age);
  this.skill=skill; 
}
//继承实例化
let lily=new Preson1('lily',33,'花式写代码');
console.log(lily)
```

### 原型链继承

```javascript
//原型链继承
Person1.prototype=extend(Person);
Person1.prototype.constructor=Person1;
//封装空函数
function extend(c){
  funcion P(){}
  P.prototype=c.prototype;
  return new P;
}
```

### 拷贝继承

- 深拷贝

```javascript
//方法一：递归
let obj={
  name:"lily",
  age:18,
  skill:{
    eat:"满汉全席",
    music:"爱",
    list:['古筝','吉他','钢琴']
  }
};
function extend(data){//复制每一层  
  if(typeof data=="object"&&data){
    var val=typeof data.lenght=='number'?[]|{};
    for(var s in data){
      val[s]=extend(data[s]);//递归
    }
    return val;
  }else{
    return data;
  }
}
let newObj=extend(obj)

//方法二：JSON对象的parse和stringify
function deepClone(obj){
    let _obj = JSON.stringify(obj),
        objClone = JSON.parse(_obj);
    return objClone
}    
let a=[0,1,[2,3],4], b=deepClone(a);
a[0]=1;
a[2][0]=1;
console.log(a,b);
```

- 浅拷贝

```javascript
//子级会改变父级值，不建议使用
//只复制第一层值，多层次无法复制
for（let s in Person.prototype）{
	Person1.prototype[s]=Person.prototype[s];
}
```



# ES6

## 模块化

- 普通js（type="applocation/javascript"）

  -默认同步加载

- 异步加载，defer(延迟)

  -必需为外链引入

  -等待DOM结构加载完，其它脚本执行完，再执行(不限制js文个引入位置)

  -多个defer之间可以确保加载顺序

- Es6模块引用（type="module"）默认为defer

  ```javascript
  //必须在服务器端口下预览,vscode安装服务器插件“Live Server”
  <script src="index.js" type="module"></script>
  ```

  ```javascript
  //模块作用域
  var  a=1;
  console.log(window.a===a);//false
  
  //默认开启严格模式‘use strict’
  console.log(a);//undefine
  var  a=1;
  ```

  ```javascript
  //js文件中导入js文件（被导入的js文件会提前执行）
  //同一个文件导入多次，只执行一次
  import "./a.js"
  ```

## 导入与导出

- 模块导出的是对原来值的引用
  - 不可以直接在导入模块后，修改值
  - 可以通过被导入模块提供的方法修改， 被导入模块内部的值
  - 所有导入的内容都是引用关系

```javascript
//index.js 导入
import {n,add} from './a.js';
console.log(n);
add()

//a.js 导出
let n=0;
let add=function(){
  console.log('add执行');
}
export {n,add};
```

```javascript
//导入，可拼接
import {m,skill as s} form './a.js';
console.log(m+s);//momo会唱歌

//指定导出
export var m="momo",skill="会唱歌";
```

```javascript
//默认导入|导出
import def form './a.js';
console.log(def);//999

export default 999;
```

```javascript
//导入别名，(取别名防止冲突)
import {n as kimoo} form './a.js';
console.log(kimoo)

//别名导出
var skill="会唱歌";
export {n as kimoo};
```

```javascript
//导入全部
import * as all form './a.js';
console.log(all);//会显示一个带所有字段集合
console.log(all.n,all.p,all.default);//skii,1999,nice

//导出
export let n='skii',p=1999;
export default 'nice';
```

```javascript
//引入的坑
//index.js
import {num,add} form './a.js';
import  './b.js';

//index.js并未执行add(),理论上应是0
//因为b.js中的执行次数，让num也变成了3
//如何“断开引用”?	每次引用都创建新对象
console.log('index.js中num的值'，num);//3

//b.js
import {num,add} form './a.js';
add();
add();
add();
console.log('b.js中num的值'，num);//3

//a.js
var num=0;
var add=function(){
  num++;
}
//解决：每次引用都创建新对象|Object.assign() 方法
function fn(){
  return{
    add(){ },
    get a(){}
  } 
}
export {name,add};
```

## 新增

### 箭头函数

- 传参

```javascript
/ES5的写法
function add(a,b){
 // var _b=b||100;
  var _b=b===undefined?100;b;
  return a+_b;
}
add(10);//110

/ES6的写法
//传参可”赋值“
function add(a,b=100){
    return a+_b; 
  }
add(10);//110

//传参可赋”剩余参数“
function add(a,...r){
    console.log(a,r)
  }
add(1,2,3,4,5);//1,[2,3,4,5]
```

- 箭头函数

  - 使用时this是创建时所在环境对象,不是使用时的环境对象

  - 没有自已参数集合对象，应用"剩余参数"模拟
  - 不能当作构造函数,不能用new命令
  - 无法修改this指向

```javascript
//ES5的写法
function add(a,b){
  return a+b;
}
add(2,3)

//ES6的写法
var add=(a,b)=>{return a+b;} 
var add=(a,b)=>a+b;//限一条语句
add(2,3)//5

//返回对象
var add=()=>({name:'lily'});
add();//{name:'lily'};


//循环指定值
var add=()=>{
  list:for(var i=0;i<10;i++){
    console.log(i);//1....9
    if(i==3) break list;
  }
} 
add();//0,1,2,3

//单参计算
var add=(a)=> a*100;
var add= a => a*100;//单参变体
add(2);//200
 
//过滤
var arr =[10,21,2,59,66];
var res=arr.filter(function(item){//ES5写法
  return item>20;
})
var res=arr.filter(item => item > 21);//ES6简 写
console.log(res);//2,10

//获取参数集合-”剩余参数“模拟
var fn=(...r)=>{
  console.log(r);  
}
fn(1,2,3,4,5)
```

- getter|setter方法
  - get是返回对象属性值的方法
  - set是设置对象属性值的方法

```javascript
var p={
	_age:18,
  get age(){
    return this._age;
  },
  set age(val){
    this,_age=val;
  }
}
//初始值
p.age;//18
//重新定义值
p.age=20;
p.age;//20
```

### ?数组

```javascript
//---
```

### ?对象

```javascript
//---
```

### 剩余参数

- 将一个不定数量的参数表示为一个数组

```javascript
function sum(...data){
  return data.reduce((pre,cur)=>{
    return pre+cur;
  })
}
sum(1,2,3);//6
sun(1,2,3,4,5);//15
```

## 解构赋值

匹配等号二边的模式相同，左边的变量就可赋给对应的值

```javascript
数组：[a,b,c]=[1,2,3]
对象：{a:1,b:2}={b:2,a:1}
基本类型：[a,b,c]="123"
```

### 数组解构

```javascript
var arr=[1,2,3];
var [a,b,c]=arr;//var a=arr[0],b=arr[1],c=arr[2]
console.log(a)//1

//默认赋值
var arr=[1,,3];
var arr=[1,false,3];//走false
var arr=[1,0,3];//走0
var arr=[1,null,3];//走null
var arr=[1,undefined,3];//走”赋值“ 
var [a,b="赋值",c]=arr;
console.log(b)

//剩余值
var arr=[1,2,3,4,5,6,7,8,9];
var [a,b,...n]=arr;
console.log(a,b,n);//1,2,[3,4,5,6,7,8,9]
```

### 对象解构

```javascript
var obj={name:123,age:28};
var {name,age}=obj;//var name=obj.name,age=obj.age
console.log(name,age)//123,28
var {name}=obj;
console.log(name)//123

//设置默认值：(优先读取对象中值,如果无值，则读取默认值)
var obj={name:123,age:28};
var {c}=obj;
console.log(c)//undefined
var {c=100}=obj;
console.log(c)//100

//取别名
var {name:str}=obj;
console.log(str)//123

//取别名配默认值
var {c:m='啦啦'}=obj;
console.log(m)

//剩余值
var obj={name:'lily',age:28,money:37000,job:'程序员'};
var {name,age,...r}=obj;
console.log(name,age,r);//lily,28,{money:37000,job:'程序员' }
```

### 深层解构

```javascript
var arr=[{a:1,b:2},{n:10,x:12}];
var [obj1]=arr;
console.log(obj1);//{a:1,b:2}
var [{b}]=arr;
console.log(b);//2
var [{b},{n}]=arr;
console.log(b,n);//2,10

var arr=[
  {a:1,b:[200,300,500]},
 	{n:10,x:12}
];
//取值后取别名
var [{b:[x]}]=arr;
console.log(x);//200

//占位
var [,{n}]=arr;
console.log(n);//10
```

## 异步编程

js属于单线程，把一些耗时的事，通过新开线程方式来实现，称为异步任务。

### 同步与异步

```javascript
/任务一，请求数据
var xhr=new XMLHttpRequest();
xhr.onlad=function(){
  console.log(this.responseText);
}
//true:异步,当前任务未处理完，依然可以执行后面任务
//false:同步,当前任务处理完成，再继续后面任务
xhr.open('get','http://xxxx',false)
xhr.send();

/任务二，背景变色
this.style.background='red';

/任务三，...
```

 ### Promise

 js异步对象(构造函数)，通过promise来构建一个异步任务处理对象

- 解决回调地狱
- 解决同时需要从二个接口中获取对应的值后在执行下步需求

#### 基本使用

- 状态
  - pending，初始状态，即不成功也不失败
  - fulfilled(火狐)|resolve(谷歌)，成功
  - reject，失败
- 方法
  - then，任务后续处理函数
  - catch，捕获失败信息

```javascript
//使用
resolve函数，当我们调用该函数时，当前的promise对象的任务状态改成resolve

reject函数，当我们调用该函数时，当前的promise对象的任务状态改成reject

let a=0;
//要执行异步任务
let test=new promise((resolve,reject)=>{
  setTimeout(()=>{
    a=10;
    //调用状态
    resolve();//成功
   //reject();//失败
  },3000)
})

//then方法是promise处理完任务后继续执行的任务
test.then(()=>{
  console.log(a,'成功啦')
},()=>{
   console.log('失败啦')
})
```

```javascript
//传参
//resolve函数|reject函数,传参给then中的函数进行使用
 new promise((resolve,reject)=>{
  setTimeout(()=>{
    let a=10;
   // resolve(a); 
    reject('失败');
  }.2000);
  
}).then( v =>{
  conosole.log(v);//10
},err=>{
    conosole.log(err);//失败
 })
```

#### 任务链

- then执行后会返回一个新的promise对象
  - 如果then没有传入处理函数，会返回一个继承上一个处理状态的promise对象
  - 如果传入处理函数，则返回状态的promise对象
- 问题
  - 不易中途终止后续任务执行
  - 解决，catch方法能捕获所有then方法中的状态

```javascript
//调用reject函数，第二个then未走”失败“?
//因为所有then都是基于上 一个then是否有值而执行状态
new promise((resolve,reject)=>{
 // resolve(); 
    reject();
}).then(()=>{
   conosole.log(1);
},()=>{
  conosole.log(2);//2
}).then(()=>{
   conosole.log(3);//3
},()=>{
  conosole.log(4);
})

//解决，在上一个then失败中手动返回
new promise((resolve,reject)=>{
 // resolve(); 
    reject();
}).then(()=>{
   conosole.log(1);
},()=>{
  conosole.log(2);//2
  //手动返回”new promise实例“
	return new promise((resolve,reject)=>{
    reject();
	})
}).then(()=>{
   conosole.log(3);
},()=>{
  conosole.log(4);//4
})
```

```javascript
//catch解决不易中途终止后续任务执行
new Promise((resolve,reject)=>{
  reject('第一步错误了')  
}).then(()=>{
  return new Promise((resolve,reject)=>{
    reject('登录失败');
  })
}).then(()=>{
  console.log('管理员')
}).then(()=>{
  console.log('获取资源')
}).catch(err=>{
  console.log(err);
});
```

#### 多任务处理

- Promise.all(全部完成，再执行下步)
- Promise.race(只要有一个任务完成，执行下步)

```javascript
 let p1=new Promise((resolve,reject)=>{
        setTimeout(()=>{
          console.log(1)
          resolve(10)
        },2000)
 })
  let p2=new Promise((resolve,reject)=>{
        setTimeout(()=>{
           console.log(3)
          resolve(20) 
        },3000)
 })
 
  //全部调用
  Promise.all([p1,p2]).then( arr =>{
    console.log(arr);//[10,20]
  })

	//竞争调用,只要有一个任务完成，执行下步
  Promise.race([p1,p2]).then( arr =>{
    console.log(arr);//[10,20]
  })
```

#### 状态方法

```javascript
//成功对象，传参
Promise.resolve().then(() =>{
	cosole,log(1);
},()=>{
  cosole,log(2)
})
//失败对象
Promise.reject().then(()=>{
	cosole,log(1)
},()=>{
  cosole,log(2)
})


//传参
Promise.resolve(1).then( v =>{
	cosole,log(v);//1 
},()=>{
  cosole,log(2)
})

//可传参Promise对象
Promise.resolve(
	new Promise((resolve,reject)=>{
    reject('错误')
  })
).then(v=>{
  console.log(v)
},err=>{
  console.log(err)
})
```

## 异步函数

- async/await
  - 解决promise执行中，中途无法取消、内部监测难、错识无法在外部捕捉，只能内部预判

````javascript
 async function fn(){
   try{
     var v=await getValue(3);
     console.log(v);  
   
      var n=await getValue(2);
      console.log(n);
     
      var y=await getValue(200)
      console.log(y);
   }cath(e){
     	console.log(e);//值太大啦
   }
 }

fn();

function getValue(val){
  return new Promise((resolve,reject)=>{
      setTimeout(()=>{
          var a=10;
        if(val<100){
            resolve(a*val)
           }else{
             reject('值太大啦')
           }
      },2000)
    });
}

````

### Class

#### 基本使用

```javascript
//ES5的写法
function Person(name,age){
  this.name=name;
  this.age=age; 
}
Person.prototype.say=function(){
  console.log(this.name,'他'+this.age+'岁就会说话');
}

var p1=new Person('moom',2);
pl.say();//moom,他2岁会说话

//ES6的写法
class Person{
  constructor(name,age){
    this.name=name;
    this.age=age;
  }
  say(){
     console.log(this.name,this.age+'岁');
  }
  eat(){
     console.log('eat...');
  }
}

let p1=new Person('lily',28);
p1.say();//lily,28

```

#### 静态方法

- 静态方法调用同一个类中的其他静态方法，可使用 `this `关键字。

```javascript
var str="妙";
//实例方法
console.log(str.charCodeAt(0));//22937
//静态方法
console.log(String.fromCharCode(22937));//妙
```

```javascript
class Person{
	constructor(name){
		this.name=name;
	}
  /静态方法
  static isHuman(){
    console.log('static前缀，我是静态方法')
  }
  say(){
    consoloe.log('我是实例方法')
  }
}
//实例方法，需要new个新实例
var p1=new Person('lily');
p1.say();
/静态方法调用
Person.isHuman();

/静态属性
Person.staticStr='我是新增静态属性值'
```

#### 继承

```javascript
calss Code extends Person{
	constructor(name,age,money){
    super(name,age);//手动调用父类的构造函数
    this.money=money; 
  }
  say(){
    consoloe.log('可改写父类方法',this.name)
  }
}

let c1=new Code('lili ',28,300000);
//调用父类方法
c1.say();
```

#### 注意事项

- 所有方法属性都是挂载在原型上的(Person.prototype)
- 原型上的方法是不可枚举的Object.keys(Person.prototype)
- 子类可改写父类的方法，并不会影响父类方法
- 子类可继承父类的静态方法



# TypeScript

- Javascript的超集，可以编译成纯javascript

- 可以在任何浏览器、计算机、操作系统上运行，并且是开源的
- 不能直接运行，属于间接运行

- 它属于强类型语言。

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

### 声明类型

```javascript
var str:string;
str='必需为字符串类型（类型约束）';

//首字大写声明的是字符串对象
var str1:String=new String('lili');
```

### 类型

基本类型：Boolean|Number|String|Null|Undefined

特殊类型：Array|Tuple|Enum|Any|Void|Never

```javascript
//数组，一组具有相同类型特征的数据有序集合
let arr:number[]=[1,2,3];
let arr1:Array<number>=[1,2,3];

//布尔
let arr:boolean=false;

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

### 高级类型

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

## 函数与类

### 函数

```javascript
//函数声明式为数字类型
function fn1(x:number,y:number){
	return x+y;
} 
fn1(1,2);

//函数表达式传参类型
var fn2:(x:number,y:numbe)=>number=function(x,y){
  return x+y;
}

//定义可传，可不传参数类型值
function fn3(x:number,y?:number):number{
  return x+y;
}
fn3(3)

//函数重载
function fn4(x:number,y:number):number;
function fn4(x:string,y:string):string;
function fn4(x:any,y:any):any{
  if(typeof x=='number'){
    return x*y;
  }else{
    return x+y;
  }
}
fn4('a','b');
fun4(1,2);
```

### 类

```javascript
class Person{
  name:string;
  age:number;
  say():void{
		console.log('Hello');
  }
}

var p1:Person=new Person();
p1.say();

/注：安装ts-node 直接运行结果

//构造函数
class Person{
  name:string;
  age:number;
  constructor( name:string,age:number;){
		this.name=name;
    this.age=age;
  }
  say():void{
		console.log('Hello'+this.name);
  }
}

var p1:Person=new Person('Lili',33);
p1.say();
```

### 类的深入

####  修饰符

公共：public （默认）
受保护：protected （子类可用）
私有：private （子类不可用）
只读：readonly （可访问，不可修改）

 #### 继承

```javascript
class Student extends Person{
  constructor(name:string,age:number){
    super(name,age)
  }
  getAge():number{
    return this.age;
  }
}

let s1:Student=new Student('leo',40);
console.log(s1.age);
```

#### 存取器

```javascript
//get|set 控制当前属性值
class Man{
  private _age:number;
  constructor(age:number){
    this._age=age;
  }
  get age():number{
		return this._age;
  }
  set age(newAge:number){
		if(newAge < 200) this._age=newAge;
  }
}
let m1:Man=new Man(10);
m1.age=100;
console.log(m1.age);
```

#### 静态方法

```javascript
class Teacher{
	age:number;
	static flag:string='静态属性';
	
  constructor(age:number){
		this.age=age;
  }
	
	static fn():void{//静态方法
    
  }
}
//访问静态属性
console.log(Teacher.flag)
//非静态属性访问，需新实例化
let t1:Teacher=new Teacher(10);
```

#### 泛型

```javascript
function fn<T>(x:T,y:T):any{
  return x;
}

fn<string>('a','b');
fn<number>(1,1);
```



## 模块

### 通配符

- TS声明第三方库的类型
- 声明文件以 **.d.ts** 为后缀
  - shims-vue.d.ts

```typescript
//shims-vue.d.ts
declare module 'vue-introjs'{
  const vueIntro:any
  export default vueIntro
}
```

### 导出

```typescript
// assets/types/order/index.d.ts 定义声明参数类型
interface IFormsPar{
  name:string,
  list:arry[],
  iphone:number
}
 interface IOrderPar{
  id:number,
  user:string,
  options:IFormsPar,
  initView():void,
  initApp():Promise<>
}
export{IOrderPar}

//页面引用
import * as I from'@/assets/types/order'
//export default class: ES6中导出创建类
//extends:继承某个类，继承后可使用、重写父类方法
//implements:可以实现多个接口，用逗号分开
export default class Order extends Vue implements I.IOrderPar{
  //....
}
```

## 装饰器

- 装饰器是一种特殊类型的声明，它能被附加到类声明、方法、访问符、属性或参数上。

- 主要的装饰器依赖：

  - vue-property-decorator
    - 社区出品
    - 基于vue-class-component，拓展出了更多操作符：@Prop、@Emit、@Inject、@Model、@Provide、@Watch
  - vue-class-component
    - 官方出品

  - vuex-class
  - core-decorators

https://www.jianshu.com/p/dadc9420afad

```typescript
@Prop	@PropSync	@Model	@ModelSync	@Watch	@Provide	@Inject	@ProvideReactive	@InjectReactive	@Emit	@Ref	s@VModel

import { Vue,Component, Ref } from 'vue-property-decorator'

@Component({
  components: {
    XXXX
  },
  props: {
    mapFlag: Number
  }
})

export default class App extends Vue {
  name:string = 'Simon Zhang'

  // computed
  get MyName():string {
    return `My name is ${this.name}`
  }

  // methods
  sayHello():void {
    alert(`Hello ${this.name}`)
  }

  mounted() {
    this.sayHello();
  }
}
```



# Axios封装

## Kxios结构

- Kxios：请求调度类，处理配置，管理请求

- config：默认配置

- Util：工具类，提供一些工具，如深拷贝

- IntercePtorMananger：拦截器的注册与销毁

- Adapter：适配器类，适配浏览器与node请求与响应

  

