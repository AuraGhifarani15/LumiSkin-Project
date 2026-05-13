# LumiSkin — Backend API 🌿

Backend RESTful API untuk **LumiSkin**, platform deteksi jerawat dan rekomendasi skincare berbasis AI.

> Coding Camp 2026 powered by DBS Foundation · Tim **CC26-PSU356**

---

## Tech Stack

|                 | Teknologi                                |
| --------------- | ---------------------------------------- |
| **Runtime**     | Node.js + Express.js                     |
| **Database**    | PostgreSQL                               |
| **Auth**        | JWT + Google OAuth 2.0 (Passport.js)     |
| **AI Chat**     | Groq API (Llama 3)                       |
| **ML Analisis** | Flask/FastAPI (model `.keras` eksternal) |
| **Email**       | Nodemailer (Gmail / SMTP)                |
| **Logging**     | Pino + pino-http + pino-roll             |
| **Security**    | Helmet, express-rate-limit, bcryptjs     |
| **Upload**      | Multer (JPG/PNG/WebP, maks 10MB)         |

---

## Struktur Folder

```
backend/
├── logs/                           # File log (production, auto-rotate)
├── uploads/                        # File gambar yang diupload
├── src/
│   ├── app.js                      # Entry point — middleware & routes
│   ├── config/
│   │   ├── db.js                   # Koneksi pool PostgreSQL
│   │   ├── passport.js             # Google OAuth 2.0 strategy
│   │   ├── migrate.js              # Buat tabel utama
│   │   ├── migrate_google.js       # Tambah kolom Google OAuth ke tabel users
│   │   └── migrate_reset_tokens.js # Buat tabel password_reset_tokens
│   ├── controllers/
│   │   ├── authController.js       # Register, login, profil, reset password
│   │   └── predicController.js     # Analisis kulit & riwayat
│   ├── middleware/
│   │   ├── auth.js                 # Verifikasi JWT Bearer token
│   │   └── upload.js               # Multer — filter & simpan file gambar
│   ├── models/
│   │   ├── User.js                 # Query tabel users
│   │   └── Analysis.js             # Query tabel analysis_history
│   ├── routes/
│   │   ├── auth.js                 # /auth/*
│   │   ├── analyze.js              # /analyze/*
│   │   └── chat.js                 # /chat
│   └── utils/
│       ├── logger.js               # Pino logger (pretty di dev, file di prod)
│       ├── jwt.js                  # generateToken & verifyToken
│       ├── email.js                # sendResetPasswordEmail via Nodemailer
│       └── response.js             # Format response standar
└── package.json
```

---

## Instalasi

### Prasyarat

- Node.js >= 18
- PostgreSQL >= 14

### Langkah

```bash
# 1. Masuk ke folder backend
cd backend

# 2. Install dependency
npm install

# 3. Buat file .env
cp .env.example .env
# lalu isi semua nilai (lihat bagian Environment Variables)

# 4. Buat database
psql -U postgres -c "CREATE DATABASE lumiskin_db;"

# 5. Jalankan migrasi secara berurutan
npm run migrate
npm run migrate:google
npm run migrate:reset-tokens

# 6. Jalankan server
npm run dev     # development (nodemon + pretty log)
npm start       # production (log ke file)
```

Server berjalan di `http://localhost:5000`

---

## API Endpoints

> Endpoint dengan 🔒 membutuhkan header `Authorization: Bearer <token>`

### Auth `/auth`

| Method | Endpoint                | Auth | Keterangan                                   |
| ------ | ----------------------- | ---- | -------------------------------------------- |
| POST   | `/auth/register`        |      | Daftar akun baru                             |
| POST   | `/auth/login`           |      | Login email & password                       |
| GET    | `/auth/google`          |      | Login dengan Google (buka di browser)        |
| GET    | `/auth/me`              | 🔒   | Data user yang sedang login                  |
| PUT    | `/auth/update-profile`  | 🔒   | Ubah nama                                    |
| PUT    | `/auth/change-password` | 🔒   | Ubah password                                |
| POST   | `/auth/forgot-password` |      | Kirim link reset ke email (berlaku 30 menit) |
| POST   | `/auth/reset-password`  |      | Reset password dengan token dari email       |

### Analyze `/analyze`

| Method | Endpoint               | Auth     | Keterangan                                   |
| ------ | ---------------------- | -------- | -------------------------------------------- |
| POST   | `/analyze`             | Opsional | Analisis foto kulit, diteruskan ke ML server |
| GET    | `/analyze/history`     | 🔒       | Semua riwayat analisis user                  |
| GET    | `/analyze/history/:id` | 🔒       | Detail satu riwayat                          |

> Jika request menyertakan token JWT, hasil analisis otomatis disimpan ke riwayat.

### Chat `/chat`

| Method | Endpoint | Auth | Keterangan      |
| ------ | -------- | ---- | --------------- |
| POST   | `/chat`  |      | Untuk sementara |

Model Groq yang tersedia:

- `llama-3.1-8b-instant`

---

## Format Response

```json
// Sukses
{ "success": true, "message": "...", "data": {} }

// Gagal
{ "success": false, "message": "Pesan error" }
```

---

## Rate Limiting

| Endpoint                     | Limit      | Window   |
| ---------------------------- | ---------- | -------- |
| `POST /auth/login`           | 10 request | 15 menit |
| `POST /auth/register`        | 5 request  | 1 jam    |
| `POST /auth/forgot-password` | 5 request  | 1 jam    |
| `POST /analyze`              | 20 request | 1 jam    |
| `POST /chat`                 | 30 request | 15 menit |

---

## Logging

Menggunakan **Pino** sebagai logging library.

| Environment   | Output                    | Format                          |
| ------------- | ------------------------- | ------------------------------- |
| `development` | Terminal                  | Pretty print berwarna           |
| `production`  | `logs/app-YYYY-MM-DD.log` | JSON, rotasi harian / maks 10MB |

Field sensitif seperti `Authorization`, `password`, dan `token` otomatis disensor (`***REDACTED***`) di semua log.
