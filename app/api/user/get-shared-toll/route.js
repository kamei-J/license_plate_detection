import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import Transaction from "@/models/Transaction";

const JWT_SECRET = process.env.JWT_SECRET;

// Fetch user details
export async function GET(req) {
  try {
    // await dbConnect();

    const cookieHeader = req.headers.get("Cookie");
    const token = cookieHeader
      ?.split(";")
      .find((c) => c.trim().startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    const txns = await Transaction.find({userId:user._id})
    return NextResponse.json(txns, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred" },
      { status: 500 }
    );
  }
}
