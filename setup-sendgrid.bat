@echo off
echo ========================================
echo Configuration SendGrid - ESSOR ACTIVE
echo ========================================
echo.

echo [ETAPE 1/4] Creation du fichier .env...
echo.

if exist .env (
    echo Le fichier .env existe deja.
    echo Voulez-vous le recreer? [O/N]
    set /p recreate=
    if /i "%recreate%"=="O" (
        del .env
        goto CREATE_ENV
    ) else (
        goto CHECK_ENV
    )
) else (
    :CREATE_ENV
    echo SENDGRID_API_KEY=votre-cle-api-sendgrid-ici > .env
    echo SENDGRID_FROM_EMAIL=noreply@essor-active.com >> .env
    echo SENDGRID_FROM_NAME=ESSOR ACTIVE >> .env
    echo.
    echo ✓ Fichier .env cree avec succes!
    echo.
    echo IMPORTANT: Editez maintenant le fichier .env et remplacez
    echo XK9OFrhtTdqWOEwteUVrzg par votre vraie cle API SendGrid
    echo.
    pause
)

:CHECK_ENV
echo.
echo [ETAPE 2/4] Verification de la configuration .env...
echo.

findstr /C:
 .env >nul 2>&1
if %errorlevel%==0 (
    echo ⚠ ATTENTION: La cle API n'est pas configuree!
    echo.
    echo Voulez-vous entrer votre cle API maintenant? [O/N]
    set /p enter_key=
    if /i "%enter_key%"=="O" (
        set /p api_key=Entrez votre cle API SendGrid (commence par SG.): 
        echo SENDGRID_API_KEY=!api_key! > .env
        echo SENDGRID_FROM_EMAIL=noreply@essor-active.com >> .env
        echo SENDGRID_FROM_NAME=ESSOR ACTIVE >> .env
        echo ✓ Cle API configuree!
    )
) else (
    echo ✓ Fichier .env configure!
)

echo.
echo [ETAPE 3/4] Verification des DNS...
echo.
echo Verification des enregistrements DNS pour essor-active.com...
echo.

echo Verification CNAME em9985.essor-active.com...
nslookup -type=CNAME em9985.essor-active.com 8.8.8.8 2>nul | findstr "u58274376.wl127.sendgrid.net" >nul
if %errorlevel%==0 (
    echo   ✓ em9985.essor-active.com - OK
) else (
    echo   ✗ em9985.essor-active.com - NON CONFIGURE
)

echo Verification CNAME s1._domainkey.essor-active.com...
nslookup -type=CNAME s1._domainkey.essor-active.com 8.8.8.8 2>nul | findstr "s1.domainkey.u58274376.wl127.sendgrid.net" >nul
if %errorlevel%==0 (
    echo   ✓ s1._domainkey.essor-active.com - OK
) else (
    echo   ✗ s1._domainkey.essor-active.com - NON CONFIGURE
)

echo Verification CNAME s2._domainkey.essor-active.com...
nslookup -type=CNAME s2._domainkey.essor-active.com 8.8.8.8 2>nul | findstr "s2.domainkey.u58274376.wl127.sendgrid.net" >nul
if %errorlevel%==0 (
    echo   ✓ s2._domainkey.essor-active.com - OK
) else (
    echo   ✗ s2._domainkey.essor-active.com - NON CONFIGURE
)

echo.
echo NOTE: Si les DNS ne sont pas configures, vous devez les ajouter
echo via votre registrar de domaine (OVH, Cloudflare, etc.)
echo Consultez sendgrid_setup.md pour les instructions detaillees.
echo.

echo [ETAPE 4/4] Demarrage du serveur...
echo.
echo Le serveur va demarrer. Verifiez le message de configuration SendGrid.
echo.
pause

echo.
echo Demarrage du serveur Node.js...
node server.js

pause
