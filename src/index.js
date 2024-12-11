const app = require("./app/app");
const { connectToDatabase } = require("./config/database");

require("dotenv").config(); // Load environment variables

const PORT = process.env.PORT || 3000;
const API_URL = process.env.API_URL || "/api/v1"; // Default API URL

// Connect to database
connectToDatabase();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}${API_URL}`);
});
