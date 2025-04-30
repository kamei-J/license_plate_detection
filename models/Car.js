import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  carNumber: { type: String, required: true, unique: true },
  ownerName: { type: String, required: true },
  bankName: { type: String, required: true },
  tollPaid: { type: Number, required: true },
});

export default mongoose.models.Car || mongoose.model('Car', carSchema);