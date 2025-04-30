import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { username, phoneNumber, email, vehicleType, licensePlateNo } = req.body;
    let photoUrl = null;

    // Handle file upload
    if (req.files && req.files.photo) {
      const photo = req.files.photo;
      const uploadPath = path.join(process.cwd(), "public/uploads", photo.name);
      await photo.mv(uploadPath); // Save the file
      photoUrl = `/uploads/${photo.name}`; // Generate the URL
    }

    // Update user data in the database (example)
    const updatedUser = {
      username,
      phoneNumber,
      email,
      vehicleType,
      licensePlateNo,
      photo: photoUrl || req.user.photo, // Keep existing photo if no new one is uploaded
    };

    // Save updated user data (e.g., in a database)
    // ...

    res.status(200).json(updatedUser);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}