"use client";
import { ListTree, Menu, PackagePlus, ShoppingBasket,  Warehouse,  X, History, Heart, Activity } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { checkAndAddAssociation } from "@/app/action";
import Stock from "./Stock";

const NavBar = () => {
  const  {user}=useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [IsOpenModal, setIsOpenModal]=useState(false)


  const  togleConfirme= ()=>{
setIsOpenModal(!IsOpenModal);

  }
  
  const pathname = usePathname();

  
  const navLinks = [
      { href: "/dashboard", label: "Dashboard", icon: Activity },
      { href: "/products", label: "Produit ", icon: ShoppingBasket },
    { href: "/new-product", label: "Nouveau produit ", icon: PackagePlus  },
    { href: "/give", label: "Donner", icon: Heart },
    { href: "/transactions", label: "Transactions", icon: History },
    { href: "/category", label: "Catégories", icon: ListTree } 
    


  ];

  
    useEffect(() => {
        if (user?.primaryEmailAddress?.emailAddress && user.fullName) {
            checkAndAddAssociation(user?.primaryEmailAddress?.emailAddress, user.fullName)
        }
    }, [user])

  

  
  const renderLinks = (baseClass: string) => (
    <>
      {navLinks.map(({ href, label, icon: Icon }) => {
        // Vérifie si le chemin d'accès actuel correspond au href du lien
        const isActive = pathname === href;

        // Définit la classe active pour styliser différemment le bouton du lien
        const activeClass = isActive ? "btn-primary" : "btn-ghost";

        return (
          
          <Link
            href={href}
            key={href} // Clé unique pour chaque lien, nécessaire pour les listes en React
            className={`${baseClass} ${activeClass} btn-sm flex gap-2 items-center `}
          >
            {/* Rendu de l'icône */}
            <Icon className="W-4 h-4" />
            {/* Rendu du label du lien */}
            {label}
          </Link>
        );
      })}


      <button className="btn btn-sm" onClick={togleConfirme} > <Warehouse className="w-4 h-4"/>Gérer le Stock
       
      </button>

    </>
  );

  return (
    // Conteneur principal de la barre de navigation, avec des styles pour la bordure, le padding et la position relative
    <div className="border-b border-base-300 px-5 md:px-[10%] py-4 relative">
      {/* Conteneur interne pour l'alignement des éléments, visible sur tous les écrans */}
      <div className="flex justify-between items-center ">
        {/* Logo et le nom de l'application */}
        <div className="flex items-center">
          <div className="p-2 flex gap-2">
            <PackagePlus className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl">AliStock</span>
          </div>
        </div>

        {/* Bouton pour ouvrir le menu mobile */}
        <button className="btn w-fit sm:hidden btn-sm" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu className="w-4 h-4" /> {/* Icône de menu */}
        </button>

        {/* Conteneur des liens de navigation, visible uniquement sur les grands écrans (hidden sm:flex) */}
        <div className="hidden space-x-2 sm:flex items-center ">
  
          {/* Appel de la fonction utilitaire pour afficher les liens */}
          {renderLinks("btn")}
          <UserButton/>
        </div>
      </div>

      {/* Menu mobile en plein écran */}
      <div
        // Classes pour le style, l'animation et le positionnement absolu
        className={`absolute top-0 w-full bg-base-100 h-screen flex flex-col gap-2 p-4
          transition-all duration-300 sm:hidden z-50 ${
            // La classe de positionnement change en fonction de l'état "menuOpen"
            menuOpen ? "left-0" : "left-full"
          }`}
      >
        {/* Conteneur du bouton de fermeture du menu mobile */}
        <div className="flex justify-between items-center ">
          {/* Bouton pour fermer le menu */}
          <button className="btn w-fit sm:hidden btn-sm" onClick={() => setMenuOpen(!menuOpen)}>
            <X className="w-4 h-4" /> {/* Icône de fermeture */}
          </button>
          <UserButton/>
        </div>
        {/* Affiche les liens de navigation dans le menu mobile */}
        {renderLinks("btn")}
        
      </div>

        {
            IsOpenModal && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                >
                    <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white shadow-xl rounded-xl transform scale-100 transition-transform duration-300">
                        <button 
                            className="absolute right-4 top-4 btn btn-sm btn-circle btn-ghost z-10"
                            onClick={togleConfirme}
                        >
                            ✕
                        </button>
                        <div className="p-8">
                            <Stock/>
                        </div>
                    </div>
                </div>
            )
        }


    </div>
  );
};

export default NavBar;