# Portfolio — Next.js · TypeScript · Tailwind CSS · Decap CMS

Portfolio moderne, épuré et responsive, dont **tout le contenu est stocké dans des fichiers** (`/content`) et éditable via une interface d'administration (**Decap CMS**) ou directement en Markdown/MDX.

- **Accueil** : présentation (hero), accroche, liens GitHub / LinkedIn / X, projets mis en avant, aperçu du parcours.
- **Projets** (`/projets`) : liste avec filtres par technologie + fiche détaillée par projet (`/projets/<slug>`).
- **Parcours** (`/parcours`) : timeline des expériences et formations.
- **Contact** (`/contact`) : formulaire fonctionnel via [Web3Forms](https://web3forms.com) (gratuit), ou lien e-mail.
- Thème clair / sombre, SEO (métadonnées, `sitemap.xml`, `robots.txt`), pages pré-rendues en HTML statique.

**Fonctionnalités bonus**

- **Recherche rapide** : `Ctrl + K` / `⌘K` (ou `/`) ouvre une palette pour aller sur une page ou un projet, rechercher une technologie, copier l'e-mail, ouvrir LinkedIn ou changer de thème.
- **Section Compétences** sur l'accueil, éditable dans le CMS.
- **Bouton « Copier l'e-mail »** sur la page Contact.
- **Images de partage générées automatiquement** (aperçu LinkedIn, X, WhatsApp…) pour le site et pour chaque projet.
- Fiches projet : **barre de progression de lecture**, temps de lecture estimé, navigation projet précédent / suivant.
- **Animations d'apparition au défilement** en CSS pur, désactivées si l'utilisateur préfère réduire les animations.

## Sommaire

1. [Lancer le projet en local](#1-lancer-le-projet-en-local)
2. [Structure du projet](#2-structure-du-projet)
3. [Modifier le contenu](#3-modifier-le-contenu)
4. [Configurer le formulaire de contact](#4-configurer-le-formulaire-de-contact)
5. [Déployer gratuitement sur Vercel](#5-déployer-gratuitement-sur-vercel-pas-à-pas)
6. [Activer le CMS en ligne](#6-activer-le-cms-en-ligne-decap--github)

---

## 1. Lancer le projet en local

Prérequis : **Node.js 20.9 ou plus récent** ([nodejs.org](https://nodejs.org)) et Git.

```bash
git clone https://github.com/lucaslamoureuxll-design/portfolio.git
cd portfolio
npm install
cp .env.example .env.local   # facultatif : clés Web3Forms, OAuth GitHub…
npm run dev
```

Ouvrez <http://localhost:3000>. Les modifications du code ou du contenu sont rechargées automatiquement.

| Commande        | Rôle                                                     |
| --------------- | -------------------------------------------------------- |
| `npm run dev`   | Serveur de développement                                 |
| `npm run cms`   | Serveur local de Decap CMS (à lancer en plus de `dev`)   |
| `npm run build` | Build de production (vérifie aussi les types TypeScript) |
| `npm run start` | Lance le build de production                             |
| `npm run lint`  | Vérifie le code avec ESLint                              |

## 2. Structure du projet

```
content/                  ← TOUT le contenu éditable
├── settings/site.json    ← nom, accroche, présentation, e-mail, réseaux sociaux, SEO
├── projects/*.mdx        ← un fichier par projet
└── experiences/*.md      ← un fichier par expérience / formation
public/
├── admin/                ← Decap CMS (index.html + config.yml)
└── images/uploads/       ← images ajoutées via le CMS
src/
├── app/                  ← pages (App Router) : /, /projets, /projets/[slug], /parcours, /contact
│   └── api/auth|callback ← connexion GitHub pour le CMS en ligne
├── components/           ← composants UI (header, cartes, timeline, formulaire…)
└── lib/content.ts        ← lecture des fichiers de /content
```

## 3. Modifier le contenu

Deux méthodes au choix, qui modifient les mêmes fichiers.

### Option A — Via le CMS (interface graphique)

**En local** (aucun compte requis) :

```bash
npm run dev    # terminal 1
npm run cms    # terminal 2
```

Ouvrez <http://localhost:3000/admin>. Les modifications sont écrites directement dans `/content` : il suffit ensuite de faire un commit et un push.

**En ligne** (`https://votre-site.vercel.app/admin`) : connectez-vous avec GitHub. Chaque enregistrement crée un commit sur le dépôt, et Vercel redéploie le site automatiquement en environ une minute. Configuration : voir la [section 6](#6-activer-le-cms-en-ligne-decap--github).

Le CMS propose trois sections :

- **Réglages → Informations du site** : nom, titre, accroche, présentation, photo, CV, e-mail, réseaux sociaux, SEO.
- **Projets** : créer, modifier, mettre en avant sur l'accueil, passer en brouillon.
- **Parcours** : expériences professionnelles et formations.

### Option B — En éditant les fichiers

Directement dans votre éditeur, ou sur github.com (icône ✏️ sur un fichier).

**Ajouter un projet** : créez `content/projects/mon-projet.mdx` (le nom du fichier devient l'URL `/projets/mon-projet`) :

```mdx
---
title: Mon projet
summary: Une phrase affichée sur la carte du projet.
date: 2026-06-15
technologies:
  - Next.js
  - TypeScript
cover: /images/uploads/mon-projet.png   # facultatif (sinon un dégradé est généré)
github: https://github.com/moi/mon-projet # facultatif
demo: https://mon-projet.vercel.app       # facultatif
featured: true    # affiché sur l'accueil
draft: false      # true = masqué du site
---

## Contexte

Texte libre en **Markdown** : titres, listes, liens, images, tableaux, code…

<Callout>Les fichiers .mdx acceptent aussi des composants React (voir src/components/markdown.tsx).</Callout>
```

Les **filtres par technologie** sont générés automatiquement à partir du champ `technologies` de tous les projets. Les projets sont triés par date décroissante.

**Ajouter une étape au parcours** : créez `content/experiences/2027-stage.md` :

```md
---
kind: work            # work = expérience, education = formation
role: Stage développeur web
organization: Entreprise   # facultatif
location: Paris            # facultatif
start: "2027-04"      # "AAAA" ou "AAAA-MM"
end: "2027-06"        # vide = « aujourd'hui » ; égal à start = une seule date (ex. un diplôme)
current: false        # true = badge « En cours »
technologies:
  - React
---

Description courte (Markdown, facultatif).
```

La timeline est triée automatiquement du plus récent au plus ancien.

**Textes généraux** : éditez `content/settings/site.json` (présentation, e-mail, réseaux sociaux, compétences, texte du badge de disponibilité). Laissez un réseau social vide (`""`) pour masquer son icône.

**Images** : placez-les dans `public/images/uploads/` et référencez-les avec `/images/uploads/nom.png`.

## 4. Configurer le formulaire de contact

1. Rendez-vous sur <https://web3forms.com>, saisissez votre e-mail et récupérez votre **Access Key** (gratuit).
2. Ajoutez-la dans `.env.local` (en local) et dans les variables d'environnement Vercel (en ligne) :
   ```
   NEXT_PUBLIC_WEB3FORMS_KEY=votre-cle
   ```
3. Les messages arrivent directement dans votre boîte mail.

Sans clé, la page Contact affiche simplement votre adresse e-mail (lien `mailto:`).

> Vous préférez Formspree ? Remplacez l'URL `https://api.web3forms.com/submit` dans `src/components/contact-form.tsx` par l'URL de votre formulaire Formspree.

## 5. Déployer gratuitement sur Vercel (pas à pas)

Le plan **Hobby** de Vercel est gratuit et suffit largement pour un portfolio.

1. **Poussez le code sur GitHub** (branche `main`).
2. Créez un compte sur <https://vercel.com/signup> avec **« Continue with GitHub »**.
3. Cliquez sur **Add New… → Project**, puis **Import** à côté du dépôt `portfolio`.
   (S'il n'apparaît pas : *Adjust GitHub App Permissions* et autorisez le dépôt.)
4. Vercel détecte automatiquement **Next.js** : ne changez rien aux réglages de build.
5. Dépliez **Environment Variables** et ajoutez (facultatif mais recommandé) :
   | Nom                         | Valeur                            |
   | --------------------------- | --------------------------------- |
   | `NEXT_PUBLIC_WEB3FORMS_KEY` | votre clé Web3Forms               |
   | `NEXT_PUBLIC_SITE_URL`      | `https://votre-projet.vercel.app` |
6. Cliquez sur **Deploy**. Après environ une minute, votre site est en ligne sur `https://<projet>.vercel.app`. 🎉
7. **Mises à jour** : chaque push sur `main` (ou chaque enregistrement dans le CMS) redéploie automatiquement le site. Chaque Pull Request obtient aussi une URL de prévisualisation.
8. **Nom de domaine personnalisé** (facultatif) : *Project → Settings → Domains → Add*, puis suivez les instructions DNS. Pensez à mettre à jour `NEXT_PUBLIC_SITE_URL`.

> Après avoir modifié une variable d'environnement, relancez un déploiement (*Deployments → ⋯ → Redeploy*).

### Alternative : Netlify

Le projet fonctionne aussi sur Netlify (offre gratuite) : *Add new site → Import an existing project*, choisissez le dépôt ; Netlify détecte Next.js automatiquement. Ajoutez les mêmes variables d'environnement.

## 6. Activer le CMS en ligne (Decap + GitHub)

Pour utiliser `/admin` sur le site déployé, le CMS doit pouvoir écrire dans votre dépôt GitHub. Le projet inclut déjà le petit serveur d'authentification nécessaire (`src/app/api/auth` et `src/app/api/callback`) : il suffit de créer une **application OAuth GitHub** (gratuit).

1. Vérifiez que `public/admin/config.yml` pointe vers **votre** dépôt et votre branche :
   ```yaml
   backend:
     name: github
     repo: lucaslamoureuxll-design/portfolio
     branch: main
   ```
2. Sur GitHub : **Settings → Developer settings → OAuth Apps → New OAuth App** ([lien direct](https://github.com/settings/applications/new)) :
   - *Application name* : `Portfolio CMS`
   - *Homepage URL* : `https://votre-projet.vercel.app`
   - *Authorization callback URL* : `https://votre-projet.vercel.app/api/callback`
3. Cliquez sur **Register application**, puis **Generate a new client secret**.
4. Dans Vercel (*Project → Settings → Environment Variables*), ajoutez :
   | Nom                          | Valeur             |
   | ---------------------------- | ------------------ |
   | `GITHUB_OAUTH_CLIENT_ID`     | le *Client ID*     |
   | `GITHUB_OAUTH_CLIENT_SECRET` | le *Client secret* |
5. Redéployez, ouvrez `https://votre-projet.vercel.app/admin` et cliquez sur **Login with GitHub**.

Seules les personnes ayant un accès en écriture au dépôt GitHub peuvent modifier le contenu.

> Si vous changez de domaine, mettez à jour l'URL de callback de l'application OAuth GitHub.

## Personnalisation du design

- **Couleurs** : variables CSS en haut de `src/app/globals.css` (`--accent`, `--background`…), pour le thème clair et le thème sombre.
- **Police** : `src/app/layout.tsx` (Geist via `next/font`).
- **Navigation** : tableau `NAV` dans `src/components/header.tsx`.

## Stack

[Next.js 16](https://nextjs.org) (App Router, Cache Components) · TypeScript · [Tailwind CSS 4](https://tailwindcss.com) · [Decap CMS](https://decapcms.org) · [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) · [next-themes](https://github.com/pacocoursey/next-themes) · [Web3Forms](https://web3forms.com)
