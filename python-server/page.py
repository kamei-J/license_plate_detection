# main.py
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import easyocr
import cv2
import numpy as np
import re
from typing import Dict

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_methods=["POST"],
    allow_headers=["*"],
)

# Initialize models
model = YOLO("C:\\Users\\hp\\OneDrive\\Desktop\\working_version5 - Copy\\best.pt").to('cpu') # Your trained model
reader = easyocr.Reader(['en'])  # Initialize OCR reader

def clean_license_plate(text: str) -> str:
    """Clean and format license plate text."""
    # Remove special characters and normalize
    cleaned = re.sub(r'[^a-zA-Z0-9]', '', text.upper())
    return cleaned

@app.post("/process-image")
async def process_image(file: UploadFile = File(...)) -> Dict:
    try:
        # Read the image file
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Detect license plate with YOLO
        results = model.predict(source=image, conf=0.25)
        
        # Get the best license plate detection
        if not results[0].boxes:
            raise HTTPException(status_code=400, detail="No license plate detected")
            
        # Get the license plate with highest confidence
        best_box = max(results[0].boxes, key=lambda box: box.conf)
        x1, y1, x2, y2 = map(int, best_box.xyxy[0])
        license_plate_img = image[y1:y2, x1:x2]
        
        # Perform OCR on the license plate
        ocr_results = reader.readtext(license_plate_img)
        if not ocr_results:
            raise HTTPException(status_code=400, detail="Could not read license plate text")
        
        # Get the text with highest confidence
        best_text = max(ocr_results, key=lambda item: item[2])
        license_plate = clean_license_plate(best_text[1])
        
        return {
            "license_plate": license_plate,
            "confidence": float(best_text[2]),
            "message": "License plate recognized successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))