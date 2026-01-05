# Script de déploiement automatique vers GitHub
# ESSOR ACTIVE

Write-Host "========================================" -ForegroundColor Green
Write-Host "  DÉPLOIEMENT ESSOR ACTIVE - GITHUB" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Demander l'URL du repository GitHub
Write-Host "ÉTAPE 1 : Créez d'abord votre repository sur GitHub" -ForegroundColor Yellow
Write-Host "Allez sur : https://github.com/new" -ForegroundColor Cyan
Write-Host "Nom du repository : essor-active" -ForegroundColor Cyan
Write-Host "NE COCHEZ RIEN (pas de README, pas de .gitignore)" -ForegroundColor Red
Write-Host ""

$repoUrl = Read-Host "Collez l'URL du repository GitHub (ex: https://github.com/username/essor-active.git)"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "❌ Erreur : URL vide. Arrêt du script." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  CONFIGURATION DU REMOTE GITHUB" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Vérifier si le remote existe déjà
$remoteExists = git remote get-url origin 2>$null

if ($remoteExists) {
    Write-Host "⚠️  Un remote 'origin' existe déjà. Suppression..." -ForegroundColor Yellow
    git remote remove origin
}

# Ajouter le remote
Write-Host "➕ Ajout du remote GitHub..." -ForegroundColor Cyan
git remote add origin $repoUrl

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'ajout du remote." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Remote ajouté avec succès !" -ForegroundColor Green
Write-Host ""

# Renommer la branche en main
Write-Host "========================================" -ForegroundColor Green
Write-Host "  PRÉPARATION DE LA BRANCHE MAIN" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "🔄 Renommage de la branche en 'main'..." -ForegroundColor Cyan
git branch -M main

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du renommage de la branche." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Branche renommée en 'main' !" -ForegroundColor Green
Write-Host ""

# Pousser vers GitHub
Write-Host "========================================" -ForegroundColor Green
Write-Host "  PUSH VERS GITHUB" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "📤 Push du code vers GitHub..." -ForegroundColor Cyan
Write-Host "⚠️  Si demandé, utilisez votre Personal Access Token comme mot de passe" -ForegroundColor Yellow
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Erreur lors du push vers GitHub." -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 AIDE :" -ForegroundColor Yellow
    Write-Host "Si l'authentification a échoué :" -ForegroundColor Yellow
    Write-Host "1. Créez un Personal Access Token : https://github.com/settings/tokens" -ForegroundColor Cyan
    Write-Host "2. Cliquez sur 'Generate new token (classic)'" -ForegroundColor Cyan
    Write-Host "3. Cochez 'repo'" -ForegroundColor Cyan
    Write-Host "4. Générez et copiez le token" -ForegroundColor Cyan
    Write-Host "5. Utilisez le token comme mot de passe lors du push" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ DÉPLOIEMENT RÉUSSI !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📦 Votre code a été poussé vers GitHub avec succès !" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 Repository : $repoUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  PROCHAINES ÉTAPES" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "1. Allez sur Render : https://dashboard.render.com" -ForegroundColor Cyan
Write-Host "2. Trouvez votre service ESSOR ACTIVE" -ForegroundColor Cyan
Write-Host "3. Settings → Build & Deploy → Connect Repository" -ForegroundColor Cyan
Write-Host "4. Sélectionnez le repository 'essor-active'" -ForegroundColor Cyan
Write-Host "5. Branche : main" -ForegroundColor Cyan
Write-Host "6. Sauvegardez et attendez le déploiement automatique" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  VÉRIFICATION POST-DÉPLOIEMENT" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Une fois déployé, testez :" -ForegroundColor Yellow
Write-Host "✅ https://essor-active.com/login.html (page client)" -ForegroundColor Cyan
Write-Host "✅ https://essor-active.com/admin (doit retourner 404)" -ForegroundColor Cyan
Write-Host "✅ https://essor-active.com/dashboard.html (interface client uniquement)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Appuyez sur une touche pour fermer..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
