# DIMENSION — Après le bruit.

Un player musical pour le calme après le service. La structure reste celle du projet : navigation latérale, deux collections Girl / Boy, cartes de morceaux et lecteur persistant. Le violet `#CD83F9` et `#2E0247` reste présent, sur des surfaces charbon plus sobres.

## Écouter

La sélection **Après le service** réunit six morceaux : Together et Apart (Nine Inch Nails), Oh My Heart et Strange Currencies (R.E.M.), Via Chicago (Wilco), Let Down (Radiohead). C’est une sélection éditoriale inspirée de l’atmosphère de The Bear, pas une bande originale officielle ni une liste des préférences d’un personnage.

- Aucun son au chargement. Le bouton **Silence** met en pause l’audio local et ferme le lecteur externe.
- Un clic sur un titre de la sélection charge son lecteur Spotify officiel. La lecture, les éventuels extraits et la disponibilité dépendent de Spotify et du compte de l’auditeur. Un lien direct reste disponible.
- Aucun fichier audio commercial n’est téléchargé ni hébergé dans ce dépôt.
- **Lo-fi original** conserve les dix fichiers audio et les GIF d’origine, répartis comme avant entre Girl (6) et Boy (4).
- Recherche par titre ou artiste, filtres Girl / Boy, navigation clavier et responsive mobile.
- Les morceaux locaux gardent lecture/pause, précédent/suivant, progression, volume et sourdine. Les commandes Spotify restent celles du lecteur officiel.
- Passer d’une source à l’autre arrête la précédente. Les cartes de la nouvelle sélection sont statiques ; les GIF de la collection originale restent animés.

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

- `src/components/MusicArchive.jsx` : interface, transport local et sélection du lecteur Spotify.
- `src/data/datamusic.json` : catalogue d’origine, inchangé.
- `src/data/afterhours.json` : titres, artistes et identifiants Spotify de la nouvelle sélection.
- `src/style/dimension.css` : responsive et identité visuelle.
- `src/auth/` : session Prelude.
- `public/brand/` et `public/favicon.svg` / `.ico` : logo D original et icônes.
- `public/images/dimension-after-hours.webp` : photographie illustrative originale générée avec l’outil intégré ImageGen, pas une image extraite de la série. Les couvertures typographiques sont des créations d’interface, pas les pochettes officielles des albums.

Sources : [musique FX](https://www.fxnetworks.com/music), [discographie Nine Inch Nails](https://www.nin.com/discography/), [Strange Currencies — R.E.M.](https://www.universalmusic.it/popular-music/album/strange-currencies_36467971753/), [documentation Spotify Embed](https://developer.spotify.com/documentation/embeds/tutorials/creating-an-embed). Chaque identifiant du catalogue renvoie à `https://open.spotify.com/track/{spotifyId}`.

Prompt de l’image (outil ImageGen intégré) :

> Use case: photorealistic-natural. Asset type: wide cinematic photograph for the DIMENSION music player, 1536x1024 landscape. Original documentary 35mm film photograph of a small independent restaurant kitchen after closing, empty and quiet. Worn stainless steel prep counter in the foreground, a neatly folded white towel, one small drinking glass, utilitarian shelves and a dim practical light, back doorway almost dark. Intimate lived-in Chicago restaurant atmosphere, restrained composition, real imperfect surfaces, subtle silver grain. Mostly charcoal and desaturated warm grey, faint muted aubergine in shadows. Sideways low eye-level composition, no people, no lettering, no logos, no brand names, no dramatic neon, no luxury restaurant styling. A quiet moment after a long service, emotionally cinematic but simple, authentic and understated.

## Liens

- [GitHub](https://github.com/Mahkalix/Dimension)
- [PR #3](https://github.com/Mahkalix/Dimension/pull/3)
- [Aperçu de la PR](https://dimension-git-codex-dimension-editorial-mahkalixs-projects.vercel.app/)
- [Production](https://dimension-gamma.vercel.app/)
- [Vercel](https://vercel.com/mahkalixs-projects/dimension)

Vercel : commande `npm run build`, dossier `build/`. Le script historique `npm run deploy` cible GitHub Pages.
