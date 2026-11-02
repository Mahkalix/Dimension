# The Den

Imaginons Carmy, seul dans la cuisine de *The Bear*. Une marmite chauffe déjà. Sur le plan de travail, son carnet est ouvert à la page de la veille. Dans la marge, entre deux quantités, il a griffonné le nom d’un disque. Il lui reste quelques minutes avant que les autres arrivent. Il s’essuie les mains sur son tablier, retrouve le morceau et appuie sur lecture. À quoi ressemble le lecteur qu’il vient de toucher ?

The Den est né de cette question. J’ai imaginé un objet qui aurait sa place à côté de son carnet. L’interface reprend le grain du papier et des nuances de gris. La petite maison qui sert d’emblème, on pourrait la retrouver dessinée au crayon dans un coin de page. En ouvrant la bibliothèque, tu prends la place de Carmy pour un geste très simple : à toi de choisir le morceau qu’entendra la première personne à pousser la porte.

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
