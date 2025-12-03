"use server"
/* eslint-disable @typescript-eslint/no-explicit-any */

import prisma from "@/lib/prisma"
import { Category } from "@prisma/client"
import { FormDataType, Product } from "../../type"

// ────────────────────────────────────────────────────────────────
// FONCTION RÉUTILISABLE : Crée l'association si elle n'existe pas
// ────────────────────────────────────────────────────────────────
async function ensureAssociation(email: string, defaultName: string = "Mon Association") {
    if (!email) throw new Error("Email requis pour l'association.")

    const association = await prisma.association.findUnique({
        where: { email }
    })

    if (!association) {
        await prisma.association.create({
            data: { email, name: defaultName }
        })
    }

    return await prisma.association.findUnique({ where: { email } })
}

// ────────────────────────────────────────────────────────────────
// CRÉATION / VÉRIFICATION D'ASSOCIATION (ancienne version conservée)
// ────────────────────────────────────────────────────────────────
export async function checkAndAddAssociation(email: string, name: string) {
    if (!email || !name) return
    try {
        const existing = await prisma.association.findUnique({ where: { email } })
        if (!existing) {
            await prisma.association.create({ data: { email, name } })
        }
    } catch (error) {
        console.error("Erreur checkAndAddAssociation:", error)
        throw error
    }
}

export async function getAssociation(email: string) {
    if (!email) return null
    try {
        return await prisma.association.findUnique({ where: { email } })
    } catch (error) {
        console.error("Erreur getAssociation:", error)
        return null
    }
}

// ────────────────────────────────────────────────────────────────
// CATEGORIES
// ────────────────────────────────────────────────────────────────
export async function createCategory(name: string, email: string, description?: string) {
    if (!name || !email) return { error: "Nom et email requis." }

    try {
        const association = await ensureAssociation(email)
        if (!association) throw new Error("Impossible de créer l'association.")

        await prisma.category.create({
            data: {
                name,
                description: description || "",
                associationId: association.id
            }
        })
        return { success: true }
    } catch (error: any) {
        console.error("createCategory error:", error)
        return { error: error.message || "Erreur lors de la création." }
    }
}

export async function updateCategory(id: string, email: string, name: string, description?: string) {
    if (!id || !email || !name) {
        return { error: "ID, email et nom requis." }
    }

    try {
        const association = await ensureAssociation(email)
        if (!association) throw new Error("Aucune association.")

        const existing = await prisma.category.findFirst({
            where: { id, associationId: association.id }
        })
        if (!existing) return { error: "Catégorie introuvable." }

        await prisma.category.update({
            where: { id },
            data: { name, description: description || "" }
        })
        return { success: true }
    } catch (error: any) {
        console.error("updateCategory error:", error)
        return { error: error.message }
    }
}

export async function deleteCategory(id: string, email: string) {
    if (!id || !email) return { error: "ID et email requis." }

    try {
        const association = await ensureAssociation(email)
        if (!association) throw new Error("Aucune association.")

        const existing = await prisma.category.findFirst({
            where: { id, associationId: association.id }
        })
        if (!existing) return { error: "Catégorie introuvable." }

        await prisma.category.delete({ where: { id } })
        return { success: true }
    } catch (error: any) {
        console.error("deleteCategory error:", error)
        return { error: error.message }
    }
}

export async function readCategories(email: string): Promise<Category[] | undefined> {
    if (!email) return []

    try {
        const association = await ensureAssociation(email)
        if (!association) return []

        return await prisma.category.findMany({
            where: { associationId: association.id }
        })
    } catch (error) {
        console.error("readCategories error:", error)
        return []
    }
}

// ────────────────────────────────────────────────────────────────
// PRODUITS
// ────────────────────────────────────────────────────────────────
export async function createProduct(formdata: FormDataType, email: string) {
    const { name, description, price, categoryId, unit, imageUrl } = formdata

    if (!email || !name || !price || !categoryId) {
        return { error: "Email, nom, prix et catégorie requis." }
    }

    try {
        const association = await ensureAssociation(email)
        if (!association) throw new Error("Aucune association.")

        await prisma.product.create({
            data: {
                name,
                description: description || "",
                price: Number(price),
                categoryId,
                imageUrl: imageUrl || "",
                unit: unit || "",
                associationId: association.id,
                quantity: 0
            }
        })
        return { success: true }
    } catch (error: any) {
        console.error("createProduct error:", error)
        return { error: error.message }
    }
}

export async function updateProduct(formdata: FormDataType, email: string) {
    const { id, name, description, price, imageUrl } = formdata

    if (!email || !id || !name || !price) {
        return { error: "Email, ID, nom et prix requis." }
    }

    try {
        const association = await ensureAssociation(email)
        if (!association) throw new Error("Aucune association.")

        const existing = await prisma.product.findFirst({
            where: { id, associationId: association.id }
        })
        if (!existing) return { error: "Produit introuvable." }

        await prisma.product.update({
            where: { id },
            data: {
                name,
                description: description || "",
                price: Number(price),
                imageUrl: imageUrl || ""
            }
        })
        return { success: true }
    } catch (error: any) {
        console.error("updateProduct error:", error)
        return { error: error.message }
    }
}

