# n8n Custom Nodes Monorepo

This repository is a monorepo for custom [n8n](https://n8n.io/) nodes, including the Markitdown node and any future nodes you add. It is designed for easy development, testing, versioning, and publishing of individual nodes.

---

## Monorepo Structure

```
├── nodes/
│   ├── Markitdown/           # Example custom node
│   │   ├── Markitdown.node.ts
│   │   ├── Markitdown.node.json
│   │   ├── package.json
│   │   └── ...
│   └── NodeTemplate/         # Template for new nodes
│       ├── NodeTemplate.node.ts
│       ├── NodeTemplate.node.json
│       ├── package.json
│       └── README.md
├── dist/                     # Bundled output for Docker/n8n
├── scripts/
│   └── bundle-nodes.js       # Bundles all node outputs to dist/
├── package.json              # Root, manages workspaces and shared tooling
├── tsconfig.json             # Shared TypeScript config
├── Dockerfile                # For building a custom n8n image
└── ...
```

---

## Adding a New Node

1. **Copy the template:**
   - Duplicate `nodes/NodeTemplate` to `nodes/YourNodeName`.
2. **Rename files and update references:**
   - Replace all `NodeTemplate` references with your node's name.
   - Update `package.json` with your node's details.
3. **Implement your node logic:**
   - Edit `YourNodeName.node.ts` and `YourNodeName.node.json`.
4. **(Optional) Add tests:**
   - Place tests in a `test/` subfolder inside your node directory.

---

## Building & Testing

- **Install dependencies:**
  ```sh
  pnpm install
  ```
- **Build all nodes:**
  ```sh
  pnpm build
  ```
  This will:
  - Build all node packages
  - Copy icons
  - Bundle all outputs to `dist/nodes/YourNodeName/`
- **Test all nodes:**
  ```sh
  pnpm test
  ```
- **Test a single node:**
  ```sh
  pnpm --filter ./nodes/YourNodeName... test
  ```

---

## Docker & Deployment

- The Dockerfile expects all built node outputs in `dist/nodes/YourNodeName/`.
- After building, you can build your Docker image as usual:
  ```sh
  docker build -t your-n8n-custom .
  ```
- The image will include all custom nodes in the `dist/` directory.

---

## Releasing & Publishing

- **Publish a node to npm:**
  ```sh
  cd nodes/YourNodeName
  npm publish --access public
  ```
- **Release workflow:**
  - The repo includes GitHub Actions for CI and can be extended for per-node publishing.
  - Update the matrix in `.github/workflows/node-ci.yml` to add new nodes to CI.

---

## Markitdown Node Usage

This repo includes a node that integrates with Microsoft's [Markitdown](https://github.com/microsoft/markitdown) tool for converting various document formats into structured Markdown.

### Installation

- Requires a self-hosted n8n instance.
- Markitdown must be installed in your environment (see below).
- Enable community nodes in n8n: `N8N_COMMUNITY_PACKAGES_ENABLED=true`
- In the n8n UI, go to `/settings/community-nodes` and add `@bitovi/n8n-nodes-markitdown`.

#### Option 1: Manual Install

See the Dockerfile and Markitdown documentation for required dependencies and installation steps.

#### Option 2: Use the Provided Docker Image

```
FROM bitovi/n8n-nodes-markitdown:latest
# Add your customizations here
```

### Supported File Types
- PDF
- PowerPoint
- Word
- Excel
- Images (EXIF, OCR)
- Audio (EXIF, transcription)
- HTML
- CSV, JSON, XML
- ZIP files
- Youtube URLs
- ...and more!

### Finding the Node
Search for "markitdown" in the n8n node search bar.

---

## Need help or have questions?

Need guidance on leveraging AI agents or n8n for your business? Our [AI Agents workshop](https://hubs.ly/Q02X-9Qq0) will equip you with the knowledge and tools necessary to implement successful and valuable agentic workflows.

## License

[MIT](./LICENSE.md)
