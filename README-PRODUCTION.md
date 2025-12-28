# ESSOR ACTIVE - Production Deployment Guide

## 📋 Vue d'ensemble

Ce projet contient un serveur Node.js/Express avec un questionnaire interactif en Tailwind CSS.

**Domaine:** https://essor-active.com  
**Route principale du questionnaire:** `/questionnaire`  

## 📁 Structure du projet

```
antigravity-github/
├── server.js                 # Serveur Express principal
├── package.json             # Dépendances Node.js
├── ecosystem.config.js      # Configuration PM2
├── .env.production         # Variables d'environnement (production)
├── DEPLOYMENT.md           # Guide de déploiement détaillé
├── deploy.sh               # Script de déploiement automatique
├── public/                 # Fichiers statiques servés par Express
│   ├── questionnaire.html  # Page du questionnaire
│   ├── index.html         # Page d'accueil
│   ├── *.html             # Autres pages
│   ├── js/
│   │   └── questionnaire.js # Logique du questionnaire
│   ├── css/
│   │   └── styles.css     # Styles compilés Tailwind
│   └── sw.js              # Service Worker
└── frontend/               # Projet Vite/Tailwind (build)
```

## 🚀 Quick Start - Déploiement rapide

### Sur votre machine de déploiement:

```bash
# 1. Éditer le script deploy.sh avec vos infos
nano deploy.sh
# Remplacer:
# - your_user par votre utilisateur SSH
# - your_server_ip par l'IP du serveur

# 2. Rendre le script exécutable
chmod +x deploy.sh

# 3. Lancer le déploiement
./deploy.sh
```

### Sur le serveur (manuel):

```bash
# 1. Se connecter au serveur
ssh user@your-server-ip

# 2. Créer le répertoire
mkdir -p /var/www/essor-active && cd /var/www/essor-active

# 3. Cloner ou copier le projet
git clone <repo-url> . 
# ou
scp -r ./antigravity-github/* user@your-server:/var/www/essor-active/

# 4. Installer les dépendances
npm install

# 5. Configurer les variables d'environnement
cp .env.production .env
nano .env  # Éditer avec vos vraies valeurs

# 6. Lancer avec PM2
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 7. Configurer Nginx + SSL (voir DEPLOYMENT.md)
```

## ✅ Checklist de déploiement

- [ ] Tous les fichiers copiés sur le serveur
- [ ] `npm install` exécuté avec succès
- [ ] `.env` configuré avec les vraies valeurs
- [ ] PM2 démarre le serveur `npm start`
- [ ] Nginx configuré et redémarrés
- [ ] SSL/TLS configuré pour HTTPS
- [ ] DNS pointant vers le serveur (essor-active.com)

## 🔍 Vérification après déploiement

### En local (avant déploiement):
```bash
npm start
# Tester: http://localhost:3000/questionnaire
```

### Sur le serveur (après déploiement):
```bash
# Vérifier le statut PM2
pm2 status

# Voir les logs
pm2 logs essor-active

# Tester localement
curl http://localhost:3000/questionnaire

# Vérifier via Nginx
curl https://essor-active.com/questionnaire
```

## 📊 Fichiers critiques à vérifier

```bash
# Fichiers HTML
public/questionnaire.html      ✓ Existe
public/index.html             ✓ Existe

# Fichiers JavaScript
public/js/questionnaire.js     ✓ Existe et contient les fonctions
  - goBack()
  - nextStep()
  - loadQuestion()

# Fichiers CSS
public/css/styles.css         ✓ Existe et compilé

# Configuration
server.js                      ✓ Routes /questionnaire définie
ecosystem.config.js            ✓ Configuration PM2 prête
```

## 🔧 Configuration des variables d'environnement

### Fichier `.env` (à créer sur le serveur):

```env
NODE_ENV=production
PORT=3000
APP_URL=https://essor-active.com

# Email (optionnel)
SENDGRID_API_KEY=sk_live_xxxxx
SENDGRID_FROM_EMAIL=noreply@essor-active.com

# Admin (optionnel)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
```

## 📈 Monitoring

### Vérifier les performances:
```bash
pm2 monit                    # Utilisation CPU/RAM en temps réel
pm2 logs essor-active        # Logs en temps réel
pm2 describe essor-active    # Détails de l'application
```

### Redémarrer l'application:
```bash
pm2 restart essor-active     # Redémarrer
pm2 stop essor-active        # Arrêter
pm2 start essor-active       # Démarrer
```

## 🐛 Troubleshooting

### Erreur: "Cannot find module"
```bash
cd /var/www/essor-active
rm -rf node_modules package-lock.json
npm install
pm2 restart essor-active
```

### Port 3000 déjà utilisé
```bash
lsof -i :3000
kill -9 <PID>
pm2 restart essor-active
```

### Fichiers statiques retournent 404
```bash
# Vérifier les chemins dans public/
ls -la public/js/questionnaire.js
ls -la public/css/styles.css

# Vérifier les permissions
chmod -R 755 public/
chown -R www-data:www-data public/
```

### HTTPS/SSL ne fonctionne pas
```bash
# Utiliser Certbot avec Let's Encrypt
sudo certbot --nginx -d essor-active.com

# Renouvellement automatique
sudo certbot renew --dry-run
```

## 📞 Support

Pour plus de détails, consultez:
- `DEPLOYMENT.md` - Guide complet de déploiement
- `server.js` - Code du serveur
- `ecosystem.config.js` - Configuration PM2

---

**Dernière mise à jour:** 28/12/2025  
**Version:** 1.0.0  
**Prêt pour production:** ✅ OUI
