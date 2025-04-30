"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  // Function to close the popup
  const closePopup = () => {
    setShowPopup(false);
    // Store a flag in localStorage to indicate the popup has been shown
    localStorage.setItem("adminWelcomePopupShown", "true");
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin");

        if (!res.ok) {
          router.push("/admin/login");
          return;
        }

        const data = await res.json();
        if (data && data.email) {
          setUsername(data.email);

          // Check if the popup has already been shown
          const popupShown = localStorage.getItem("adminWelcomePopupShown");
          if (!popupShown) {
            setShowPopup(true); // Show the popup only if it hasn't been shown before
          }
        } else {
          setError("Invalid response from server");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setError("An error occurred. Please try again.");
      }
    };

    const fetchDashboardData = async () => {
      try {
        const usersRes = await fetch("/api/admin/users");
        // const taxRes = await fetch("/api/admin/toll");
        const transactionsRes = await fetch("/api/admin/transactions");

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setTotalUsers(usersData.length); // Assuming the response has a total field
        }

        // if (taxRes.ok) {
        //   const taxData = await taxRes.json();
        //   setTotalTax(taxData.total); // Assuming the response has a total field
        // }

        if (transactionsRes.ok) {
          const transactionsData = await transactionsRes.json();
          setRecentTransactions(transactionsData); // Assuming the response is an array of transactions
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    checkAuth();
    fetchDashboardData();
  }, [router]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });

      if (res.ok) {
        router.push("/");
      } else {
        setError("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome, {"Admin"}!</h2>
            <p className="mb-4">
              You have successfully logged in to the Admin Dashboard.
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

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700">Total Users</h3>
          <p className="text-3xl font-bold text-blue-500">{totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700">
            Total Tax Collected
          </h3>
          <p className="text-3xl font-bold text-green-500">${totalTax}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700">
            Recent Transactions
          </h3>
          <p className="text-3xl font-bold text-purple-500">
            {recentTransactions.length}
          </p>
        </div>
      </div>

      {/* Recent Transactions Table */}
      {recentTransactions.length != 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Recent Transactions
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions?.map((transaction, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3">{transaction.description}</td>
                    <td className="p-3">${transaction.amount}</td>
                    <td className="p-3">
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
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}