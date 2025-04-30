import dbConnect from "@/lib/mongodb";
import Vehicle from "@/models/Vehicle";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    try {
      await dbConnect();

      const { vehicleid, vehicletype, tollrate } = req.body;
      console.log("Data received for update:", { vehicleid, vehicletype, tollrate });

      // Find the vehicle by vehicleid and update it
      const updatedVehicle = await Vehicle.findOneAndUpdate(
        { vehicleid },
        { vehicletype, tollrate },
        { new: true } // Return the updated document
      );

      if (!updatedVehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }

      return res.status(200).json({ message: "Vehicle updated successfully", updatedVehicle });
    } catch (error) {
      console.error("Error updating vehicle:", error);
      return res.status(500).json({ error: "Failed to update vehicle" });
    }
  } else {
    // Return 405 Method Not Allowed for non-PUT requests
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}