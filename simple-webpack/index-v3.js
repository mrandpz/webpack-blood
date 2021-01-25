/*
 * @Author: Mr.pz
 * @Date: 2021-01-25 15:56:06
 * @Last Modified by: Mr.pz
 * @Last Modified time: 2021-01-25 17:13:01
 * index 文件接下去
 * 递归解析所有依赖项，生成依赖关系图
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
    // 解析入口文件
    const info = this.build(this.entry);
    this.modules.push(info);
    this.modules.forEach(({ dependecies }) => {
      // 判断有依赖对象，递归解析所有依赖项
      if (dependecies) {
        for (const dependency in dependecies) {
          this.modules.push(this.build(dependecies[dependency]));
        }
      }
    });
    // 生成关系依赖图
    const dependencyGraph = this.modules.reduce((graph, item) => ({
      ...graph,
      // 使用文件路径作为每个模块的唯一标识符
      [item.filename]: {
        dependecies: item.dependecies,
        code: item.code,
      },
    }));
    this.generate(dependencyGraph);
  }
  build(filename) {
    const { getAst, getDependecies, getCode } = Parser;
    const ast = getAst(this.entry);
    // console.log(ast); // 自行打印查看
    const dependecies = getDependecies(ast, this.entry);
    // console.log(dependecies); // { lodash: './src\\lodash' }
    const code = getCode(ast);
    return {
      // 文件路径,可以作为每个模块的唯一标识符
      filename,
      // 依赖对象,保存着依赖模块路径
      dependecies,
      // 文件内容
      code,
    };
  }
  // 重写require 函数，输出bundle
  generate() {
    // 输出文件路径
    const filePath = path.join(this.output.path, this.output.filename);
    const bundle = `(function(graph){      
      function require(module){        
        function localRequire(relativePath){         
           return require(graph[module].dependecies[relativePath])}        
          var exports = {};        
          (function(require,exports,code){          
            eval(code)       
          })(localRequire,exports,graph[module].code);
                  return exports;
              }      
        require('${this.entry}')})(${JSON.stringify(code)})`;
    fs.writeFileSync(filePath, bundle, "utf-8");
  }
}

new Compiler(options).run();
