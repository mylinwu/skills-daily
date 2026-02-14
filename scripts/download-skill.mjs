#!/usr/bin/env node
// 下载指定技能到 temp 目录
// 用法: node src/download-skill.mjs <skill_id>
// 示例: node src/download-skill.mjs vercel-labs/skills/find-skills
// 输出: 技能文件在 temp 目录下的路径

import { existsSync, mkdirSync, cpSync, rmSync, renameSync } from 'fs';
import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TEMP_DIR = resolve(ROOT, 'temp');
// 定义项目内的 .agents 目录作为临时下载点
const LOCAL_AGENTS_DIR = resolve(ROOT, '.agents');
const LOCAL_SKILLS_DIR = resolve(LOCAL_AGENTS_DIR, 'skills');

const skillId = process.argv[2];
if (!skillId) {
  console.error('用法: node src/download-skill.mjs <skill_id>');
  process.exit(1);
}

// 从 id 中解析 source 和 skillName
// 输入格式: owner/repo/skillName (如 vercel-labs/agent-skills/vercel-react-best-practices)
const parts = skillId.split('/');
if (parts.length < 3) {
  console.error('skill_id 格式应为 owner/repo/skillName');
  process.exit(1);
}
const source = parts.slice(0, 2).join('/');
const skillName = parts.slice(2).join('/');
const skillLocalDir = resolve(TEMP_DIR, skillName);

// 确保 temp 目录存在
mkdirSync(TEMP_DIR, { recursive: true });

// 下载位置：项目下的 .agents/skills/skillName
const downloadSkillDir = resolve(LOCAL_SKILLS_DIR, skillName);

// npx skills add 的格式为 source@skillName
const addArg = `${source}@${skillName}`;
try {
  // 移除 --global 参数，下载到当前项目
  execSync(`npx skills add ${addArg} --agent opencode -y`, {
    stdio: ['pipe', 'pipe', 'pipe'],
    timeout: 180_000,
    cwd: ROOT, // 确保在项目根目录执行
  });
} catch (e) {
  const stderr = e.stderr ? e.stderr.toString() : '';
  const stdout = e.stdout ? e.stdout.toString() : '';
  console.error(`下载失败: ${e.message}`);
  if (stderr) console.error(`stderr: ${stderr}`);
  if (stdout) console.error(`stdout: ${stdout}`);
  process.exit(1);
}

// 从下载目录移动到 temp
if (existsSync(downloadSkillDir)) {
  // 先清理目标目录（如果存在）
  if (existsSync(skillLocalDir)) {
    rmSync(skillLocalDir, { recursive: true, force: true });
  }
  
  // 移动文件
  try {
    renameSync(downloadSkillDir, skillLocalDir);
  } catch (err) {
    // 如果跨设备移动失败，回退到复制+删除
    cpSync(downloadSkillDir, skillLocalDir, { recursive: true });
    rmSync(downloadSkillDir, { recursive: true, force: true });
  }

  console.log(skillLocalDir);
  
  // 尝试清理空的 .agents 目录（可选，避免残留）
  try {
    const { rmdirSync } = await import('fs');
    // 尝试删除 .agents/skills (如果为空)
    rmdirSync(LOCAL_SKILLS_DIR);
    // 尝试删除 .agents (如果为空)
    rmdirSync(LOCAL_AGENTS_DIR);
  } catch (e) {
    // 忽略清理错误（目录非空或不存在）
  }
} else {
  console.error(`下载目录未找到: ${downloadSkillDir}`);
  process.exit(1);
}
