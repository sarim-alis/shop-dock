import prisma from "../../../../lib/prisma.js";
import authAdmin from "../../../..//middlewares/authAdmin.js";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Toggle store isActive.
export async function GET (request) {
    try {
        const { userId } = getAuth(request)
        const isAdmin    = await authAdmin(userId)

        if (!isAdmin) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 })
        }

        const { storeId } = await request.json()

        if (!storeId) {
            return NextResponse.json({ error: "Store ID is required" }, { status: 400 })
        }

        // Find store.
        const store = await prisma.store.findUnique({where: { id: storeId }})

        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 })
        }

        await prisma.store.update({
            where: { id: storeId },
            data:  { isActive: !store.isActive }
        })

        return NextResponse.json({ message: "Store updated successfully" })
        
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}