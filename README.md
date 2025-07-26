# @bitovi/n8n-nodes-markitdown

This repo contains an [n8n](https://n8n.io/) community node that intregrates with Microsoft's [Markitdown](https://github.com/microsoft/markitdown) tool for converting various document formats into structured Markdown.

## Installation

- A self-hosted n8n instance.
   - n8n Cloud [does not support nodes with external dependencies](https://community.n8n.io/t/custom-node-approval/118559?utm_source=chatgpt.com)
- Make sure you have [Markitdown](https://github.com/bitovi/n8n-nodes-markitdown) installed
   2. Simply update your own Dockerfile with the delcarations below
   1. You may use our [custom image](https://hub.docker.com/r/bitovi/n8n-nodes-markitdown)
- Make sure to allow community nodes with `N8N_COMMUNITY_PACKAGES_ENABLED=true`
- Once logged in to your N8N web UI, go to `/settings/community-nodes` and type `@bitovi/n8n-nodes-markitdown`

### Option 1 (Reccomended)
```
FROM n8nio/n8n:latest

# Install Python and system dependencies for markitdown
USER root
RUN apk add --no-cache \
    python3 \
    py3-pip \
    ffmpeg \
    perl-image-exiftool \
    && ln -sf python3 /usr/bin/python

# Set environment variables for markitdown
ENV EXIFTOOL_PATH=/usr/bin/exiftool
ENV FFMPEG_PATH=/usr/bin/ffmpeg

# Create a virtual environment and install markitdown
RUN python3 -m venv /opt/markitdown-venv \
    && /opt/markitdown-venv/bin/pip install --no-cache-dir markitdown[all]

# Add the virtual environment to PATH so markitdown is available
ENV PATH="/opt/markitdown-venv/bin:$PATH"

# Switch back to node user
USER node

# Set the working directory to n8n's default
WORKDIR /home/node/.n8n/nodes

# Install the n8n Markitdown nodes package
RUN npm install @bitovi/n8n-nodes-markitdown@latest

# Set the main working directory back to n8n's default
WORKDIR /home/node
```

### Option 2

```
# Use our custom image
FROM bitovi/n8n-nodes-markitdown:latest

# Optional, put your customization here
...
```

## File Types accepted
At present, MarkItDown supports:

PDF
PowerPoint (reading in top-to-bottom, left-to-right order)
Word
Excel
Images (EXIF metadata and OCR)
Audio (EXIF metadata and speech transcription)
HTML
Text-based formats (CSV, JSON, XML)
ZIP files (iterates over contents)
Youtube URLs
... and more!

## How to find the node?
You can search markitdown in the searchbar.
It will look like this: [markitdownnode](/markitdown.png)

## Need help or have questions?

Need guidance on leveraging AI agents or N8N for your business? Our [AI Agents workshop](https://hubs.ly/Q02X-9Qq0) will equip you with the knowledge and tools necessary to implement successful and valuable agentic workflows.

## License

[MIT](./LICENSE.md)
