# LumiSkin Backend API

Backend API untuk **LumiSkin** — Aplikasi Analisis Kulit & Konsultasi Skincare AI  
Capstone Project **CC26-PSU356** · Coding Camp 2026 powered by DBS Foundation

---

## Teknologi yang Digunakan

| Teknologi | Fungsi |
|-----------|--------|
| Express.js | Web framework |
| PostgreSQL | Database |
| Prisma ORM | Query & migrasi database |
| Redis | Caching & message queue |
| Bull | Job queue untuk analisis async |
| JWT | Autentikasi token |
| Passport.js | Google OAuth login |
| Helmet | HTTP security headers |
| Pino | Structured logging |
| Multer | Upload file gambar |
| Nodemailer | Kirim email reset password |
| Groq API (Llama 3.x) | AI chatbot skincare |
| FastAPI (ML Server) | Prediksi jenis jerawat (CNN) |
| Docker | Container deployment |

---

## Cara Menjalankan

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Setup environment

```bash
cp .env.example .env
```

Edit `.env` sesuai konfigurasi:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

DATABASE_URL="postgresql://postgres:password@localhost:5432/lumiskin_db"

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=12h
SESSION_SECRET=your_session_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

ML_MODEL_URL=http://localhost:8000

GROQ_API_KEY=your_groq_api_key

EMAIL_SERVICE=gmail
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Setup database

```bash
npm run migrate
npm run db:generate
```

### 4. Jalankan server

```bash
npm run dev       # development (hot reload)
npm start         # production
```

Server berjalan di `http://localhost:5000`

---

## NPM Scripts

| Script | Keterangan |
|--------|------------|
| `npm start` | Jalankan di production |
| `npm run dev` | Development + hot reload |
| `npm run migrate` | Jalankan migrasi DB |
| `npm run migrate:deploy` | Deploy migrasi ke production |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:studio` | GUI browser database |
