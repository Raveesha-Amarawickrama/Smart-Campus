#!/bin/bash
echo "Restoring correct Vite version..."
rm -rf node_modules package-lock.json
npm install --no-audit --no-fund
echo "Done! Run: npm run dev"
