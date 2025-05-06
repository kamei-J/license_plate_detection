"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState("");
  const [transactions, setTransactions] = useState([]); // State for transactions

  const router = useRouter();

  // Function to close the popup
  const closePopup = () => {
    setShowPopup(false);
    // Store a flag in localStorage to indicate the popup has been shown
    localStorage.setItem("welcomePopupShown", "true");
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Fetch user data
        const userRes = await fetch("/api/user", {
          credentials: "include",
        });

        if (!userRes.ok) {
          router.push("/login");
        } else {
          const userData = await userRes.json();

          // Check if the response contains valid data
          if (userData && userData.username) {
            setUsername(userData.username);

            // Check if the popup has already been shown
            const popupShown = localStorage.getItem("welcomePopupShown");
            if (!popupShown) {
              setShowPopup(true); // Show the popup only if it hasn't been shown before
            }
          } else {
            setError("Invalid response from server");
          }
        }

        // Fetch transactions
        const transactionsRes = await fetch("/api/transactions", {
          credentials: "include",
        });

        if (!transactionsRes.ok) {
          console.error(
            "Transaction fetch failed:",
            await transactionsRes.text()
          );
          setTransactions([]); // Fallback to an empty array
          return;
        }

        const transactionsData = await transactionsRes.json();
        setTransactions(transactionsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Show a loading spinner or message while fetching data
  if (isLoading) {
    return <p>Loading...</p>;
  }

  // Show an error message if there's an error
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-24">
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Welcome, {username}!</h2>
            <p className="mb-4">
              You have successfully logged in to the Users Dashboard.
            </p>
            <button
              onClick={closePopup}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Recent Transactions Section */}
      <div className="w-full max-w-4xl mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {transactions.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Transaction ID</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Status</th>
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
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No transactions found.</p>
          )}
        </div>
      </div>
    </div>
  );
}