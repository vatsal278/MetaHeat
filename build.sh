#!/bin/bash
# Install all dependencies including dev dependencies
npm install --include=dev

# Use local node_modules binaries explicitly
./node_modules/.bin/vite build
./node_modules/.bin/esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist