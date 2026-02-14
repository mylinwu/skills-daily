#!/usr/bin/env node
// 抓取 CDN 数据源到 temp 目录
// 用法: node src/fetch-data.mjs
// 输出: 下载的文件路径

import { mkdirSync, statSync } from 'fs';
import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TODAY = new Date().toISOString().slice(0, 10);
const TEMP_DIR = resolve(ROOT, 'temp');
const CDN_URL = 'https://cdn.jsdelivr.net/gh/NeverSight/skills.sh_feed@main/data/skills.json';
const CDN_FILE = resolve(TEMP_DIR, `cdn_skills_${TODAY}.json`);

mkdirSync(TEMP_DIR, { recursive: true });

try {
  execSync(`curl -s -L --connect-timeout 30 --max-time 60 "${CDN_URL}" -o "${CDN_FILE}"`, { stdio: 'pipe' });
  const { size } = statSync(CDN_FILE);
  if (size < 100) throw new Error('数据为空');
  console.log(CDN_FILE);
} catch (e) {
  console.error(`抓取失败: ${e.message}`);
  process.exit(1);
}
