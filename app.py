import sys
from groq import Groq

# ---------------------------------------------------------------------------
# AYARLAR VE BAŞLATMA
# ---------------------------------------------------------------------------
# Groq platformundan aldığın API anahtarını buraya yapıştır.
API_KEY = "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"

if API_KEY == "GROQ_API_KEY_BURAYA" or not API_KEY:
    print("[HATA] Lütfen koddaki API_KEY değişkenine geçerli Groq API anahtarınızı girin.")
    sys.exit(1)

# Groq istemcisini başlatıyoruz
client = Groq(api_key=API_KEY)

# Kullanılacak model (Groq üzerinde en güncel ve hızlı çalışan modellerden biri)
MODEL_NAME = "openai/gpt-oss-20b"

# Asistanın kişiliği ve genel kuralları
SYSTEM_PROMPT = {
    "role": "system",
    "content": (
        "Sen arkadaş canlısı, son derece zeki ve yardımsever bir yapay zeka asistanısın. "
        "Kullanıcıyla Türkçe konuşacaksın. Sorulara net, anlaşılır ve doğru cevaplar ver."
    )
}

# Sohbet geçmişini tutacağımız liste
messages_history = [SYSTEM_PROMPT]

# ---------------------------------------------------------------------------
# SOHBET DÖNGÜSÜ
# ---------------------------------------------------------------------------
def sohbet_baslat():
    print("=" * 60)
    print("       GROQ AI ASİSTANINA HOŞ GELDİNİZ!       ")
    print("=" * 60)
    print("Çıkış yapmak için 'q', 'çıkış' veya 'exit' yazabilirsiniz.\n")

    while True:
        try:
            # Kullanıcıdan girdi alma
            user_input = input("\nSiz: ").strip()

            # Boş mesaj kontrolü
            if not user_input:
                continue

            # Çıkış komutları
            if user_input.lower() in ["q", "çıkış", "exit", "cikis"]:
                print("\nYapay zeka asistanı kapatılıyor. İyi günler!")
                break

            # Kullanıcı mesajını geçmişe ekle
            messages_history.append({"role": "user", "content": user_input})

            print("\nAsistan düşünüyors...", end="", flush=True)

            # Groq API'sine istek gönderme
            response = client.chat.completions.create(
                model=MODEL_NAME,
                messages=messages_history,
                temperature=0.7,  # Yaratıcılık oranı (0.0 - 1.0 arası)
                max_tokens=2048,   # Üretilecek maksimum yanıt uzunluğu
            )

            # Yanıtı alma
            ai_response = response.choices[0].message.content

            # Yanıtı ekranı temizleyerek yazdır
            print("\r" + " " * 30 + "\r", end="") # "düşünüyor..." yazısını siler
            print(f"Asistan: {ai_response}")

            # Asistanın yanıtını da sohbet geçmişine ekle (bağlamı korumak için)
            messages_history.append({"role": "assistant", "content": ai_response})

        except Exception as e:
            print(f"\n[Bir hata oluştu]: {e}")
            break

if __name__ == "__main__":
    sohbet_baslat()