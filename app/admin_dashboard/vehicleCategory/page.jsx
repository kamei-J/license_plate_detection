"use client";

import { BiUserPlus } from "react-icons/bi";
import Table from "@/components/table";
import FormVehicle from "@/components/formVehicle";
import { useState, useEffect } from "react";

export default function VehicleCategoryPage() {
  const [visible, setVisible] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [editData, setEditData] = useState(null); // State to store data for editing
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // Fetch data from MongoDB
  const fetchData = async () => {
    try {
      const res = await fetch("/api/vehicle");
      const data = await res.json();
      setTableData(data); // Update the table data
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
  }, []);

  const handler = () => {
    setVisible(!visible);
    setEditData(null); // Reset edit data when showing the form
  };

  const addVehicle = async (newVehicle) => {
    try {
      // Send new vehicle data to MongoDB
      const res = await fetch("/api/vehicle/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVehicle),
      });

      if (res.ok) {
        fetchData(); // Refresh the table data
        setVisible(false); // Hide the form
      } else {
        console.error("Failed to add vehicle:", await res.json());
      }
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
  };

  const handleEdit = (data) => {
    setEditData(data); // Set the data to be edited
    setVisible(true); // Show the form
  };

  const handleUpdate = async (updatedVehicle) => {
    console.log("Data being sent for update:", updatedVehicle); // Log the data
    try {
      const res = await fetch("/api/vehicle/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedVehicle),
      });

      if (!res.ok) {
        const errorResponse = await res.json(); // Parse the error response
        console.error("Failed to update vehicle:", errorResponse);
        throw new Error(errorResponse.error || "Failed to update vehicle");
      }

      const data = await res.json(); // Parse the success response
      console.log("Vehicle updated successfully:", data);

      fetchData(); // Refresh the table data
      setVisible(false); // Hide the form
    } catch (error) {
      console.error("Error updating vehicle:", error);
    }
  };

  const handleDelete = async (vehicleid) => {
    try {
      // Send delete request to MongoDB
      const res = await fetch("/api/vehicle/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleid }),
      });

      if (res.ok) {
        fetchData(); // Refresh the table data
      } else {
        console.error("Failed to delete vehicle:", await res.json());
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  return (
    <main className="">
      <h1 className="text-xl md:text-5xl text-center font-bold py-10">
        Vehicle Category
      </h1>

      <div className="container mx-auto flex justify-between py-5 border-b">
        <div className="left flex gap-3">
          <button
            onClick={handler}
            className="flex bg-indigo-500 text-white mx-4 px-4 py-2 border rounded-md hover:bg-gray-500"
          >
            Add Vehicle{" "}
            <span className="px-1">
              <BiUserPlus size={23} />
            </span>
          </button>
        </div>
      </div>

      <div className="container mx-auto">
        {visible && (
          <FormVehicle
            addVehicle={addVehicle}
            editData={editData}
            onUpdate={handleUpdate}
          />
        )}
      </div>

      <div className="container m-2">
        {isLoading ? (
          <p>Loading...</p> // Show loading state
        ) : (
          <Table data={tableData} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
    </main>
  );
}