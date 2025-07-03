# Use the Debian variant of the n8n image
ARG N8N_VERSION=latest
FROM n8nio/n8n:${N8N_VERSION}

# Switch to the root user for installations
USER root

# === Python Dependencies (from before, still correct) ===
# Install Python tools and then clean up to keep the image small
RUN apt-get update && \
    apt-get install -y --no-install-recommends git python3-pip && \
    pip install markitdown && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# === Node.js Dependencies (The Fix) ===

# Set the working directory for our custom node installation
WORKDIR /home/node/.n8n/custom

# 1. Copy only the package manifest files.
# This leverages Docker's layer caching. If these files don't change,
# Docker won't re-run the `pnpm install` step on subsequent builds.
COPY package.json pnpm-lock.yaml ./

# 2. Install ONLY production dependencies using pnpm.
# The `pnpm` command is available in the n8n base image.
# The `--prod` flag skips devDependencies, keeping the image lean.
RUN pnpm install --prod

# 3. Copy the rest of your built code.
# This will copy your actual node files from dist/ into the current directory.
COPY dist/ .

# Ensure the 'node' user owns all the new files
RUN chown -R node:node /home/node/.n8n/custom

# Switch back to the non-privileged 'node' user for security
USER node

# Set the main working directory back to n8n's default (optional but good practice)
WORKDIR /home/node
