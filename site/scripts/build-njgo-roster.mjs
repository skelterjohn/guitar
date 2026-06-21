import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sourcePath = process.argv[2];
const outputPath = join(__dirname, '../src/data/njgo-roster.yaml');

if (!sourcePath) {
  console.error('Usage: node build-njgo-roster.mjs <source-markdown.txt>');
  process.exit(1);
}

const source = readFileSync(sourcePath, 'utf8');
const lines = source.split(/\r?\n/);

const skipNames = new Set(['New Jersey Guitar Orchestra']);
const members = [];
let inRoster = false;
let current = null;
let paragraph = [];

function isUrlLine(line) {
  const trimmed = line.trim();
  return (
    /^https?:\/\//i.test(trimmed)
    || /^www\./i.test(trimmed)
    || /^[a-z0-9.-]+\.(com|org|net|me)\/?$/i.test(trimmed)
    || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
    || /^@[\w_]+$/.test(trimmed)
  );
}

function isNonBioLine(line) {
  const trimmed = line.trim();
  return (
    !trimmed
    || trimmed.startsWith('Visit ')
    || trimmed.startsWith('Article:')
    || trimmed === 'For more information, visit'
  );
}

function cleanParagraph(text) {
  return text
    .replace(/^Description goes here/, '')
    .replace(/\s+https?:\/\/\S+$/i, '')
    .replace(/\s+For more information, visit\s*$/i, '')
    .trim();
}

function flushParagraph() {
  if (!current || !paragraph.length) return;
  const text = cleanParagraph(paragraph.join(' ').replace(/\s+/g, ' '));
  if (text) current.paragraphs.push(text);
  paragraph = [];
}

function flushMember() {
  flushParagraph();
  if (current) members.push(current);
  current = null;
}

for (const line of lines) {
  if (line.trim() === 'Meet the NJGO Performers') {
    inRoster = true;
    continue;
  }
  if (!inRoster) continue;

  const heading = line.match(/^##\s+(.+)$/);
  if (heading) {
    flushMember();
    const name = heading[1].trim();
    if (!skipNames.has(name)) {
      current = { name, paragraphs: [] };
    }
    continue;
  }

  if (!current) continue;

  if (!line.trim()) {
    flushParagraph();
    continue;
  }

  if (isNonBioLine(line) || isUrlLine(line)) {
    flushParagraph();
    continue;
  }

  paragraph.push(line.trim());
}

flushMember();

function yamlQuote(value) {
  return JSON.stringify(value);
}

function formatBio(paragraphs) {
  if (paragraphs.length === 1) {
    return `    bio: ${yamlQuote(paragraphs[0])}`;
  }
  const body = paragraphs.join('\n\n');
  const indented = body
    .split('\n')
    .map((line) => (line ? `      ${line}` : ''))
    .join('\n');
  return `    bio: |-\n${indented}`;
}

const yaml = [
  '# Roster sourced from https://jaysonmartinez.org/njgo',
  'members:',
  ...members.flatMap((member) => [
    `  - name: ${yamlQuote(member.name)}`,
    formatBio(member.paragraphs),
    '',
  ]),
].join('\n').trimEnd() + '\n';

writeFileSync(outputPath, yaml, 'utf8');
console.log(`Wrote ${members.length} members to ${outputPath}`);
