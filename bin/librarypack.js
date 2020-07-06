#! /usr/bin/env node
const path = require("path");
const process = require("process");
const fs = require("fs");
const shell = require("shelljs");

const build = async function () {
  const cwd = process.cwd();
  const cd = path.resolve(__dirname, "..");

  /**
   * Read package.json
   */

  const packageJsonURL = path.resolve(cwd, "package.json");

  const packageJsonContent = fs.readFileSync(packageJsonURL, {
    encoding: "utf8",
  });

  const config = JSON.parse(packageJsonContent);

  if (!config.source) {
    return false;
  }

  /**
   * Create ENV file
   */

  let env = `INPUT_SOURCE="${path.resolve(cwd, config.source)}"\n`;
  env += `OUTPUT_CJS="${path.resolve(cwd, config.main)}"\n`;
  env += `OUTPUT_ESM="${path.resolve(cwd, config.module)}"\n`;
  env += `OUTPUT_UMD="${path.resolve(cwd, config.unpkg)}"\n`;

  const envURL = path.resolve(cd, ".env");

  fs.writeFileSync(envURL, env);

  /**
   * Run Bundler: Rollup
   */
  const rollup = path.resolve(cd, "node_modules/rollup/dist/bin/rollup");
  const rollupConfig = path.resolve(cd, "rollup.config.js");

  shell.exec(`node ${rollup} -c ${rollupConfig}`);
};

build();
