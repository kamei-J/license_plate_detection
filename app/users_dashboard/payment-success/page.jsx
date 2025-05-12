"use client";

import { useSearchParams } from "next/navigation";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const txnId = searchParams.get("txnId"); // Get the transaction ID from the query parameters
  const amt = searchParams.get("amt"); // Get the transaction ID from the query parameters

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100"
    //   style={{
    //     backgroundImage: "url('/public/qr.png')", // Optional background image
    //     backgroundSize: "cover",
    //     backgroundPosition: "center",
    //   }}
    >
      <div className="text-center bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4 text-green-600">Please Pay Here!</h1>
        <p className="text-lg mb-6">Transaction ID: {txnId}</p>
        <img
          src={`https://quickchart.io/qr?text=upi%3A%2F%2Fpay%3Fpa%3Dparthadeuri4%40oksbi%26pn%3DParthapratim%2520Deuri%26am%3D${amt}.00%26cu%3DINR%26aid%3DuGICAgMDg4uOacQ&size=200`} // Replace with the actual path to your image
          alt="Success"
          className="w-48 h-48 mx-auto"
        />
      </div>
    </div>
  );
}