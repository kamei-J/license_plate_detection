import dbConnect from "@/lib/mongodb";
import Vehicle from "@/models/Vehicle";

export async function DELETE(req) {
  try {
    await dbConnect();

    const { vehicleid } = await req.json();

    // Find the vehicle by vehicleid and delete it
    const deletedVehicle = await Vehicle.findOneAndDelete({ vehicleid });

    if (!deletedVehicle) {
      return new Response(
        JSON.stringify({ error: "Vehicle not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Vehicle deleted successfully", deletedVehicle }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete vehicle" }),
      { status: 500 }
    );
  }
}