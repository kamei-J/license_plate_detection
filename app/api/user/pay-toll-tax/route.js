import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

export async function POST(req) {
  try {
    // await dbConnect();

    // Fetch the logged-in user's ID from the session or token
    // const userId = "64f1a2b3c4d5e6f7g8h9i0j"; // Replace with actual user ID
   
    
    const { txnId, amount, userId } = await req.json();
    // Update the transaction status to "completed"
    await Transaction.updateOne(
      { _id:txnId, status: "pending" },
      { status: "completed" }
    );

    return NextResponse.json(
      { message: "Payment successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { message: "An error occurred while processing payment" },
      { status: 500 }
    );
  }
}