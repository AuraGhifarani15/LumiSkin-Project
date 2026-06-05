import base64
from io import BytesIO
import numpy as np
import tensorflow as tf
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from PIL import Image
import os
import csv
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# 1. Inisialisasi FastAPI
app = FastAPI(title="LumiSkin ML API Server")

# 2. Definisikan Schema Input Request
class PredictionRequest(BaseModel):
    skinType: str = None
    concerns: list = []
    additionalNotes: str = None
    image: str = None        # Menerima Base64 string gambar
    imagePath: str = None    # Menerima path lokal gambar jika berada di server yang sama

# 3. Konfigurasi Model & Pemuatan Dinamis
IMG_SIZE = (224, 224)
class_names = ["Cyst", "Papules", "Pustules"]

def load_ml_model(model_path):
    print(f"Mencoba memuat model dari: {model_path}")
    # 1. Coba pakai Keras 3 (native tensorflow)
    try:
        import keras
        print("Mencoba memuat dengan Keras 3...")
        model = keras.models.load_model(model_path)
        print("Model berhasil dimuat dengan Keras 3!")
        return model
    except Exception as e:
        print(f"Pemuatan dengan Keras 3 gagal: {e}")
        
    # 2. Coba pakai tf_keras (Keras 2 compatibility mode)
    try:
        print("Mencoba memuat dengan tf_keras (Keras 2 compatibility mode)...")
        import tf_keras
        model = tf_keras.models.load_model(model_path)
        print("Model berhasil dimuat dengan tf_keras!")
        return model
    except Exception as e:
        print(f"Pemuatan dengan tf_keras gagal: {e}")
        raise RuntimeError(f"Gagal memuat model '{model_path}' dengan Keras 3 maupun tf_keras. Silakan periksa kembali file model Anda.")

# Load model secara dinamis dari file .env
MODEL_PATH = os.getenv("MODEL_PATH", "LumiSkin_EfficientNetB0_AcneModel.keras")
model = load_ml_model(MODEL_PATH)

# Load dataset skincare (dengan pencarian jalur fallback fleksibel)
PRODUCTS_CSV_PATH = os.path.join(os.path.dirname(__file__), "../datasets/female_daily_dataset/Indonesian_Skincare.csv")

# Jika path default di luar folder tidak ada, coba cari di dalam folder local
if not os.path.exists(PRODUCTS_CSV_PATH):
    PRODUCTS_CSV_PATH = os.path.join(os.path.dirname(__file__), "datasets/female_daily_dataset/Indonesian_Skincare.csv")
if not os.path.exists(PRODUCTS_CSV_PATH):
    PRODUCTS_CSV_PATH = os.path.join(os.path.dirname(__file__), "Indonesian_Skincare.csv")

products_db = []

if os.path.exists(PRODUCTS_CSV_PATH):
    try:
        with open(PRODUCTS_CSV_PATH, mode='r', encoding='utf-8') as f:
            r = csv.DictReader(f)
            for row in r:
                try:
                    rating = float(row.get('Rating', 0.0))
                except:
                    rating = 0.0
                try:
                    reviewers = int(row.get('Total Reviewers', '0').replace(',', ''))
                except:
                    reviewers = 0
                    
                products_db.append({
                    "type": row.get("Type", "").strip(),
                    "name": row.get("Name", "").strip(),
                    "brand": row.get("Brand", "").strip(),
                    "rating": rating,
                    "reviewers": reviewers,
                    "link": row.get("Link", "").strip()
                })
        print(f"Berhasil memuat {len(products_db)} produk skincare dari dataset.")
    except Exception as e:
        print(f"Gagal membaca file dataset skincare: {e}")
else:
    print(f"File dataset tidak ditemukan di: {PRODUCTS_CSV_PATH}")

def get_skincare_recommendations(acne_type):
    # Tentukan kata kunci pencarian berdasarkan tipe acne
    if acne_type == "Cyst":
        keywords = ["cica", "centella", "calm", "barrier", "gentle", "soothe", "acne"]
    elif acne_type == "Papules":
        keywords = ["salicylic", "bha", "cica", "centella", "acne", "soothe", "exfoliat"]
    else:  # Pustules
        keywords = ["tea tree", "acne", "cica", "centella", "soothe", "benzoyl"]

    # Kategori target produk: Cleanser, Toner, Moisturizer, Sunscreen
    categories = {
        "Facial Wash": "Cleanser",
        "Toner": "Toner",
        "Moisturizer Gel": "Moisturizer",
        "Moisturizer Cream": "Moisturizer",
        "Sunscreen": "Sunscreen"
    }

    recommended = {}
    
    # Filter produk yang mengandung kata kunci di nama atau brand
    matching_products = []
    for p in products_db:
        name_lower = p['name'].lower()
        brand_lower = p['brand'].lower()
        if any(kw in name_lower or kw in brand_lower for kw in keywords):
            matching_products.append(p)

    # Urutkan berdasarkan rating (tertinggi) lalu jumlah reviewers (terbanyak)
    matching_products.sort(key=lambda x: (x['rating'], x['reviewers']), reverse=True)

    # Ambil produk terbaik untuk masing-masing kategori
    for p in matching_products:
        p_type = p['type']
        if p_type in categories:
            cat_name = categories[p_type]
            if cat_name not in recommended:
                recommended[cat_name] = {
                    "category": cat_name,
                    "name": p['name'],
                    "brand": p['brand'],
                    "rating": p['rating'],
                    "reviewers": p['reviewers'],
                    "link": p['link']
                }
                if len(recommended) >= 4:
                    break

    # Jika ada kategori yang kurang, isi dengan produk populer dari kategori tersebut
    if len(recommended) < 4:
        for p in products_db:
            p_type = p['type']
            if p_type in categories:
                cat_name = categories[p_type]
                if cat_name not in recommended:
                    recommended[cat_name] = {
                        "category": cat_name,
                        "name": p['name'],
                        "brand": p['brand'],
                        "rating": p['rating'],
                        "reviewers": p['reviewers'],
                        "link": p['link']
                    }
                    if len(recommended) >= 4:
                        break

    return list(recommended.values())

