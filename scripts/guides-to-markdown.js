// Renders src/content/monthly-guides.json as a readable Markdown file for reviewers.
// Usage: npm run content:guides-doc
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const data = JSON.parse(
  fs.readFileSync(path.join(root, 'src/content/monthly-guides.json'), 'utf8'),
);
const sources = Object.fromEntries(data.sources.map((s) => [s.id, s]));

const lines = [
  '# Monthly guides: review copy',
  '',
  '> Generated from `src/content/monthly-guides.json`. Edit the JSON file, not this one.',
  `> Drafted from official sources read on ${data.accessed}. Every section still needs expert review.`,
  '',
];

for (const g of data.guides) {
  lines.push(`## ${g.title} (${g.ageLabel})`, '', `_${g.intro}_`, '');
  for (const s of g.sections) {
    lines.push(`### ${s.title}`, '', `Reviewer: **${s.reviewer}**`, '');
    for (const p of s.paragraphs) lines.push(p, '');
    for (const b of s.bullets) lines.push(`- ${b}`);
    if (s.bullets.length) lines.push('');
    if (s.note) lines.push(`> **Where guidance differs:** ${s.note}`, '');
    lines.push(
      'Sources: ' +
        s.sources
          .map((id) => `[${sources[id].publisher}: ${sources[id].title}](${sources[id].url})`)
          .join(' · '),
      '',
    );
  }
}

fs.writeFileSync(path.join(root, 'docs/monthly-guides-review.md'), lines.join('\n'));
console.log('Wrote docs/monthly-guides-review.md');
