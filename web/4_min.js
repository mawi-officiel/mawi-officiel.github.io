const fs = require('fs');
const path = require('path');

const BASE_DIR = __dirname;
const TEMPLATES_DIR = path.join(BASE_DIR, 'templates');
const ASSETS_JS_DIR = path.join(BASE_DIR, 'assets', 'js');
const ASSETS_CSS_DIR = path.join(BASE_DIR, 'assets', 'css');

// The exact header content as requested
const headerComment = [
  '/**',
  ' * Copyright by Developer Ayoub Alarjani',
  ' * Official Website: www.mawiman.com',
  ' * © 2025 by MawiMan',
  ' */',
  ''
].join('\n');

function isDirectory(p) { try { return fs.statSync(p).isDirectory(); } catch { return false; } }
function isFile(p) { try { return fs.statSync(p).isFile(); } catch { return false; } }
function readFileUtf8(filePath) { return fs.readFileSync(filePath, 'utf8'); }
function writeFileUtf8(filePath, content) { fs.writeFileSync(filePath, content, 'utf8'); }

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

function listFilesInDir(dir, filterExts = []) {
  const res = [];
  if (!isDirectory(dir)) return res;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (filterExts.length === 0 || filterExts.includes(ext)) {
        res.push(path.join(dir, entry.name));
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

// ---------------- HTML processing ----------------
function stripHtmlComments(html) {
  // Remove <!-- ... --> comments (non-greedy across lines)
  return html.replace(/<!--([\s\S]*?)-->/g, '');
}
function minifyHtml(html) {
  let out = stripHtmlComments(html);
  // Remove whitespace between tags >   < -> ><
  out = out.replace(/>\s+</g, '><');
  // Trim each line and collapse multiple blank lines
  out = out.split(/\r?\n/).map((l) => l.trim()).filter((l, i, a) => !(l === '' && a[i - 1] === '')).join('\n');
  return out;
}

// ---------------- CSS processing ----------------
function stripCssComments(css) {
  // Remove /* ... */ comments safely
  let out = '';
  let i = 0;
  let inBlock = false;
  while (i < css.length) {
    const ch = css[i];
    const next = css[i + 1];
    if (!inBlock && ch === '/' && next === '*') {
      inBlock = true;
      i += 2;
      continue;
    }
    if (inBlock) {
      if (ch === '*' && next === '/') {
        inBlock = false;
        i += 2;
        continue;
      }
      i++;
      continue;
    }
    out += ch;
    i++;
  }
  return out;
}
function minifyCss(css) {
  let out = stripCssComments(css);
  // Remove newlines and excessive spaces
  out = out.replace(/\r?\n/g, ' ');
  out = out.replace(/\s{2,}/g, ' ');
  // Remove spaces around punctuation
  out = out.replace(/\s*{\s*/g, '{');
  out = out.replace(/\s*}\s*/g, '}');
  out = out.replace(/\s*;\s*/g, ';');
  out = out.replace(/\s*:\s*/g, ':');
  out = out.replace(/\s*,\s*/g, ',');
  out = out.replace(/\s*>\s*/g, '>');
  out = out.trim();
  return out;
}

// ---------------- JS processing ----------------
function stripJsComments(js) {
  let out = '';
  let i = 0;
  let inLine = false;
  let inBlock = false;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let escape = false;

  while (i < js.length) {
    const ch = js[i];
    const next = js[i + 1];

    if (inLine) {
      if (ch === '\n') {
        inLine = false;
        out += ch; // keep newline
      }
      i++;
      continue;
    }

    if (inBlock) {
      if (ch === '*' && next === '/') {
        inBlock = false;
        i += 2;
        continue;
      }
      i++;
      continue;
    }

    if (inSingle) {
      out += ch;
      if (!escape && ch === "'") inSingle = false;
      escape = ch === '\\' && !escape;
      i++;
      continue;
    }
    if (inDouble) {
      out += ch;
      if (!escape && ch === '"') inDouble = false;
      escape = ch === '\\' && !escape;
      i++;
      continue;
    }
    if (inTemplate) {
      out += ch;
      if (!escape && ch === '`') inTemplate = false;
      escape = ch === '\\' && !escape;
      i++;
      continue;
    }

    // Not in string/comment
    if (ch === "'") { inSingle = true; out += ch; i++; escape = false; continue; }
    if (ch === '"') { inDouble = true; out += ch; i++; escape = false; continue; }
    if (ch === '`') { inTemplate = true; out += ch; i++; escape = false; continue; }

    if (ch === '/' && next === '/') { // line comment
      inLine = true;
      i += 2;
      continue;
    }
    if (ch === '/' && next === '*') { // block comment
      inBlock = true;
      i += 2;
      continue;
    }

    out += ch;
    i++;
  }
  return out;
}
function minifyJs(js) {
  // Remove comments only (conservative), then trim excessive whitespace
  let out = stripJsComments(js);
  out = out.replace(/\r?\n/g, '\n');
  // Collapse multiple blank lines
  out = out.split(/\n/).map((l) => l.trimEnd()).filter((l, i, a) => !(l.trim() === '' && a[i - 1] && a[i - 1].trim() === '')).join('\n');
  // Optional: remove spaces around some punctuation (safe-ish)
  out = out.replace(/\s*([=+\-*/%<>!?:;,{}()[\]])\s*/g, '$1');
  return out.trim();
}

function processHtmlFile(filePath) {
  const original = readFileUtf8(filePath);
  const minified = minifyHtml(original);
  if (minified !== original) {
    writeFileUtf8(filePath, minified);
    return true;
  }
  return false;
}
function processCssFile(filePath) {
  const original = readFileUtf8(filePath);
  const minified = minifyCss(original);
  const withHeader = headerComment + minified;
  if (withHeader !== original) {
    writeFileUtf8(filePath, withHeader);
    return true;
  }
  return false;
}
function processJsFile(filePath) {
  const original = readFileUtf8(filePath);
  const minified = minifyJs(original);
  const withHeader = headerComment + minified;
  if (withHeader !== original) {
    writeFileUtf8(filePath, withHeader);
    return true;
  }
  return false;
}

function main() {
  const htmlTargets = [
    ...listRootHtmlFiles(),
    ...listFilesRecursive(TEMPLATES_DIR, ['.html']),
  ];
  const cssTargets = listFilesInDir(ASSETS_CSS_DIR, ['.css']);

  let updated = 0;
  for (const f of htmlTargets) { if (isFile(f) && processHtmlFile(f)) { updated++; console.log(`HTML updated: ${path.relative(BASE_DIR, f)}`); } }
  for (const f of cssTargets) { if (isFile(f) && processCssFile(f)) { updated++; console.log(`CSS updated: ${path.relative(BASE_DIR, f)}`); } }

  console.log(`Done. Updated ${updated} file(s).`);
}

if (require.main === module) {
  try { main(); } catch (e) { console.error('Error during minification:', e); process.exit(1); }
}