const fs = require("fs");
const path = require("path");

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Added CORS 
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  //  Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const filePath = path.join(process.cwd(), "destination.json");

  try {
    // Read the file asynchronously
    const data = await fs.promises.readFile(filePath, "utf8");

    res.setHeader("Content-Type", "application/json");
    res.status(200).send(data);
  } catch (err) {
    console.error("Error reading file:", err);
    res.status(500).json({ error: "Failed to read destination.json" });
  }
}