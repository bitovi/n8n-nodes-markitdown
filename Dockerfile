ARG N8N_VERSION=latest
FROM n8nio/n8n:${N8N_VERSION}

LABEL io.n8n.version.base="${N8N_VERSION}"

# Switch to the root user for installations
USER root

# === Install pnpm ===
# The base n8n image does not include pnpm, so we install it globally using npm.
RUN npm install -g pnpm

# === Python Dependencies for Alpine ===
# This uses Alpine's 'apk' package manager.
# 1. Create a temporary virtual package '.build-deps' with all build dependencies.
# 2. Use pip to install markitdown, adding '--break-system-packages' to handle PEP 668.
# 3. Remove the entire virtual package, cleaning up build tools to keep the image small.
RUN apk add --no-cache --virtual .build-deps git build-base python3-dev py3-pip && \
    pip install markitdown --break-system-packages && \
    apk del .build-deps

# === Node.js Dependencies ===
# Set the working directory for our custom node installation
WORKDIR /home/node/.n8n/custom

# Copy package manifests to leverage Docker cache
COPY package.json pnpm-lock.yaml ./

# Install production Node.js dependencies.
RUN pnpm install --prod

# Copy the built application code
COPY dist/ .

# === Final Steps ===
# Ensure the 'node' user owns all the new files
RUN chown -R node:node /home/node/.n8n/custom

# Switch back to the non-privileged 'node' user for security
USER node

# Set the main working directory back to n8n's default
WORKDIR /home/node
