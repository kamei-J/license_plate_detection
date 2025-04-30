import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    await dbConnect(); // Connect to the database

    const { email, password } = await req.json();

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 }
      );
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 }
      );
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Payload
      JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Token expiration
    );

    // Create a response object
    const response = NextResponse.json(
      { message: "Login successful", user: { username: user.username, email: user.email, role: user.role } },
      { status: 200 }
    );

    // Set the token as an HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Ensure cookies are only sent over HTTPS in production
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: 3600, // Cookie expiration time in seconds (1 hour)
      path: "/", // Make the cookie available across the entire site
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}