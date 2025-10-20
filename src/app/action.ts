"use server"

import prisma from "@/lib/prisma"
import { Category, Transaction } from "@prisma/client"
import { FormDataType, Product } from "../../type"

export async function checkAndAddAssociation(email: string, name: string) {
    if (!email) return
    try {
        const existingAssociation = await prisma.association.findUnique({
            where: {
                email
            }
        })
        if (!existingAssociation && name) {
            await prisma.association.create({
                data: {
                    email, name
                }
            })
        }

    } catch (error) {
        console.error(error)
    }
}

export async function getAssociation(email: string) {
    if (!email) return
    try {
        const existingAssociation = await prisma.association.findUnique({
            where: {
                email
            }
        })
        return existingAssociation
    } catch (error) {
        console.error(error)
    }
}

export async function createCategory(
    name: string,
    email: string,
    description?: string
) {

    if (!name) return
    try {

        const association = await getAssociation(email)
        if (!association) {
            throw new Error("Aucune association trouvée avec cet email.");
        }
        await prisma.category.create({
            data: {
                name,
                description: description || "",
                associationId: association.id
            }
        })

    } catch (error) {
        console.error(error)
    }
}

export async function updateCategory(
    id: string,
    email: string,
    name: string,
    description?: string,
) {

    if (!id || !email || !name) {
        throw new Error("L'id, l'email de l'association et le nom de la catégorie sont requis pour la mise à jour.")
    }

    try {
        const association = await getAssociation(email)
        if (!association) {
            throw new Error("Aucune association trouvée avec cet email.");
        }

        await prisma.category.update({
            where: {
                id: id,
                associationId: association.id
            },
            data: {
                name,
                description: description || "",
            }
        })

    } catch (error) {
        console.error(error)
    }
}

export async function deleteCategory(id: string, email: string) {
    if (!id || !email) {
        throw new Error("L'id, l'email de l'association et sont requis.")
    }

    try {
        const association = await getAssociation(email)
        if (!association) {
            throw new Error("Aucune association trouvée avec cet email.");
        }

        await prisma.category.delete({
            where: {
                id: id,
                associationId: association.id
            }
        })
    } catch (error) {
        console.error(error)
    }
}

export async function readCategories(email: string): Promise<Category[] | undefined> {
    if (!email) {
        throw new Error("l'email de l'association est  requis")
    }

    try {
        const association = await getAssociation(email)
        if (!association) {
            throw new Error("Aucune association trouvée avec cet email.");
        }

        const categories = await prisma.category.findMany({
            where: {
                associationId: association.id
            }
        })
        return categories
    } catch (error) {
        console.error(error)
    }
}

export async function  createProduct( formdata:FormDataType , email:string ){

   try{

 const { name,description, price, categoryId, unit, imageUrl}= formdata;

    if(!email || !name || !price || !categoryId  ){

        throw new Error ('L email , le nom , le prix , la categorie sont requis pour la  creation du produit');
    }

    const safeImageUrl= imageUrl || "";

const safeunit = unit ||"";


const association = await getAssociation(email)
if(!association){

    throw new Error ("Aucune trouver avec cet email");
    
}


await prisma.product.create({
  data :{
name ,
description,
price: Number(price),
categoryId, 
imageUrl:safeImageUrl,
unit:safeunit,
associationId: association.id
  }



})

   }catch(error){
console.error(error)
   }



}

export async function  updateProduct(formdata:FormDataType, email:string){


 try{

 const { id, name,description, price, imageUrl}= formdata;

    if(!email || !name || !price || !id ){

        throw new Error ('L email , le nom , le prix , la categorie sont requis pour la  creation du produit');
    }





const association = await getAssociation(email)
if(!association){

    throw new Error ("Aucune trouver avec cet email");
    
}



        await prisma.product.update({
            where: {
                id: id,
                associationId: association.id
            },
           data :{
name ,
description,
price:Number(price),
imageUrl: imageUrl,

  }

        })
   }catch(error){
console.error(error)
   }



}


export async function  deleteProduct(id:string, email:string){


 try{



    if( !id ){

        throw new Error (' lid sont requis pour la supression');
    }





const association = await getAssociation(email)
if(!association){

    throw new Error ("Aucune trouver avec cet email");
    
}



        await prisma.product.delete({
            where: {
                id: id,
                associationId: association.id
            }
         
  
        })
   }catch(error){
console.error(error)
   }



}

export async function readProducts(email: string): Promise<Product[] | undefined> {
    try {
        if (!email) {
            throw new Error("l'email est requis .")
        }

        const association = await getAssociation(email)
        if (!association) {
            throw new Error("Aucune association trouvée avec cet email.");
        }

        const products = await prisma.product.findMany({
            where: {
                associationId: association.id
            },
            include: {
                category: true
            }
        })

        return products.map(product => ({
            ...product,
            categoryName: product.category?.name
        }))

    } catch (error) {
        console.error(error)
    }
}

