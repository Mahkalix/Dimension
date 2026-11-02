# The Den

*Le lecteur musical que Carmy aurait dans sa cuisine dans **The Bear**.*

La clé tourne dans la porte de service. Carmy pose son carnet près de la balance, met une casserole d’eau sur le feu et commence à éplucher un oignon. Au bout de deux coups de couteau, il s’arrête. Il manque quelque chose. Il s’essuie un doigt sur son tablier et lance *Embrace*. Cette fois, il peut commencer.

J’ai imaginé The Den en partant de ce geste. Si Carmy gardait un lecteur à portée de main, à côté de ses recettes, à quoi ressemblerait-il ? J’aimais l’idée d’un objet assez personnel pour qu’on lui reconnaisse un propriétaire. Le grain du papier vient de son carnet. La petite maison qui signe le projet pourrait être un dessin oublié dans la marge.

### Sur la platine

*Embrace*, *Good Night*, *Lofi Study*… Chaque piste a sa carte et sa boucle animée. Choisis un morceau, lance la lecture et règle le volume. Dans la cuisine que j’imagine, Carmy le baisse juste assez pour entendre l’eau frémir derrière lui.

---

## Lancer le lecteur chez soi

Avec Node.js et npm installés, ouvre un terminal et lance ces commandes.

```bash
git clone https://github.com/Mahkalix/THEDEN.git
cd THEDEN
npm install
npm start
```

Ouvre le lecteur sur [localhost au port 3000](http://localhost:3000).

## Côté code

Le lecteur utilise React 18 et l’audio natif du navigateur. Pour suivre le trajet d’un morceau, pars de [son entrée dans le catalogue](src/data/datamusic.json), puis ouvre [le composant qui pilote la lecture](src/components/musicplayer.jsx).

| Pour… | Où regarder |
| --- | --- |
| Retrouver les fichiers audio et les animations | [Morceaux](public/music) · [GIF](public/gif) |
| Parcourir les deux écrans | [Routes React Router](src/router/router.jsx) |
| Adapter la connexion Auth0 | [Configuration](src/index.js) |

Pour utiliser ton propre tenant Auth0, configure son domaine et son identifiant client. Autorise aussi l’origine de l’application dans Auth0. En local, le retour de connexion utilise `http://localhost:3000`.

Lance les tests avec `npm test`. Pour préparer le déploiement, `npm run build` génère les fichiers statiques dans `build/`. Le projet Vercel s’appelle `theden`. La commande historique `npm run deploy` cible GitHub Pages. [Tableau de bord Vercel](https://vercel.com/mahkalixs-projects/theden)
