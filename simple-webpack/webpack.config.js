/*
 * @Author: Mr.pz
 * @Date: 2021-01-25 15:57:58
 * @Last Modified by: Mr.pz
 * @Last Modified time: 2021-01-25 16:04:39
 * webpack 配置
 */
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "main.js",
  },
};
