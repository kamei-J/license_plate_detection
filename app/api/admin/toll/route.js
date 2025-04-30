import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Vehicle from "@/models/Vehicle";

export async function POST(req) {
  try {
    await dbConnect();

    const { licensePlateNo } = await req.json();

    // Fetch user details based on license plate number
    const user = await User.findOne({ licensePlateNo });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Calculate toll tax based on vehicle type
    const tollTax = await calculateTollTax(user.vehicleType);

    return NextResponse.json(
      { user, tollTax },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching user details" },
      { status: 500 }
    );
  }
}

// Function to calculate toll tax based on vehicle type
const calculateTollTax = async (vehicletype) => {
    const vehicle = await Vehicle.findOne({vehicletype})
    
    return vehicle.tollrate;
//   switch (vehicleType) {
//     case "car":
//       return 50;
//     case "bike":
//       return 20;
//     case "bus":
//       return 100;
//     case "truck":
//       return 150;
//     default:
//       return 0;
//   }
};