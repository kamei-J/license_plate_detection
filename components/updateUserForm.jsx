"use client";
import { useState, useEffect } from "react";
import { BiPlus } from "react-icons/bi";

export default function UpdateUserForm({ editData, onUpdate }) {
  const [formData, setFormData] = useState(editData);

  useEffect(() => {
    setFormData(editData); // Update form data when editData changes
  }, [editData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if form data is empty
    if (Object.keys(formData).length === 0) {
      console.log("Don't have Form Data");
      return;
    }

    console.log("Form Data:", formData); // Log the form data

    // Call the onUpdate function
    onUpdate(formData);
  };

  return (
    <form className="grid lg:grid-cols-2 w-4/6 gap-4" onSubmit={handleSubmit}>
      <div className="input-type">
        <input
          type="text"
          value={formData.vehicleid || ""}
          onChange={(e) => setFormData({ ...formData, vehicleid: e.target.value })}
          name="vehicleid"
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
          placeholder="Vehicle Id"
          required
        />
      </div>
      <div className="input-type">
        <input
          type="text"
          value={formData.vehicletype || ""}
          onChange={(e) => setFormData({ ...formData, vehicletype: e.target.value })}
          name="vehicletype"
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
          placeholder="Vehicle Type"
          required
        />
      </div>
      <div className="input-type">
        <input
          type="number"
          value={formData.tollrate || ""}
          onChange={(e) => setFormData({ ...formData, tollrate: e.target.value })}
          name="tollrate"
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
          placeholder="Toll Rate"
          required
        />
      </div>
      <button
        type="submit"
        className="flex justify-center text-md w-2/6 bg-green-500 text-white px-4 py-2 border rounded-md hover:bg-gray-50 hover:border-green-500 hover:text-green-500"
      >
        Update <span className="px-1"><BiPlus size={24} /></span>
      </button>
    </form>
  );
}