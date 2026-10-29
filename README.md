# DIMENSION

A kitchen has its own soundtrack.

DIMENSION est une PWA musicale expérimentale, inspirée par la matérialité des iPod Classic et l'atmosphère d'une cuisine professionnelle. Ce projet indépendant n'est affilié ni à FX, ni à Spotify.

## Parcours

1. Entrer dans une cuisine 3D construite avec Three.js et React Three Fiber.
2. Cliquer sur la tablette : la caméra s'en approche avec GSAP.
3. Explorer les ambiances, les morceaux et le lecteur dans une interface rétro-industrielle.

La scène possède une alternative lorsque WebGL est indisponible ou que le mouvement réduit est activé. Le lien « Passer l'introduction » permet d'accéder immédiatement à la musique.

## Fonctionnalités

- Cinq ambiances : Before Service, Yes Chef, Family Meal, After Hours, The Walk Home.
- Bibliothèque audio locale, intégration YouTube officielle pour les titres éditoriaux, recherche, albums et artistes.
- Favoris conservés dans le navigateur, file d'attente modifiable, lecture aléatoire et répétition.
- Player persistant avec pause, navigation, volume et progression sur les pistes locales.
- Interface responsive, commandes natives et focus clavier visible.
- Aucun son n'est lancé sans interaction.
- Authentification Prelude existante conservée (activation et configuration externes à vérifier).

Les fichiers musicaux locaux proviennent du dépôt historique. Vérifier séparément leur licence avant diffusion publique. Les morceaux de tiers passent par leur intégration officielle, ils ne sont pas réhébergés.

## Installation

Node.js 22 ou supérieur conseillé.

```bash
npm install
npm start
npm test -- --runInBand
npm run build
```

La migration de la scène introduit Three.js, React Three Fiber, Drei et GSAP. Le lockfile ancien a été retiré : régénérer un `package-lock.json` avec `npm install`, puis le versionner après validation du build.

## Déploiement

Vercel : `npm run build`, dossier `build`.

Preview : https://dimension-git-codex-dimension-editorial-mahkalixs-projects.vercel.app/

PR : https://github.com/Mahkalix/Dimension/pull/3

## État et limites

La refonte visuelle et les interactions ont été codées sur la branche de PR. Un déploiement correct ne prouve pas l'absence de bugs : vérifier la lecture réelle, WebGL et la navigation sur navigateurs desktop et mobiles avant fusion.

L'application reste sur Create React App / JavaScript pour préserver les fonctionnalités historiques. La migration Next.js + TypeScript prévue dans le cahier des charges n'a pas été réalisée et devra être décidée séparément.
