"use client";
import { useReducer } from "react";
import { BiPlus } from "react-icons/bi";

const formReducer = (state, event) => {
  return {
    ...state,
    [event.target.name]: event.target.value,
  };
};

export default function AddUserForm({ addVehicle }) {
  const [formData, setFormData] = useReducer(formReducer, {});

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if form data is empty
    if (Object.keys(formData).length === 0) {
      console.log("Don't have Form Data");
      return;
    }

    console.log("Form Data:", formData); // Log the form data

    // Add the new vehicle to the table data
    addVehicle(formData);

    // Reset the form fields
    setFormData({ target: { name: "vehicleid", value: "" } });
    setFormData({ target: { name: "vehicletype", value: "" } });
    setFormData({ target: { name: "tollrate", value: "" } });
  };

  return (
    <form className="grid lg:grid-cols-2 w-4/6 gap-4" onSubmit={handleSubmit}>
      <div className="input-type">
        <input
          type="text" // Use text for vehicleid (assuming it's a string)
          onChange={setFormData}
          name="vehicleid" // Ensure the name matches the schema
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
          placeholder="Vehicle Id"
          required // Add required attribute
        />
      </div>
      <div className="input-type">
        <input
          type="text"
          onChange={setFormData}
          name="vehicletype" // Ensure the name matches the schema
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
          placeholder="Vehicle Type"
          required // Add required attribute
        />
      </div>
      <div className="input-type">
        <input
          type="number" // Use number for tollrate
          onChange={setFormData}
          name="tollrate" // Ensure the name matches the schema
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
          placeholder="Toll Rate"
          required // Add required attribute
        />
      </div>
      <button
        type="submit"
        className="flex justify-center text-md w-2/6 bg-green-500 text-white px-4 py-2 border rounded-md hover:bg-gray-50 hover:border-green-500 hover:text-green-500"
      >
        Add <span className="px-1"><BiPlus size={24} /></span>
      </button>
    </form>
  );
}