#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const outputsDir = 'outputs';

try {
  // 检查 outputs 目录是否存在
  if (!fs.existsSync(outputsDir)) {
    console.error(`错误: ${outputsDir} 目录不存在`);
    process.exit(1);
  }

  // 获取所有 .md 文件
  const files = fs.readdirSync(outputsDir)
    .filter(file => file.endsWith('.md'))
    .sort();

  if (files.length === 0) {
    console.log('没有找到任何 .md 文件');
    process.exit(0);
  }

  console.log(`找到 ${files.length} 个报告文件，开始添加 GitHub 链接...\n`);

  // 处理每个文件
  for (const file of files) {
    const filePath = path.join(outputsDir, file);
    
    try {
      // 使用 add-github-link.mjs 处理文件
      execSync(`node src/add-github-link.mjs "${filePath}"`, { 
        stdio: 'inherit',
        cwd: process.cwd()
      });
    } catch (error) {
      console.error(`处理 ${file} 时出错: ${error.message}`);
    }
  }

  console.log('\n✅ 所有报告文件处理完成！');

} catch (error) {
  console.error(`批量处理失败: ${error.message}`);
  process.exit(1);
}
