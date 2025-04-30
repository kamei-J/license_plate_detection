"use client";

import { useState, useEffect } from "react";

export default function UserDashboard() {
  const [tollTax, setTollTax] = useState(0);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    // Fetch toll tax for the logged-in user
    const fetchTollTax = async () => {
      try {
        const res = await fetch("/api/user/toll-tax", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch toll tax");
        }

        const data = await res.json();
        setTollTax(data.tollTax);
        setIsPaid(data.isPaid);
      } catch (error) {
        console.error("Error fetching toll tax:", error);
      }
    };

    fetchTollTax();
  }, []);

  const handlePayment = async () => {
    try {
      const res = await fetch("/api/user/pay-toll-tax", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to process payment");
      }

      setIsPaid(true);
      alert("Payment successful!");
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Calculated Tax</h1>

      <div className="w-full max-w-md">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Toll Tax</h2>
          <p>
            Amount to be Paid: <strong>Rs.{tollTax}</strong>
          </p>
          {isPaid ? (
            <p className="text-green-500 mt-4">Payment Completed</p>
          ) : (
            <button
              onClick={handlePayment}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Pay Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}