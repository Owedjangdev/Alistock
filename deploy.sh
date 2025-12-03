#!/bin/bash

# Script de déploiement Vercel automatique

echo "🚀 Déploiement AliStock sur Vercel"
echo "=================================="
echo ""

# Vérifier que vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI pas trouvé. Installation..."
    npm install -g vercel
fi

# Demander les variables
echo "📝 Récupération des variables d'environnement..."
echo ""
echo "Va sur https://dashboard.clerk.com et copie ta SECRET_KEY"
read -p "CLERK_SECRET_KEY: " CLERK_SECRET_KEY

echo ""
echo "🔧 Configuration des variables sur Vercel..."

# Ajouter les variables
vercel env add DATABASE_URL < <(echo 'postgresql://postgres:MonSuperMotDePasse123!@db.bvbisnpbhknyjtdmnwcb.supabase.co:5432/postgres')
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY < <(echo 'pk_test_bmVhdC1jaGFtb2lzLTc3LmNsZXJrLmFjY291bnRzLmRldiQ')
vercel env add CLERK_SECRET_KEY < <(echo "$CLERK_SECRET_KEY")
vercel env add NEXT_PUBLIC_CLERK_SIGN_IN_URL < <(echo '/sign-in')
vercel env add NEXT_PUBLIC_CLERK_SIGN_UP_URL < <(echo '/sign-up')

echo ""
echo "✅ Variables ajoutées!"
echo ""
echo "🚀 Lancement du déploiement en production..."
vercel deploy --prod

echo ""
echo "✨ C'est bon! Ton site sera online dans 2-5 minutes"
echo "Vérifie: https://alistock-otd1.vercel.app"