export async function readProductById(productId: string, email: string): Promise<Product | undefined> {
    try {
        if (!email) {
            throw new Error("l'email est requis .")
        }

        const association = await getAssociation(email)
        if (!association) {
            throw new Error("Aucune association trouvée avec cet email.");
        }

        const product = await prisma.product.findUnique({
            where: {
                id: productId,
                associationId: association.id
            },
            include: {
                category: true
            }
        })
        if (!product) {
            return undefined
        }

        return {
            ...product,
            categoryName: product.category?.name
        }
    } catch (error) {
        console.error(error)
    }
}

export async function updateStockQuantity(productId: string, quantityToAdd: number, email: string) {
    try {
        if (!email || !productId || quantityToAdd <= 0) {
            throw new Error("L'email, l'ID du produit et une quantité positive sont requis.");
        }

        const association = await getAssociation(email)
        if (!association) {
            throw new Error("Aucune association trouvée avec cet email.");
        }

        // Vérifier que le produit existe et appartient à l'association
        const existingProduct = await prisma.product.findUnique({
            where: {
                id: productId,
                associationId: association.id
            }
        })

        if (!existingProduct) {
            throw new Error("Produit non trouvé ou n'appartient pas à votre association.");
        }

        // Mettre à jour la quantité du produit
        const updatedProduct = await prisma.product.update({
            where: {
                id: productId,
                associationId: association.id
            },
            data: {
                quantity: {
                    increment: quantityToAdd
                }
            }
        })

        // Créer une transaction pour l'historique
        await prisma.transaction.create({
            data: {
                type: "ADD",
                quantity: quantityToAdd,
                productId: productId,
                associationId: association.id
            }
        })

        return updatedProduct;
    } catch (error) {
        console.error(error)
        throw error;
    }
}

export async function updateStockQuantityRemove(productId: string, quantityToRemove: number, email: string) {
    try {
        if (!email || !productId || quantityToRemove <= 0) {
            throw new Error("L'email, l'ID du produit et une quantité positive sont requis.");
        }

        const association = await getAssociation(email)
        if (!association) {
            throw new Error("Aucune association trouvée avec cet email.");
        }

        // Vérifier que le produit existe et appartient à l'association
        const existingProduct = await prisma.product.findUnique({
            where: {
                id: productId,
                associationId: association.id
            }
        })

        if (!existingProduct) {
            throw new Error("Produit non trouvé ou n'appartient pas à votre association.");
        }

        // Vérifier que le stock est suffisant
        if (existingProduct.quantity < quantityToRemove) {
            throw new Error(`Stock insuffisant. Stock actuel: ${existingProduct.quantity} ${existingProduct.unit}. Quantité demandée: ${quantityToRemove} ${existingProduct.unit}.`);
        }

        // Mettre à jour la quantité du produit
        const updatedProduct = await prisma.product.update({
            where: {
                id: productId,
                associationId: association.id
            },
            data: {
                quantity: {
                    decrement: quantityToRemove
                }
            }
        })

        // Créer une transaction pour l'historique
        await prisma.transaction.create({
            data: {
                type: "REMOVE",
                quantity: quantityToRemove,
                productId: productId,
                associationId: association.id
            }
        })

        return updatedProduct;
    } catch (error) {
        console.error(error)
        throw error;
    }
}

