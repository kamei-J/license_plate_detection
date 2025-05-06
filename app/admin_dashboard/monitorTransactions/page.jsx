"use client";

import { useState } from "react";

export default function TollPage() {
  const [image, setImage] = useState(null);
  const [licensePlateNo, setLicensePlateNo] = useState("");
  const [user, setUser] = useState(null);
  const [tollTax, setTollTax] = useState(0);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  // const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  // const [shareLink, setShareLink] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setError("");

    try {
      // Display the uploaded image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);

      // Step 1: Send image to FastAPI for license plate recognition
      const plateData = await recognizeLicensePlate(file);
      setLicensePlateNo(plateData.license_plate);

      // Step 2: Fetch user details and toll tax from your Next.js API
      const res = await fetch("/api/admin/toll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licensePlateNo: plateData.license_plate }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user details");
      }

      const data = await res.json();
      setUser(data.user);
      setTollTax(data.tollTax);
    } catch (error) {
      // console.error("Error:", error);
      setError(error.message || "An error occurred during processing");
    } finally {
      setIsProcessing(false);
    }
  };

  const recognizeLicensePlate = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/process-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("License plate recognition failed");
      }

      const data = await response.json();
      
      if (!data.license_plate) {
        throw new Error("No license plate detected");
      }

      return data;
    } catch (error) {
      console.error("Recognition error:", error);
      throw new Error("Could not process the image");
    }
  };

  const handleShare = async () => {
    try {
      // Generate a unique shareable link (you might want to implement this in your backend)
      const res = await fetch("/api/admin/share_toll", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licensePlateNo, 
          tollTax,
          userId: user?._id
        }),
      });
      console.log(res);

      if (!res.ok) throw new Error("Failed to generate share link");

      const data = await res.json();
      // setShareLink(data.shareLink);
      // setIsShareModalOpen(true);
      
      // Copy to clipboard
      // await navigator.clipboard.writeText(data.shareLink);
      alert("Toll tax shared to user successfully!");
    } catch (error) {
      console.error("Error sharing:", error);
      setError("Failed to generate share link");
    }
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
              disabled={isProcessing}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
            />
            {isProcessing && (
              <p className="mt-2 text-blue-600">Processing image...</p>
            )}
          </div>

          {/* License Plate Number */}
          {licensePlateNo && (
            <div className="mb-8">
              <p className="text-lg font-medium text-gray-700">
                Detected License Plate:{" "}
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
              
              {/* Share Button - Only shown when user details are displayed */}
              <button
                onClick={handleShare}
                className="mt-4 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
              >
                Share toll tax 
              </button>
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
                Vehicle Image
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

      {/* Share Modal */}
      {/* {isShareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Share Details</h2>
            <p className="mb-4">Share this link with others:</p>
            <div className="flex items-center mb-4">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 p-2 border rounded-l"
              />
              <button
                onClick={() => navigator.clipboard.writeText(shareLink)}
                className="bg-blue-500 text-white p-2 rounded-r"
              >
                Copy
              </button>
            </div>
            <button
              onClick={() => setIsShareModalOpen(false)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
}