# NodeTemplate

This is a template for creating a new custom n8n node.

## Steps to use:

1. **Copy this folder** to `nodes/YourNodeName`.
2. **Rename files** and update all references from `NodeTemplate` to your node's name.
3. **Edit `package.json`** with your node's details.
4. **Implement your node logic** in `YourNodeName.node.ts` and `YourNodeName.node.json`.
5. **Add tests** in a `test/` subfolder if needed.
6. **Build and test**:
   ```sh
   pnpm --filter ./nodes/YourNodeName... build
   pnpm --filter ./nodes/YourNodeName... test
   ```
7. **Publish** (if desired):
   ```sh
   cd nodes/YourNodeName
   npm publish --access public
   ```

---

For more details, see the root README or consult the n8n documentation. 