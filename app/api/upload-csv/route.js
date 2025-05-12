import dbConnect from '../../lib/dbConnect';
import Car from '../../models/Car';
import Papa from 'papaparse';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { file } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Parse the CSV file
    const results = Papa.parse(file, { header: true });

    if (results.errors.length > 0) {
      return res.status(400).json({ error: 'Invalid CSV file' });
    }

    const carNumbers = results.data.map((row) => row.carNumber);

    // Query the database for matching car numbers
    await dbConnect();
    const cars = await Car.find({ carNumber: { $in: carNumbers } });

    return res.status(200).json({ cars });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}