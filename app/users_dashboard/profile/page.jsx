"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    phoneNumber: "",
    email: "",
    vehicleType: "",
    licensePlateNo: "",
  });
  const router = useRouter();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user", {
          credentials: "include", // Ensure cookies are sent
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await res.json();
        setUser(data);
        setFormData({
          username: data.username || "",
          phoneNumber: data.phoneNumber || "",
          email: data.email || "",
          vehicleType: data.vehicleType || "",
          licensePlateNo: data.licensePlateNo || "",
        });
      } catch (error) {
        setError("Not authenticated. Redirecting to login...");
        router.push("/login");
      }
    };

    fetchUser();
  }, [router]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include", // Ensure cookies are sent
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await res.json();
      setUser(updatedUser);
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      setError("Failed to update profile. Please try again.");
    }
  };

  if (error) {
    return <p className="text-red-500 text-center mt-8">{error}</p>;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl transform transition-all duration-300 hover:scale-105">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Profile
        </h1>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Username
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Email
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Vehicle Type
                <input
                  type="text"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                License Plate No
                <input
                  type="text"
                  name="licensePlateNo"
                  value={formData.licensePlateNo}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </label>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-lg text-gray-700">
                <strong>Username:</strong> {user.username}
              </p>
              <p className="text-lg text-gray-700">
                <strong>Phone Number:</strong> {user.phoneNumber}
              </p>
              <p className="text-lg text-gray-700">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-lg text-gray-700">
                <strong>Vehicle Type:</strong> {user.vehicleType}
              </p>
              <p className="text-lg text-gray-700">
                <strong>License Plate No:</strong> {user.licensePlateNo}
              </p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}