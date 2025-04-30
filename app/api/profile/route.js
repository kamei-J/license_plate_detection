// pages/api/profile/create.js
import clientPromise from '@/lib/mongodb';
import Profile from '@/models/UserPro';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Disable default bodyParser to handle file uploads
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const chunks = [];
    req.on('data', (chunk) => {
      chunks.push(chunk);
    });

    req.on('end', async () => {
      const data = Buffer.concat(chunks).toString();
      const boundary = req.headers['content-type'].split('boundary=')[1];
      const parts = data.split(`--${boundary}`);

      let username, phoneNumber, email, vehicleType, licensePlateNo, photo;

      for (const part of parts) {
        if (part.includes('username')) {
          username = part.split('name="username"')[1].trim().replace(/\r\n/g, '');
        }
        if (part.includes('phoneNumber')) {
          phoneNumber = part.split('name="phoneNumber"')[1].trim().replace(/\r\n/g, '');
        }
        if (part.includes('email')) {
          email = part.split('name="email"')[1].trim().replace(/\r\n/g, '');
        }
        if (part.includes('vehicleType')) {
          vehicleType = part.split('name="vehicleType"')[1].trim().replace(/\r\n/g, '');
        }
        if (part.includes('licensePlateNo')) {
          licensePlateNo = part.split('name="licensePlateNo"')[1].trim().replace(/\r\n/g, '');
        }
        if (part.includes('photo')) {
          const fileData = part.split('\r\n\r\n')[1];
          const fileName = part
            .split('filename="')[1]
            .split('"')[0];
          const filePath = path.join(process.cwd(), 'public/uploads', fileName);

          fs.writeFileSync(filePath, fileData, 'binary');
          photo = `/uploads/${fileName}`;
        }
      }

      try {
        await clientPromise;
        const profile = new Profile({
          username,
          phoneNumber,
          email,
          vehicleType,
          licensePlateNo,
          photo,
        });
        await profile.save();
        res.status(201).json({ message: 'Profile created successfully', profile });
      } catch (error) {
        res.status(500).json({ message: 'Error creating profile', error });
      }
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}