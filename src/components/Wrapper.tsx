import { ToastContainer } from "react-toastify"
import NavBar from "./NavBar"
import Link from "next/link"
import { Github, Twitter, Mail, Linkedin, Heart } from "lucide-react"

type WrapperProps = {
  children: React.ReactNode
}

const Wrapper = ({ children }: WrapperProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />

      <main className="flex-grow">
        <div className="px-3 sm:px-5 md:px-[10%] py-6 sm:py-8 md:py-12">
          {children}
        </div>
      </main>

      {/* Footer Moderne */}
      <footer className="border-t border-slate-200 bg-slate-50 mt-auto">
        <div className="px-3 sm:px-5 md:px-[10%] py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="font-bold text-lg text-slate-900 mb-2">AliStock</div>
              <p className="text-slate-600 text-sm">
                Gestion de stock pour associations. Donnez avec impact et transparence.
              </p>
            </div>

            {/* Product */}
            <div>
              <div className="font-semibold text-slate-900 mb-3 sm:mb-4 text-xs sm:text-sm">Produit</div>
              <div className="flex flex-col gap-2 sm:gap-3">
                <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 text-xs sm:text-sm transition-colors">
                  Dashboard
                </Link>
                <Link href="/products" className="text-slate-600 hover:text-slate-900 text-xs sm:text-sm transition-colors">
                  Gestion Produits
                </Link>
                <Link href="/give" className="text-slate-600 hover:text-slate-900 text-xs sm:text-sm transition-colors">
                  Dons
                </Link>
                <Link href="/transactions" className="text-slate-600 hover:text-slate-900 text-xs sm:text-sm transition-colors">
                  Transactions
                </Link>
              </div>
            </div>

            {/* Resources */}
            <div>
              <div className="font-semibold text-slate-900 mb-3 sm:mb-4 text-xs sm:text-sm">Ressources</div>
              <div className="flex flex-col gap-2 sm:gap-3">
                <a href="#" className="text-slate-600 hover:text-slate-900 text-xs sm:text-sm transition-colors">
                  Documentation
                </a>
                <a href="#" className="text-slate-600 hover:text-slate-900 text-xs sm:text-sm transition-colors">
                  Support
                </a>
                <a href="#" className="text-slate-600 hover:text-slate-900 text-xs sm:text-sm transition-colors">
                  Blog
                </a>
                <a href="#" className="text-slate-600 hover:text-slate-900 text-xs sm:text-sm transition-colors">
                  FAQ
                </a>
              </div>
            </div>

            {/* Socials */}
            <div>
              <div className="font-semibold text-slate-900 mb-3 sm:mb-4 text-xs sm:text-sm">Nous suivre</div>
              <div className="flex gap-2 sm:gap-3">
                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors" aria-label="GitHub">
                  <Github className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
                </a>
                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors" aria-label="Twitter">
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
                </a>
                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors" aria-label="Email">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
                </a>
                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200 pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-600">
              <span>© {new Date().getFullYear()} AliStock</span>
              <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm">
                <a href="#" className="hover:text-slate-900 transition-colors">Confidentialité</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Conditions</a>
              </div>
              <div className="flex items-center gap-1 text-xs sm:text-sm">
                Fait avec <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" /> pour les associations
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Wrapper
