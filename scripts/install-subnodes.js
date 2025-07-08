const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

const nodesDir = path.join(__dirname, '..', 'nodes');

async function installSubnodes() {
  const nodes = await fs.readdir(nodesDir);
  for (const node of nodes) {
    if (node === 'NodeTemplate') continue; // Skip template
    const nodePath = path.join(nodesDir, node);
    const stat = await fs.stat(nodePath);
    if (stat.isDirectory() && await fs.pathExists(path.join(nodePath, 'package.json'))) {
      console.log(`Installing dependencies for ${node}...`);
      execSync('pnpm install', { cwd: nodePath, stdio: 'inherit' });
    }
  }
  console.log('All subnode dependencies installed.');
}

installSubnodes(); 