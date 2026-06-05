# LumiSkin Project

## Deskripsi
LumiSkin adalah sistem analisis kondisi wajah dan rekomendasi skincare berbasis AI.

## Tech Stack
- Frontend: React (Vite)
- Backend: Express.js
- AI: TensorFlow CNN (MobileNetV2)
- Data Science: Streamlit (planned)

## Cara Menjalankan

### Backend
cd backend
node app.js

### Frontend
cd frontend
npm install
npm run dev

## Struktur
- frontend: tampilan UI
- backend: API & logic
- ai-model: model AI
- data-science: analisis data

<<<<<<< HEAD
## Dashboard Deployment
https://lumiskin-project.streamlit.app

=======
## AI Model

Model klasifikasi jerawat dibangun menggunakan TensorFlow Functional API dengan arsitektur CNN berbasis MobileNetV2.

### Kelas yang Diprediksi
- Cyst
- Papules
- Pustules

### Komponen Kustom
- Custom Callback (`SaveBestModel`)

### File Utama
- training.py
- inference.py
- lumiskin_model.keras
- lumiskin_final_model.keras

### Hasil Inference Contoh

```text
HASIL PREDIKSI
Class : Cyst
Confidence : 0.9897
```
>>>>>>> b504c218bfbb601d196bee7a6bf23a01eb46d9c8
