#!/bin/bash

# Script pour ajouter les env variables à Vercel

cd /home/epiphane/Bureau/AssoAli/gstook

echo "🚀 Configuration des variables sur Vercel..."
echo ""

# Lire le fichier .env et ajouter chaque variable
while IFS='=' read -r key value; do
  # Ignorer les lignes vides et les commentaires
  if [[ ! -z "$key" && ! "$key" =~ ^# ]]; then
    # Nettoyer la valeur (enlever les guillemets)
    value="${value%\"}"
    value="${value#\"}"
    
    echo "➕ Ajout: $key"
    echo "$value" | vercel env add "$key" production 2>/dev/null || true
  fi
done < /home/epiphane/Bureau/AssoAli/gstook/.env

echo ""
echo "✅ Variables ajoutées!"
echo ""
echo "🚀 Lancement du déploiement..."
cd /home/epiphane/Bureau/AssoAli/gstook
vercel deploy --prod

echo ""
echo "✨ Déploiement en cours! Visite: https://alistock-otd1.vercel.app dans 3-5 minutes"
