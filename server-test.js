// server.js
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;

// Enable CORS
app.use(cors());

app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from Node.js!" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
