# 🚀 GUIDE DE DÉPLOIEMENT ESSOR ACTIVE

## ✅ ÉTAT ACTUEL

- ✅ Git initialisé
- ✅ Fichiers commités localement
- ✅ Configuration Git : Steven Charron (steven.charron44@gmail.com)

---

## 📋 ÉTAPES À SUIVRE

### **ÉTAPE 1 : Créer le Repository GitHub**

1. **Ouvrez votre navigateur** et allez sur : https://github.com/new

2. **Remplissez le formulaire :**
   - Repository name : `essor-active`
   - Description : `Application ESSOR ACTIVE - Fitness & Wellness`
   - Visibilité : **Private** (recommandé) ou Public
   - ⚠️ **NE COCHEZ PAS** "Add a README file"
   - ⚠️ **NE COCHEZ PAS** "Add .gitignore"
   - ⚠️ **NE COCHEZ PAS** "Choose a license"

3. **Cliquez sur "Create repository"**

4. **Copiez l'URL du repository** qui apparaît (format : `https://github.com/VOTRE_USERNAME/essor-active.git`)

---

### **ÉTAPE 2 : Pousser le Code vers GitHub**

Une fois le repository créé, **exécutez ces commandes dans PowerShell** :

```powershell
cd C:\Users\User\.gemini\antigravity\scratch\essor-questionnaire

# Ajouter le remote GitHub (remplacez l'URL par la vôtre)
git remote add origin https://github.com/VOTRE_USERNAME/essor-active.git

# Renommer la branche en main
git branch -M main

# Pousser le code vers GitHub
git push -u origin main
```

⚠️ **Si GitHub vous demande de vous authentifier :**
- Utilisez votre **Personal Access Token** (pas votre mot de passe)
- Pour créer un token : https://github.com/settings/tokens
- Permissions nécessaires : `repo` (Full control of private repositories)

---

### **ÉTAPE 3 : Connecter Render au Repository GitHub**

1. **Allez sur Render** : https://dashboard.render.com

2. **Trouvez votre service ESSOR ACTIVE** dans la liste

3. **Cliquez sur le service** pour ouvrir ses détails

4. **Allez dans "Settings"** (dans le menu de gauche)

5. **Section "Build & Deploy"** :
   - Cliquez sur **"Connect Repository"** ou **"Change Repository"**
   - Autorisez Render à accéder à votre GitHub si nécessaire
   - Sélectionnez le repository `essor-active`
   - Branche : `main`

6. **Sauvegardez les changements**

---

### **ÉTAPE 4 : Configurer les Variables d'Environnement sur Render**

⚠️ **IMPORTANT** : Vérifiez que ces variables sont configurées dans Render :

1. Dans votre service Render, allez dans **"Environment"**

2. Ajoutez/vérifiez ces variables :
   - `SENDGRID_API_KEY` : Votre clé API SendGrid
   - `SENDGRID_FROM_EMAIL` : contact@essor-active.com (ou votre email vérifié)
   - `NODE_ENV` : production
   - `PORT` : 10000 (ou le port utilisé par Render)

3. **Sauvegardez**

---

### **ÉTAPE 5 : Déployer**

Render devrait déployer automatiquement après la connexion du repository.

**Si ce n'est pas le cas :**

1. Allez dans l'onglet **"Manual Deploy"**
2. Cliquez sur **"Deploy latest commit"**
3. Attendez que le déploiement se termine (suivez les logs)

---

## 🔍 VÉRIFICATION POST-DÉPLOIEMENT

Une fois le déploiement terminé, testez :

### ✅ Page de Connexion Client
```
https://essor-active.com/login.html
```
**Attendu :** Page de connexion/inscription client standard (pas admin)

### ✅ Route Admin Supprimée
```
https://essor-active.com/admin
```
**Attendu :** Erreur 404

### ✅ Dashboard Client
```
https://essor-active.com/dashboard.html
```
**Attendu :** Interface utilisateur standard uniquement (aucun élément admin)

### ✅ Endpoint API Admin Supprimé
Testez avec curl ou Postman :
```
POST https://essor-active.com/api/admin-login
```
**Attendu :** Erreur 404

---

## 🆘 EN CAS DE PROBLÈME

### Problème : "Authentication failed" lors du push GitHub

**Solution :**
1. Créez un Personal Access Token : https://github.com/settings/tokens
2. Cliquez sur "Generate new token" → "Generate new token (classic)"
3. Cochez `repo`
4. Générez et copiez le token
5. Utilisez le token comme mot de passe lors du push

### Problème : Le déploiement échoue sur Render

**Solution :**
1. Vérifiez les logs dans Render (onglet "Logs")
2. Vérifiez que `package.json` contient le bon script de démarrage
3. Vérifiez que les variables d'environnement sont configurées

### Problème : Le site affiche toujours l'ancienne version

**Solution :**
1. Videz le cache du navigateur (Ctrl + Shift + R)
2. Vérifiez que le déploiement est terminé dans Render
3. Attendez quelques minutes pour la propagation

---

## 📝 COMMANDES RÉCAPITULATIVES

```powershell
# 1. Aller dans le dossier du projet
cd C:\Users\User\.gemini\antigravity\scratch\essor-questionnaire

# 2. Ajouter le remote GitHub (remplacez par votre URL)
git remote add origin https://github.com/VOTRE_USERNAME/essor-active.git

# 3. Renommer la branche
git branch -M main

# 4. Pousser vers GitHub
git push -u origin main
```

---

## ✅ CHECKLIST

- [ ] Repository GitHub créé (`essor-active`)
- [ ] Code poussé vers GitHub (branche `main`)
- [ ] Repository connecté à Render
- [ ] Variables d'environnement configurées sur Render
- [ ] Déploiement lancé et terminé
- [ ] `essor-active.com/login.html` affiche la page client
- [ ] `essor-active.com/admin` retourne 404
- [ ] `essor-active.com/dashboard.html` affiche l'interface client uniquement

---

## 🎯 RÉSULTAT ATTENDU

Après ces étapes, votre site `essor-active.com` sera mis à jour avec :

- ✅ Page `login.html` 100% client (connexion/inscription)
- ✅ Dashboard sans aucun élément admin
- ✅ Aucune route `/admin` accessible
- ✅ Aucun endpoint `/api/admin-login`
- ✅ Flux utilisateur uniforme pour tous

---

**Besoin d'aide ? Suivez les étapes une par une et faites-moi savoir si vous rencontrez un problème !**
