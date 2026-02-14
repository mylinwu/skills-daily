#!/usr/bin/env node
// 统一管理 history.json：支持查找与新增
// 用法:
//   node src/history-manager.mjs find <history_json_path> <skill_name_or_id>
//   node src/history-manager.mjs add <history_json_path> <skill_id> <analysis_date> <source_url> <report_path>

import { readFileSync, writeFileSync } from 'fs';

function usage() {
  console.error('用法:');
  console.error('  node src/history-manager.mjs find <history_json_path> <skill_name_or_id>');
  console.error('  node src/history-manager.mjs add <history_json_path> <skill_id> <analysis_date> <source_url> <report_path>');
}

function parseHistory(historyPath) {
  return JSON.parse(readFileSync(historyPath, 'utf-8'));
}

const command = process.argv[2];
const historyPath = process.argv[3];

if (!command || !historyPath) {
  usage();
  process.exit(1);
}

try {
  const history = parseHistory(historyPath);

  if (!Array.isArray(history)) {
    throw new Error('history 文件格式错误：根节点必须是数组');
  }

  if (command === 'find') {
    const query = (process.argv[4] || '').trim();

    if (!query) {
      usage();
      process.exit(1);
    }

    const q = query.toLowerCase();
    const items = history.filter(item => {
      const skillName = String(item.skill_name || '').toLowerCase();
      const skillId = String(item.skill_id || '').toLowerCase();
      return skillName === q || skillId === q || skillId.endsWith(`/${q}`);
    });

    if (items.length === 0) {
      console.log(JSON.stringify({ found: false, query }));
      process.exit(0);
    }

    const latest = items[items.length - 1];
    console.log(JSON.stringify({
      found: true,
      query,
      report_path: latest.report_path,
      source_url: latest.source_url,
      analysis_date: latest.analysis_date,
      skill_id: latest.skill_id,
      skill_name: latest.skill_name
    }));
    process.exit(0);
  }

  if (command === 'add') {
    const skillId = process.argv[4];
    const analysisDate = process.argv[5];
    const sourceUrl = process.argv[6];
    const reportPath = process.argv[7];

    if (!skillId || !analysisDate || !sourceUrl || !reportPath) {
      usage();
      process.exit(1);
    }

    const skillName = sourceUrl.split('/').slice(-1)[0] || skillId.split('/').slice(-1)[0];

    const exists = history.some(item => item.skill_id === skillId || item.skill_name === skillName);
    if (exists) {
      console.log(`技能 "${skillName}" 已存在于历史记录中，跳过`);
      process.exit(0);
    }

    history.push({
      skill_id: skillId,
      skill_name: skillName,
      analysis_date: analysisDate,
      source_url: sourceUrl,
      report_path: reportPath
    });

    writeFileSync(historyPath, JSON.stringify(history, null, 2) + '\n', 'utf-8');
    console.log(`已添加技能 "${skillId}" 到历史记录`);
    process.exit(0);
  }

  usage();
  process.exit(1);
} catch (error) {
  console.error('history 管理失败:', error.message);
  process.exit(1);
}
