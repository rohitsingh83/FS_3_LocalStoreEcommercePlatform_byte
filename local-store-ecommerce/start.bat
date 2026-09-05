@echo off
title GreenLeaf Artisan Market
echo ========================================================
echo Starting GreenLeaf Artisan Market E-Commerce Platform
echo Server & Storefront: http://localhost:5000
echo ========================================================
cd /d "%~dp0backend"
start http://localhost:5000
node src/server.js
pause
