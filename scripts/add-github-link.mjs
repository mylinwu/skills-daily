#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// 获取命令行参数
const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('用法: node add-github-link.mjs <markdown_file_path>');
  process.exit(1);
}

const filePath = args[0];
const fileName = path.basename(filePath);

// GitHub 仓库基础 URL
const githubBaseUrl = 'https://github.com/mylinwu/skills-daily/tree/main/outputs';

try {
  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    console.error(`错误: 文件 ${filePath} 不存在`);
    process.exit(1);
  }

  // 读取文件内容
  let content = fs.readFileSync(filePath, 'utf8');

  // 检查是否已经包含 GitHub 链接
  const githubLinkPattern = /\n---\n\n\*\*📄 文档地址\*\*:/;
  if (githubLinkPattern.test(content)) {
    console.log(`文件 ${fileName} 已经包含 GitHub 链接，跳过处理`);
    process.exit(0);
  }

  // 在文件末尾添加 GitHub 链接
  const githubUrl = `${githubBaseUrl}/${fileName}`;
  const footer = `

---

文档地址: ${githubUrl}`;

  content += footer;

  // 写回文件
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ 已为 ${fileName} 添加 GitHub 链接: ${githubUrl}`);

} catch (error) {
  console.error(`处理文件时出错: ${error.message}`);
  process.exit(1);
}
