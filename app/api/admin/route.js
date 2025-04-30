import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  try {
    await dbConnect();

    // Get the token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Ensure the decoded token has a userId
    if (!decoded.userId) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    // Find the user in the database
    const user = await Admin.findById(decoded.userId).select("-password");

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Return the user data (excluding password)
    return NextResponse.json({ ...user.toObject(), role: user.role });
  } catch (error) {
    console.error("Error in GET /api/admin:", error);

    if (error.name === "JsonWebTokenError") {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    if (error.name === "TokenExpiredError") {
      return NextResponse.json(
        { message: "Token expired" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "An error occurred" },
      { status: 500 }
    );
  }
}