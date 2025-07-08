# n8n Custom Nodes Monorepo

This repository is a monorepo for custom [n8n](https://n8n.io/) nodes, including the Markitdown node and any future nodes you add. It is designed for easy development, testing, versioning, and publishing of individual nodes.

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

## Building, Testing, and Local Development

- **Install all dependencies (root and subnodes):**
  ```sh
  pnpm install
  ```
  This will install all dependencies for the monorepo and for each subnode automatically.
- **Build all nodes:**
  ```sh
  pnpm build
  ```
- **Test all nodes:**
  ```sh
  pnpm test
  ```
- **Test a single node:**
  ```sh
  pnpm --filter ./nodes/YourNodeName... test
  ```
> **Note:** After running `pnpm build`, all built nodes are automatically copied to your local n8n custom directory (`~/.n8n/custom/nodes/`) for local development.

---

## Docker & Deployment

- The Dockerfile expects all built node outputs in `dist/nodes/YourNodeName/`. This is handled by the `pnpm build` step.
- After building, you can build your Docker image as usual:
  ```sh
  docker build -t n8n-subnodes .
  ```
- Run the Docker container:
  ```sh
  docker run -it --rm \
    -p 5678:5678 \
    -e N8N_COMMUNITY_PACKAGES_ENABLED=true \
    n8n-subnodes
  ```
- (Optional) For live development, mount your local `dist/nodes`:
  ```sh
  docker run -it --rm \
    -p 5678:5678 \
    -e N8N_COMMUNITY_PACKAGES_ENABLED=true \
    -v $PWD/dist/nodes:/home/node/.n8n/custom/nodes \
    n8n-subnodes
  ```

---

## Releasing & Publishing

- **Publish a node to npm:**
  ```sh
  cd nodes/YourNodeName
  npm publish --access public
  ```
- **Release workflow:**
  - The repo includes GitHub Actions for CI, npm publishing, and Docker image publishing.
  - Update the matrix in `.github/workflows/publish-npm-nodes.yml` to add new nodes to npm publishing.

---

## Markitdown Node

For details on using the Markitdown node, see [`nodes/Markitdown/README.md`](nodes/Markitdown/README.md).

---

## Need help or have questions?

Need guidance on leveraging AI agents or n8n for your business? Our [AI Agents workshop](https://hubs.ly/Q02X-9Qq0) will equip you with the knowledge and tools necessary to implement successful and valuable agentic workflows.

## License

[MIT](./LICENSE.md)
