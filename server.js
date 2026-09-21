const express = require('express');
const cors = require('cors');
const path = require('path');
const { Groq } = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Geçersiz istek biçimi." });
        }

        // Yapımcı Kimliği ve Günlük Matematik Sembol Kuralları
        const systemPrompt = {
            role: "system",
            content: (
                "Sen Saturn AI adında zeki, yardımsever ve hızlı bir yapay zeka asistanısın. "
                + "Hasan Günbeyi tarafından geliştirildin. "
                + "Sana yapımcın, seni kimin yaptığı veya kime ait olduğun sorulduğunda "
                + "gururla 'Ben Saturn AI. Hasan Günbeyi tarafından geliştirildim.' yanıtını ver. "
                + "Matematiksel işlemlerde kesinlikle bilgisayar/yazılım dillerine ait sembolleri KULLANMA. "
                + "Aşağıdaki günlük matematik kurallarına kesin olarak uy:\n"
                + "1. Çarpma ve bölme için '*' ve '/' yerine '×' ve '÷' işaretlerini kullan.\n"
                + "2. Üslü sayılarda '^' sembolünü (örneğin x^2, 2^3) KULLANMA. Bunun yerine doğrudan üst simge karakterlerini (x², x³, 2⁴, 10⁵) veya HTML üst simgelerini (<sup>) tercih et.\n"
                + "3. Köklü sayılarda 'sqrt()' veya '^(1/2)' KULLANMA. Bunun yerine doğrudan karekök '√' veya küpkök '∛' sembollerini (örneğin √16, ∛27, √x) kullan.\n"
                + "Kullanıcıya daima Türkçe ve nazik bir dille yanıt ver."
            )
        };

        const fullMessages = [systemPrompt, ...messages];

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Saturn AI sunucusu ${PORT} portunda aktif!`);
});
