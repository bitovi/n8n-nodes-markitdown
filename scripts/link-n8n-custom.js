const fs = require('fs-extra');
const path = require('path');
const os = require('os');

const distNodesDir = path.join(__dirname, '..', 'dist', 'nodes');
const n8nCustomNodesDir = path.join(os.homedir(), '.n8n', 'custom', 'nodes');

async function linkN8nCustom() {
  await fs.ensureDir(n8nCustomNodesDir);
  const nodes = await fs.readdir(distNodesDir);
  for (const node of nodes) {
    const src = path.join(distNodesDir, node);
    const dest = path.join(n8nCustomNodesDir, node);
    await fs.remove(dest); // Remove any existing node dir
    await fs.copy(src, dest);
    console.log(`Copied ${src} -> ${dest}`);
  }
  console.log('All custom nodes copied to ~/.n8n/custom/nodes/.');
}

linkN8nCustom(); 