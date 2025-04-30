// models/Profile.js
import mongoose from 'mongoose';

const UserProSchema = new mongoose.Schema({
  username: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  vehicleDetails: { type: String, required: true },
  bankDetails: { type: String, required: true },
});

export default mongoose.models.UserPro || mongoose.model('UserPro', UserProSchema);