def get_gemini_analysis(predicted_class, skin_type, concerns, additional_notes):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("💡 GEMINI_API_KEY tidak ditemukan di file .env. Menggunakan rekomendasi statis lokal.")
        return None
        
    try:
        from google import genai
        from google.genai import types
        import json

        client = genai.Client(api_key=api_key)
        
        prompt = f"""
Anda adalah dokter spesialis kulit (dermatolog) AI dari LumiSkin.
Berikan hasil analisis medis dan rekomendasi yang dipersonalisasi untuk pengguna berikut:
- Tipe Jerawat Terdeteksi: {predicted_class} (pilihan: Cyst, Papules, Pustules)
- Tipe Kulit User: {skin_type if skin_type else 'Tidak ditentukan'}
- Kekhawatiran Kulit: {', '.join(concerns) if concerns else 'Tidak ada'}
- Catatan Tambahan User: {additional_notes if additional_notes else 'Tidak ada'}

Berikan hasil analisis medis dalam format JSON murni dengan struktur persis seperti di bawah ini:
{{
  "summary": "Tulis penjelasan 2-3 kalimat mengenai kondisi kulit mereka saat ini dengan bahasa yang sopan, empati, bersahabat, dan informatif.",
  "conditions": [
    {{
      "name": "Nama medis kondisi jerawat",
      "description": "Penjelasan singkat 1-2 kalimat mengenai kondisi ini.",
      "severity": "berat / sedang / ringan"
    }}
  ],
  "recommendations": [
    {{
      "title": "Judul Saran Rekomendasi 1",
      "detail": "Penjelasan detail saran rekomendasi 1."
    }},
    {{
      "title": "Judul Saran Rekomendasi 2",
      "detail": "Penjelasan detail saran rekomendasi 2."
    }},
    {{
      "title": "Judul Saran Rekomendasi 3",
      "detail": "Penjelasan detail saran rekomendasi 3."
    }}
  ]
}}

Pastikan JSON yang Anda hasilkan valid. Jangan sertakan tag markdown ```json atau teks penjelasan tambahan lainnya, hanya JSON murni agar dapat diparse secara langsung. Gunakan Bahasa Indonesia.
"""
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        
        # Bersihkan string respon dari spasi kosong atau baris baru
        cleaned_text = response.text.strip()
        data = json.loads(cleaned_text)
        return data
    except Exception as e:
        print(f"⚠️ Gagal memanggil Gemini API: {e}. Menggunakan fallback rekomendasi lokal.")
        return None

# 4. Fungsi Helper Preprocessing Gambar
def preprocess_image(image: Image.Image):
    image = image.convert("RGB")
    image = image.resize(IMG_SIZE)
    img_array = tf.keras.utils.img_to_array(image)
    
    # Lakukan normalisasi jika pada saat training Anda membagi piksel dengan 255.0
    # img_array = img_array / 255.0 
    
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

