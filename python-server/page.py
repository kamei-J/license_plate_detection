from ultralytics import YOLO
import easyocr
import cv2
import numpy as np
import re
import os

# Load the trained YOLO model
model = YOLO("C:/Users/hp/OneDrive/Desktop/working_version5 - Copy/best1.pt")

# Initialize EasyOCR reader
reader = easyocr.Reader(['en'])

def preprocess_plate_image(image):
    """Preprocess license plate image for better OCR results"""
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply adaptive thresholding
    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                 cv2.THRESH_BINARY, 11, 2)
    
    # Apply morphological operations to remove noise
    kernel = np.ones((1, 1), np.uint8)
    processed = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)
    processed = cv2.morphologyEx(processed, cv2.MORPH_CLOSE, kernel)
    
    return processed

def clean_license_text(text):
    """Clean and validate license plate text"""
    # Remove all non-alphanumeric characters
    cleaned = re.sub(r'[^a-zA-Z0-9]', '', text.upper())
    
    # Common license plate patterns (adjust based on your region)
    patterns = [
        r'[A-Z]{2}\d{2}[A-Z]{2}',    # AB12CD format
        r'[A-Z]{3}\d{3}',             # ABC123 format
        r'\d{3}[A-Z]{3}',             # 123ABC format
        r'[A-Z]\d[A-Z]\d[A-Z]\d',     # A1B2C3 format
        r'[A-Z]{1,3}\d{1,4}[A-Z]{0,3}' # More generic pattern
    ]
    
    # Check for matches with known patterns
    for pattern in patterns:
        match = re.search(pattern, cleaned)
        if match:
            return match.group()
    
    return cleaned if 5 <= len(cleaned) <= 10 else None

def save_detection_image(image, save_path="detection_output.jpg"):
    """Save detection image instead of showing it"""
    try:
        cv2.imwrite(save_path, image)
        print(f"Detection results saved to {save_path}")
    except Exception as e:
        print(f"Error saving detection image: {e}")

def detect_and_recognize_plate(image_path):
    """Main function to detect and recognize license plates"""
    # Verify image exists
    if not os.path.exists(image_path):
        print(f"Error: Image not found at {image_path}")
        return None
    
    # Load the image
    image = cv2.imread(image_path)
    if image is None:
        print(f"Error: Could not load image {image_path}")
        return None
    
    print("Running license plate detection...")
    
    # Detect license plates with YOLO
    try:
        results = model(image)
    except Exception as e:
        print(f"Error during detection: {e}")
        return None
    
    # Save detection results instead of showing
    if results:
        res_plotted = results[0].plot()
        save_detection_image(res_plotted)
    
    # Process each detected license plate
    for result in results:
        boxes = result.boxes.xyxy.cpu().numpy()
        
        for box in boxes:
            x1, y1, x2, y2 = map(int, box)
            
            # Crop license plate with padding
            padding = 5
            x1 = max(0, x1 - padding)
            y1 = max(0, y1 - padding)
            x2 = min(image.shape[1], x2 + padding)
            y2 = min(image.shape[0], y2 + padding)
            
            plate_img = image[y1:y2, x1:x2]
            
            # Skip if the cropped plate is too small
            if plate_img.size == 0 or min(plate_img.shape[:2]) < 20:
                continue
            
            # Preprocess the cropped plate
            processed_plate = preprocess_plate_image(plate_img)
            
            # Save processed plate for debugging
            cv2.imwrite("processed_plate.jpg", processed_plate)
            
            # Perform OCR
            try:
                ocr_results = reader.readtext(processed_plate, paragraph=False)
            except Exception as e:
                print(f"OCR Error: {e}")
                continue
            
            if ocr_results:
                # Get all possible texts sorted by confidence
                ocr_results.sort(key=lambda x: x[2], reverse=True)
                
                # Try each result until we find a valid plate
                for result in ocr_results:
                    plate_number = clean_license_text(result[1])
                    if plate_number:
                        print(f"Detected License Plate: {plate_number}")
                        return plate_number
    
    print("No valid license plate detected")
    return None

# Example usage
if __name__ == "__main__":
    image_path = "C:/Users/hp/OneDrive/Pictures/CARS/1.jpg"
    plate_number = detect_and_recognize_plate(image_path)
    
    if plate_number:
        print(f"Final recognized plate: {plate_number}")
    else:
        print("No plate found")