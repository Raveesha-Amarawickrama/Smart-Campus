@echo off
echo Restoring correct Vite version...
rmdir /s /q node_modules
del package-lock.json
npm install --no-audit --no-fund
echo Done! Run: npm run dev
pause
