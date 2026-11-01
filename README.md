# DIMENSION · Planche de matériaux

Étape 1 pour le passe de cuisine. La composition 1280 × 720 se réduit proportionnellement avec des bandes noires. Les cinq échantillons, le bouton, le curseur, la barre de titre et les cinq lignes du menu sont des spécimens statiques. Playlists illustre la sélection.

## Lancer

```sh
npm ci
npm run dev
npm run build
```

## Sources

- `src/screens/MaterialBoard/MaterialBoard.tsx` compose la planche.
- `src/screens/MaterialBoard/MaterialBoard.module.css` règle les dimensions et la composition.
- `src/styles/materials.css` définit les cinq finitions et la variable `--chrome`.

Le texte de la sélection repose sur une zone mate pour garder le reflet hors des lettres. L’inox combine turbulence SVG et lignes CSS. Archivo est retenue pour sa chasse variable, qui permettra un mot-symbole large au splash.

Restent pour les étapes suivantes le splash, la navigation, les deux fournisseurs musicaux, les tickets et les réglages. Le futur lecteur Spotify nécessitera Premium et, en mode développement, un utilisateur autorisé.
