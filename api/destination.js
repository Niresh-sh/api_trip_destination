const fs = require("fs");
const path = require("path");

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // CORS
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const filePath = path.join(process.cwd(), "destination.json");

  try {
    // Read JSON file
    const data = await fs.promises.readFile(filePath, "utf8");
    const destinations = JSON.parse(data);

    // Extract category from query
    const { category } = req.query;

    // If category is given (and not 'All'), filter data
    let filtered = destinations;
    if (category && category !== "All") {
  filtered = destinations.filter((dest) => {
    if (Array.isArray(dest.category)) {
      return dest.category.some(
        (c) => c.toLowerCase() === category.toLowerCase()
      );
    }
    if (typeof dest.category === "string") {
      return dest.category.toLowerCase() === category.toLowerCase();
    }
    return false;
  });
}

    // Send filtered results
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(filtered);
  } catch (err) {
    console.error("Error reading file:", err);
    res.status(500).json({ error: "Failed to read destination.json" });
  }
}
