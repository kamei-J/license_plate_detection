"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [licensePlateNo, setLicensePlateNo] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Optional: Validate phone number format

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password,
        phoneNumber,
        vehicleType,
        licensePlateNo,
      }),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const errorData = await res.json();
      alert(`Registration failed: ${errorData.message || "Unknown error"}`);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-4xl font-bold mb-8 text-center">Register</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label htmlFor="username" className="sr-only">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="p-2 border rounded"
          />

          <label htmlFor="phoneNumber" className="sr-only">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="123-456-7890"
            required
            className="p-2 border rounded"
          />

          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="p-2 border rounded"
          />

          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="p-2 border rounded"
          />

          <label htmlFor="vehicleType" className="sr-only">
            Vehicle Type
          </label>
          <input
            type="text"
            id="vehicleType"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            placeholder="car/bike/bus/truck"
            required
            className="p-2 border rounded"
          />

          <label htmlFor="licensePlateNo" className="sr-only">
            License Plate No.
          </label>
          <input
            type="text"
            id="licensePlateNo"
            value={licensePlateNo}
            onChange={(e) => setLicensePlateNo(e.target.value)}
            placeholder="AR21ER4567"
            required
            className="p-2 border rounded"
          />

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Register
          </button>
        </form>
      </Card>
    </div>
  );
}