#!/bin/bash

# Install all dependencies including dev dependencies
npm install --include=dev

# Build client (React)
./node_modules/.bin/vite build

# Build server
./node_modules/.bin/esbuild server/index.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outfile=dist/index.js