export async function deleteProduct(id: string, email: string) {
    if (!id || !email) return { error: "ID et email requis." }

    try {
        const association = await ensureAssociation(email)
        if (!association) throw new Error("Aucune association.")

        const existing = await prisma.product.findFirst({
            where: { id, associationId: association.id }
        })
        if (!existing) return { error: "Produit introuvable." }

        await prisma.product.delete({ where: { id } })
        return { success: true }
    } catch (error: any) {
        console.error("deleteProduct error:", error)
        return { error: error.message }
    }
}

export async function readProducts(email: string): Promise<Product[] | undefined> {
    if (!email) return []

    try {
        const association = await ensureAssociation(email)
        if (!association) return []

        const products = await prisma.product.findMany({
            where: { associationId: association.id },
            include: { category: true }
        })

        return products.map(p => ({
            ...p,
            categoryName: p.category?.name || ""
        }))
    } catch (error) {
        console.error("readProducts error:", error)
        return []
    }
}

export async function readProductById(productId: string, email: string): Promise<Product | undefined> {
    if (!email || !productId) return undefined

    try {
        const association = await ensureAssociation(email)
        if (!association) return undefined

        const product = await prisma.product.findUnique({
            where: { id: productId, associationId: association.id },
            include: { category: true }
        })

        if (!product) return undefined

        return {
            ...product,
            categoryName: product.category?.name || ""
        }
    } catch (error) {
        console.error("readProductById error:", error)
        return undefined
    }
}

// ────────────────────────────────────────────────────────────────
// STOCK & TRANSACTIONS
// ────────────────────────────────────────────────────────────────
export async function updateStockQuantity(productId: string, quantityToAdd: number, email: string) {
    if (!email || !productId || quantityToAdd <= 0) {
        return { error: "Paramètres invalides." }
    }

    try {
        const association = await ensureAssociation(email)
        if (!association) throw new Error("Aucune association.")

        const product = await prisma.product.findFirst({
            where: { id: productId, associationId: association.id }
        })
        if (!product) return { error: "Produit introuvable." }

        const updated = await prisma.product.update({
            where: { id: productId },
            data: { quantity: { increment: quantityToAdd } }
        })

        await prisma.transaction.create({
            data: {
                type: "ADD",
                quantity: quantityToAdd,
                productId,
                associationId: association.id
            }
        })

        return { success: true, product: updated }
    } catch (error: any) {
        console.error("updateStockQuantity error:", error)
        return { error: error.message }
    }
}

export async function updateStockQuantityRemove(productId: string, quantityToRemove: number, email: string) {
    if (!email || !productId || quantityToRemove <= 0) {
        return { error: "Paramètres invalides." }
    }

    try {
        const association = await ensureAssociation(email)
        if (!association) throw new Error("Aucune association.")

        const product = await prisma.product.findFirst({
            where: { id: productId, associationId: association.id }
        })
        if (!product) return { error: "Produit introuvable." }
        if (product.quantity < quantityToRemove) {
            return { error: `Stock insuffisant: ${product.quantity} ${product.unit}` }
        }

        const updated = await prisma.product.update({
            where: { id: productId },
            data: { quantity: { decrement: quantityToRemove } }
        })

        await prisma.transaction.create({
            data: {
                type: "REMOVE",
                quantity: quantityToRemove,
                productId,
                associationId: association.id
            }
        })

        return { success: true, product: updated }
    } catch (error: any) {
        console.error("updateStockQuantityRemove error:", error)
        return { error: error.message }
    }
}

// (Le reste des fonctions est déjà correct et utilise `ensureAssociation` si besoin)
// → Tu peux les laisser telles quelles si tu veux, ou les adapter plus tard.

export async function readTransactions(email: string): Promise<any[] | undefined> {
    if (!email) return []
    try {
        const association = await ensureAssociation(email)
        if (!association) return []

        const transactions = await prisma.transaction.findMany({
            where: { associationId: association.id },
            include: {
                product: { include: { category: true } }
            },
            orderBy: { createdAt: 'desc' }
        })

        return transactions.map(t => ({
            ...t,
            productName: t.product.name,
            categoryName: t.product.category?.name,
            productUnit: t.product.unit
        }))
    } catch (error) {
        console.error("readTransactions error:", error)
        return []
    }
}

// ... (les autres fonctions comme createGiveTransaction, getGiveStats, etc.)
// → Elles sont déjà bien structurées. Tu peux les garder telles quelles.


