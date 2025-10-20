

import { Product as PrismaProduct } from "@prisma/client"


export interface Product extends PrismaProduct {
    categoryName: string;
}
export interface FormDataType {
    id?: string;
    name: string;
    description: string;
    price: number;
    quantity?: number;
    categoryId?: string;
    unit?: string;
    categoryName?: string;
    imageUrl?: string;
}

export interface TransactionType {
    id: string;
    type: string;
    quantity: number;
    createdAt: string;
    productName: string;
    categoryName: string;
    productUnit: string;
}