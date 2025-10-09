const fs = require('fs');
const path = require('path');

const BASE_DIR = __dirname;
const TEMPLATES_DIR = path.join(BASE_DIR, 'templates');

function isDirectory(p) {
  try { return fs.statSync(p).isDirectory(); } catch { return false; }
}
function isFile(p) {
  try { return fs.statSync(p).isFile(); } catch { return false; }
}
function listFilesRecursive(dir, filterExts = []) {
  const res = [];
  if (!isDirectory(dir)) return res;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      res.push(...listFilesRecursive(full, filterExts));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (filterExts.length === 0 || filterExts.includes(ext)) {
        res.push(full);
      }
    }
  }
  return res;
}
function listRootHtmlFiles() {
  const entries = fs.readdirSync(BASE_DIR, { withFileTypes: true });
  const res = [];
  for (const entry of entries) {
    if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
      res.push(path.join(BASE_DIR, entry.name));
    }
  }
  return res;
}
function readFileUtf8(filePath) { return fs.readFileSync(filePath, 'utf8'); }
function writeFileUtf8(filePath, content) { fs.writeFileSync(filePath, content, 'utf8'); }

function buildVersionString() {
  const now = new Date();
  const Y = now.getFullYear();
  const M = (now.getMonth() + 1).toString().padStart(2, '0');
  const D = now.getDate().toString().padStart(2, '0');
  const h = now.getHours(); // intentionally not padded per example
  const m = now.getMinutes().toString().padStart(2, '0');
  const s = now.getSeconds().toString().padStart(2, '0');
  return `${Y}.${M}.${D}.${h}.${m}.${s}`;
}

function isExternalUrl(u) {
  return /^(?:https?:)?\/\//i.test(u);
}
function isCssUrl(u) {
  const noHash = u.split('#')[0];
  const noQuery = noHash.split('?')[0];
  return /\.css(?:\b|$)/i.test(noQuery);
}
function isJsUrl(u) {
  const noHash = u.split('#')[0];
  const noQuery = noHash.split('?')[0];
  return /\.js(?:\b|$)/i.test(noQuery);
}

function addOrUpdateVParam(u, version) {
  const hashIdx = u.indexOf('#');
  let base = u;
  let hash = '';
  if (hashIdx >= 0) {
    base = u.slice(0, hashIdx);
    hash = u.slice(hashIdx);
  }
  const qIdx = base.indexOf('?');
  let pathOnly = base;
  let query = '';
  if (qIdx >= 0) {
    pathOnly = base.slice(0, qIdx);
    query = base.slice(qIdx + 1);
  }
  if (query) {
    if (/(^|&)v=/.test(query)) {
      query = query.replace(/(^|&)v=[^&]*/i, (full, sep) => `${sep}v=${version}`);
    } else {
      query = `${query}&v=${version}`;
    }
    base = `${pathOnly}?${query}`;
  } else {
    base = `${pathOnly}?v=${version}`;
  }
  return base + hash;
}

const LINK_HREF_REGEX = /(<link\b[^>]*\bhref\s*=\s*)("([^"]*)"|'([^']*)')/gi;
const SCRIPT_SRC_REGEX = /(<script\b[^>]*\bsrc\s*=\s*)("([^"]*)"|'([^']*)')/gi;

function processHtml(content, version) {
  let changed = false;
  // Update link href for CSS
  content = content.replace(LINK_HREF_REGEX, (full, prefix, quoted, dbl, sgl) => {
    const url = dbl !== undefined ? dbl : sgl !== undefined ? sgl : '';
    if (!url || isExternalUrl(url) || !isCssUrl(url)) return full;
    const updated = addOrUpdateVParam(url, version);
    if (updated !== url) changed = true;
    const quote = dbl !== undefined ? '"' : "'";
    return prefix + quote + updated + quote;
  });
  // Update script src for JS
  content = content.replace(SCRIPT_SRC_REGEX, (full, prefix, quoted, dbl, sgl) => {
    const url = dbl !== undefined ? dbl : sgl !== undefined ? sgl : '';
    if (!url || isExternalUrl(url) || !isJsUrl(url)) return full;
    const updated = addOrUpdateVParam(url, version);
    if (updated !== url) changed = true;
    const quote = dbl !== undefined ? '"' : "'";
    return prefix + quote + updated + quote;
  });
  return { content, changed };
}

function main() {
  const version = buildVersionString();
  const targets = [
    ...listRootHtmlFiles(),
    ...listFilesRecursive(TEMPLATES_DIR, ['.html']),
  ].filter(isFile);

  if (targets.length === 0) {
    console.log('No HTML files found to update.');
    return;
  }

  let updatedCount = 0;
  for (const f of targets) {
    const original = readFileUtf8(f);
    const { content, changed } = processHtml(original, version);
    if (changed) {
      writeFileUtf8(f, content);
      updatedCount++;
      console.log(`Updated: ${path.relative(BASE_DIR, f)}`);
    }
  }
  console.log(`Done. Version applied: v=${version}. Updated files: ${updatedCount}`);
}

if (require.main === module) {
  try { main(); } catch (e) { console.error('Error:', e); process.exit(1); }
}