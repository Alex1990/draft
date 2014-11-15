卓博JavaScript风格简要指南
==========================

##命名

- 变量命名不要使用过于简短的名字，比如只用一个字母，除非是用于循环中的计数器，如`i`
- 变量命名使用小驼峰，即首字母小写，后面的每个单词首字母大写，如`userName`
- 构造函数的函数名称首字母需大写
- jQuery/Zepto对象的命名需要以美元符号`$`开头
- HTML的id命名应全部使用小写字母，以连接符`-`连接单词，如`id="save-post"`

以上命名，通常不要使用汉语拼音，不要把单词拼写错误。

##变量声明

变量声明时，使用一个`var`，禁止逗号开头的风格。

##引号

字符串使用单引号，如`var foo = 'Hello, world!';`。

##缩进

使用4个空格缩进，请配置编辑器使用tab键替换为4个空格。

##分号

语句结尾必须加分号。

##空格

为了提高代码可读性，需要在下面的位置使用空格，或参考jQuery代码即可：

- 赋值操作符及所有二元或三元运算符的两侧，如`=`/`+`/`>`
- 数组字面量，对象字面量及函数参数列表的逗号`,`后面，对象属性名的冒号`:`后面
- 表达式或函数参数列表两侧与小括号之间
- `if`/`else`/`for`/`while`/`switch`/`try`/`function`等关键字的后面
- 左花括号`{`的前面

示例代码：

```js
function factorial(num) {
    if ( num === 1 ) {
        return 1;
    } else {
        return num * factorial(--num);
    }
}
```

##行尾空白符

行尾不能有空格或其他空白符。

##花括号

`if`/`else`/`for`/`while`/`try`语句的花括号/大括号不能省略。

##条件表达式

条件表达式使用全等运算符`===`和不全等运算符`!==`。

##内置对象

禁止扩展内置对象。

##其他参考风格

以jQuery的风格为主。

- [jQuery JavaScript Style Guide](http://contribute.jquery.org/style-guide/js/)
- idiomantic.js: [English](https://github.com/rwaldron/idiomatic.js) [中文](https://github.com/rwaldron/idiomatic.js/tree/master/translations/zh_CN)
- Airbnb: [English](https://github.com/airbnb/javascript) [中文](https://github.com/adamlu/javascript-style-guide)
