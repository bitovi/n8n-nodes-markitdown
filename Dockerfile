# Start with a Node.js base image (n8n requires Node.js)
FROM n8nio/n8n:latest

USER root

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

# Download and install Python 3.10.12
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

# Actual part needed
RUN pip install --use-pep517 markitdown

WORKDIR /app

RUN git clone https://github.com/bitovi/n8n-nodes-markitdown

WORKDIR /app/markitdownnode

RUN npm i -g child_process fs-extra tmp-promise
COPY dist/nodes/ /home/node/.n8n/custom/

# Create data directory for n8n
RUN mkdir -p /root/.n8n

WORKDIR /
USER node
