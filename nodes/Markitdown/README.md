# Markitdown n8n Node

This directory contains the custom n8n node for integrating with Microsoft's [Markitdown](https://github.com/microsoft/markitdown) tool, which converts various document formats into structured Markdown.

## Installation

- Requires a self-hosted n8n instance.
- Markitdown must be installed in your environment (see below).
- Enable community nodes in n8n: `N8N_COMMUNITY_PACKAGES_ENABLED=true`
- In the n8n UI, go to `/settings/community-nodes` and add `@bitovi/n8n-nodes-markitdown`.

### Option 1: Manual Install

See the Dockerfile and Markitdown documentation for required dependencies and installation steps.

### Option 2: Use the Provided Docker Image

```
FROM bitovi/n8n-nodes-markitdown:latest
# Add your customizations here
```

## Supported File Types
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

## Finding the Node
Search for "markitdown" in the n8n node search bar. 