export async function readTransactions(email: string): Promise<any[] | undefined> {
    try {
        if (!email) {
            throw new Error("L'email est requis.");
        }

        const association = await getAssociation(email)
        if (!association) {
            throw new Error("Aucune association trouvée avec cet email.");
        }

        const transactions = await prisma.transaction.findMany({
            where: {
                associationId: association.id
            },
            include: {
                product: {
                    include: {
                        category: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return transactions.map(transaction => ({
            ...transaction,
            productName: transaction.product.name,
            categoryName: transaction.product.category?.name,
            productUnit: transaction.product.unit
        }))
    } catch (error) {
        console.error(error)
        throw error;
    }
}

export async function createTransaction(
    productId: string, 
    type: string, 
    quantity: number, 
    email: string
) {
    try {
        if (!email || !productId || !type || quantity <= 0) {
            throw new Error("Tous les paramètres sont requis et la quantité doit être positive.");
        }

        const association = await getAssociation(email)
        if (!association) {
            throw new Error("Aucune association trouvée avec cet email.");
        }

        // Vérifier que le produit existe et appartient à l'association
        const existingProduct = await prisma.product.findUnique({
            where: {
                id: productId,
                associationId: association.id
            }
        })

        if (!existingProduct) {
            throw new Error("Produit non trouvé ou n'appartient pas à votre association.");
        }

        // Créer la transaction
        const transaction = await prisma.transaction.create({
            data: {
                type,
                quantity,
                productId,
                associationId: association.id
            },
            include: {
                product: {
                    include: {
                        category: true
                    }
                }
            }
        })

        return {
            ...transaction,
            productName: transaction.product.name,
            categoryName: transaction.product.category?.name,
            productUnit: transaction.product.unit
        };
    } catch (error) {
        console.error(error)
        throw error;
    }
}

export async function getTransactionStats(email: string) {
    try {
        if (!email) {
            throw new Error("L'email est requis.");
        }

        const association = await getAssociation(email)
        if (!association) {
            throw new Error("Aucune association trouvée avec cet email.");
        }

        const totalTransactions = await prisma.transaction.count({
            where: {
                associationId: association.id
            }
        });

        const addTransactions = await prisma.transaction.count({
            where: {
                associationId: association.id,
                type: "ADD"
            }
        });

        const removeTransactions = await prisma.transaction.count({
            where: {
                associationId: association.id,
                type: "REMOVE"
            }
        });

        const totalQuantityAdded = await prisma.transaction.aggregate({
            where: {
                associationId: association.id,
                type: "ADD"
            },
            _sum: {
                quantity: true
            }
        });

        const totalQuantityRemoved = await prisma.transaction.aggregate({
            where: {
                associationId: association.id,
                type: "REMOVE"
            },
            _sum: {
                quantity: true
            }
        });

        const giveTransactions = await prisma.transaction.count({
            where: {
                associationId: association.id,
                type: "GIVE"
            }
        });

        const totalQuantityGiven = await prisma.transaction.aggregate({
            where: {
                associationId: association.id,
                type: "GIVE"
            },
            _sum: {
                quantity: true
            }
        });

        return {
            totalTransactions,
            addTransactions,
            removeTransactions,
            totalQuantityAdded: totalQuantityAdded._sum.quantity || 0,
            totalQuantityRemoved: totalQuantityRemoved._sum.quantity || 0,
            giveTransactions,
            totalQuantityGiven: totalQuantityGiven._sum.quantity || 0
        };
    } catch (error) {
        console.error(error)
        throw error;
    }
}

export async function createGiveTransaction(
    items: Array<{productId: string, quantity: number}>,
    email: string,
    recipientName?: string,
    recipientInfo?: string
) {
    try {
        if (!email || !items || items.length === 0) {
            throw new Error("L'email et au moins un produit sont requis pour créer un don.");
        }

        const association = await getAssociation(email)
        if (!association) {
            throw new Error("Aucune association trouvée avec cet email.");
        }

        // Vérifier que tous les produits existent et appartiennent à l'association
        const productIds = items.map(item => item.productId);
        const existingProducts = await prisma.product.findMany({
            where: {
                id: { in: productIds },
                associationId: association.id
            }
        });

        if (existingProducts.length !== productIds.length) {
            throw new Error("Un ou plusieurs produits n'existent pas ou n'appartiennent pas à votre association.");
        }

        // Vérifier que les stocks sont suffisants pour chaque produit
        for (const item of items) {
            const product = existingProducts.find(p => p.id === item.productId);
            if (!product) continue;
            
            if (product.quantity < item.quantity) {
                throw new Error(`Stock insuffisant pour ${product.name}. Stock actuel: ${product.quantity} ${product.unit}. Quantité demandée: ${item.quantity} ${product.unit}.`);
            }
        }

        // Créer les transactions de don et mettre à jour les stocks
        const transactions = [];
        for (const item of items) {
            const product = existingProducts.find(p => p.id === item.productId);
            if (!product) continue;

            // Créer la transaction de don
            const transaction = await prisma.transaction.create({
                data: {
                    type: "GIVE",
                    quantity: item.quantity,
                    productId: item.productId,
                    associationId: association.id,
                    recipientName: recipientName || "",
                    recipientInfo: recipientInfo || ""
                } as any,
                include: {
                    product: {
                        include: {
                            category: true
                        }
                    }
                }
            });

            // Mettre à jour le stock
            await prisma.product.update({
                where: {
                    id: item.productId,
                    associationId: association.id
                },
                data: {
                    quantity: {
                        decrement: item.quantity
                    }
                }
            });

            transactions.push({
                ...transaction,
                productName: (transaction as any).product.name,
                categoryName: (transaction as any).product.category?.name,
                productUnit: (transaction as any).product.unit
            });
        }

        return transactions;
    } catch (error) {
        console.error(error)
        throw error;
    }
}

export async function getGiveStats(email: string) {
    try {
        if (!email) {
            throw new Error("L'email est requis.");
        }

        const association = await getAssociation(email)
        if (!association) {
            throw new Error("Aucune association trouvée avec cet email.");
        }

        const giveTransactions = await prisma.transaction.count({
            where: {
                associationId: association.id,
                type: "GIVE"
            }
        });

        const totalQuantityGiven = await prisma.transaction.aggregate({
            where: {
                associationId: association.id,
                type: "GIVE"
            },
            _sum: {
                quantity: true
            }
        });

        const uniqueRecipients = await prisma.transaction.groupBy({
            by: ['recipientName'] as any,
            where: {
                associationId: association.id,
                type: "GIVE",
                recipientName: {
                    not: ""
                }
            } as any
        });

        return {
            totalGiveTransactions: giveTransactions,
            totalQuantityGiven: totalQuantityGiven._sum.quantity || 0,
            uniqueRecipients: uniqueRecipients.length
        };
    } catch (error) {
        console.error(error)
        throw error;
    }
}


