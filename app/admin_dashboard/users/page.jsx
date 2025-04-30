"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Fetch all users and their transactions
  useEffect(() => {
    const fetchUsersAndTransactions = async () => {
      try {
        // Fetch users
        const usersRes = await fetch("/api/admin/users", {
          credentials: "include", // Include cookies for authentication
        });

        if (!usersRes.ok) {
          throw new Error("Failed to fetch users");
        }

        const usersData = await usersRes.json();

        // Fetch transactions for each user
        const usersWithTransactions = await Promise.all(
          usersData?.map(async (user) => {
            const transactionsRes = await fetch(
              `/api/admin/transactions?userId=${user._id}`,
              {
                credentials: "include",
              }
            );

            if (!transactionsRes.ok) {
              throw new Error("Failed to fetch transactions");
            }

            const transactionsData = await transactionsRes.json();

            // Determine the overall transaction status for the user
            const transactionStatus = transactionsData.some(
              (transaction) => transaction.status === "pending"
            )
              ? "Pending"
              : "Completed";

            return {
              ...user,
              transactionStatus, // Add transaction status to the user object
            };
          })
        );

        setUsers(usersWithTransactions);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsersAndTransactions();
  }, []);

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
      <h1 className="text-4xl font-bold mb-8">Users Details</h1>
      <div className="w-full max-w-4xl">
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone Number</th>
              <th className="p-3 text-left">Vehicle Type</th>
              <th className="p-3 text-left">License Plate No</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Transaction Status</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user._id} className="border-b">
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.phoneNumber}</td>
                <td className="p-3">{user.vehicleType}</td>
                <td className="p-3">{user.licensePlateNo}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded ${
                      user.role === "admin"
                        ? "bg-blue-200 text-blue-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded ${
                      user.transactionStatus === "Pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {user.transactionStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}