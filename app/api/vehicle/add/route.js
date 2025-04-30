import dbConnect from "@/lib/mongodb";
import Vehicle from "@/models/Vehicle";

export async function POST(req) {
  try {
    await dbConnect();

    const { vehicleid, vehicletype, tollrate } = await req.json();

    console.log("Received Data:", { vehicleid, vehicletype, tollrate }); // Log received data

    // Check if the vehicle already exists
    const existingVehicle = await Vehicle.findOne({ vehicleid });
    if (existingVehicle) {
      console.log("Vehicle already exists:", existingVehicle); // Log duplicate vehicle
      return new Response(
        JSON.stringify({ error: "Vehicle already exists" }),
        { status: 400 }
      );
    }

    // Create a new vehicle
    const newVehicle = new Vehicle({ vehicleid, vehicletype, tollrate });
    await newVehicle.save();

    console.log("Vehicle added successfully:", newVehicle); // Log success
    return new Response(
      JSON.stringify({ message: "Vehicle added successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding vehicle:", error); // Log the error
    return new Response(
      JSON.stringify({ error: "Failed to add vehicle" }),
      { status: 500 }
    );
  }
}