import Wrapper from "@/components/Wrapper";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Package, Heart, TrendingUp, Users, Sparkles, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <Wrapper>
      {/* HERO SECTION - CLEAN & MODERN */}
      <section className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-12 sm:py-20 md:py-0 relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {/* Subtle background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-96 sm:h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 w-full">
          {/* Badge moderne */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900/5 border border-slate-200 text-xs font-semibold text-slate-700">
            <Sparkles className="w-3 h-3" />
            <span className="hidden xs:inline">Gestion de stocks pour associations</span>
            <span className="xs:hidden">AliStock</span>
          </div>

          {/* Titre principal - Responsive */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-slate-900">
            Gérez vos stocks,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">maximisez vos dons.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl">
            Une plateforme simple et puissante pour suivre vos inventaires, optimiser vos dons et mesurer votre impact social.
          </p>

          {/* Boutons CTA - Design épuré */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-6 w-full sm:w-auto">
            <Link
              href="/dashboard"
              className="px-4 sm:px-8 py-2.5 sm:py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Accéder au dashboard</span>
              <span className="sm:hidden">Dashboard</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link
              href="/give"
              className="px-4 sm:px-8 py-2.5 sm:py-3 bg-white text-slate-900 border-2 border-slate-900 rounded-lg font-semibold hover:bg-slate-50 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
              <span className="hidden sm:inline">Faire un don</span>
              <span className="sm:hidden">Donner</span>
            </Link>
          </div>

          {/* Stats - Layout amélioré */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 pt-8 sm:pt-12 border-t border-slate-200">
            {[
              { icon: Package, value: "1.2k", label: "Articles" },
              { icon: Heart, value: "850+", label: "Dons" },
              { icon: Users, value: "120+", label: "Bénéficiaires" },
              { icon: TrendingUp, value: "99%", label: "Uptime" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 text-slate-400" />
                <div className="text-xl sm:text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-xs sm:text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION FONCTIONNALITÉS */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-3 sm:mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Une solution complète conçue pour les associations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {[
              {
                title: "Gestion intuitive",
                desc: "Ajoutez, modifiez et suivez vos produits simplement.",
                icon: Package,
                bg: "bg-blue-50",
                color: "text-blue-600",
              },
              {
                title: "Dons tracés",
                desc: "Enregistrez chaque don avec bénéficiaire et détails.",
                icon: Heart,
                bg: "bg-red-50",
                color: "text-red-600",
              },
              {
                title: "Analytics en temps réel",
                desc: "Tableaux de bord clairs avec graphiques et alertes.",
                icon: TrendingUp,
                bg: "bg-emerald-50",
                color: "text-emerald-600",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-5 sm:p-8 bg-white border border-slate-200 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg ${feature.bg} flex items-center justify-center mb-4 sm:mb-5`}>
                  <feature.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${feature.color}`} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION CTA FINALE */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            Transformez votre gestion de stocks
          </h2>
          <p className="text-base sm:text-lg text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Rejoignez les associations qui utilisent AliStock pour gérer leurs stocks et maximiser leur impact social.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
            <Link
              href="/sign-up"
              className="px-4 sm:px-8 py-2.5 sm:py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base"
            >
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Commencer gratuitement</span>
              <span className="sm:hidden">Commencer</span>
            </Link>
            <Link
              href="/dashboard"
              className="px-4 sm:px-8 py-2.5 sm:py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-all duration-300 text-sm sm:text-base"
            >
              Voir la démo
            </Link>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 mt-4 sm:mt-6">
            Gratuit • Aucune carte • Support 24/7
          </p>
        </div>
      </section>
    </Wrapper>
  );
}
