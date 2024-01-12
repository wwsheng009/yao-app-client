import path from "node:path";
import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import alias from "@rollup/plugin-alias";
import json from "@rollup/plugin-json";
import nodePolyfills from "rollup-plugin-polyfill-node";

const __dirname = path.resolve();

// 命令行定义环境变量，在脚本中可以直接获取
// console.log(process.env.TEST);
const libraryName = "core";

import pkg from "./package.json" assert { type: "json" };

export default {
  input: "./src/index.ts",
  output: [
    {
      file: pkg.main,
      sourcemap: true,
      name: libraryName,
      format: "umd",
    },
    {
      file: pkg.module,
      sourcemap: true,
      format: "es",
    },
  ],
  watch: {
    include: "src/**",
  },
  external: ["path"],
  plugins: [
    nodeResolve({ preferBuiltins: true }),
    json(),
    //路径别名
    alias({
      entries: [
        {
          find: "@",
          replacement: path.resolve(__dirname, "src"),
        },
      ],
    }),
    nodePolyfills(/* options */),
    // typescript({ module: "commonjs" }),
    typescript(),
    commonjs(),
    // commonjs({ include: "node_modules/**" }),
  ],
  external: [],
};
