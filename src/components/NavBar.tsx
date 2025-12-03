"use client";
import { Menu, Package, ShoppingBasket, PackagePlus, Heart, History, ListTree, X, Warehouse, Activity } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { checkAndAddAssociation } from "@/app/action";
import Stock from "./Stock";

const NavBar = () => {
  const { user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [IsOpenModal, setIsOpenModal] = useState(false);

  const toggleConfirme = () => {
    setIsOpenModal(!IsOpenModal);
  };

  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Activity },
    { href: "/products", label: "Produits", icon: ShoppingBasket },
    { href: "/new-product", label: "Nouveau", icon: PackagePlus },
    { href: "/give", label: "Dons", icon: Heart },
    { href: "/transactions", label: "Historique", icon: History },
    { href: "/category", label: "Catégories", icon: ListTree },
  ];

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress && user.fullName) {
      checkAndAddAssociation(user?.primaryEmailAddress?.emailAddress, user.fullName);
    }
  }, [user]);

  const renderLinks = (baseClass: string) => (
    <>
      {navLinks.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        const activeClass = isActive
          ? "bg-slate-900 text-white"
          : "text-slate-700 hover:bg-slate-100";

        return (
          <Link
            href={href}
            key={href}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors duration-200 text-sm ${baseClass} ${activeClass}`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        );
      })}

      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors duration-200"
        onClick={toggleConfirme}
      >
        <Warehouse className="w-4 h-4" />
        Stock
      </button>
    </>
  );

  return (
    <div className="border-b border-slate-200 bg-white sticky top-0 z-40">
      <div className="px-5 md:px-[10%] py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span>AliStock</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {renderLinks("btn-ghost")}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden btn btn-sm btn-ghost"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <UserButton />
          </div>
        </div>

        {/* Mobile Nav */}
        <div
          className={`absolute top-full left-0 w-full bg-white border-b border-slate-200 transition-all duration-300 md:hidden z-50 overflow-hidden ${
            menuOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="p-4 space-y-2 flex flex-col">
            {renderLinks("w-full justify-start")}
          </div>
        </div>
      </div>

      {/* Stock Modal */}
      {IsOpenModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl rounded-xl">
            <button
              className="absolute right-4 top-4 btn btn-sm btn-circle btn-ghost z-10"
              onClick={toggleConfirme}
            >
              ✕
            </button>
            <div className="p-8">
              <Stock />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
