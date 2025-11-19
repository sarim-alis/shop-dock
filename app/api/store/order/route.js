import prisma from "../../../../lib/prisma";
import authSeller from "../../../../middlewares/authSeller"
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


// Update seller order status.
export async function POST (request) {
    try {
      const { userId } = getAuth(request)
      const storeId    = await authSeller(userId)

      if (!storeId) {
         return NextResponse.json({ error: "Not authorized" }, { status: 401 });
      }
      
      const { orderId, status } = await request.json()

      await prisma.order.update({
        where: { id: orderId, storeId },
        data:  { status }
      })
        
      return NextResponse.json({message: "Order status updated"})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status:400 })
    }
}