# DIMENSION · configuration des comptes
Le lecteur est accessible sans compte. L’identité DIMENSION dépend d’Auth0. Spotify demande son propre consentement. Le compte Spotify sert à afficher le profil et le lecteur musical utilise son intégration YouTube existante.

## Configuration locale
Copier .env.example dans .env.local. Configurer APP_BASE_URL=http://127.0.0.1:3000, AUTH0_DOMAIN=dev-s4cqy56nmufsd1nf.us.auth0.com et AUTH0_CLIENT_ID=wu1hMC3jEzhtP8te5ChZ08FpuCfV8C17.
Dans Auth0, utiliser une application Regular Web Application, méthode d’authentification du client compatible avec le SDK, et renseigner AUTH0_CLIENT_SECRET. Générer AUTH0_SECRET avec 32 octets aléatoires, par exemple avec la commande suivante.

    node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"

Dans les paramètres Auth0, enregistrer les Allowed Callback URLs, Allowed Logout URLs et Allowed Web Origins selon le tableau ci-dessous. Dans le dashboard Spotify Developer, créer une application Web API, enregistrer exactement le redirect URI, puis copier SPOTIFY_CLIENT_ID et SPOTIFY_CLIENT_SECRET dans l’environnement serveur. En mode développement, autoriser le compte Spotify de test dans le dashboard si requis.

| Paramètre | Local | Vercel |
|---|---|---|
| Auth0 callback | http://127.0.0.1:3000/auth/callback | https://HOTE/auth/callback |
| Auth0 logout | http://127.0.0.1:3000 | https://HOTE |
| Auth0 web origin | http://127.0.0.1:3000 | https://HOTE |
| Spotify redirect URI | http://127.0.0.1:3000/api/spotify/callback | https://HOTE/api/spotify/callback |

Remplacer HOTE par le domaine stable du déploiement. Définir APP_BASE_URL sur cette origine. Configurer les sept variables dans le bon environnement Vercel, puis redéployer. Aucun secret ne doit avoir le préfixe NEXT_PUBLIC_. Démarrer avec npm install puis npm run dev.

## Fonctionnement
Le SDK Auth0 gère le login, le callback et le logout. Connecter Spotify exige une session DIMENSION. Le serveur crée un état aléatoire valable dix minutes, vérifie sa correspondance au retour et échange le code avec Spotify. Il lit /v1/me, conserve uniquement le nom, la photo et l’identifiant dans la session chiffrée Auth0 et abandonne le jeton. Dissocier utilise un POST de même origine. Une déconnexion Auth0 termine également cette association de session. Pour retirer le consentement accordé auprès de Spotify, utiliser la gestion des applications dans le compte Spotify.

## Vérification
Construire avec npm run build. Après npm run start, exécuter scripts/check-interface.mjs avec Node, Chrome installé et TEST_URL réglé sur l’origine locale. Ce test en contexte vierge produit les captures accueil, bibliothèque et lecteur dans docs/screens. La capture lecteur vérifie le panneau ouvert. Elle ne prouve pas une diffusion audio effective. Les deux captures authentifiées doivent être prises après une vraie connexion aux fournisseurs.
