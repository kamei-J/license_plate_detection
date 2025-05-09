"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main 
      className="flex min-h-screen flex-col items-center justify-center p-24 relative"
      style={{
        backgroundImage: "url('/Flux_Dev_Create_a_highresolution_image_of_a_modern_toll_plaza__3.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Semi-transparent overlay for better text visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
      
      {/* Content container with higher z-index */}
      <div className="relative z-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-white">Welcome to OTMS</h1>
      <div className="flex gap-4">
        <Link
          href="/admin/login"
          className="bg-red-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Admin
        </Link>
        <Link
          href="/login"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          User Login
        </Link>
        <Link
          href="/register"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          New User
        </Link>
      </div>
      </div>
    </main>
  );
}