import mongoose from "mongoose"


const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: [true, "Please provide a phone number"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  vehicleType:{
    type: String,
    required: [true, "Please provide a vehicle type"],
  },
  licensePlateNo: {
    type: String,
    required: [true, "Please provide a license plate number"],
    unique: true,
  },
  role: {
    type: String,
    required: true,
    default: "User",
  },
})

export default mongoose.models.User || mongoose.model("User", UserSchema)
