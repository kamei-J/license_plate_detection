


import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(req) {
  try {
    await dbConnect()
  
    const { username, phoneNumber, email, password, vehicleType, licensePlateNo} = await req.json()

   const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ username, phoneNumber, email, password: hashedPassword, vehicleType, licensePlateNo})
    await newUser.save()

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}

