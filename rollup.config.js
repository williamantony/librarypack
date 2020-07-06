import path from "path";
import dotenv from "dotenv";
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import image from "@rollup/plugin-image";
import scss from "rollup-plugin-scss";
import { terser } from "rollup-plugin-terser";

dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

const { INPUT_SOURCE, OUTPUT_CJS, OUTPUT_UMD, OUTPUT_ESM } = process.env;

const commons = {
  output: {
    name: "Bundle",
    sourcemap: true,
    globals: {
      react: "React",
      "react-dom": "ReactDOM",
    },
  },
};

/**
 * Output
 */

const output = [];

if (OUTPUT_CJS) {
  output.push({
    ...commons.output,
    file: path.resolve("build", "bundle.js"),
    format: "cjs",
  });
}

if (OUTPUT_UMD) {
  output.push({
    ...commons.output,
    file: path.resolve("build", "bundle.umd.js"),
    format: "umd",
  });
}

if (OUTPUT_ESM) {
  output.push({
    ...commons.output,
    file: path.resolve("build", "bundle.module.js"),
    format: "esm",
  });
}

/**
 * Export
 */

export default {
  input: INPUT_SOURCE,

  output,

  plugins: [
    resolve(),
    babel({
      exclude: "node_modules/**",
      babelHelpers: "runtime",
      presets: ["@babel/preset-react", "@babel/preset-env"],
      plugins: [
        "@babel/plugin-transform-runtime",
        "@babel/plugin-proposal-class-properties",
      ],
    }),
    commonjs(),
    replace({
      "process.env.NODE_ENV": JSON.stringify("development"),
    }),
    terser(),
    scss(),
    image(),
  ],

  external: ["react", "react-dom"],
};
