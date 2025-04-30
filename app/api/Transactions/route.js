import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

export async function GET(req) {
  try {
    await dbConnect();

    // Fetch transactions from the database
    const transactions = await Transaction.find({})
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