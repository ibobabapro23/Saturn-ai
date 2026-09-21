const express = require('express');
const cors = require('cors');
const path = require('path');
const { Groq } = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());

// Public klasöründeki frontend dosyalarını sunuyoruz
app.use(express.static(path.join(__dirname, 'public')));

// Groq API Bağlantısı (API Anahtarını Render Ortam Değişkeninden alacak)
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Geçersiz istek biçimi." });
        }

        // Yapımcı Kimliği ve Sistem Komutu
        const systemPrompt = {
            role: "system",
            content: (
                "Sen Saturn AI adında zeki, yardımsever ve hızlı bir yapay zeka asistanısın. "
                + "Hasan Günbeyi tarafından geliştirildin. "
                + "Sana yapımcın, seni kimin yaptığı veya kime ait olduğun sorulduğunda "
                + "gururla 'Ben Saturn AI. Hasan Günbeyi tarafından geliştirildim.' yanıtını ver. "
                + "Kullanıcıya daima Türkçe ve nazik bir dille yanıt ver."
            )
        };

        const fullMessages = [systemPrompt, ...messages];

        // Groq API Çağrısı
        const response = await groq.chat.completions.create({
            messages: fullMessages,
            model: "openai/gpt-oss-20b",
            temperature: 0.7,
            max_tokens: 2048,
        });

        const reply = response.choices[0]?.message?.content || "Yanıt alınamadı.";
        res.json({ reply });

    } catch (error) {
        console.error("Groq API Hatası:", error);
        res.status(500).json({ error: "Sunucu hatası: Yapay zeka ile bağlantı kurulamadı." });
    }
});

// Render'ın atayacağı Port üzerinden sunucuyu başlatıyoruz
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Saturn AI sunucusu ${PORT} portunda aktif!`);
});
