const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();

// Enable CORS
app.use(cors({ origin: true }));

// Access your API key as an environment variable
// const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);
const genAI = new GoogleGenerativeAI(functions.config().google.ai_api_key);

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

// Export the express app as an HTTP function
exports.api = functions.https.onRequest(app);
