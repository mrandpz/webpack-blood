/*
 * @Author: Mr.pz
 * @Date: 2021-01-25 15:56:06
 * @Last Modified by: Mr.pz
 * @Last Modified time: 2021-01-25 16:55:29
 * 定义compiler 类
 * 解析入口文件，获取AST  -> @babel/parser
 * 找出所有依赖模块 -> @babel/traverse
 * 将AST 转换成浏览器可执行代码 -> @babel/core @babel/preset-env
 */
const fs = require("fs");
// 借助@babel/parser 生成 AST 抽象语法书
const parser = require("@babel/parser");
const options = require("./webpack.config");
// 遍历抽象语法树，找出依赖模块
const traverse = require("@babel/traverse").default;
// 把抽象语法树转换为代码可执行的code
const { transformFromAst } = require("@babel/core");

const path = require("path");

const Parser = {
  // 解析获得抽象语法树
  getAst: (path) => {
    // 读取入口文件
    const content = fs.readFileSync(path, "utf-8");
    // 将文件内容转为AST抽象语法树
    return parser.parse(content, { sourceType: "module" });
  },
  getDependecies: (ast, filename) => {
    const dependecies = {};
    traverse(ast, {
      // import 语句
      ImportDeclaration({ node }) {
        const dirname = path.dirname(filename);
        // 保存依赖模块路径，之后生成依赖关系图要用到
        // console.log(node); // 遍历语法树的node节点，
        const filepath = "./" + path.join(dirname, node.source.value);
        dependecies[node.source.value] = filepath;
      },
    });
    // console.log(dependecies);
    return dependecies;
  },
  getCode: (ast) => {
    // AST 转换为code
    const { code } = transformFromAst(ast, null, {
      presets: ["@babel/preset-env"],
    });
    return code;
  },
};

class Compiler {
  constructor(options) {
    // webpack 配置
    const { entry, output } = options;
    // 入口
    this.entry = entry;
    // 出口
    this.output = output;
    // 模块
    this.modules = [];
  }

  // 构建启动
  run() {
    const { getAst, getDependecies, getCode } = Parser;
    const ast = getAst(this.entry);
    // console.log(ast); // 自行打印查看
    const dependecies = getDependecies(ast, this.entry);
    // console.log(dependecies); // { lodash: './src\\lodash' }
    const code = getCode(ast);
    console.log(code);
    // "use strict";

    // var _lodash = _interopRequireDefault(require("lodash"));

    // function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

    // function test() {
    //   // this is a test entry
    //   console.log("这是一个测试打印");
    //   return "这是一个测试入口";
    // }
  }
  // 重写require 函数，输出bundle
  generate() {}
}

new Compiler(options).run();
