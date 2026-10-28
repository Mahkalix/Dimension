# DIMENSION — Find your own dimension.

Player musical lo-fi avec une navigation inspirée de Spotify et une identité violette : accent `#CD83F9`, fond de bannière `#2E0247`, surfaces sombres. La structure des collections originales est conservée : Lo-fi Girl, puis Lo-fi Boy, avec les dix morceaux, leurs GIF et le personnage au casque d’origine.

## Expérience

- Lecture des dix fichiers audio existants, pause, piste précédente/suivante, progression, volume et sourdine.
- Lecteur fixe en bas de page, conservant la lecture pendant la recherche et le filtrage.
- Recherche par titre et filtres All / Lo-fi Girl / Lo-fi Boy.
- Vue immersive, version mobile compacte, contrôles clavier natifs et focus visibles.
- Lecture automatique du morceau suivant ; cartes accessibles au clavier et transitions désactivées avec `prefers-reduced-motion`. Les GIF originaux restent animés.

L’écoute et les collections sont publiques. La connexion Prelude reste accessible séparément ; son activation n’est pas nécessaire pour écouter les fichiers déjà publics. Les métadonnées disponibles ne renseignent pas les artistes : aucun nom d’artiste, BPM ou taux d’échantillonnage n’a été inventé.

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

- `src/components/MusicArchive.jsx` : interface, collections Girl / Boy et transport audio.
- `src/style/dimension.css` : système visuel et responsive.
- `src/data/datamusic.json` : catalogue audio existant.
- `src/auth/` : intégration de session Prelude.
- `public/brand/dimension-mark.svg` et `public/favicon.svg` : monogramme D vectoriel original aux couleurs du projet.
- `public/gif/` et `src/assets/png/men.png` : visuels originaux réutilisés.

## Liens

- [GitHub](https://github.com/Mahkalix/Dimension)
- [Aperçu de la PR](https://dimension-git-codex-dimension-editorial-mahkalixs-projects.vercel.app/)
- [Production](https://dimension-gamma.vercel.app/)
- [Vercel](https://vercel.com/mahkalixs-projects/dimension)

Vercel : commande `npm run build`, dossier `build/`. Le script historique `npm run deploy` cible GitHub Pages.
