"use client"
import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

// export const metadata = {
//   title: "Next.js MongoDB Auth",
//   description: "A Next.js app with MongoDB and authentication",
// }

export default function RootLayout({
  children
}) {
  return (
    (<html lang="en">
      <body className={inter.className}>{children}</body>
    </html>)
  );
}

