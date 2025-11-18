import prisma from "../../../../lib/prisma.js";
import authAdmin from "../../../..//middlewares/authAdmin.js";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


// Add new coupon.
export async function POST(request) {
    try {
        const { userId } = getAuth()
        const isAdmin    = await authAdmin()
        
        if (!isAdmin) {
            return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
        }

        const { coupon } = await request.json()
        coupon.code = coupon.code.toUpperCase()

        await prisma.coupon.create({data: coupon})

        return NextResponse.json({ message: "Coupon added successfully!" })
        
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.code || error.message }, { status:400 })
    }
}