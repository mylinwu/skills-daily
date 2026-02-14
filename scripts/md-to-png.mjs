#!/usr/bin/env node

/**
 * 将指定路径的 Markdown 文件转换为 GitHub 风格的 PNG 图片（宽度 500）
 *
 * 用法: node src/md-to-png.mjs <md_file_path> [css_file_path]
 *
 * 依赖: mdimg (通过 npx 或全局安装)
 */

import { execSync } from "child_process";
import path from "path";

const inputPath = process.argv[2];
const cssPath = process.argv[3];

if (!inputPath) {
  console.error("用法: node src/md-to-png.mjs <md_file_path> [css_file_path]");
  process.exit(1);
}

const absoluteInput = path.resolve(inputPath);
const dir = path.dirname(absoluteInput);
const baseName = path.basename(absoluteInput, path.extname(absoluteInput));
const outputPath = path.join(dir, `${baseName}.png`);

try {
  // 构建 npx mdimg 命令
  let command = `npx mdimg --input "${absoluteInput}" --output "${outputPath}" --width 500`;
  
  // 如果提供了自定义 CSS 文件，添加 --css 参数
  if (cssPath) {
    command += ` --css "${path.resolve(cssPath)}"`;
  } else {
    command += ` --css "${path.resolve('./markdown.css')}"`;
  }

  // 执行命令
  execSync(command, { stdio: "inherit" });
  
  console.log(`转换成功: ${outputPath}`);
} catch (err) {
  console.error("转换失败");
  process.exit(1);
}
