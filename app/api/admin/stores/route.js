import prisma from "../../../../lib/prisma.js";
import authAdmin from "../../../..//middlewares/authAdmin.js";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


// Approve seller.