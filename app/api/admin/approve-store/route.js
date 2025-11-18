import prisma from "../../../../lib/prisma.js";
import authAdmin from "../../../..//middlewares/authAdmin.js";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


// Approve seller.
export async function POST (request) {
    try {
        const { userId } = getAuth(request)
        const isAdmin    = await authAdmin(userId)

        if (!isAdmin) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 })
        }

        const {storeId, status} = await request.json()

        if (status === 'approved') {
            await prisma.store.update({
                where: { id: storeId },
                data:  { status: "approved", isActive: true }
            })
        } else if (status === 'rejected') {
            await prisma.store.update({
                where: { id: storeId },
                data:  { status: "rejected" }
            })
        }

        return NextResponse.json({ message: status + ' successfully' })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.code || error.message }, { status:400 })
    }
}