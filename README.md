# Portfolio de Fabrice Hountondji

Site statique (HTML, CSS, JavaScript) qui présente mon profil d'analyste et
d'ingénieur de données, avec un **Data Lab** interactif branché sur les données
de ma plateforme aéronautique.

## Structure

```
portfolio-fabrice/
├── index.html                  Page unique du portfolio
├── assets/
│   ├── css/style.css           Styles (palette, mise en page, responsive)
│   ├── js/main.js              Menu mobile et lien actif
│   ├── js/datalab.js           Explorateur CSV, tableau de bord, notebook
│   ├── js/notebook-cells.js    Code Python et SQL des cellules du notebook
│   ├── img/                    Mettre ici photo.png (portrait détouré)
│   └── CV_Fabrice_Hountondji.pdf
├── data/aviation/              CSV de l'entrepôt (voir son README)
└── scripts/generate_sample_data.py   Génère les CSV d'exemple
```

## Lancer en local

Les navigateurs bloquent la lecture de fichiers locaux, il faut donc un petit serveur :

```bash
cd portfolio-fabrice
python -m http.server 8000
```

Puis ouvrir http://localhost:8000.

## Le Data Lab

1. **Fichiers de l'entrepôt** : schéma en étoile, aperçu de chaque CSV et téléchargement.
2. **Tableau de bord** : indicateurs et graphiques Chart.js calculés en direct
   depuis les CSV, filtrables par compagnie.
3. **Notebook Python et SQL** : Python (Pyodide) tourne dans le navigateur du
   visiteur, sans serveur. Les CSV sont copiés dans `/data/aviation/` ; pandas,
   matplotlib et sqlite3 sont disponibles. `display(df)` affiche un tableau, les
   graphiques matplotlib s'affichent automatiquement. Ctrl + Entrée exécute une cellule.

Pour ajouter ou modifier une cellule par défaut, éditez `assets/js/notebook-cells.js`.

## À personnaliser

- `assets/img/photo.png` : votre portrait (idéalement fond transparent, format 4:5).
  Sans ce fichier, un visuel avec vos initiales s'affiche.
- `data/aviation/*.csv` : remplacez les données d'exemple par vos exports réels.
- Vérifiez l'adresse courriel dans `index.html` (reprise telle quelle du CV).

## Mise en ligne

Le site est 100 % statique : GitHub Pages, Netlify ou Vercel fonctionnent sans
configuration. Poussez le dossier dans un dépôt GitHub, puis activez Pages
(Settings > Pages > branche `main`, dossier racine).
