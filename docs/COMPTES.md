# Compte et profil The Den

Une seule connexion avec Spotify suffit. Le fournisseur Spotify intégré à NextAuth gère OAuth, la vérification state/PKCE, les cookies et la session chiffrée. La bibliothèque et la lecture audio restent accessibles sans compte.

## Variables serveur

NEXTAUTH_URL désigne l’origine du site. En Preview Vercel, l’application peut utiliser VERCEL_BRANCH_URL et, en production, VERCEL_PROJECT_PRODUCTION_URL si NEXTAUTH_URL est absent.

- NEXTAUTH_SECRET, secret aléatoire de session, configuré côté serveur.
- SPOTIFY_CLIENT_ID, identifiant de l’application Spotify Developer.
- SPOTIFY_CLIENT_SECRET, secret de l’application Spotify Developer.

Copier .env.example dans .env.local pour une configuration locale. Garder les secrets hors du dépôt et des variables NEXT_PUBLIC_. Le SDK utilise temporairement AUTH0_SECRET comme valeur de secours pour les déploiements existants ; Auth0 ne participe plus à la connexion.

## Spotify Developer

Enregistrer ces callbacks exacts selon l’environnement.

- Local, http://127.0.0.1:3000/api/auth/callback/spotify
- Déploiement, https://HOTE/api/auth/callback/spotify

Remplacer HOTE par le domaine stable du déploiement. Les anciens callbacks /auth/callback et /api/spotify/callback sont remplacés par celui du fournisseur NextAuth. Renseigner les deux variables Spotify dans Vercel puis redéployer.

## Parcours

Dans Compte, Continuer avec Spotify ouvre le consentement personnel du visiteur. Le retour crée une session The Den basée sur son identifiant Spotify. Mon profil affiche le nom, l’avatar et l’identifiant fournis par Spotify. Se déconnecter utilise la fonction signOut du SDK, avec sa protection CSRF.

La session dure au maximum sept jours. Aucun compte avec mot de passe The Den ni donnée de profil n’est créé dans une base de données. La session contient les informations de profil nécessaires à l’affichage ; le jeton Spotify ne part pas dans la session exposée au navigateur.

La connexion ne charge pas de catalogue Spotify. Tous les visiteurs écoutent les mêmes fichiers locaux sous CC BY 4.0. Les crédits sont disponibles dans Extras → Crédits et public/music/den/LICENSE.md.

## Accès des utilisateurs

Le mode Development de Spotify exige l’ajout des comptes autorisés dans Users and Access et limite leur nombre. La connexion avec un compte personnel n’annule pas ces restrictions. Vérifier les conditions actuelles pour un accès public dans https://developer.spotify.com/documentation/web-api/concepts/quota-modes.

## Vérification

npm run build
TEST_URL=http://127.0.0.1:3000 node scripts/check-interface.mjs
TEST_URL=http://127.0.0.1:3000 node scripts/check-figma-pages.mjs

Ces tests vérifient le parcours invité, la lecture audio et les vues responsive. Une connexion Spotify réelle nécessite les identifiants Developer et le consentement d’un compte autorisé.
