import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import Transaction from "@/models/Transaction";

const JWT_SECRET = process.env.JWT_SECRET;

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
    // Fetch transactions from the database
    const transactions = await Transaction.find({
      userId: decoded.userId,
      // status: "completed",
    })
      .sort({ date: -1 }) // Sort by date in descending order
      .limit(10); // Limit to 10 recent transactions

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching transactions" },
      { status: 500 }
    );
  }
}
