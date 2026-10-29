# DIMENSION — Material Board (étape 1)

Cette branche contient uniquement la planche de matériaux 1280×720 demandée.

## Lancer

```bash
npm install
npm run dev
npm run build
```

## Étape 1
- Matériaux globaux dans `src/styles/materials.css`.
- Mise en page uniquement dans `MaterialBoard.module.css`.
- `--chrome` pilote l'opacité des couches miroir. À `0`, seule la base inox mate reste visible.
- Texture brossée SVG `feTurbulence` en data-URI, avec PNG de repli 3.2 Ko.
- Contrastes calculés dans l'interface. Minimum actuel du menu : 9.3:1.
- Polices fournies via Fontsource et bundlées localement par Vite.
- Navigation de la planche : flèches haut/bas pour déplacer le focus du menu.

## Volontairement non implémenté
Audio, providers, Zustand, splash final, navigation multi-écrans, click wheel, rail, pression et Spotify.
