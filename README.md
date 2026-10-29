# DIMENSION — Après le bruit.

Un player musical pour le calme après le service. La structure reste celle du projet : navigation latérale, deux sélections Silence / Retour, cartes de morceaux et lecteur persistant. Le violet devient une lavande vieillie `#C8B6D0`, associée à `#332A3A`, avec un grain presque imperceptible limité aux pochettes ; le fond est uni. Les sous-titres et phrases décoratives ont été retirés.

## Écouter

La sélection **Après le service** réunit Weird Fishes / Arpeggi — From the Basement (Radiohead) et Chicago (Sufjan Stevens). C’est une proposition éditoriale pour une atmosphère calme, mélancolique et alternative, pas une affirmation sur les goûts d’un personnage ni une bande originale officielle.

- Aucun son au chargement. Le bouton **Silence** arrête l’audio ou ferme le lecteur.
- Les titres sont proposés via les vidéos des chaînes officielles des artistes. Le lecteur YouTube reste visible ; les morceaux ne sont ni téléchargés ni réhébergés.
- Lecture/pause et volume réglable directement dans DIMENSION via l’API officielle YouTube. Le volume est conservé en changeant de morceau ou de source, et reste accessible sur mobile.
- Une vidéo indisponible affiche une erreur et un lien vers sa page officielle.
- **Lo-fi original** conserve les dix fichiers audio et les GIF d’origine.
- Recherche par titre/artiste, filtres Silence / Retour, navigation clavier et responsive.
- Le lecteur local conserve progression, volume, pause et changement de piste. Changer de source arrête la précédente.
- Le logo est une silhouette d’ours de profil, sans visage de mascotte. Les titres et artistes n’apparaissent qu’une fois sur les nouvelles cartes ; labels et sous-titres décoratifs sont supprimés.

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

Ne jamais exposer de clé Management API dans une variable `REACT_APP_*`. La migration des comptes historiques Auth0 reste une opération séparée. L’activation et le cycle de connexion réel Prelude doivent encore être vérifiés avant de déclarer cette intégration opérationnelle. L’écoute publique est indépendante de la connexion.

## Structure et sources

- `src/components/MusicArchive.jsx` : interface, transport local et sélection du lecteur vidéo.
- `src/components/MusicVideoPlayer.jsx` : intégration YouTube, lecture/pause, volume et nettoyage du lecteur.
- `src/data/datamusic.json` : catalogue d’origine, inchangé.
- `src/data/afterhours.json` : titres, artistes et identifiants des vidéos officielles YouTube de la nouvelle sélection.
- `src/style/dimension.css` : responsive et identité visuelle.
- `src/auth/` : session Prelude.
- `public/brand/` et `public/favicon.svg` / `.ico` : logo ours vectoriel original et icônes. Le monogramme D précédent est conservé comme fichier historique mais n’est plus utilisé.
- `public/images/dimension-after-hours.webp` : photographie illustrative originale générée avec l’outil intégré ImageGen, pas une image extraite de la série. Les couvertures typographiques sont des créations d’interface, pas les pochettes officielles des albums.

Sources : [musique FX](https://www.fxnetworks.com/music), [documentation YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference). Chaque vidéo du catalogue renvoie à `https://www.youtube.com/watch?v={videoId}`.

Prompt de l’image (outil ImageGen intégré) :

> Use case: photorealistic-natural. Asset type: wide cinematic photograph for the DIMENSION music player, 1536x1024 landscape. Original documentary 35mm film photograph of a small independent restaurant kitchen after closing, empty and quiet. Worn stainless steel prep counter in the foreground, a neatly folded white towel, one small drinking glass, utilitarian shelves and a dim practical light, back doorway almost dark. Intimate lived-in Chicago restaurant atmosphere, restrained composition, real imperfect surfaces, subtle silver grain. Mostly charcoal and desaturated warm grey, faint muted aubergine in shadows. Sideways low eye-level composition, no people, no lettering, no logos, no brand names, no dramatic neon, no luxury restaurant styling. A quiet moment after a long service, emotionally cinematic but simple, authentic and understated.

## Liens

- [GitHub](https://github.com/Mahkalix/Dimension)
- [PR #3](https://github.com/Mahkalix/Dimension/pull/3)
- [Aperçu de la PR](https://dimension-git-codex-dimension-editorial-mahkalixs-projects.vercel.app/)
- [Production](https://dimension-gamma.vercel.app/)
- [Vercel](https://vercel.com/mahkalixs-projects/dimension)

Vercel : commande `npm run build`, dossier `build/`. Le script historique `npm run deploy` cible GitHub Pages.
