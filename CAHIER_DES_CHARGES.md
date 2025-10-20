# CAHIER DES CHARGES - AliStock

## 1. PRÉSENTATION GÉNÉRALE

### 1.1 Contexte
AliStock est une application web de gestion de stock développée spécifiquement pour les associations. Elle permet aux associations de gérer leurs produits, catégories et stocks de manière efficace et intuitive.

### 1.2 Objectifs
- Permettre aux associations de gérer leur inventaire de produits
- Faciliter la création et l'organisation de catégories de produits
- Offrir un système de gestion des stocks en temps réel
- Fournir une interface utilisateur moderne et responsive

### 1.3 Technologies utilisées
- **Framework Frontend** : Next.js 15.4.6 avec React 19.1.0
- **Authentification** : Clerk (v6.31.1)
- **Base de données** : SQLite avec Prisma ORM
- **Styling** : Tailwind CSS avec DaisyUI
- **Langage** : TypeScript
- **Icônes** : Lucide React
- **Notifications** : React Toastify

## 2. ARCHITECTURE TECHNIQUE

### 2.1 Structure du projet
```
gstook/
├── prisma/                    # Configuration base de données
├── src/
│   ├── app/                   # Pages et routes Next.js
│   ├── components/            # Composants réutilisables
│   ├── lib/                   # Utilitaires et configuration
│   └── middleware.ts          # Middleware d'authentification
├── public/uploads/            # Stockage des images
└── type.ts                   # Types TypeScript
```

### 2.2 Base de données (Schéma Prisma)
- **Association** : Gestion des organisations utilisatrices
- **Product** : Produits avec prix, quantité, images
- **Category** : Catégories pour organiser les produits
- **Transaction** : Historique des mouvements de stock

## 3. FONCTIONNALITÉS PRINCIPALES

### 3.1 Authentification et Gestion des Associations
- **Inscription/Connexion** : Via Clerk
- **Gestion automatique des associations** : Création automatique lors de la première connexion
- **Sécurisation des routes** : Middleware protégeant toutes les pages sauf connexion/inscription

### 3.2 Gestion des Produits
#### 3.2.1 Création de produits
- Formulaire complet avec validation
- Upload d'images avec prévisualisation
- Sélection de catégorie
- Définition du prix et de l'unité de mesure
- Types d'unités supportés : g, kg, l, m, cm, h, pcs

#### 3.2.2 Liste des produits
- Affichage sous forme de tableau
- Colonnes : Image, Nom, Description, Prix, Quantité, Catégorie, Actions
- Actions disponibles : Modifier, Supprimer
- Gestion des états vides avec composant EmptyState

#### 3.2.3 Modification de produits
- Pré-remplissage des données existantes
- Possibilité de changer l'image
- Modification du prix et des informations
- Sauvegarde avec validation

#### 3.2.4 Suppression de produits
- Confirmation avant suppression
- Suppression automatique de l'image associée
- Nettoyage de la base de données

### 3.3 Gestion des Catégories
#### 3.3.1 Création de catégories
- Modal de création avec nom et description
- Validation des champs obligatoires
- Association automatique à l'organisation

#### 3.3.2 Modification de catégories
- Modal d'édition pré-rempli
- Mise à jour des informations
- Sauvegarde des modifications

#### 3.3.3 Suppression de catégories
- Confirmation avec avertissement sur la suppression en cascade
- Suppression automatique des produits associés

### 3.4 Gestion des Stocks
#### 3.4.1 Alimentation du stock
- Sélection du produit via liste déroulante
- Affichage des détails du produit sélectionné
- Saisie de la quantité à ajouter
- Validation et mise à jour du stock

#### 3.4.2 Interface de gestion
- Modal dédié accessible depuis la navigation
- Composant réutilisable pour l'affichage des produits
- Gestion des états et validations

### 3.5 Interface Utilisateur

#### 3.5.1 Navigation
- **Barre de navigation responsive** avec :
  - Logo et nom de l'application (AliStock)
  - Menu desktop avec liens principaux
  - Menu mobile hamburger
  - Bouton d'alimentation du stock
  - Profil utilisateur (UserButton Clerk)

