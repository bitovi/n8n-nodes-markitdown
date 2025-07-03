# Use an ARG to specify the n8n version. This can be set by the GitHub Action.
ARG N8N_VERSION=latest

# We use the official n8n image as the base for our final image.
FROM n8nio/n8n:${N8N_VERSION}

# Switch to the root user to install packages
USER root

# The n8n base image already contains Python 3 and pip.
# We only need to install the 'markitdown' library.
# The --no-cache flag keeps the image size smaller.
RUN apk add --no-cache git && \
    pip install markitdown

# The source code for your nodes will be copied from your repository's context.
# We assume your build process (e.g., `pnpm run build`) creates a `dist` directory.
# This directory should contain your node's .js files.
# The 'COPY' command below moves these files into the directory where n8n
# looks for custom nodes.
COPY dist/ /home/node/.n8n/custom/

# After copying, we must ensure the 'node' user owns the new files.
# n8n runs as the 'node' user, and it needs permission to read these files.
RUN chown -R node:node /home/node/.n8n/custom

# Switch back to the non-privileged 'node' user for security.
# This is the user that n8n will run as.
USER node
