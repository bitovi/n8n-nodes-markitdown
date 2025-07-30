# @bitovi/n8n-nodes-markitdown

This is an n8n community node. It lets you use Microsoft's Markitdown in your n8n workflows.

Microsoft's [Markitdown](https://github.com/microsoft/markitdown) is a powerful utility for converting various document formats (PDF, Word, PowerPoint, Excel, images, audio, and more) into clean, structured Markdown text. This makes it easy to extract and process content from different file types in your automation workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

#### Requirements

- A self-hosted n8n instance.
   - n8n Cloud [does not support nodes with external dependencies](https://community.n8n.io/t/custom-node-approval/118559?utm_source=chatgpt.com)
- Make sure you have [Markitdown](https://github.com/bitovi/n8n-nodes-markitdown) installed
   2. Simply update your own Dockerfile with the delcarations below
   1. You may use our [custom image](https://hub.docker.com/r/bitovi/n8n-nodes-markitdown)
- Make sure to allow community nodes with `N8N_COMMUNITY_PACKAGES_ENABLED=true`
- Once logged in to your N8N web UI, go to `/settings/community-nodes` and type `@bitovi/n8n-nodes-markitdown`

### Option 1 (Recommended) - Use our pre-built Docker image

```dockerfile
# Use our custom image
FROM bitovi/n8n-nodes-markitdown:latest

# Optional, put your customization here
...
```

### Option 2 - Add to your existing Dockerfile
```dockerfile
FROM n8nio/n8n:latest

# Switch to the root user for installations
USER root
RUN npm install -g pnpm

# === Python Dependencies for Alpine ===
# This uses Alpine's 'apk' package manager.
# 1. Create a temporary virtual package '.build-deps' with all build dependencies.
# 2. Use pip to install markitdown globally, adding '--break-system-packages' to handle PEP 668.
# 3. Ensure Python runtime packages remain installed.
# 4. Remove only the build dependencies to keep the image smaller.
RUN apk add --no-cache --virtual .build-deps git build-base python3-dev py3-pip && \
    apk add --no-cache python3 && \
    pip install markitdown --break-system-packages && \
    apk del .build-deps

# Ensure the Python scripts directory is in PATH for all users
ENV PATH="/usr/local/bin:$PATH"

# Switch back to the non-privileged 'node' user for security
USER node

# Set the working directory to n8n's default
WORKDIR /home/node/.n8n/nodes

# Install the n8n Markitdown nodes package
RUN npm install @bitovi/n8n-nodes-markitdown@latest --only=prod

# Set the main working directory back to n8n's default
WORKDIR /home/node
```

## Operations

This node provides a single operation:

**Convert to Markdown**: Takes any supported file format and converts it to clean, structured Markdown text.

**Input Parameters:**
- **Input Binary Field**: The name of the binary property containing the file to process (default: "data")

**Output:**
- **data**: The converted Markdown content as a string in the JSON output
- **binary**: Empty binary object (the output is provided as text in the JSON data)

## Compatibility

- **Minimum n8n version**: 1.0.0
- **Node.js version**: >=18.10
- **Python version**: 3.7+ (required for markitdown)
- **Tested with**: n8n 1.14.1+

This node requires Python and the markitdown package to be installed in your n8n environment. See the installation instructions above for proper setup.

## Usage

### Basic Workflow Setup

1. **File Input**: Connect a node that provides binary file data (like "Read Binary File", "HTTP Request", or "Google Drive" nodes)
2. **Markitdown Node**: Add the Markitdown node to your workflow
3. **Configure**: Set the "Input Binary Field" parameter to match the binary property name from your input node (usually "data")
4. **Output**: The converted Markdown will be available in the `data` field of the output JSON

### Example Use Cases

- **Document Processing**: Convert Word documents, PDFs, or PowerPoint presentations to Markdown for further text processing
- **Content Extraction**: Extract text content from images using OCR capabilities
- **Data Pipeline**: Batch convert multiple documents as part of a larger data processing workflow
- **Content Management**: Convert various document formats to Markdown for publishing or archival systems

### Tips

- The node processes files by creating temporary files, so ensure your n8n instance has sufficient disk space
- Large files may take longer to process depending on the complexity and type of document
- If processing fails, check that the markitdown command is properly installed and accessible in your environment

### How to find the node

You can search "markitdown" in the n8n node search bar. The node will appear with the Microsoft logo.

![Markitdown Node](markitdown.png)

## File Types Supported

MarkItDown supports a wide variety of file formats:

- **PDF**: Extract text and structure from PDF documents
- **Microsoft Office**: PowerPoint (reading in top-to-bottom, left-to-right order), Word, Excel
- **Images**: EXIF metadata extraction and OCR text recognition
- **Audio**: EXIF metadata and speech transcription
- **Web**: HTML pages and content
- **Text-based formats**: CSV, JSON, XML
- **Archives**: ZIP files (iterates over contents)
- **Online content**: YouTube URLs
- **And more!**

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Microsoft Markitdown GitHub repository](https://github.com/microsoft/markitdown)
- [Bitovi's n8n-nodes-markitdown repository](https://github.com/bitovi/n8n-nodes-markitdown)
- [Bitovi Docker Hub image](https://hub.docker.com/r/bitovi/n8n-nodes-markitdown)


## Need Help or Have Questions?

Need guidance on leveraging AI agents or N8N for your business? Our [AI Agents workshop](https://hubs.ly/Q02X-9Qq0) will equip you with the knowledge and tools necessary to implement successful and valuable agentic workflows.

## License

[MIT](./LICENSE.md)
