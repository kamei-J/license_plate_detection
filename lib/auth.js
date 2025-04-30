import bcrypt from "bcrypt";

export async function comparePassword(inputPassword, hashedPassword) {
  return await bcrypt.compare(inputPassword, hashedPassword);
}

export async function getAuthUser(req) {
  // Implement logic to extract the user ID from the cookie
  // Example: Using a session token or JWT
  return req.cookies.userId; // Replace with your actual cookie logic
}