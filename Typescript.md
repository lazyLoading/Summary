## 什么是TypeScript
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













