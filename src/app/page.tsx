import Wrapper from "@/components/Wrapper";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Package, Heart, TrendingUp, Users, Sparkles, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <Wrapper>
      {/* HERO SECTION - CLEAN & MODERN */}
      <section className="min-h-screen flex flex-col justify-center items-center px-4 py-16 md:py-0 relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {/* Subtle background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto space-y-10">
          {/* Badge moderne */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900/5 border border-slate-200 text-xs font-semibold text-slate-700">
            <Sparkles className="w-3 h-3" />
            Gestion de stocks pour associations
          </div>

          {/* Titre principal - Minimaliste & Puissant */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-slate-900">
            Gérez vos stocks,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">maximisez vos dons.</span>
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl">
            Une plateforme simple et puissante pour suivre vos inventaires, optimiser vos dons et mesurer votre impact social en temps réel.
          </p>

          {/* Boutons CTA - Design épuré */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              Accéder au dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/give"
              className="px-8 py-3 bg-white text-slate-900 border-2 border-slate-900 rounded-lg font-semibold hover:bg-slate-50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5 text-red-500" />
              Faire un don
            </Link>
          </div>

          {/* Stats - Layout amélioré */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-slate-200">
            {[
              { icon: Package, value: "1 200+", label: "Articles" },
              { icon: Heart, value: "850+", label: "Dons" },
              { icon: Users, value: "120+", label: "Bénéficiaires" },
              { icon: TrendingUp, value: "99%", label: "Uptime" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="w-6 h-6 mx-auto mb-3 text-slate-400" />
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION FONCTIONNALITÉS */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-slate-600 text-lg">
              Une solution complète conçue pour les associations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
                className="p-8 bg-white border border-slate-200 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-lg ${feature.bg} flex items-center justify-center mb-5`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION CTA FINALE */}
      <section className="py-24 px-4 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Transformez votre gestion de stocks
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Rejoignez les associations qui utilisent AliStock pour gérer leurs stocks et maximiser leur impact social.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="px-8 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
            >
              <CheckCircle className="w-5 h-5" />
              Commencer gratuitement
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-all duration-300"
            >
              Voir la démo
            </Link>
          </div>

          <p className="text-sm text-slate-400 mt-6">
            Gratuit • Aucune carte requise • Support 24/7
          </p>
        </div>
      </section>
    </Wrapper>
  );
}
