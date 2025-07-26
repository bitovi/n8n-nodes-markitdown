# Use the default Alpine n8n image

ARG N8N_VERSION=latest
FROM n8nio/n8n:${N8N_VERSION}

ARG N8N_VERSION
LABEL io.n8n.version.base="${N8N_VERSION}"

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
