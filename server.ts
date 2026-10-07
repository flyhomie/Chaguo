import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const rootDir = process.cwd();
const publicDir = path.resolve(rootDir, "public");
const distDir = path.resolve(rootDir, "dist");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.static(publicDir));
app.use("/images", express.static(path.resolve(publicDir, "images")));

// Initialize Gemini client lazily/safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", appName: "Chaguo" });
});

// AI Candidate & Policy Fact-Check Assistant Endpoint
app.post("/api/ai/analyze", async (req, res) => {
  try {
    const { question, candidateContext } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: "Question parameter is required." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        answer: "Gemini API key is not configured in the environment. Please ensure GEMINI_API_KEY is available in your server environment or Secrets panel to enable AI voter insights.",
        sources: ["System Notification"]
      });
    }

    const systemPrompt = `You are Chaguo AI, an impartial, objective, non-partisan Kenyan electoral data and navigation assistant.
Your purpose is to provide Kenyan voters with factual, neutral, verified information regarding:
1. Legal & Integrity dockets: Corruption convictions/charges, rape and defilement cases (Sexual Offences Act), robbery and violent crime charges (especially for MCAs and legislators).
2. Actual Good Leaders doing real community development projects (bursaries, schools, hospitals, water boreholes) with 100% clean records.
3. Legislative voting history (Finance Bill 2024 & Finance Bill 2025 divisions).
4. Positions across Kenya: MPs, Senators, Governors, Woman Reps, Presidential Aspirants, and MCAs (Members of County Assembly).
5. Constitutional rights: Article 104 MP recall procedures and Chapter 6 integrity principles.

Rules:
1. Maintain strict political neutrality and an objective tone. Present verified facts without inflammatory editorializing.
2. Clearly distinguish between formal court convictions/charges and citizen allegations.
3. Be concise, direct, helpful, and informative for Kenyan voters.
4. Reference candidate context and citizen evidence reports provided. Context: ${JSON.stringify(candidateContext || {})}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Voter Question: ${question}`,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
      }
    });

    const replyText = response.text || "No detailed response generated.";
    return res.json({
      answer: replyText,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({
      error: "Failed to generate AI analysis",
      details: error?.message || "Internal server error"
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Chaguo server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
