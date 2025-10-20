import { existsSync } from "fs"; // Vérifie si un chemin existe de manière synchrone
import { mkdir, unlink, writeFile } from "fs/promises"; // Crée un répertoire (version promise/asynchrone)
import { NextRequest, NextResponse } from "next/server"; // Types et fonctions pour les requêtes/réponses Next.js
import { join } from "path"; // Joint des segments de chemin

// Fonction asynchrone pour gérer les requêtes HTTP POST
export async function POST(request: NextRequest) {


      try {
        const data = await request.formData()
        const file: File | null = data.get("file") as unknown as File

        if (!file) {
            return NextResponse.json({ success: false })
        }
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const uploadDir = join(process.cwd(), "public", "uploads")
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true })
        }

        const ext = file.name.split('.').pop()
        const UniqueName = crypto.randomUUID() + '.' + ext
        const filePath = join(uploadDir, UniqueName)
        await writeFile(filePath, buffer)
        const publicPath = `/uploads/${UniqueName}`
        return NextResponse.json({ success: true, path: publicPath })
    } catch (error) {
        console.error(error)
    }
}


export async function DELETE(request: NextRequest) {
    try {
        const { path } = await request.json()
        if (!path) {
            return NextResponse.json({ success: false, message: "Chemin invalide." }, { status: 400 });
        }

        const filePath = join(process.cwd(), "public", path)

        if (!existsSync(filePath)) {
            return NextResponse.json({ success: false, message: "Fichier supprimé avec succès." }, { status: 201 });
        }

        await unlink(filePath)
        return NextResponse.json({ success: true, message: "Fichier non trouvé." }, { status: 404 });
    }
    catch (error) {
        console.error(error)
    }
}