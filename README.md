# Dimension

Dimension est une application web React avec authentification Auth0 et navigation via React Router.

## Liens du projet

- [Dépôt GitHub](https://github.com/Mahkalix/Dimension)
- [Projet Vercel](https://vercel.com/mahkalixs-projects/dimension) — tableau de bord des déploiements, accessible aux membres du projet.

## Technologies

- React 18 et Create React App (`react-scripts` 5)
- React Router 6
- Auth0 pour l’authentification
- Sass pour les styles
- Axios et React Audio Player

## Démarrage local

Installer Node.js et npm, puis exécuter :

```bash
git clone https://github.com/Mahkalix/Dimension.git
cd Dimension
npm install
npm start
```

L’application est disponible sur [localhost:3000](http://localhost:3000).

L’intégration Auth0 est configurée dans `src/index.js`. Pour utiliser votre propre tenant, adapter son domaine et son identifiant client, ainsi que les URL autorisées dans Auth0. L’URL de retour utilisée par l’application correspond à son origine (`window.location.origin`).

## Commandes

| Commande | Description |
| --- | --- |
| `npm start` | Démarrer le serveur de développement. |
| `npm test` | Lancer les tests en mode interactif. |
| `npm run build` | Générer la version de production dans `build/`. |

## Organisation

- `src/App.js` : structure générale de l’application.
- `src/router/router.jsx` : routes `/` et `/Accueil`.
- `src/pages/` : pages de l’application.
- `src/components/` : composants, dont l’en-tête et le pied de page.
- `src/style/` : styles.

## Vercel

Le projet Vercel se nomme `dimension`. Pour produire les fichiers statiques de cette application Create React App, utiliser `npm run build` ; le dossier généré est `build/`.

Le script historique `npm run deploy` utilise GitHub Pages ; il ne déploie pas sur Vercel.
