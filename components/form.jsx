import { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import * as XLSX from 'xlsx';

export default function Form() {
  const [numberPlate, setNumberPlate] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [kmsTravelled, setKmsTravelled] = useState('');
  const [tollTax, setTollTax] = useState(0);
  const [result, setResult] = useState(null);
  const videoRef = useRef(null);

  const handleNumberPlateDetection = async () => {
    const video = videoRef.current;

    // Capture image from video stream
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    // Use Tesseract.js to detect text from the image
    const { data: { text } } = await Tesseract.recognize(
      canvas.toDataURL('image/jpeg'),
      'eng'
    );

    setNumberPlate(text.trim());
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Calculate toll tax (1 KM = ₹10)
    const tax = parseFloat(kmsTravelled) * 10;
    setTollTax(tax);

    // Prepare data for Excel
    const data = [
      ['Number Plate', 'Current Location', 'Destination Location', 'KMs Travelled', 'Toll Tax'],
      [numberPlate, currentLocation, destinationLocation, kmsTravelled, tax],
    ];

    // Create a worksheet and workbook
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Toll Data');

    // Save the workbook as an Excel file
    XLSX.writeFile(wb, 'toll_data.xlsx');

    // Display the result
    setResult({ numberPlate, tollTax: tax });
  };

  return (
    <div>
      <h1>Automatic License Plate Detection and Toll Tax Generator</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Number Plate:</label>
          <div>
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxWidth: '400px' }} />
            <button type="button" onClick={handleNumberPlateDetection}>
              Detect Number Plate
            </button>
            <input
              type="text"
              value={numberPlate}
              onChange={(e) => setNumberPlate(e.target.value)}
              placeholder="Detected Number Plate"
              required
            />
          </div>
        </div>
        <div>
          <label>Current Location:</label>
          <input
            type="text"
            value={currentLocation}
            onChange={(e) => setCurrentLocation(e.target.value)}
            placeholder="Enter current location"
            required
          />
        </div>
        <div>
          <label>Destination Location:</label>
          <input
            type="text"
            value={destinationLocation}
            onChange={(e) => setDestinationLocation(e.target.value)}
            placeholder="Enter destination location"
            required
          />
        </div>
        <div>
          <label>KMs Travelled:</label>
          <input
            type="number"
            value={kmsTravelled}
            onChange={(e) => setKmsTravelled(e.target.value)}
            placeholder="Enter KMs travelled"
            required
          />
        </div>
        <button type="submit">Calculate Toll Tax</button>
      </form>

      {result && (
        <div>
          <h2>Result</h2>
          <p><strong>Number Plate:</strong> {result.numberPlate}</p>
          <p><strong>Toll Tax:</strong> ₹{result.tollTax}</p>
        </div>
      )}
    </div>
  );
}