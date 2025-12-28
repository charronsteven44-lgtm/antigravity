# Guide de Déploiement - essor-active.com

## Prérequis
- Node.js 18+ installé sur le serveur
- Accès SSH au serveur
- Un domaine essor-active.com configuré
- Un reverse proxy comme Nginx (recommandé)

## Étapes de déploiement

### 1. Préparer le serveur
```bash
# Se connecter au serveur
ssh user@your-server-ip

# Créer un répertoire pour le projet
mkdir -p /var/www/essor-active
cd /var/www/essor-active

# Initialiser un dossier logs
mkdir -p logs
```

### 2. Copier le projet
```bash
# Copier tous les fichiers du projet (utiliser git clone si disponible)
# Option 1: Avec git
git clone <repository-url> .

# Option 2: Avec scp depuis votre machine locale
scp -r ./antigravity-github/* user@your-server-ip:/var/www/essor-active/
```

### 3. Installer les dépendances
```bash
cd /var/www/essor-active
npm install
```

### 4. Configurer les variables d'environnement
```bash
# Copier le fichier .env.production et le personnaliser
cp .env.production .env
nano .env  # Éditer avec vos vraies valeurs

# Vérifier que les valeurs suivantes sont correctes:
# - NODE_ENV=production
# - PORT=3000
# - APP_URL=https://essor-active.com
# - SENDGRID_API_KEY (si vous utilisez les emails)
# - ADMIN_USERNAME et ADMIN_PASSWORD
```

### 5. Installer et configurer PM2
```bash
# Installer PM2 globalement
npm install -g pm2

# Démarrer le serveur avec PM2
pm2 start ecosystem.config.js

# Sauvegarder la configuration PM2
pm2 save

# Activer le démarrage automatique au reboot
pm2 startup
```

### 6. Configurer Nginx (Reverse Proxy)
```bash
# Créer la configuration Nginx
sudo nano /etc/nginx/sites-available/essor-active

# Ajouter la configuration suivante:
```

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name essor-active.com www.essor-active.com;

    # Redirection HTTP vers HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name essor-active.com www.essor-active.com;

    # Certificats SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/essor-active.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/essor-active.com/privkey.pem;

    # Configuration SSL recommandée
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Logs
    access_log /var/log/nginx/essor-active-access.log;
    error_log /var/log/nginx/essor-active-error.log;

    # Proxy vers Node.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache des fichiers statiques
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 365d;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Activer la configuration
sudo ln -s /etc/nginx/sites-available/essor-active /etc/nginx/sites-enabled/

# Tester la configuration Nginx
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx

# Installer Let's Encrypt (Certbot)
sudo apt-get install certbot python3-certbot-nginx -y
sudo certbot --nginx -d essor-active.com -d www.essor-active.com
```

### 7. Vérifier le déploiement

```bash
# Vérifier que PM2 est en cours d'exécution
pm2 status

# Vérifier les logs
pm2 logs essor-active

# Tester l'accès local
curl http://localhost:3000/questionnaire

# Tester l'accès public
curl https://essor-active.com/questionnaire
```

## Monitoring et Maintenance

### Vérifier les performances
```bash
# Afficher l'utilisation de la mémoire et du CPU
pm2 monit

# Voir les logs en temps réel
pm2 logs essor-active
```

### Redémarrer le serveur
```bash
# Redémarrer l'application
pm2 restart essor-active

# Arrêter l'application
pm2 stop essor-active

# Relancer l'application
pm2 start essor-active
```

### Mettre à jour le projet
```bash
cd /var/www/essor-active
git pull origin main  # ou votre branche
npm install
pm2 restart essor-active
```

## Points de vérification

- ✅ Route `/questionnaire` accessible et retourne le HTML
- ✅ CSS Tailwind chargé depuis `/css/styles.css`
- ✅ JavaScript chargé depuis `/js/questionnaire.js`
- ✅ Boutons "Suivant" et "Retour" fonctionnent
- ✅ Aucun fichier ne retourne 404
- ✅ HTTPS activé et certificat valide
- ✅ PM2 maintient le serveur actif

## Troubleshooting

### Le serveur ne démarre pas
```bash
# Vérifier les logs PM2
pm2 logs essor-active

# Vérifier que le port 3000 n'est pas utilisé
lsof -i :3000

# Vérifier les fichiers requis
ls -la public/js/questionnaire.js
ls -la public/css/styles.css
```

### CSS/JS ne charge pas
```bash
# Vérifier que les fichiers existent
find public -name "*.css" -o -name "*.js"

# Vérifier les permissions
chmod -R 755 public/
```

### Erreur 404 sur /questionnaire
```bash
# Vérifier que la route est bien configurée dans server.js
grep -n "app.get('/questionnaire'" server.js

# Vérifier que questionnaire.html existe
ls -la public/questionnaire.html
```

---

**Date de création:** 28/12/2025  
**Dernière mise à jour:** 28/12/2025  
**Status:** Prêt pour le déploiement
