# DIMENSION — A place has a sound.

Player musical à la direction artistique éditoriale : papier, charbon, rouge signal, archives numérotées et photographie de studio originale.

## Expérience

- Lecture des dix fichiers audio existants, pause, piste précédente/suivante, progression, volume et sourdine.
- Lecteur persistant entre les vues Now Playing, The Selection, Sessions et Archive.
- Recherche dans la collection et deux séquences d’écoute avec leur propre ordre de lecture.
- Vue immersive, version mobile compacte, contrôles clavier natifs et focus visibles.
- Oscilloscope calculé à partir du son réel via Web Audio ; désactivé avec `prefers-reduced-motion`.

L’écoute et les archives sont publiques. La connexion Prelude reste accessible séparément ; son activation n’est pas nécessaire pour écouter les fichiers déjà publics. Les métadonnées disponibles ne renseignent pas les artistes : aucun nom d’artiste, BPM ou taux d’échantillonnage n’a été inventé. La photographie de studio est une création illustrative générée, et non la pochette officielle des morceaux.

## Développement

Node.js 22 minimum (testé avec Node.js 24).

```bash
npm ci
npm start
npm test -- --watchAll=false --runInBand
npm run build
```

## Prelude Auth

Copier `.env.example` vers `.env.local` et renseigner `REACT_APP_PRELUDE_DOMAIN` avec le domaine de l’application Auth activée, sans protocole ni chemin. Configurer OTP e-mail et les origines autorisées dans Prelude. Sur Vercel, ajouter la même variable dans les environnements concernés puis reconstruire.

Ne jamais exposer de clé Management API dans une variable `REACT_APP_*`. La migration des comptes historiques Auth0 reste une opération séparée. L’activation et le cycle de connexion réel Prelude doivent encore être vérifiés avant de déclarer cette intégration opérationnelle.

## Structure

- `src/components/MusicArchive.jsx` : interface, transport audio, archives, sessions et oscilloscope.
- `src/style/dimension.css` : système visuel et responsive.
- `src/data/datamusic.json` : catalogue audio existant.
- `src/auth/` : intégration de session Prelude.
- `public/images/dimension-studio.png` : visuel éditorial original généré avec l’outil intégré ImageGen.

## Visuel

Prompt utilisé : « Documentary 35mm black and white film photograph of an empty intimate analog recording studio at night: vintage mixing console, reel-to-reel tape machine, dark acoustic wall, small recording-booth window, practical lamp glow, charcoal shadows, ivory highlights, silver grain. No people, lettering, logos or watermark. Square album-cover photograph. »

## Liens

- [GitHub](https://github.com/Mahkalix/Dimension)
- [Production](https://dimension-gamma.vercel.app/)
- [Vercel](https://vercel.com/mahkalixs-projects/dimension)

Vercel : commande `npm run build`, dossier `build/`. Le script historique `npm run deploy` cible GitHub Pages.
