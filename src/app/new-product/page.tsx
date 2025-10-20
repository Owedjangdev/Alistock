"use client"
import { useEffect, useState } from 'react';
import Wrapper from '@/components/Wrapper';
import { Category } from '@prisma/client';
import { FormDataType} from '../../../type';
import { useUser } from '@clerk/nextjs';
import { createProduct, readCategories } from '../action';
import { FileImage } from 'lucide-react';
import ImageCompo from '@/components/ImageCompo';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const Page = () => {

  const router = useRouter();
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress as string;

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formatData, setformatData] = useState< FormDataType>({
    name: '',
    description: '',
    price: 0,
    unit: '',
    categoryId: '',
    imageUrl :""
  });

  const handlefileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
    if (selectedFile) {
      const preview = URL.createObjectURL(selectedFile);
      setPreviewUrl(preview);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setformatData({ ...formatData, [name]: value });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      if (email) {
        try {
          const data = await readCategories(email);
          if (data) setCategories(data);
        } catch (error) {
          console.error("Erreur lors de la récupération des catégories:", error);
        }
      }
    };
    fetchCategories();
  }, [email]);




   const handleSubmit = async () => {
    // Vérifie les champs du formulaire
    if (!formatData.name || !formatData.description || !formatData.price || !formatData.categoryId || !formatData.unit) {
      toast.error("Veuillez remplir tous les champs du formulaire.")
      return
    }
  
    if (!file) {
      toast.error("Veuillez sélectionner une image.")
      return
    }
  
    try {
      const imageData = new FormData()
      imageData.append("file", file)
  
      const res = await fetch("/api/upload", {
        method: "POST",
        body: imageData
      })
  
      const data = await res.json()
  
      if (!data.success) {
        throw new Error("Erreur lors de l’upload de l’image.")
      }
  
      // Ajout de l'image dans le formatData
      formatData.imageUrl = data.path
  
      // Création du produit
      await createProduct(formatData, email)
  
      toast.success("Produit créé avec succès")
      router.push("/products")
  
    } catch (error) {
      console.log(error)
      toast.error("Il y a une erreur")
    }
  }
  

  return (
    <Wrapper>
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 w-full">

        {/* === FORMULAIRE === */}
        <section className="flex flex-col space-y-5 w-full md:w-[450px]">
          <h1 className="text-2xl font-bold mb-3">Créer un nouveau produit</h1>

          <input
            type="text"
            name="name"
            value={formatData.name}
            onChange={handleChange}
            placeholder="Nom du produit"
            className="input input-bordered w-full"
          />

          <textarea
            name="description"
            value={formatData.description}
            onChange={handleChange}
            placeholder="Description du produit"
            className="textarea textarea-bordered w-full h-24"
          ></textarea>

          <input
            type="number"
            name="price"
            value={formatData.price}
            onChange={handleChange}
            placeholder="Prix du produit"
            className="input input-bordered w-full"
          />

          <select
            value={formatData.categoryId}
            onChange={handleChange}
            name='categoryId'
            className="select select-bordered w-full"
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>

          <select
            value={formatData.unit}
            onChange={handleChange}
            name='unit'
            className="select select-bordered w-full"
          >
            <option value="">Sélectionner une unité</option>
            <option value="g">Gramme</option>
            <option value="kg">Kilogramme</option>
            <option value="l">Litre</option>
            <option value="m">Mètre</option>
            <option value="cm">Centimètre</option>
            <option value="h">Heure</option>
            <option value="pcs">Pièces</option>
          </select>

          <input
            type="file"
            accept='image/*'
            className='file-input file-input-bordered w-full'
            onChange={handlefileChange}
          />



          <button className='btn btn-primary w-fit' onClick={handleSubmit}>

Créer un produit 


          </button>
        </section>

        {/* === IMAGE PREVIEW === */}
        <div className='w-full md:w-[380px] h-[250px] md:h-[380px] border-2 border-primary flex justify-center items-center rounded-3xl bg-gray-50'>
          {previewUrl && previewUrl !== "" ? (
           <ImageCompo 
           
          src={previewUrl}
          alt="preview"
          heightClass='h-40'
          widthClass='h-40'
           
           
           
           
           />
          ) : (
            <div className='wiggle-animation flex flex-col items-center text-primary'>
              <FileImage strokeWidth={1} className='h-10 w-10 text-primary' />
              <p className="text-sm mt-2">Aucune image sélectionnée</p>
            </div>
          )}



        </div>

      </div>
    </Wrapper>
  );
};

export default Page;
