import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json(
        { message: 'Admin not found' },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid password' },
        { status: 401 }
      );
    }
    const token = jwt.sign({ userId: admin._id }, JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    const response = NextResponse.json(
      { message: 'Login successful', admin: { email: admin.email, role: admin.role } },{ status: 200 });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development", // Secure in production
      maxAge: 3600, // 1 hour
      path: "/",
    });
    return response;
      
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}