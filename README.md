# @bitovi/n8n-nodes-markitdown

This repo contains [N8N](https://n8n.io/) node to work with Microsoft's [Markitdown](https://github.com/microsoft/markitdown).

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
# Install system dependencies
RUN apk add --no-cache \
    bash \
    git \
    curl \
    wget \
    build-base \
    openssl-dev \
    zlib-dev \
    bzip2-dev \
    readline-dev \
    sqlite-dev \
    ncurses-dev \
    xz \
    libxml2-dev \
    libffi-dev \
    python3 \
    python3-dev \
    py3-pip \
    nodejs \
    npm

# Download and install Python. Needed to compile Markitdown
WORKDIR /tmp
RUN wget https://www.python.org/ftp/python/3.10.12/Python-3.10.12.tgz \
    && tar -xvf Python-3.10.12.tgz \
    && cd Python-3.10.12 \
    && ./configure --enable-optimizations \
    && make -j$(nproc) && make altinstall \
    && cd .. && rm -rf Python-3.10.12.tgz Python-3.10.12

RUN ln -sf /usr/local/bin/python3.10 /usr/bin/python3 && \
    ln -sf /usr/local/bin/python3.10 /usr/bin/python

# Install pip for Python 3.10
RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py && \
    python3 get-pip.py && \
    rm get-pip.py

WORKDIR /

# Install Markitdown on the image
RUN git clone https://github.com/microsoft/markitdown.git && \
    cd markitdown && \
    pip install --use-pep517 packages/markitdown

WORKDIR /app

# Install custom node to interact with Markitdown from n8n
RUN git clone https://github.com/bitovi/n8n-nodes-markitdown

WORKDIR /app/markitdownnode

RUN npm i -g child_process fs-extra tmp-promise
RUN cp -R dist/nodes/ /home/node/.n8n/custom/
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
