Placeholder polyfill
====================

规范：[https://html.spec.whatwg.org/multipage/forms.html#attr-input-placeholder](https://html.spec.whatwg.org/multipage/forms.html#attr-input-placeholder)

开源参考：

- https://github.com/jamesallardice/Placeholders.js
- https://github.com/mathiasbynens/jquery-placeholder

通常有两种解决方法：`value`属性模拟和其他标签模拟

## 要解决的问题

- 如果采用`Element.value`属性来模拟，则`input:password`可能会显示“点点”，比如 VirtualBox + Win7 + IE7/8 (simulated in IE9)，据说 IE10 中也会。可以采用`input:text`替换或只替换`type`或用其他标签来解决，但是显示隐藏是否会和`transition`动画冲突呢？

- 如果有初始值的话

- 一种观点认为低版本的 IE 就应该优雅降级，即不需要和现代浏览器体验一模一样，而且做到一样很难。我也同意这种观点，就是觉得一些产品经理不认同，非要一模一样。

- 采用`value`属性模拟，如果`placeholder`的值与用户输入的内容相同时，发生`blur`事件可能使得获取的`val()`值为空字符串。

- `placeholder`字体颜色在各浏览器中统一，支持`placeholder`属性的浏览器使用特殊的选择器来设置。

- 使用`value`属性来模拟，表单提交时不要提交`placeholder`内容，相对来说 jquery-placeholder 处理不错。有些插件会在表单提交时清空`placeholder`内容，提交成功后可能会不再显示了，这个怎么处理？

- 表单元素的`disabled`和`readonly`属性

- placeholder text 的样式控制，假如采用标签模拟，那应该只提供一个`class`接口使用CSS设置样式，还是利用JS复制一些布局视觉样式。要注意，样式依赖 HTML 的结构，这样利用 JS 复制有局限性。

- 是否模拟首次输入（可能键盘/粘贴/拖放等）才消失的效果。

- 是否依赖 jQuery

- 与`autocomplete`/`autofill`/`autofocus`属性是否冲突

- 浏览器记录密码功能自动填充用户名与密码时

- 标签模拟时，`z-index`属性设置问题，与其他组件冲突问题，[https://github.com/diy/jquery-placeholder/issues/24](https://github.com/diy/jquery-placeholder/issues/24)

- `ESC` 键在 IE 下清除文本框内容问题

- `placeholder`属性的目的到底是什么

- 可访问性问题

- 规范规定是`focus`事件时，placeholder 消失

- 浏览器分级支持，即多个版本：native/ie6+/ie9+

- 自定义字体问题

- 更新 placeholder 文本的接口

- `Tab` 键移动焦点是否表现正常

- 如果要修改 jQuery 的 `val()` 的话，注意是否有副作用，比如多选`select`、`$().val()`。

- 只有`input`和`textarea`支持`placeholder`属性，是否要支持`select`呢？

- `javascript:void(0)` kill placeholder ?

- RTL support?

- 动态加载的表单元素，方便初始化

- 标签模拟方式，注意 cursor style，IE8 中默认为`cursor: default`，应该设置为`cursor: text`。

- 移动端浏览器支持与测试

- 有些浏览器中，`input`支持`placeholder`，但`textarea`不支持，导致原生与 polyfill 一起使用，可以选择除非全部支持才使用原生，否则全部采用 polyfill，该如何选择呢？

  另外`input.attr('placeholder')`对于动态插入的表单元素可能无效，使用`input.getAttribute('placholder')`更可靠。

  这两个问题可参考：[https://github.com/ginader/HTML5-placeholder-polyfill/issues/17](https://github.com/ginader/HTML5-placeholder-polyfill/issues/17)。

- 有人反应，在 gridTable edit 环境下有很多 bug

- IE10+支持，但是获取焦点时消失，与其他现代浏览器不一样，这个要不要一致，提供配置？产品经理非要一致呢？要不要揍他？

- 标签模拟方式对 DOM 结构依赖高，应该怎么处理好呢？

- 其他交互形式：如获取焦点且输入字符时，占位符不消失，而是颜色透明度变化

- 脚本改变`value`值不会触发的`input`事件

- 除了Github，其他参考插件：

  - http://www.dao-e.com/Common/Js/jquery.placeholder.js

- 在`textarea`下面占位符内容换行问题

- IE10/11中，`input`元素有`placeholder`属性，在获取焦点时会触发`input`事件，参考：http://caniuse.com/#feat=input-placeholder

- `input:search`有自己默认的 UI，可以去掉。

- 使用`input.type`来改变`type`属性时，在IE6-8（包括改变文档模式来模拟的）中会报错；使用`input.setAttribute()`时，在IE6/IE8/IE7(in IE8)中会报错，在IE9+模拟的IE7/8中不会报错。注：IE10是根据网上反应，IE11未测。

- 光标位置问题：可以使用选区API

- 如果焦点元素在一个`iframe`，且跨域了，则`document.activeElement`在IE8/9中会抛出`"unspecified error"`。参考：

  - https://github.com/jquery/jquery-mobile/issues/2064
  - https://github.com/mathiasbynens/jquery-placeholder/pull/99

- 恢复到未调用插件状态，比如`$(':input').placeholder('destroy')`

- Opera Mini 中测试支持`placeholder`，但是实际上不存在，参考：https://github.com/mathiasbynens/jquery-placeholder/pull/130

- https://github.com/aralejs/placeholder/issues/4

- IE点击`<a href="javascript:;"></a>`触发`onbeforeunload`事件影响：https://github.com/mathiasbynens/jquery-placeholder/issues/121

- IE中，如果输入框有输入（包括空字符串），则刷新页面，输入框内容保留。

  如果焦点在某个输入框内，则刷新页面后会触发该输入框的`blur`事件，

- 使用jquery-placeholder将`input:password`替换为`input:text`的方式，要注意两者的高度在IE11模拟的IE7-9中不同，可使用CSS显式设置高度。

- 目前的jquery-placeholder在IE6-9中需要JS加载好之后才能显示placeholder，当然可以改成加载好CSS后就生效，但是还是采用目前的吧，较少依赖CSS与HTML设置。

- form 的`reset`事件会清除所有表单元素的内容

- 假如要为密码框添加那种眼睛图标用来切换密码显示为黑点还是明文功能，其交互方式至少有两种，一种是鼠标点击切换，一种是鼠标按着才显示明文，松开则恢复黑点。

- 应该提供清除/设置`placeholder`文本的接口

- 提供阻止显示`placeholder`的判断的设置，利用`jQuery.data()`？

- placeholder文本内容超过文本框的宽度时自动截断

- 使用标签技术时，Chrome里面记住账户与密码功能会出现问题：

  - 首先placeholder显示，然后浏览器将账户与密码填充进入，然后才执行到JS根据文本框的`value`决定是否显示placeholder，当然可以先让placeholder隐藏，然后JS将其显示出来，这样不会看到placeholder先显示再隐藏那样闪烁一次。
  - 另外一个问题是，输入URL进入页面（即非刷新）时，密码框虽然被自动填充了，但是其`value`值为空，手动点页面任意位置才会正确，当然脚本触发`click`或者密码框的`focus`都不管用。火狐和360没有这个问题。

