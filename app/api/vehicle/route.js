import dbConnect from "@/lib/mongodb";
import Vehicle from "@/models/Vehicle";

export async function GET() {
  try {
    await dbConnect();

    const vehicles = await Vehicle.find({}); // Fetch all vehicles
    return new Response(JSON.stringify(vehicles), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
    });
  }
}