import Wrapper from "@/components/Wrapper";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Package, Heart, TrendingUp, Users, Sparkles, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <Wrapper>
      {/* HERO SECTION - MODERNE & IMPACT */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 py-16 md:py-24 relative overflow-hidden">
        {/* Fond animé */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          {/* Badge animé */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AliStock — Gestion & Solidarité</span>
          </div>

          {/* Titre principal */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-fade-in-up">
            Gérez. Donnez.<br />
            <span className="text-foreground">Changez des vies.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animation-delay-300">
            Suivez vos stocks en temps réel, optimisez vos dons, et mesurez votre impact solidaire avec une interface simple et puissante.
          </p>

          {/* Boutons CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-500">
            <Link
              href="/dashboard"
              className="group btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              Voir mon tableau de bord
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/give"
              className="btn btn-outline btn-lg hover:btn-primary transition-all duration-300 flex items-center gap-2"
            >
              <Heart className="w-5 h-5" />
              Faire un don
            </Link>
          </div>

          {/* Stats animées au scroll */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {[
              { icon: Package, value: "1 200+", label: "Produits gérés" },
              { icon: Heart, value: "850+", label: "Dons effectués" },
              { icon: Users, value: "120+", label: "Bénéficiaires" },
              { icon: TrendingUp, value: "99%", label: "Satisfaction" },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${700 + i * 100}ms` }}
              >
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION FONCTIONNALITÉS */}
      <section className="py-20 px-4 bg-base-200/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-muted-foreground text-lg">
              Une solution complète, pensée pour les associations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Gestion intuitive",
                desc: "Ajoutez, modifiez, supprimez vos produits en 3 clics.",
                icon: Package,
                color: "text-primary",
              },
              {
                title: "Dons tracés",
                desc: "Chaque don est enregistré avec bénéficiaire et quantité.",
                icon: Heart,
                color: "text-red-500",
              },
              {
                title: "Stats en temps réel",
                desc: "Tableau de bord clair avec graphiques et alertes stock.",
                icon: TrendingUp,
                color: "text-success",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-base-300"
              >
                <div className="card-body p-8 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-base-200 flex items-center justify-center ${feature.color}`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION TÉMOIGNAGE */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="avatar-group -space-x-4">
              <div className="avatar">
                <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <Image src="/avatar1.jpg" alt="User" width={48} height={48} />
                </div>
              </div>
              <div className="avatar">
                <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <Image src="/avatar2.jpg" alt="User" width={48} height={48} />
                </div>
              </div>
              <div className="avatar">
                <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <Image src="/avatar3.jpg" alt="User" width={48} height={48} />
                </div>
              </div>
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-medium italic text-foreground mb-4">
            “Grâce à AliStock, nous avons donné <span className="text-primary font-bold">850 repas</span> en 3 mois.”
          </p>
          <p className="text-muted-foreground">
            — Amina, Association Espoir
          </p>
        </div>
      </section>

      {/* SECTION APPEL À L’ACTION */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à faire la différence ?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Rejoignez des centaines d’associations qui gèrent leurs stocks et leurs dons avec simplicité.
          </p>

          {/* BOUTONS CTA FINAUX */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="group btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Commencer gratuitement
            </Link>env
            <Link href="/dashboard" className="btn btn-ghost btn-lg">
              Voir une démo
            </Link>
          </div>

          {/* Texte rassurant */}
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Gratuit pour toujours • Aucune carte requise
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          © 2025 AliStock. Conçu avec <Heart className="inline w-4 h-4 text-red-500 mx-1" /> pour les associations.
        </div>
      </footer>
    </Wrapper>
  );
}