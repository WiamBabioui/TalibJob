<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TaliJob</title>
    <link rel="stylesheet" href="/assets/index-BzhAWTkw.css">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/index-hyYYgH6y.js"></script>
  </body>
</html>
```
> ⚠️ Les noms de fichiers JS/CSS changent à chaque `build`. Vérifie les noms exacts dans `back/public/assets/`.

---

## Fix 4 — Corriger le Procfile
```
web: vendor/bin/heroku-php-apache2 public/