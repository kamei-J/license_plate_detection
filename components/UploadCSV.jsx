"use client"
import { useState } from 'react';

export default function UploadCSV() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;

      // Send the CSV data to the API
      const response = await fetch('/api/upload-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file: text }),
      });

      const data = await response.json();
      setResults(data.cars);
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <h1>Upload CSV File</h1>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Submit</button>

      {results.length > 0 && (
        <div>
          <h2>Results</h2>
          <table>
            <thead>
              <tr>
                <th>Car Number</th>
                <th>Owner Name</th>
                <th>Bank Name</th>
                <th>Toll Paid</th>
              </tr>
            </thead>
            <tbody>
              {results.map((car, index) => (
                <tr key={index}>
                  <td>{car.carNumber}</td>
                  <td>{car.ownerName}</td>
                  <td>{car.bankName}</td>
                  <td>{car.tollPaid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}