# 面向对象

## 什么是面向对象

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

String|Number|Boolean|Null|Undefind

特点：赋值时，只是值的复制

比较：值相同，返回true

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

Array|Objcet

特点：赋值时，不仅是值的**复制**，而且也是**引用**(指变量名)的传递

比较：值与引用名都相同，返回ture 

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

### 函数

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

### 数组 



### 对象

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

# Axios封装

## Kxios结构

- Kxios：请求调度类，处理配置，管理请求

- config：默认配置

- Util：工具类，提供一些工具，如深拷贝

- IntercePtorMananger：拦截器的注册与销毁

- Adapter：适配器类，适配浏览器与node请求与响应

  

