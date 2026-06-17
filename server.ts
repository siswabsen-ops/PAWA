import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Initialize Gemini Client
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("PAWA Backend: Gemini API Client successfully initialized.");
  } else {
    console.warn("PAWA Backend Warning: GEMINI_API_KEY is not defined. AI Assistant features will run on local fallback.");
  }

  // --- API ROUTE: HEALTH CHECK ---
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ready",
      appName: "PAWA",
      timestamp: new Date().toISOString(),
      aiAvailable: !!ai
    });
  });

  // --- API ROUTE: GEMINI CALLS ---
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { prompt, systemInstruction, model } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
      }

      if (!ai) {
        // Fallback simulation when GEMINI_API_KEY is not configured
        console.warn("Gemini API not initialized. Sending helpful smart simulation.");
        return res.json({
          text: `[FALLBACK] Halo! Saya adalah PAWA Asisten. Kunci API Gemini belum terdeteksi (Anda dapat menambahkannya di panel Settings > Secrets AI Studio). Berikut rancangan umum gagasan Anda:

1. **Intisari**: Pengembangan tulisan yang efisien dan berkualitas tinggi.
2. **Saran Ide**: Buat dokumen teks format PDF/TXT, lalu kreasikan video cinemagic maupun komposisi musik di studio PAWA.
3. **Catatan Tambahan**: Gagasan Anda adalah "${prompt}" - ketikkan ide lainnya untuk disimulasikan, atau hubungkan API key agar asisten cerdas ini aktif maksimal.`
        });
      }

      const selectedModel = model || "gemini-3.5-flash";
      const instruction = systemInstruction || 
        "Anda adalah PAWA (Panji Wafa), asisten cerdas multifungsi profesional dengan tagline 'Panduan Andal, Karya Sempurna'. " +
        "Tugas Anda adalah memandu pengguna menghasilkan karya tulisan, naskah film/video, laporan, materi pembelajaran, menerjemahkan naskah, " +
        "atau merancang petunjuk kreasi bernilai tinggi. " +
        "Gunakan bahasa Indonesia yang ramah, profesional, ringkas, dan sangat kreatif. " +
        "Jika pengguna meminta 'ilustrasi' atau 'desain', buatlah visual dengan membalas menggunakan kode SVG yang valid dan indah bertema modern di dalam blok markdown ```xml\n<svg ...>...</svg>\n``` agar bisa ditampilkan langsung sebagai karya visual di antarmuka PAWA.";

      console.log(`Calling Gemini API using model: ${selectedModel}`);
      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: prompt,
        config: {
          systemInstruction: instruction,
          temperature: 0.75,
        }
      });

      const responseText = response.text || "Maaf, tidak ada respon teks yang diperoleh.";
      res.json({ text: responseText });

    } catch (error: any) {
      console.error("Error communicating with Gemini API:", error);
      res.status(500).json({ 
        error: "Gagal memproses data melalui asisten cerdas PAWA.", 
        details: error.message || String(error)
      });
    }
  });

  // --- VITE MIDDLEWARE / INTEGRATION ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("PAWA Backend: Vite middleware mounted (Development mode).");
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("PAWA Backend: Static asset serving is ready (Production mode).");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PAWA Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start PAWA Server on Port 3000:", error);
});
