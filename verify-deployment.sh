#!/bin/bash
# Script de vérification post-déploiement
# À exécuter sur le serveur après déploiement

set -e

echo "=========================================="
echo "VÉRIFICATION POST-DÉPLOIEMENT"
echo "=========================================="
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteurs
PASSED=0
FAILED=0

# Fonction pour les tests
test_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} Fichier existe: $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} Fichier manquant: $1"
        ((FAILED++))
    fi
}

test_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} Répertoire existe: $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} Répertoire manquant: $1"
        ((FAILED++))
    fi
}

test_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${GREEN}✓${NC} Port $1 en écoute"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} Port $1 ne répond pas"
        ((FAILED++))
    fi
}

test_url() {
    if curl -s -o /dev/null -w "%{http_code}" "$1" | grep -q "200"; then
        echo -e "${GREEN}✓${NC} URL accessible: $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} URL non accessible: $1"
        ((FAILED++))
    fi
}

echo "1. Vérification des fichiers critiques..."
test_file "server.js"
test_file "package.json"
test_file "ecosystem.config.js"
test_file ".env"
test_file "public/questionnaire.html"
test_file "public/js/questionnaire.js"
test_file "public/css/styles.css"

echo ""
echo "2. Vérification des répertoires..."
test_dir "public"
test_dir "public/js"
test_dir "public/css"
test_dir "programs"
test_dir "node_modules"
test_dir "logs"

echo ""
echo "3. Vérification du serveur Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js installé: $NODE_VERSION"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Node.js non trouvé"
    ((FAILED++))
fi

echo ""
echo "4. Vérification de npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} npm installé: $NPM_VERSION"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} npm non trouvé"
    ((FAILED++))
fi

echo ""
echo "5. Vérification de PM2..."
if pm2 status &> /dev/null; then
    echo -e "${GREEN}✓${NC} PM2 installé et fonctionnel"
    ((PASSED++))
    pm2 status
else
    echo -e "${RED}✗${NC} PM2 non disponible"
    ((FAILED++))
fi

echo ""
echo "6. Vérification du serveur en écoute..."
test_port "3000"

echo ""
echo "7. Vérification de la connectivité HTTP..."
if test_url "http://localhost:3000/"; then
    :
fi
if test_url "http://localhost:3000/questionnaire"; then
    :
fi
if test_url "http://localhost:3000/css/styles.css"; then
    :
fi
if test_url "http://localhost:3000/js/questionnaire.js"; then
    :
fi

echo ""
echo "8. Vérification du contenu HTML..."
if curl -s http://localhost:3000/questionnaire | grep -q 'href="/css/styles.css"'; then
    echo -e "${GREEN}✓${NC} CSS Tailwind lié dans HTML"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} CSS non lié"
    ((FAILED++))
fi

if curl -s http://localhost:3000/questionnaire | grep -q 'src="/js/questionnaire.js"'; then
    echo -e "${GREEN}✓${NC} JavaScript lié dans HTML"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} JavaScript non lié"
    ((FAILED++))
fi

if curl -s http://localhost:3000/questionnaire | grep -q 'onclick="goBack()"'; then
    echo -e "${GREEN}✓${NC} Fonctions navigations présentes"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Fonctions navigations manquantes"
    ((FAILED++))
fi

echo ""
echo "=========================================="
echo "RÉSULTAT"
echo "=========================================="
echo -e "Tests réussis: ${GREEN}$PASSED${NC}"
echo -e "Tests échoués: ${RED}$FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ Tous les tests sont passés!${NC}"
    echo ""
    echo "Le serveur est prêt pour la production."
    echo ""
    echo "Étapes suivantes:"
    echo "1. Configurer Nginx comme reverse proxy"
    echo "2. Configurer SSL/TLS avec Let's Encrypt"
    echo "3. Vérifier https://essor-active.com/questionnaire"
    exit 0
else
    echo -e "${RED}✗ Certains tests ont échoué!${NC}"
    echo ""
    echo "Veuillez corriger les problèmes mentionnés ci-dessus."
    echo "Consultez DEPLOYMENT.md pour plus d'aide."
    exit 1
fi
