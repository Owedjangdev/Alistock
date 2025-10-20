<div align="center">

# AliStock – Gestion de stock pour associations

Suivez vos produits, catégories, stocks et dons avec une interface moderne.

</div>

## Aperçu

- Dashboard avec indicateurs clés, graphiques et activité récente
- Gestion des produits et catégories
- Mouvements de stock (ajout, retrait) + Dons multi-produits
- Upload d’images, toasts de notifications, thème DaisyUI

## Stack

- Next.js, React, TypeScript
- Prisma (SQLite dev), Clerk (auth)
- Tailwind CSS v4, DaisyUI, Lucide Icons

## Prérequis

- Node.js 18+
- Variables d’environnement:
  - `DATABASE_URL="file:./prisma/dev.db"`
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...`
  - `CLERK_SECRET_KEY=...`

## Installation

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Application: http://localhost:3000

## Scripts

- `npm run dev` – développement
- `npm run build` – build production
- `npm run start` – serveur production
- `npm run lint` – lint

## Structure

```
src/
  app/
    dashboard/         # Tableau de bord
    give/              # Page de dons multi-produits
    products/          # Liste produits
    new-product/       # Création produit
    category/          # Catégories
    transactions/      # Historique
    api/upload/        # Upload images
  components/          # UI (Wrapper, NavBar, etc.)
  lib/prisma.ts        # Client Prisma
prisma/schema.prisma   # Modèle de données
public/uploads/        # Images
```

## Captures d’écran

Ajoutez vos images dans `public/` et référencez-les ici (exemples):

![Dashboard](public/next.svg)

## Déploiement

- Configurer les variables d’environnement (DB, Clerk)
- Exécuter `npm run build` puis `npm run start`

## Publier sur GitHub

```bash
git init
git add .
git commit -m "Initial commit: AliStock"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

## Licence

MIT
