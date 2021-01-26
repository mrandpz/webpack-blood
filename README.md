> 为什么写这篇文章，因为我简历上写了构建了一个公司的脚手架。然后去厦门xxx网络公司面试，被问webpack打包原理的时候一脸懵逼，当时又没吃早餐，可恶的连 debounce 都答不出来。
很多技术，我都只会用，实际上我确实对很多技术感兴趣，但是经常只在外面蹭蹭，我会React，vue，Electron，React Navite，但是一旦问到原理，概念等，就会出现一脸懵逼的情况，因此，接下来这里会有很多对原理问题的学习，并且搭载学习过程中的扩展。

[参考文章](https://juejin.cn/post/6844904038543130637)

- webpack 是一个现代 JavaScript 应用程序的静态 **模块打包器（module bundler）**，处理程序时会递归地构建**依赖关系图（dependency graph）**，然后将所有模块都打包成一个或多个bundle。
- webpack 就像一条生产线，每个 **plugin**，就是生产线的一个功能。
- webpack 通过 **Tapable** 来组织生产线。插件只需要监听它所关心的事件。  Tapable是一个发布订阅模式，提供一系列的钩子函数

### webpack 的核心概念
#### entry 
起点文件
#### output
输出文件，默认为 dist

### module
在webpack中一切皆模块，`webpack` 会从 `entry` 中开始递归找出所有的依赖模块

### chunk
代码块，一个chunk由多个模块组合而成，用于代码合并和分割

### loader
将非 js 的文件，转换为 webpack能够处理的**有效模块**，生成依赖关系图可以直接引用的模块

### plugin
功能相对loader更加广，从打包，压缩，定义环境变量等，可以处理各种各样的任务

### 构建流程
1. 初始化参数，从配置文件和 Shell 语句中读取与合并参数，得出最终的参数
2. 开始编译：用上一步得到的参数初始化 **Compiler** 对象，加载所有配置的插件，执行对象的 run 方法开始编译
3. 确定入口，根据entry找出所有的入口文件
4. 编译模块：从入口entry触发，调用所有配置的loader对模块进行编译，再找出模块依赖的模块。直到递归所有文件，生成依赖关系
5. 输出资源： 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的chunk，再把每个chunk转换成一个单独的文件到输出列表，这步是改变输出内容的最后机会
6. 输出完成，写入文件，生成dist

### 加深理解请看 simple-webpack 
[webpack 示例代码](https://github.com/mrandpz/webpack-blood/tree/main/simple-webpack)
### 我们直接写出来的是 module，webpack 处理时是 chunk（多个module生成），最后生成浏览器可以直接运行的 bundle。

### 创建一个脚手架
#### 工具
命令行：commander
#### 如何调试
需要开发的cli脚手架执行 npm link
npm link用来在本地项目和本地npm模块之间建立连接，可以在本地进行模块测试

> npm link 容易受到nvm的干扰，所以我自己用的是yarn link
**具体用法**：
1. 项目和模块在同一个目录下，可以使用相对路径
npm link ../module
2. 项目和模块不在同一个目录下
cd到模块目录，npm link，进行全局link
cd到项目目录，npm link 模块名(package.json中的name)
3. 解除link
解除项目和模块link，项目目录下，npm unlink 模块名
解除模块全局link，模块目录下，npm unlink 模块名
# TODO
- [ ] webpack 脚手架
- [ ] webpack 插件
- [ ] webpack loader




