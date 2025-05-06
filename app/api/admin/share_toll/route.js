import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Transaction from "@/models/Transaction";

export async function POST(req) {
  try {
    // await dbConnect();

    const { licensePlateNo, tollTax, userId } = await req.json();
    // Fetch user details based on license plate number
    const user = await User.findById(userId);
    // const oldTxn = await Transaction.findOne({ userId });
    // if (oldTxn) {
    //   await Transaction.findByIdAndUpdate(
    //     oldTxn._id,
    //     { amount: oldTxn.amount + tollTax, status: "pending" }
    //   );
    //   return NextResponse.json({ user }, { status: 200 });
    // }
    const txn = new Transaction({
      userId: user._id,
      amount: tollTax,
      status: "pending",
      date: new Date(),
    });

    await txn.save();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while fetching user details", error },
      { status: 500 }
    );
  }
}
