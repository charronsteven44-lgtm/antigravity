#!/bin/bash
# Script de déploiement pour essor-active.com

set -e

echo "=========================================="
echo "Déploiement essor-active"
echo "=========================================="

# Configuration
SERVER_USER="your_user"
SERVER_IP="your_server_ip"
REMOTE_PATH="/var/www/essor-active"
LOCAL_PATH="."

echo "1. Copie des fichiers..."
scp -r $LOCAL_PATH/* $SERVER_USER@$SERVER_IP:$REMOTE_PATH/

echo "2. Installation des dépendances..."
ssh $SERVER_USER@$SERVER_IP "cd $REMOTE_PATH && npm install"

echo "3. Configuration PM2..."
ssh $SERVER_USER@$SERVER_IP "cd $REMOTE_PATH && pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js"

echo "4. Sauvegarde PM2..."
ssh $SERVER_USER@$SERVER_IP "pm2 save"

echo "=========================================="
echo "✓ Déploiement réussi!"
echo "=========================================="
echo ""
echo "Vérifiez l'accès à https://essor-active.com/questionnaire"