// ────────────────────────────────────────────────────────────────
// STATS DES DONS
// ────────────────────────────────────────────────────────────────
export async function getGiveStats(email: string) {
    if (!email) {
        return { error: "Email requis." }
    }

    try {
        const association = await ensureAssociation(email)
        if (!association) throw new Error("Aucune association.")

        const giveTransactions = await prisma.transaction.count({
            where: {
                associationId: association.id,
                type: "GIVE"
            }
        })

        const totalQuantityGiven = await prisma.transaction.aggregate({
            where: {
                associationId: association.id,
                type: "GIVE"
            },
            _sum: { quantity: true }
        })

        const uniqueRecipients = await prisma.transaction.groupBy({
            by: ['recipientName'],
            where: {
                associationId: association.id,
                type: "GIVE",
                recipientName: { not: "" }
            }
        })

        return {
            totalGiveTransactions: giveTransactions,
            totalQuantityGiven: totalQuantityGiven._sum.quantity || 0,
            uniqueRecipients: uniqueRecipients.length
        }
    } catch (error: any) {
        console.error("getGiveStats error:", error)
        return { error: error.message }
    }
}



// ────────────────────────────────────────────────────────────────
// STATS GÉNÉRALES DES TRANSACTIONS
// ────────────────────────────────────────────────────────────────
export async function getTransactionStats(email: string) {
    if (!email) {
        return { error: "Email requis." }
    }

    try {
        const association = await ensureAssociation(email)
        if (!association) throw new Error("Aucune association.")

        const totalTransactions = await prisma.transaction.count({
            where: { associationId: association.id }
        })

        const addTransactions = await prisma.transaction.count({
            where: { associationId: association.id, type: "ADD" }
        })

        const removeTransactions = await prisma.transaction.count({
            where: { associationId: association.id, type: "REMOVE" }
        })

        const totalQuantityAdded = await prisma.transaction.aggregate({
            where: { associationId: association.id, type: "ADD" },
            _sum: { quantity: true }
        })

        const totalQuantityRemoved = await prisma.transaction.aggregate({
            where: { associationId: association.id, type: "REMOVE" },
            _sum: { quantity: true }
        })

        const giveTransactions = await prisma.transaction.count({
            where: { associationId: association.id, type: "GIVE" }
        })

        const totalQuantityGiven = await prisma.transaction.aggregate({
            where: { associationId: association.id, type: "GIVE" },
            _sum: { quantity: true }
        })

        return {
            totalTransactions,
            addTransactions,
            removeTransactions,
            totalQuantityAdded: totalQuantityAdded._sum.quantity || 0,
            totalQuantityRemoved: totalQuantityRemoved._sum.quantity || 0,
            giveTransactions,
            totalQuantityGiven: totalQuantityGiven._sum.quantity || 0
        }
    } catch (error: any) {
        console.error("getTransactionStats error:", error)
        return { error: error.message }
    }
}


// ────────────────────────────────────────────────────────────────
// CRÉER UN DON (GIVE TRANSACTION)
// ────────────────────────────────────────────────────────────────
export async function createGiveTransaction(
    items: Array<{ productId: string; quantity: number }>,
    email: string,
    recipientName?: string,
    recipientInfo?: string
) {
    if (!email || !items || items.length === 0) {
        return { error: "Email et au moins un produit requis." }
    }

    try {
        const association = await ensureAssociation(email)
        if (!association) throw new Error("Aucune association.")

        // Vérifier que tous les produits existent et appartiennent à l'association
        const productIds = items.map(item => item.productId)
        const existingProducts = await prisma.product.findMany({
            where: {
                id: { in: productIds },
                associationId: association.id
            }
        })

        if (existingProducts.length !== productIds.length) {
            return { error: "Un ou plusieurs produits n'existent pas ou n'appartiennent pas à votre association." }
        }

        // Vérifier le stock
        for (const item of items) {
            const product = existingProducts.find(p => p.id === item.productId)
            if (!product) continue

            if (product.quantity < item.quantity) {
                return { error: `Stock insuffisant pour ${product.name}. Disponible: ${product.quantity} ${product.unit}` }
            }
        }

        // Créer les transactions + mettre à jour les stocks
        const transactions = []
        for (const item of items) {
            const product = existingProducts.find(p => p.id === item.productId)
            if (!product) continue

            const transaction = await prisma.transaction.create({
                data: {
                    type: "GIVE",
                    quantity: item.quantity,
                    productId: item.productId,
                    associationId: association.id,
                    recipientName: recipientName || "",
                    recipientInfo: recipientInfo || ""
                },
                include: {
                    product: { include: { category: true } }
                }
            })

            await prisma.product.update({
                where: { id: item.productId },
                data: { quantity: { decrement: item.quantity } }
            })

            transactions.push({
                ...transaction,
                productName: transaction.product.name,
                categoryName: transaction.product.category?.name,
                productUnit: transaction.product.unit
            })
        }

        return { success: true, transactions }
    } catch (error: any) {
        console.error("createGiveTransaction error:", error)
        return { error: error.message || "Erreur lors du don." }
    }
}