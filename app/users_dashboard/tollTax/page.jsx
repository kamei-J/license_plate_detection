"use client";

import { useState, useEffect } from "react";

export default function UserDashboard() {
  const [tollTax, setTollTax] = useState(0);
  const [isPaid, setIsPaid] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const fetchTollTax = async () => {
    try {
      const res = await fetch("/api/user/get-shared-toll", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch toll tax");
      }

      const data = await res.json();
      // console.log(data);
      // setTollTax(data.amount);
      // setIsPaid(data.status==='completed');
      // setTollTax(0);
      // setIsPaid(false);
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching toll tax:", error);
    }
  };

  useEffect(() => {
    // Fetch toll tax for the logged-in user

    fetchTollTax();
  }, []);

  const handlePayment = async (txn) => {
    try {
      const res = await fetch("/api/user/pay-toll-tax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txnId: txn._id,
          userId: txn.userId,
          amount: txn.amount,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to process payment");
      }

      setIsPaid(true);
      fetchTollTax();
      alert("Payment successful!");
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Calculated Tax</h1>

      {/* <div className="w-full max-w-md">
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
      </div> */}
      <div className="w-full max-w-5xl mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent Pending Transactions</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {transactions.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Transaction ID</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Payment</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id} className="border-b">
                    <td className="p-2">{transaction._id}</td>
                    <td className="p-2">${transaction.amount.toFixed(2)}</td>
                    <td className="p-2">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded ${
                          transaction.status === "completed"
                            ? "bg-green-200 text-green-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => {
                          handlePayment(transaction);
                        }}
                        className={`${
                          transaction.status !== "completed"
                            ? "bg-blue-500 hover:bg-blue-700 text-white"
                            : "bg-gray-300 text-black"
                        } font-bold py-2 px-4 rounded mt-4`}
                        disabled={transaction.status === "completed"}
                      >
                        Pay Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No Pending transactions found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