# 5. Endpoint Prediksi
@app.post("/predict")
async def predict(payload: PredictionRequest):
    try:
        # Load gambar dari Base64 atau Path File
        if payload.image:
            # Jika menggunakan base64 format (misal: "data:image/jpeg;base64,...")
            if "," in payload.image:
                base64_str = payload.image.split(",")[1]
            else:
                base64_str = payload.image
                
            img_data = base64.b64decode(base64_str)
            image = Image.open(BytesIO(img_data))
            
        elif payload.imagePath:
            # Jika menggunakan file path lokal yang dikirim dari uploads/ Express
            image = Image.open(payload.imagePath)
        else:
            raise HTTPException(status_code=400, detail="Image (Base64 atau imagePath) wajib disediakan.")

        # Preprocess gambar
        processed_img = preprocess_image(image)

        # Lakukan prediksi
        prediction = model.predict(processed_img)
        predicted_class_idx = np.argmax(prediction)
        predicted_class = class_names[predicted_class_idx]
        confidence = float(np.max(prediction))

        # Kembalikan response yang akan diterima oleh Express
        # Sesuai dengan format yang diharapkan oleh ResultCard di frontend (summary, conditions, recommendations)
        if predicted_class == "Cyst":
            summary = "Kulit Anda menunjukkan tanda-tanda jerawat kistik (Cystic Acne) yang tergolong berat. Sangat disarankan untuk berkonsultasi dengan dokter spesialis kulit guna mendapatkan penanganan medis yang tepat."
            conditions = [
                {
                    "name": "Cystic Acne (Jerawat Batu)",
                    "description": "Jerawat meradang parah yang terbentuk jauh di dalam kulit.",
                    "confidence": confidence,
                    "severity": "berat"
                }
            ]
            recommendations = [
                {"title": "Konsultasi ke Dokter Kulit", "detail": "Cystic acne memerlukan penanganan medis profesional seperti obat resep atau tindakan dermatologis."},
                {"title": "Gunakan Pembersih Wajah Lembut", "detail": "Cuci muka 2 kali sehari dengan pembersih berformula lembut (gentle cleanser) tanpa scrub."},
                {"title": "Hindari Memencet Jerawat", "detail": "Memencet jerawat kistik dapat menyebarkan infeksi dan memicu bekas luka mendalam (bopeng)."}
            ]
        elif predicted_class == "Papules":
            summary = "Terdeteksi adanya jerawat papula (Papules) tingkat sedang pada kulit Anda. Fokuskan perawatan pada menenangkan kulit meradang dan eksfoliasi ringan menggunakan asam salisilat."
            conditions = [
                {
                    "name": "Acne Papules (Jerawat Papula)",
                    "description": "Benjolan merah kecil, padat, dan meradang tanpa nanah di ujungnya.",
                    "confidence": confidence,
                    "severity": "sedang"
                }
            ]
            recommendations = [
                {"title": "Gunakan Produk Mengandung Salicylic Acid (BHA)", "detail": "BHA membantu membersihkan pori-pori tersumbat dan meredakan peradangan ringan."},
                {"title": "Aplikasikan Skincare dengan Centella Asiatica", "detail": "Membantu menenangkan kulit kemerahan dan mempercepat pemulihan skin barrier."},
                {"title": "Gunakan Tabir Surya (Sunscreen)", "detail": "Lindungi kulit dari paparan sinar UV agar kemerahan jerawat tidak meninggalkan bekas hitam (PIH)."}
            ]
        else: # Pustules
            summary = "Terdeteksi jerawat pustula (Pustules) tingkat sedang pada kulit Anda. Disarankan untuk menggunakan obat totol jerawat antibakteri dan menghindari memencet jerawat secara paksa."
            conditions = [
                {
                    "name": "Acne Pustules (Jerawat Pustula)",
                    "description": "Jerawat meradang dengan puncak berwarna putih/kuning berisi nanah.",
                    "confidence": confidence,
                    "severity": "sedang"
                }
            ]
            recommendations = [
                {"title": "Gunakan Benzoyl Peroxide atau Acne Spot Treatment", "detail": "Sangat efektif untuk membasmi bakteri penyebab jerawat di permukaan kulit."},
                {"title": "Gunakan Pimple Patch", "detail": "Melindungi jerawat dari sentuhan tangan dan menyerap cairan jerawat secara higienis."},
                {"title": "Hindari Scrub Wajah Sementara Waktu", "detail": "Scrub fisik dapat memecahkan pustula secara kasar dan menyebarkan bakteri ke area kulit lainnya."}
            ]

        # Ambil rekomendasi produk dari dataset
        skincare_products = get_skincare_recommendations(predicted_class)

        # Coba dapatkan rekomendasi personal dari Gemini
        gemini_result = get_gemini_analysis(
            predicted_class=predicted_class,
            skin_type=payload.skinType,
            concerns=payload.concerns,
            additional_notes=payload.additionalNotes
        )

        if gemini_result:
            summary = gemini_result.get("summary", summary)
            
            # Tambahkan field confidence ke object condition dari Gemini
            gemini_conditions = gemini_result.get("conditions", [])
            for cond in gemini_conditions:
                cond["confidence"] = confidence
            
            conditions = gemini_conditions if gemini_conditions else conditions
            recommendations = gemini_result.get("recommendations", recommendations)
            print("✨ Berhasil menggunakan rekomendasi dinamis dari Gemini API.")

        return {
            "status": "success",
            "prediction": predicted_class,
            "confidence": confidence,
            "probabilities": {class_names[i]: float(prob) for i, prob in enumerate(prediction[0])},
            "summary": summary,
            "conditions": conditions,
            "recommendations": recommendations,
            "skincare_products": skincare_products
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memproses prediksi: {str(e)}")

# Untuk menjalankan server lokal secara langsung lewat file python ini
if __name__ == "__main__":
    import uvicorn
    # Jalankan server berdasarkan konfigurasi .env
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host=host, port=port)
