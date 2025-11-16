import prisma from "../../../../lib/prisma";
import authSeller from "../../../../middlewares/authSeller"
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Toggle stock of product.
export async function POST (request) {
    try {
        const { userId }   = getAuth(request)
        const { productId} = await request.json()

        if (!productId) {
            return NextResponse.json({error: "Missing details: productId"}, { status:400 });
        }

        const storeId = await authSeller(userId)

        if (!storeId) {
            return NextResponse.json({error: "Not Authorized"}, { status:401 });
        }

        // Check if product exists.
        const product = await prisma.product.findFirst({
            where: { id: productId, storeId }
        })

        if (!product) {
            return NextResponse.json({error: "Product not found"}, { status:404 });
        }

        await prisma.product.update({
            where: { id: productId },
            data: { inStock: !product.inStock }
        })
        
        return NextResponse.json({message: "Product stock updated successfully"});
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status:400 })
    }
}