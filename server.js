const { GoogleGenerativeAI } = require("@google/generative-ai");

const dotenv = require("dotenv");
dotenv.config();

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);

async function run() {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt_1 = "Give me a word. (don't write anything besides the words)";

  const result = await model.generateContent(prompt_1);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

run();
