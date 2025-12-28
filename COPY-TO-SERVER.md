# Fichiers à copier sur le serveur

## 📋 Structure minimale requise

Lors du déploiement sur le serveur, assurez-vous de copier ces fichiers et répertoires:

```
essor-active/
├── server.js                    # Serveur principal
├── package.json                 # Dépendances
├── package-lock.json            # Lock file
├── ecosystem.config.js          # Configuration PM2
├── .env.production              # Variables d'env (à personnaliser)
│
├── public/                      # Fichiers statiques
│   ├── questionnaire.html
│   ├── index.html
│   ├── admin.html
│   ├── body-map.html
│   ├── dashboard.html
│   ├── final.html
│   ├── login.html
│   ├── my-program.html
│   ├── my-program-pro.html
│   ├── profile.html
│   ├── subscription.html
│   ├── sw.js
│   │
│   ├── js/
│   │   └── questionnaire.js
│   │
│   └── css/
│       └── styles.css
│
└── programs/                    # Répertoire pour les programmes sauvegardés
```

## 🚀 Commandes de copie

### Avec Git (recommandé):
```bash
git clone https://github.com/your-repo/antigravity-github.git /var/www/essor-active
cd /var/www/essor-active
npm install
```

### Avec SCP:
```bash
# Depuis votre machine locale
scp -r ./antigravity-github/* user@your-server:/var/www/essor-active/
```

### Avec Rsync:
```bash
# Synchronisation plus efficace
rsync -avz --delete ./antigravity-github/ user@your-server:/var/www/essor-active/
```

## ✅ Vérification après copie

Sur le serveur, exécuter:
```bash
cd /var/www/essor-active

# Vérifier les fichiers critiques
ls -la server.js
ls -la public/questionnaire.html
ls -la public/js/questionnaire.js
ls -la public/css/styles.css

# Installer les dépendances
npm install

# Vérifier les permissions
chmod -R 755 public/
chmod -R 755 programs/

# Lancer le serveur
npm start
# ou
pm2 start ecosystem.config.js
```

## 🚨 Fichiers à NE PAS copier

```bash
# Optionnels ou générés:
- node_modules/        (recréé par npm install)
- package-lock.json    (regénéré par npm install)
- .env                 (créé manuellement sur le serveur)
- debug.log            (généré par le serveur)
- logs/                (créé automatiquement par PM2)
- .git/                (optionnel, clone de git suffit)
```

## 📝 Fichiers de configuration OBLIGATOIRES

À créer sur le serveur:

### 1. `.env` (copier de `.env.production` et personnaliser)
```bash
cp .env.production .env
nano .env
```

### 2. Permissions des répertoires
```bash
mkdir -p logs programs
chmod -R 755 public/
chmod -R 755 programs/
```

---

**Checklist de copie:**

- [ ] `server.js` ✓
- [ ] `package.json` ✓
- [ ] `ecosystem.config.js` ✓
- [ ] `public/` (all files) ✓
- [ ] `public/js/questionnaire.js` ✓
- [ ] `public/css/styles.css` ✓
- [ ] `.env.production` ✓
- [ ] Documentation (DEPLOYMENT.md, README-PRODUCTION.md) ✓

---

**Date:** 28/12/2025  
**Version:** 1.0.0
