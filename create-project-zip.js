import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const rootDir = process.cwd();
const zip = new JSZip();

const IGNORED_DIRS = new Set(['node_modules', '.git', 'dist']);
const IGNORED_FILES = new Set(['the-eternal-push.zip']);

function addDirectoryToZip(dirPath, zipFolder) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relPath = path.relative(rootDir, fullPath);

    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      const subFolder = zipFolder.folder(entry.name);
      addDirectoryToZip(fullPath, subFolder);
    } else if (entry.isFile()) {
      if (IGNORED_FILES.has(entry.name)) continue;
      if (entry.name.endsWith('.zip')) continue;

      const fileData = fs.readFileSync(fullPath);
      zipFolder.file(entry.name, fileData);
      console.log(`Added: ${relPath}`);
    }
  }
}

async function buildZip() {
  console.log('Packing project files...');
  addDirectoryToZip(rootDir, zip);

  console.log('Generating ZIP buffer...');
  const buffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  // Ensure public folder exists
  const publicDir = path.join(rootDir, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outPathPublic = path.join(publicDir, 'the-eternal-push.zip');
  const outPathRoot = path.join(rootDir, 'the-eternal-push.zip');

  fs.writeFileSync(outPathPublic, buffer);
  fs.writeFileSync(outPathRoot, buffer);

  console.log(`ZIP created successfully! Size: ${(buffer.length / 1024).toFixed(1)} KB`);
  console.log(`Output 1: ${outPathPublic}`);
  console.log(`Output 2: ${outPathRoot}`);
}

buildZip().catch(console.error);
