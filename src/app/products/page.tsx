"use client";
import Wrapper from "@/components/Wrapper";
import { useUser } from "@clerk/nextjs";
import { deleteProduct, readProducts } from "../action";
import { useEffect, useState } from "react";
import { Product } from "../../../type";
import EmptyState from "@/components/EmptyState";
import ImageCompo from "@/components/ImageCompo";
import Link from "next/link";
import { Trash } from "lucide-react";
import { toast } from "react-toastify";

const Page = () => {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress as string;

  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    if (email) {
      try {
        const data = await readProducts(email);
        if (data) setProducts(data);
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

  const handleDeleteProduct = async (product: Product) => {
    const confirmDelete = confirm(
      "Voulez-vous vraiment supprimer ce produit ?"
    );
    if (!confirmDelete) return;
    try {
      if (product.imageUrl) {
        const resDelete = await fetch("/api/upload", {
          method: "DELETE",
          body: JSON.stringify({ path: product.imageUrl }),
          headers: { "Content-Type": "application/json" },
        });
        const dataDelete = await resDelete.json();
        if (!dataDelete.success) {
          throw new Error("Erreur lors de la suppression de l’image.");
        } else {
          if (email) {
            await deleteProduct(product.id, email);
            await fetchProducts();
            toast.success("Produit supprimé avec succès ");
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Wrapper>
      {products.length === 0 ? (
        <div className="h-[60vh]">
          <EmptyState
            IconComponent="PackageSearch"
            message="Aucun produit trouvé. Veuillez ajouter des produits."
          />
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="table">
            <thead>
              <tr>
                <th></th>

                <th>Image</th>
                <th>Noms</th>
                <th>Descriptions</th>
                <th>Prix</th>
                <th>Quantités</th>
                <th>Catégories</th>
                <th>hActions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product, index) => (
                <tr key={product.id}>
                  <td>{index + 1}</td>

                  <td>
                    <ImageCompo
                      src={product.imageUrl}
                      alt={product.imageUrl}
                      heightClass="h-12"
                      widthClass="h-12"
                    />
                  </td>

                  <td>{product.name}</td>

                  <td>{product.description}</td>

                  <td>{product.price} Euro</td>
                  <td className="capitalize">
                    {product.quantity} {product.unit}
                  </td>

                  <td>{product.categoryName}</td>

                  <td className="flex flex-col gap-2">
                    <Link
                      href={`/update-products/${product.id}`}
                      className="btn btn-sm btn-primary w-full"
                    >
                      Modifier
                    </Link>

                    <button
                      className="btn"
                      onClick={() => handleDeleteProduct(product)}
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Wrapper>
  );
};

export default Page;
