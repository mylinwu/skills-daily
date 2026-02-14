#!/usr/bin/env node
// 从 CDN 数据中筛选第一个未分析的 trending 技能
// 用法: node src/select-skill.mjs <cdn_json_path> <history_json_path>
// 输出: JSON 格式的选中技能信息，如果没有可选技能则输出 {"error": "..."}

import { readFileSync } from 'fs';

const cdnPath = process.argv[2];
const historyPath = process.argv[3];

if (!cdnPath || !historyPath) {
  console.error('用法: node src/select-skill.mjs <cdn_json_path> <history_json_path>');
  process.exit(1);
}

try {
  const cdnData = JSON.parse(readFileSync(cdnPath, 'utf-8'));
  const history = JSON.parse(readFileSync(historyPath, 'utf-8'));

  const analyzedSkillNames = new Set(history.map(h => h.skill_name));
  const trending = cdnData.trending || cdnData.topTrending || [];

  const selected = trending.find(skill => {
    const skillName = skill.name || skill.skillId;
    return !analyzedSkillNames.has(skillName);
  });

  if (!selected) {
    console.log(JSON.stringify({ error: '所有 trending 技能均已分析过' }));
    process.exit(0);
  }

  const id = `${selected.source}/${selected.skillId}`;
  console.log(JSON.stringify({
    id: id,
    title: selected.name || selected.skillId,
    link: `https://skills.sh/${id}`,
    installs: selected.installs
  }));
} catch (e) {
  console.error('解析失败:', e.message);
  process.exit(1);
}
