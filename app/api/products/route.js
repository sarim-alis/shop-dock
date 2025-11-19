import prisma from "../../../lib/prisma.js";
import authAdmin from "../../..//middlewares/authAdmin.js";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET (request) {
    try {
        let products = await prisma.product.findMany({
            where: { inStock: true },
            include: {
                rating: {
                    select: {
                        createdAt: true, rating: true, review: true,
                        user: { select: {name: true, image: true}}
                    }
                },
                store: true,
            },
            orderBy: { createdAt: 'desc' }
        })

        // Remove products with store inActive false.
        products = products.filter(product => product.store.isActive)
        return NextResponse.json({products})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error'}, { status: 500 });
    }
}