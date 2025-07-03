# Use the official n8n image as the base, version set by build ARG
ARG N8N_VERSION=latest
FROM n8nio/n8n:${N8N_VERSION}

# Switch to root to install dependencies
USER root

# Install build dependencies, install markitdown, then clean up
RUN apk add --no-cache --virtual .build-deps git build-base python3-dev py3-pip && \
    pip install markitdown --break-system-packages && \
    apk del .build-deps

# Copy built custom nodes to n8n custom directory
COPY dist/ /home/node/.n8n/custom/

# Ensure correct ownership for node user
RUN chown -R node:node /home/node/.n8n/custom

# Switch back to non-root user for security
USER node
