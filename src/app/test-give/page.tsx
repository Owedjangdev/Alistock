"use client";
import Wrapper from "@/components/Wrapper";
import { useUser } from "@clerk/nextjs";
import { readProducts } from "../action";
import { useEffect, useState } from "react";
import { Product } from "../../../type";
import ImageCompo from "@/components/ImageCompo";
import { Plus, Package, Heart } from "lucide-react";

const TestPage = () => {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (email) {
        try {
          console.log("Fetching products for:", email);
          const data = await readProducts(email);
          console.log("Products received:", data);
          setProducts(data || []);
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [email]);

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500" />
              Test Page - Donner des produits
            </h1>
            <p className="text-gray-600 mt-2">Page de test pour vérifier le chargement des produits</p>
          </div>
        </div>

        {/* Debug Info */}
        <div className="alert alert-info">
          <div className="text-sm">
            <strong>Debug:</strong> Email: {email || "Non connecté"} | 
            Produits chargés: {products.length}
          </div>
        </div>

        {/* Liste des produits */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Tous les produits ({products.length})
          </h2>
          
          {products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucun produit trouvé</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="card bg-base-100 shadow-sm border border-base-200">
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
                        <h3 className="font-bold text-sm">{product.name}</h3>
                        <p className="text-xs text-gray-600 mb-2">{product.categoryName}</p>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-semibold ${product.quantity > 0 ? 'text-success' : 'text-error'}`}>
                            Stock: {product.quantity} {product.unit}
                          </span>
                          <button
                            className="btn btn-sm btn-primary"
                            disabled={product.quantity === 0}
                          >
                            <Plus className="w-3 h-3" />
                            Ajouter
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
      </div>
    </Wrapper>
  );
};

export default TestPage;

