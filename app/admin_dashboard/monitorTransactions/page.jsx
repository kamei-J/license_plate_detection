"use client";

import { useState } from "react";

export default function TollPage() {
  const [image, setImage] = useState(null);
  const [licensePlateNo, setLicensePlateNo] = useState("");
  const [user, setUser] = useState(null);
  const [tollTax, setTollTax] = useState(0);
  const [error, setError] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Display the uploaded image
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target.result);
    };
    reader.readAsDataURL(file);

    // Extract license plate number from the image (mock function)
    const extractedLicensePlate = await extractLicensePlate(file);
    setLicensePlateNo(extractedLicensePlate);

    // Fetch user details and toll tax
    try {
      const res = await fetch("/api/admin/toll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licensePlateNo: extractedLicensePlate }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user details");
      }

      const data = await res.json();
      setUser(data.user);
      setTollTax(data.tollTax);
      // console.log(data.tollTax);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError("An error occurred while fetching user details");
    }
  };

  // Mock function to extract license plate number
  const extractLicensePlate = async (file) => {
    // Replace this with actual OCR logic (e.g., Google Cloud Vision API or Tesseract.js)
    return "NL34JK9802"; // Mock license plate number
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-6xl bg-white p-8 rounded-lg shadow-lg flex flex-col md:flex-row gap-8">
        {/* Left Side: Form and User Details */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            Toll Tax System
          </h1>

          {/* File Upload Section */}
          <div className="mb-8">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Upload Vehicle Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* License Plate Number */}
          {licensePlateNo && (
            <div className="mb-8">
              <p className="text-lg font-medium text-gray-700">
                License Plate No:{" "}
                <span className="font-bold text-blue-600">{licensePlateNo}</span>
              </p>
            </div>
          )}

          {/* User Details and Toll Tax */}
          {user && (
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                User Details
              </h2>
              <div className="space-y-4">
                <p className="text-lg text-gray-700">
                  <span className="font-semibold">Username:</span> {user.username}
                </p>
                <p className="text-lg text-gray-700">
                  <span className="font-semibold">Email:</span> {user.email}
                </p>
                <p className="text-lg text-gray-700">
                  <span className="font-semibold">Vehicle Type:</span>{" "}
                  {user.vehicleType}
                </p>
                <p className="text-lg text-gray-700">
                  <span className="font-semibold">License Plate No:</span>{" "}
                  {user.licensePlateNo}
                </p>
                <p className="text-lg text-gray-700">
                  <span className="font-semibold">Toll Tax to be Paid:</span>{" "}
                  <span className="font-bold text-green-600">${tollTax}</span>
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Right Side: Uploaded Image */}
        {image && (
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Uploaded Image
              </h2>
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={image}
                  alt="Uploaded Vehicle"
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}