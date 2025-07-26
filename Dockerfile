# Use the default Alpine n8n image

ARG N8N_VERSION=latest
FROM n8nio/n8n:${N8N_VERSION}

ARG N8N_VERSION
LABEL io.n8n.version.base="${N8N_VERSION}"

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
