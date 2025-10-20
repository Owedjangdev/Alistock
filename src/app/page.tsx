import Wrapper from "@/components/Wrapper";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <Wrapper>
      <section className="min-h-[60vh] grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="order-2 md:order-1 text-center md:text-left">
          <span className="badge badge-primary badge-soft mb-3">AliStock</span>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Gérez vos stocks simplement,<br className="hidden md:block" />
            donnez avec impact.
          </h1>
          <p className="mt-3 text-gray-600 max-w-xl md:mx-0 mx-auto">
            Suivez produits, catégories et mouvements en temps réel. Optimisez vos dons et
            prenez de meilleures décisions grâce à des statistiques claires.
          </p>
        </div>

        <div className="order-3 md:order-3 flex flex-wrap gap-3 md:justify-start justify-center">
          <Link href="/products" className="btn btn-primary">
            Découvrir les produits
          </Link>
          <Link href="/new-product" className="btn">
            Créer un produit
          </Link>
          <Link href="/dashboard" className="btn btn-ghost">
            Voir le tableau de bord
          </Link>
        </div>

        <div className="order-1 md:order-2 flex md:justify-end justify-center">
          <div className="relative w-[320px] h-[240px] md:w-[460px] md:h-[340px] rounded-3xl overflow-hidden border-2 border-primary/20 bg-base-100">
            <Image src="/globe.svg" alt="Illustration" fill className="object-contain p-6" />
          </div>
        </div>

        <div className="order-4 stats shadow mt-6 w-full md:max-w-3xl">
          <div className="stat">
            <div className="stat-title">Simplicité</div>
            <div className="stat-value text-primary">Rapide</div>
            <div className="stat-desc">Ajoutez, modifiez, donnez en quelques clics</div>
          </div>
          <div className="stat">
            <div className="stat-title">Visibilité</div>
            <div className="stat-value text-secondary">Clair</div>
            <div className="stat-desc">Tableau de bord et historique détaillé</div>
          </div>
          <div className="stat">
            <div className="stat-title">Impact</div>
            <div className="stat-value text-accent">Solidaire</div>
            <div className="stat-desc">Suivi des dons et bénéficiaires</div>
          </div>
        </div>
      </section>
    </Wrapper>
  );
}
