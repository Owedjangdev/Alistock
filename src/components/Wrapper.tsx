import { ToastContainer } from "react-toastify"
import NavBar from "./NavBar"
import Link from "next/link"
import { Github, Twitter, Facebook, Linkedin } from "lucide-react"



type WrapperProps={

    children:React.ReactNode
}

const Wrapper = ({children}:WrapperProps) => {
  return (
    <div>

 <NavBar/>


      <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnHover
      draggable
      /> 

<div className="px-5 md:px-[10%]  mt-8 mb-10">
    {
        children
        
    }
</div>


      
    <footer className="border-t border-base-200 mt-10">
      <div className="px-5 md:px-[10%] py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div>
          <div className="font-bold text-lg">AliStock</div>
          <p className="text-gray-600 mt-2">Gestion de stock pour associations. Donnez avec impact.</p>
        </div>
        <div>
          <div className="font-semibold mb-2">Navigation</div>
          <div className="flex flex-col gap-1">
            <Link href="/dashboard" className="link link-hover">Dashboard</Link>
            <Link href="/products" className="link link-hover">Produits</Link>
            <Link href="/give" className="link link-hover">Donner</Link>
            <Link href="/category" className="link link-hover">Catégories</Link>
          </div>
        </div>
        <div>
          <div className="font-semibold mb-2">À propos</div>
          <div className="text-gray-600">Plateforme de gestion de stock pour associations.</div>
          <div className="flex gap-3 mt-3">
            <a href="#" aria-label="GitHub" className="btn btn-ghost btn-sm">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" aria-label="Twitter" className="btn btn-ghost btn-sm">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" aria-label="Facebook" className="btn btn-ghost btn-sm">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" aria-label="LinkedIn" className="btn btn-ghost btn-sm">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="px-5 md:px-[10%] py-4 text-xs text-gray-500 border-t border-base-200 flex justify-between">
        <span>© {new Date().getFullYear()} AliStock</span>
        <span>Fait avec ❤️</span>
      </div>
    </footer>
    </div>
  )
}

export default Wrapper
