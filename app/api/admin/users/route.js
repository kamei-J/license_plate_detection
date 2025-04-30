import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User"; // Ensure this model exists

export async function GET(req) {
  try {
    await dbConnect();

    // Fetch all users from the database
    const users = await User.find({}).select("-password"); // Exclude passwords
    // console.log(users)
    return NextResponse.json(users, {status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching users" },
      { status: 500 }
    );
  }
}