# Dimension

Dimension est une application d’écoute musicale React avec connexion par code e-mail via Prelude Auth.

## Liens

- [Site en ligne](https://dimension-gamma.vercel.app/)
- [Dépôt GitHub](https://github.com/Mahkalix/Dimension)
- [Projet Vercel](https://vercel.com/mahkalixs-projects/dimension)

## Technologies

React 18, Create React App 5, React Router 6, Prelude Auth (`@prelude.so/js-sdk`), Sass et React Audio Player.

## Démarrage local

Installer Node.js 22 ou supérieur et npm (validation effectuée avec Node.js 24), puis :

```bash
git clone https://github.com/Mahkalix/Dimension.git
cd Dimension
npm ci
```

Copier `.env.example` vers `.env.local` et renseigner `REACT_APP_PRELUDE_DOMAIN` avec le domaine de l’application **Prelude Auth activée**, sans `https://` ni chemin. Le domaine fourni par Prelude a généralement la forme `<auth-app-id>.session.prelude.dev` ; utiliser la valeur affichée dans Auth, pas l’identifiant du projet Verify.

```bash
npm start
```

L’application est disponible sur [localhost:3000](http://localhost:3000). Redémarrer le serveur après toute modification de `.env.local`.

## Configuration Prelude Auth

1. Activer **Auth** dans le tableau de bord Prelude. Au 28 octobre 2026, le compte Dimension affiche « Access Requested » : l’activation est encore en attente.
2. Créer ou sélectionner l’application Auth et activer la méthode OTP par **e-mail**, avec son modèle d’envoi Verify. Vérifier que l’accès à l’envoi d’e-mails est activé également.
3. Configurer les origines autorisées pour `http://localhost:3000`, `https://dimension-gamma.vercel.app` et, si nécessaire, les URL de prévisualisation utilisées pour les tests.
4. Ajouter `REACT_APP_PRELUDE_DOMAIN` dans les variables d’environnement Vercel concernées, puis reconstruire le déploiement : Create React App injecte cette valeur lors du build.
5. Vérifier avec un compte de test l’envoi et la vérification du code, le rechargement de page, l’expiration de session et la déconnexion avant de mettre la migration en production.

Le SDK gère la finalisation de connexion, les jetons et leur renouvellement. L’application restaure la session au chargement et la revérifie au retour sur l’onglet et toutes les minutes. Aucune clé Management API ne doit être placée dans une variable `REACT_APP_*`, dans le dépôt ou dans le navigateur.

Sans domaine configuré, le site reste consultable, mais le formulaire indique que la connexion est indisponible. L’intégration ne bascule pas vers Auth0.

La migration du code ne transfère pas les comptes historiques Auth0. Si leurs identifiants ou profils doivent être conservés, préparer une migration des utilisateurs avec Prelude avant le basculement.

Documentation officielle : [SDK Web](https://docs.prelude.so/auth/documentation/frontend-sdks/web/introduction), [configuration OTP](https://docs.prelude.so/auth/documentation/integration-guide/otp-login), [gestion des sessions](https://docs.prelude.so/auth/documentation/frontend-sdks/web/session-management), [migration des utilisateurs](https://docs.prelude.so/auth/documentation/migration-guide).

## Commandes

| Commande | Description |
| --- | --- |
| `npm start` | Serveur de développement. |
| `npm test` | Tests en mode interactif. |
| `npm test -- --watchAll=false --runInBand` | Tests automatisés de connexion. |
| `npm run build` | Version de production dans `build/`. |

## Organisation

- `src/auth/` : client Prelude et état de session React.
- `src/components/logbutton.jsx` : formulaire de connexion et déconnexion.
- `src/pages/Home.jsx` : affichage selon la session ; `/Accueil` utilise le même contrôle.
- `src/components/` : lecteur, cartes, en-tête et pied de page.
- `src/style/` : styles.

Les fichiers audio et images dans `public/` restent publics. Le contrôle d’affichage React ne protège pas des ressources serveur ; toute future API privée devra vérifier les jetons Prelude côté serveur.

## Déploiement Vercel

Projet : `dimension`. Commande de build : `npm run build`. Dossier de sortie : `build/`.

Le script historique `npm run deploy` cible GitHub Pages, pas Vercel.
