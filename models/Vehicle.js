import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  vehicleid: { type: String, required: true, unique: true },
  vehicletype: { type: String, required: true },
  tollrate: { type: Number, required: true },
});

export default mongoose.models.Vehicle || mongoose.model("Vehicle", vehicleSchema);