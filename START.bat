@echo off
color 0A
cls
echo =================================
echo   ESSOR QUICK START
echo =================================

if not exist node_modules (
    echo Installation des dependances...
    call npm install
)

echo.
echo Lancement du serveur...
start /B node server.js

echo.
echo Ouverture du navigateur...
timeout /t 3 /nobreak >nul
start http://localhost:3000

echo.
echo pret.
pause
