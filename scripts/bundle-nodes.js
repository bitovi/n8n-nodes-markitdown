const fs = require('fs-extra');
const path = require('path');

const nodesDir = path.join(__dirname, '..', 'nodes');
const distDir = path.join(__dirname, '..', 'dist', 'nodes');

async function bundleNodes() {
  await fs.remove(distDir); // Clean previous dist
  await fs.ensureDir(distDir);

  const nodes = await fs.readdir(nodesDir);
  for (const node of nodes) {
    const nodePath = path.join(nodesDir, node);
    const stat = await fs.stat(nodePath);
    if (stat.isDirectory()) {
      // Copy .js, .json, .svg, .png from node dir to dist/nodes/NodeName/
      const files = await fs.readdir(nodePath);
      const outDir = path.join(distDir, node);
      await fs.ensureDir(outDir);
      for (const file of files) {
        if (/\.(js|json|svg|png)$/i.test(file)) {
          await fs.copy(
            path.join(nodePath, file),
            path.join(outDir, file)
          );
        }
      }
    }
  }
}

bundleNodes(); 