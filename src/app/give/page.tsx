"use client";
import Wrapper from "@/components/Wrapper";
import { useUser } from "@clerk/nextjs";
import { readProducts, createGiveTransaction, getGiveStats } from "../action";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Product } from "../../type";
import EmptyState from "@/components/EmptyState";
import ImageCompo from "@/components/ImageCompo";
import { 
  Heart, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  User, 
  MessageSquare, 
  Gift,
  Users,
  Package
} from "lucide-react";

interface CartItem {
  product: Product;
  quantity: number;
}

interface GiveStats {
  totalGiveTransactions: number;
  totalQuantityGiven: number;
  uniqueRecipients: number;
}

const Page = () => {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress as string;
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [stats, setStats] = useState<GiveStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Informations du bénéficiaire
  const [recipientName, setRecipientName] = useState("");
  const [recipientInfo, setRecipientInfo] = useState("");

  const fetchData = async () => {
    if (email) {
      try {
        setLoading(true);
        const [productsData, statsData] = await Promise.all([
          readProducts(email),
          getGiveStats(email)
        ]);
        
        if (productsData) {
          // Afficher tous les produits, même avec stock 0; le bouton sera désactivé si nécessaire
          setProducts(productsData);
        }
        if (statsData) {
          setStats(statsData);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (email) {
      fetchData();
    }
  }, [email]);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.quantity) {
        setCart(cart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        toast.warning(`Stock maximum atteint pour ${product.name}`);
      }
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else if (newQuantity <= product.quantity) {
      setCart(cart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    } else {
      toast.warning(`Stock insuffisant pour ${product.name}. Stock disponible: ${product.quantity}`);
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error("Veuillez ajouter au moins un produit au panier.");
      return;
    }

    if (!recipientName.trim()) {
      toast.error("Veuillez saisir le nom du bénéficiaire.");
      return;
    }

    setSubmitting(true);
    try {
      const items = cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }));

      await createGiveTransaction(items, email, recipientName.trim(), recipientInfo.trim());
      
      toast.success(`Don effectué avec succès ! ${getTotalItems()} articles donnés à ${recipientName}.`);
      
      // Reset form
      setCart([]);
      setRecipientName("");
      setRecipientInfo("");
      
      // Refresh data
      await fetchData();
      
      // Redirect to transactions
      router.push('/transactions');
    } catch (error: unknown) {
      console.error("Erreur lors du don:", error);
      toast.error("Erreur lors du don");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Wrapper>
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500" />
              Donner des produits
            </h1>
            <p className="text-gray-600 mt-2">Faites un don de vos produits à ceux qui en ont besoin</p>
          </div>
          <div className="flex items-center gap-2">
            <Gift className="w-6 h-6 text-red-500" />
            <span className="font-semibold">Générosité</span>
          </div>
        </div>

        {/* Debug Info */}
        <div className="alert alert-info">
          <div className="text-sm">
            <strong>Debug:</strong> Email: {email || "Non connecté"} | 
            Produits chargés: {products.length} | 
            Panier: {cart.length} articles
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Dons effectués</p>
                    <p className="text-2xl font-bold text-red-500">{stats.totalGiveTransactions}</p>
                  </div>
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Articles donnés</p>
                    <p className="text-2xl font-bold text-red-500">{stats.totalQuantityGiven}</p>
                  </div>
                  <Package className="w-8 h-8 text-red-500" />
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Bénéficiaires</p>
                    <p className="text-2xl font-bold text-red-500">{stats.uniqueRecipients}</p>
                  </div>
                  <Users className="w-8 h-8 text-red-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des produits disponibles */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Produits disponibles ({products.length})
            </h2>
            
            {products.length === 0 ? (
              <div className="h-64">
                <EmptyState
                  IconComponent="PackageSearch"
                  message="Aucun produit disponible en stock pour faire un don."
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow">
                    <div className="card-body p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <ImageCompo
                            src={product.imageUrl}
                            alt={product.name}
                            heightClass="h-16"
                            widthClass="w-16"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm truncate">{product.name}</h3>
                          <p className="text-xs text-gray-600 mb-2">{product.categoryName}</p>
                          <div className="flex items-center justify-between">
                            <span className={`text-sm font-semibold ${product.quantity > 0 ? 'text-success' : 'text-error'}`}>
                              Stock: {product.quantity} {product.unit}
                            </span>
                            <button
                              onClick={() => addToCart(product)}
                              className={`btn btn-sm ${product.quantity === 0 ? 'btn-disabled' : 'btn-primary'}`}
                              disabled={product.quantity === 0}
                            >
                              <Plus className="w-3 h-3" />
                              {product.quantity === 0 ? 'Indisponible' : 'Ajouter'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Panier et formulaire */}
          <div className="space-y-6">
            {/* Panier */}
            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-4">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Panier ({getTotalItems()} articles)
                </h3>
                
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Votre panier est vide</p>
                    <p className="text-xs">Ajoutez des produits depuis la liste</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-3 p-3 bg-base-50 rounded-lg border">
                        <div className="flex-shrink-0">
                          <ImageCompo
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            heightClass="h-10"
                            widthClass="w-10"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{item.product.name}</p>
                          <p className="text-xs text-gray-600">{item.product.unit}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="btn btn-xs btn-circle btn-ghost"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="btn btn-xs btn-circle btn-ghost"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="btn btn-xs btn-circle btn-error btn-ghost"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Formulaire de don */}
            {cart.length > 0 && (
              <form onSubmit={handleSubmit} className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body p-4">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informations du bénéficiaire
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="label">
                        <span className="label-text font-semibold">Nom du bénéficiaire *</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Nom de la personne qui reçoit"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="label">
                        <span className="label-text font-semibold flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Informations complémentaires
                        </span>
                      </label>
                      <textarea
                        placeholder="Adresse, contact, raison du don..."
                        value={recipientInfo}
                        onChange={(e) => setRecipientInfo(e.target.value)}
                        className="textarea textarea-bordered w-full h-20"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className={`btn btn-error w-full ${submitting ? 'loading' : ''}`}
                      disabled={submitting}
                    >
                      {submitting ? 'Don en cours...' : `Faire le don (${getTotalItems()} articles)`}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Page;