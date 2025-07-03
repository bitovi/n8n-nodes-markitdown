# Use an ARG to specify the n8n version. This can be set by the GitHub Action.
ARG N8N_VERSION=latest

# We use the official n8n image as the base for our final image.
FROM n8nio/n8n:${N8N_VERSION}

# Switch to the root user to install packages
USER root

# Optimized RUN command:
# 1. Create a temporary virtual package '.build-deps' with all build dependencies.
# 2. Use pip to install markitdown, overriding the PEP 668 protection.
# 3. Remove the entire virtual package, cleaning up all build dependencies.
RUN apk add --no-cache --virtual .build-deps git build-base python3-dev py3-pip && \
    pip install markitdown --break-system-packages && \
    apk del .build-deps

# The source code for your nodes will be copied from your repository's context.
COPY dist/ /home/node/.n8n/custom/

# After copying, we must ensure the 'node' user owns the new files.
RUN chown -R node:node /home/node/.n8n/custom

# Switch back to the non-privileged 'node' user for security.
USER node
