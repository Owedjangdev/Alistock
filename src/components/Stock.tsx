import { readProducts, updateStockQuantity, updateStockQuantityRemove } from "@/app/action"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Product} from "../../type"
import ProductComponent from "./ProductComponents"


const Stock = () => {
 const [Product , setProduct]= useState<Product[] >([])
const [SelectedProduct , setSelectedProduct]= useState<Product | null>(null)
const [Quantity , setQuantity]= useState<number>(0)
const [SelectedProductId , setSelectedProductId]= useState<string | null>(null)
const [loading, setLoading] = useState(false)
const [operationType, setOperationType] = useState<'ADD' | 'REMOVE'>('ADD')


const { user } = useUser();
const router = useRouter();
  const email = user?.primaryEmailAddress?.emailAddress as string;



  const fetchProducts = async () => {
    if (email) {
      try {
        const data = await readProducts(email);
        if (data) setProduct(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
      }
    }
  };

  useEffect(() => {
    if (email) {
      fetchProducts();
    }
  }, [email]);


  const handleproductChange =(productId :string)=>{
    const  product = Product.find((p)=>p.id===productId)
    setSelectedProduct(product || null);
    setSelectedProductId(productId );
    setQuantity(0); // Reset quantity when changing product
  }

  const handleOperationTypeChange = (type: 'ADD' | 'REMOVE') => {
    setOperationType(type);
    setQuantity(0); // Reset quantity when changing operation type
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!SelectedProductId || !Quantity || Quantity <= 0) {
      toast.error("Veuillez sélectionner un produit et saisir une quantité valide.");
      return;
    }

    setLoading(true);
    try {
      if (operationType === 'ADD') {
        await updateStockQuantity(SelectedProductId, Quantity, email);
        toast.success(`${Quantity} ${SelectedProduct?.unit} ajouté(s) au stock de ${SelectedProduct?.name} !`);
      } else {
        await updateStockQuantityRemove(SelectedProductId, Quantity, email);
        toast.success(`${Quantity} ${SelectedProduct?.unit} retiré(s) du stock de ${SelectedProduct?.name} !`);
      }
      
      // Reset form
      setSelectedProduct(null);
      setSelectedProductId(null);
      setQuantity(0);
      setOperationType('ADD');
      
      // Close modal and redirect to products page
      const modal = document.getElementById('stock-modal');
      if (modal) {
        (modal as HTMLDialogElement).close();
      }
      
      router.push('/products');
    } catch (error: unknown) {
      console.error("Erreur lors de la mise à jour du stock:", error);
      toast.error("Erreur lors de la mise à jour du stock");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="font-bold text-2xl mb-6 text-center">Gestion des stocks</h3>
      
      <p className="text-sm mb-6 text-center text-gray-600">
        Gérer les quantités de vos produits en stock
      </p>

      {/* Boutons de sélection d'opération */}
      <div className="flex gap-4 justify-center mb-6">
        <button
          type="button"
          className={`btn ${operationType === 'ADD' ? 'btn-success' : 'btn-outline btn-success'}`}
          onClick={() => handleOperationTypeChange('ADD')}
        >
          ➕ Ajouter au stock
        </button>
        <button
          type="button"
          className={`btn ${operationType === 'REMOVE' ? 'btn-error' : 'btn-outline btn-error'}`}
          onClick={() => handleOperationTypeChange('REMOVE')}
        >
          ➖ Retirer du stock
        </button>
      </div>
<form onSubmit={handleSubmit} className="space-y-6">

<div className="space-y-3">
          <label className="block text-sm font-semibold">Sélectionner un produit</label>
          <select
            className="select select-bordered w-full"
            value={SelectedProductId || ""} 
            onChange={(e) => handleproductChange(e.target.value)}
            required
          >
<option value="">
              Sélectionner un produit
            </option>
            {Product.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - {product.categoryName}
              </option>
            ))}
</select>



        </div>

        {/* Affichage du produit sélectionné */}
        {SelectedProduct && (
          <div className="space-y-3">
            <label className="block text-sm font-semibold">Produit sélectionné</label>
            <div className="border-2 border-primary/20 rounded-lg p-4 bg-base-100">
              <ProductComponent product={SelectedProduct} />
              <div className="mt-3 space-y-2">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Stock actuel:</span> 
                  <span className={`ml-2 font-bold ${SelectedProduct.quantity === 0 ? 'text-error' : SelectedProduct.quantity < 5 ? 'text-warning' : 'text-success'}`}>
                    {SelectedProduct.quantity} {SelectedProduct.unit}
                  </span>
                </div>
                {operationType === 'REMOVE' && SelectedProduct.quantity === 0 && (
                  <div className="alert alert-error alert-sm">
                    <span>⚠️ Stock vide - Impossible de retirer</span>
                  </div>
                )}
                {operationType === 'REMOVE' && SelectedProduct.quantity < 5 && SelectedProduct.quantity > 0 && (
                  <div className="alert alert-warning alert-sm">
                    <span>⚠️ Stock faible - Attention aux retraits</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Section quantité */}
        {SelectedProduct && (
          <div className="space-y-3">
            <label className="block text-sm font-semibold">
              Quantité à {operationType === 'ADD' ? 'ajouter' : 'retirer'}
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                placeholder={`Quantité à ${operationType === 'ADD' ? 'ajouter' : 'retirer'}`}
                value={Quantity}
                min="1"
                max={operationType === 'REMOVE' ? SelectedProduct.quantity : undefined}
                required
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="input input-bordered flex-1"
              />
              <span className="text-sm text-gray-600 min-w-fit">
                {SelectedProduct.unit}
              </span>
            </div>
            {operationType === 'REMOVE' && Quantity > 0 && (
              <div className="text-sm">
                <span className="text-gray-600">Stock après retrait: </span>
                <span className={`font-bold ${SelectedProduct.quantity - Quantity < 0 ? 'text-error' : SelectedProduct.quantity - Quantity < 5 ? 'text-warning' : 'text-success'}`}>
                  {Math.max(0, SelectedProduct.quantity - Quantity)} {SelectedProduct.unit}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Bouton d'action */}
        <div className="flex justify-center pt-4">
          <button 
            type="submit" 
            className={`btn w-full max-w-xs ${operationType === 'ADD' ? 'btn-success' : 'btn-error'} ${loading ? 'loading' : ''}`}
            disabled={loading || !SelectedProduct || !Quantity || (operationType === 'REMOVE' && SelectedProduct && SelectedProduct.quantity === 0)}
          >
            {loading ? 
              (operationType === 'ADD' ? 'Ajout en cours...' : 'Retrait en cours...') : 
              (operationType === 'ADD' ? 'Ajouter au stock' : 'Retirer du stock')
            }
          </button>
        </div>


</form>








    </div>
  )
}

export default Stock
