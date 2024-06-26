const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

// Enable CORS
app.use(cors());

app.use((req, res, next) => {
  res.removeHeader("Cross-Origin-Opener-Policy");
  res.removeHeader("Cross-Origin-Embedder-Policy");
  next();
});

dotenv.config();

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);

async function generateText() {
  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt_1 = "Give me a word. (don't write anything besides the words)";

    const result = await model.generateContent(prompt_1);
    const response = await result.response;
    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Error generating text:", error);
    return "Error generating text";
  }
}

// Define the API endpoint to generate and return text
app.get("/api/generate-text", async (req, res) => {
  const text = await generateText();
  res.json({ message: text });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