#### 3.5.2 Pages principales
- **Page d'accueil** : Interface simple avec wrapper
- **Page produits** : Liste complète avec actions
- **Nouveau produit** : Formulaire de création avec prévisualisation
- **Catégories** : Gestion complète des catégories
- **Mise à jour produit** : Interface d'édition

#### 3.5.3 Composants réutilisables
- **Wrapper** : Layout principal avec navigation et notifications
- **EmptyState** : Affichage des états vides
- **ImageCompo** : Gestion des images avec Next.js Image
- **ProductComponent** : Affichage des produits
- **CategoryModal** : Modal pour les catégories

## 4. GESTION DES FICHIERS

### 4.1 Upload d'images
- **API Route** : `/api/upload`
- **Méthodes** : POST (upload), DELETE (suppression)
- **Stockage** : Dossier `public/uploads/`
- **Nommage** : UUID unique pour éviter les conflits
- **Types supportés** : Images uniquement

### 4.2 Gestion des erreurs
- Validation côté client et serveur
- Messages d'erreur via React Toastify
- Gestion des états de chargement
- Fallbacks pour les images manquantes

## 5. SÉCURITÉ

### 5.1 Authentification
- Protection de toutes les routes sauf connexion/inscription
- Middleware Clerk pour la vérification des sessions
- Gestion des utilisateurs via Clerk

### 5.2 Autorisation
- Chaque association ne peut accéder qu'à ses propres données
- Vérification de l'email utilisateur pour toutes les opérations
- Isolation des données par association

### 5.3 Validation
- Validation des types avec TypeScript
- Validation des données côté serveur
- Sanitisation des entrées utilisateur

## 6. PERFORMANCE ET UX

### 6.1 Optimisations
- Images optimisées avec Next.js Image
- Lazy loading des composants
- Gestion des états de chargement
- Animations CSS pour les interactions

### 6.2 Responsive Design
- Interface adaptative mobile/desktop
- Menu hamburger pour mobile
- Layout flexible avec Tailwind CSS
- Thème DaisyUI "valentine"

### 6.3 Notifications
- Système de toast pour les retours utilisateur
- Messages de succès et d'erreur
- Notifications non-intrusives

## 7. DÉPLOIEMENT ET CONFIGURATION

### 7.1 Variables d'environnement
- `DATABASE_URL` : URL de connexion SQLite
- Configuration Clerk pour l'authentification

### 7.2 Scripts disponibles
- `npm run dev` : Développement avec Turbopack
- `npm run build` : Build de production
- `npm run start` : Serveur de production
- `npm run lint` : Vérification du code

### 7.3 Base de données
- SQLite pour le développement
- Migrations Prisma pour la gestion du schéma
- Auto-génération du client Prisma

## 8. LIMITES ET AMÉLIORATIONS POSSIBLES

### 8.1 Fonctionnalités manquantes
- Historique complet des transactions
- Rapports et statistiques
- Export/Import de données
- Gestion multi-utilisateurs par association
- Notifications de stock faible
- Codes-barres des produits

### 8.2 Améliorations techniques
- Migration vers PostgreSQL pour la production
- Tests automatisés
- Monitoring et logging
- Cache Redis pour les performances
- API REST complète
- Documentation API

### 8.3 Améliorations UX
- Recherche et filtres avancés
- Pagination pour les grandes listes
- Drag & drop pour les images
- Mode sombre
- Personnalisation du thème
- Raccourcis clavier

## 9. CONCLUSION

AliStock est une application web moderne et fonctionnelle pour la gestion de stock des associations. Elle offre une interface intuitive, une architecture robuste et une sécurité appropriée. L'application est prête pour un déploiement en production avec quelques ajustements mineurs et peut être étendue selon les besoins futurs des utilisateurs.

L'architecture modulaire et l'utilisation de technologies modernes facilitent la maintenance et l'évolution du projet.






