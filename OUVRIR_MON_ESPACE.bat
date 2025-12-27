@echo off
echo ===================================================
echo     OUVERTURE DE VOTRE ESPACE PERSONNEL - ESSOR
echo ===================================================
echo.
echo 1. Demarrage du serveur...
start /B node server.js
echo.
echo 2. Ouverture de l'application...
timeout /t 2 >nul
start http://localhost:3000/dashboard.html
echo.
echo ===================================================
echo    APPLICATION LANCEE !
echo    Ne fermez pas cette fenetre noire.
echo ===================================================
pause
