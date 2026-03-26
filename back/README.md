# AJI TA5DEM – Backend Laravel 11

## 📁 Structure du projet

```
talib-job-laravel/
├── app/
│   ├── Http/Controllers/
│   │   ├── AuthEtudiantController.php     ← Register, Login, Logout, Me
│   │   ├── AuthEntrepriseController.php   ← Register, Login, Logout, Me
│   │   ├── EtudiantController.php         ← Dashboard, Profil, Candidatures, Paramètres
│   │   ├── EntrepriseController.php       ← Dashboard entreprise, Gérer candidatures
│   │   └── MissionController.php          ← Offres publiques, Postuler, Publier
│   └── Models/
│       ├── Etudiant.php
│       ├── Entreprise.php
│       ├── Mission.php
│       ├── Candidature.php
│       ├── Notification.php
│       └── Message.php
├── config/
│   ├── cors.php          ← CORS autorisé pour localhost:5173
│   └── sanctum.php       ← Auth token
├── database/
│   ├── migrations/       ← Correspond exactement au schéma SQL fourni
│   └── seeders/          ← Données de test (2 étudiants, 2 entreprises, 4 offres)
├── routes/api.php        ← Toutes les routes API
├── bootstrap/app.php     ← Config Laravel 11
└── .env.example          ← À copier en .env
```

---

## ⚙️ Installation (15 minutes)

### Prérequis
- PHP 8.2+ → https://www.php.net
- Composer → https://getcomposer.org
- XAMPP (MySQL) → https://www.apachefriends.org

---

### Étape 1 — Placer le dossier
Copiez `talib-job-laravel` dans un répertoire de votre choix, par exemple :
```
C:\Users\hp\OneDrive\Bureau\talib-job-laravel\
```

### Étape 2 — Installer les dépendances
```bash
cd talib-job-laravel
composer install
```

### Étape 3 — Configurer l'environnement
```bash
copy .env.example .env
php artisan key:generate
```

Ouvrir `.env` et vérifier :
```env
DB_HOST=127.0.0.1
DB_PORT=3306          # ou 3307 selon votre XAMPP
DB_DATABASE=systeme_recrutement
DB_USERNAME=root
DB_PASSWORD=          # vide si XAMPP standard
```

### Étape 4 — Créer la base de données
Dans phpMyAdmin (http://localhost/phpmyadmin) :
- Créer la base `systeme_recrutement`

Puis lancer les migrations :
```bash
php artisan migrate
```

### Étape 5 — Insérer les données de test
```bash
php artisan db:seed
```

### Étape 6 — Démarrer le serveur Laravel
```bash
php artisan serve
```
→ Backend disponible sur **http://localhost:8000**

---

## 🔗 Toutes les routes API

### 🔓 Publiques (sans token)
| Méthode | URL                         | Description              |
|---------|-----------------------------|--------------------------|
| POST    | `/api/etudiant/register`    | Inscription étudiant     |
| POST    | `/api/etudiant/login`       | Connexion étudiant       |
| POST    | `/api/entreprise/register`  | Inscription entreprise   |
| POST    | `/api/entreprise/login`     | Connexion entreprise     |
| GET     | `/api/missions`             | Liste des offres actives |
| GET     | `/api/missions/{id}`        | Détail d'une offre       |

### 🔐 Étudiant (Bearer Token requis)
| Méthode | URL                                   | Description              |
|---------|---------------------------------------|--------------------------|
| GET     | `/api/etudiant/dashboard`             | Tableau de bord          |
| GET     | `/api/etudiant/candidatures`          | Mes candidatures         |
| GET     | `/api/etudiant/profil`                | Mon profil               |
| PUT     | `/api/etudiant/profil`                | Modifier profil          |
| PUT     | `/api/etudiant/parametres`            | Changer mot de passe...  |
| POST    | `/api/etudiant/upload-cv`             | Uploader CV (PDF)        |
| POST    | `/api/etudiant/upload-photo`          | Uploader photo profil    |
| POST    | `/api/etudiant/missions/{id}/postuler`| Postuler à une offre     |
| POST    | `/api/etudiant/logout`                | Déconnexion              |

### 🔐 Entreprise (Bearer Token requis)
| Méthode | URL                                          | Description              |
|---------|----------------------------------------------|--------------------------|
| GET     | `/api/entreprise/dashboard`                  | Tableau de bord          |
| GET     | `/api/entreprise/missions`                   | Mes offres publiées      |
| POST    | `/api/entreprise/missions`                   | Publier une offre        |
| GET     | `/api/entreprise/missions/{id}/candidatures` | Candidats reçus          |
| PUT     | `/api/entreprise/candidatures/{id}/statut`   | Accepter / Refuser       |
| POST    | `/api/entreprise/logout`                     | Déconnexion              |

---

## 🔑 Comptes de test

| Type        | Email                      | Mot de passe |
|-------------|----------------------------|--------------|
| Étudiant 1  | youssef@etu.ma             | 123456       |
| Étudiant 2  | sara@etu.ma                | 123456       |
| Entreprise 1| rh@techinnov.ma            | 123456       |
| Entreprise 2| contact@creativeminds.ma   | 123456       |

---

## 🔧 Mettre à jour le frontend React

Dans `src/services/api.jsx`, remplacer `baseURL` :

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',  // ← serveur Laravel
  headers: { 'Content-Type': 'application/json' },
});

// Ajouter le token automatiquement à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

Exemple d'appel login dans le frontend :
```javascript
const res = await api.post('/api/etudiant/login', { email, motDePasse });
localStorage.setItem('token', res.data.token);
localStorage.setItem('etudiant', JSON.stringify(res.data.etudiant));
```

---

## 🧪 Tester avec Postman

**Login :**
```
POST http://localhost:8000/api/etudiant/login
Body (JSON) : { "email": "youssef@etu.ma", "motDePasse": "123456" }
```

**Dashboard (avec token) :**
```
GET http://localhost:8000/api/etudiant/dashboard
Headers : Authorization: Bearer {token_reçu_au_login}
```
