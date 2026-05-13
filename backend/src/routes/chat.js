const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { messages, system, model = "llama-3.1-8b-instant" } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Messages tidak boleh kosong." });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    req.log.error("GROQ_API_KEY not configured");
    return res.status(500).json({
      success: false,
      message: "GROQ_API_KEY belum dikonfigurasi di .env",
    });
  }

  try {
    // 1. Format pesan (Groq/OpenAI format)
    let formattedMessages = messages.map((m) => {
      if (Array.isArray(m.content)) {
        const formattedContent = m.content.map((part) => {
          if (part.type === "image") {
            const raw = part.source?.data ?? "";
            const base64Data = raw.includes(",")
              ? raw
              : `data:${part.source?.media_type ?? "image/jpeg"};base64,${raw}`;
            return {
              type: "image_url",
              image_url: { url: base64Data },
            };
          }
          return { type: "text", text: part.text ?? "" };
        });
        return { role: m.role, content: formattedContent };
      }
      return { role: m.role, content: String(m.content) };
    });

    // 2. Masukkan System Prompt di awal array
    if (system) {
      formattedMessages.unshift({ role: "system", content: system });
    }

    // Body Request
    const requestBody = {
      model: model,
      messages: formattedMessages,
      max_tokens: 1024,
      temperature: 0.7,
    };

    const groqUrl = "https://api.groq.com/openai/v1/chat/completions";

    // Kirim ke Groq API
    const response = await fetch(groqUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      req.log.error({ errData, model }, "Groq API error");
      return res.status(502).json({
        success: false,
        message: errData?.error?.message ?? "Gagal menghubungi Groq API.",
      });
    }

    const data = await response.json();

    // Ekstrak balasan Groq
    const reply = data?.choices?.[0]?.message?.content ?? "";

    if (!reply) {
      req.log.warn({ model, data }, "Groq returned empty response");
      return res
        .status(502)
        .json({ success: false, message: "Respons dari Groq kosong." });
    }

    req.log.info({ model, messageCount: messages.length }, "Chat completed");
    return res.json({ success: true, reply });
  } catch (err) {
    req.log.error({ err, model }, "Chat failed");
    return res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan server." });
  }
});

module.exports = router;
