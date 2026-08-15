# BIRDE proýekti — SESSIÝA ÝATLAMASY (2026-08-15 dowam üçin)

## Bu sessiýada edildi — Dizaýn Studia (AI Logo + Wizitka)
- **DesignStudio.jsx** goşuldy: Hero we Navbar-da "Logo + Wizitka dizaýn et" düwmesi → täze modal penjire açylýar.
- Akym: 1) Kompaniýa ady + ugur + telefon → 2) Logo stili/reňk → 3) Wizitka stili → 4) Generasiýa → 5) Nusgalar (logo, wizitka öňi/arkasy) → 6) Halady → töleg → admin bilen habarlaşma → 7) Admin tassyklasa ýükleme açylýar.
- Üýtgetme çägi: **3 gezek** (`max_attempts=3`, `design.attempts`). 4-nji synanyşykda 403.
- **Backend API (index.js)**: `/api/design/generate`, `/api/design/:id/regenerate`, `/api/design/:id/status`, `/api/design/:id/download`, `/api/design/:id/logo|card|card-back` (`?final=1` diňe paid/done bolsa).
- **logo.js**: `generateCardBack()` (wizitka arkasy), `stripWatermark()`, `injectWatermark()`, variant+ACCENTS gradient. Card 400x240, logo 400x160.
- **aiDesign.js** (TÄZE): Gemini (OpenAI-uygunly endpoint `/v1beta/openai`) bilen 3 SVG (logo/card/cardBack) generasiýa. 429/503 bolsa retry (3 synanyşyk), ýalňyşsa **şablona awtomatik gaýdýar** (fallback) — `ai:false`.
- **Admin**: `paid` status ("Töleg tassyklandy") goşuldy — download muny açýar.
- Test: generate/regenerate/limit/status/download — ählisi işledi.

## Gemini barlagy (ulanyjy beren key)
- Key: `AQ.Ab8RN...` (Google AI Studio, free tier) — OpenAI-uygunly endpoint-de **işledi** (tekst).
- Surat modelleri (gemini-2.5-flash-image, nano-banana, imagen-4.0) free tier-de **quota 0** — surat generasiýasy ýok.
- `gemini-2.5-flash` köne — täze ulanyjylara 404. Işleýän: `gemini-flash-latest` (→gemini-3.7-flash).
- 429/503 yzygiderli (free tier ýok ýüklenme) — şol sebäpli AI dizaýn fallback-e gaçýar. Şablon generasiýa gowy işleýär.

## Render env (dolandyryş panelinde goýmaly)
```
ADMIN_TOKEN=<parol>
DATA_DIR=/data            # render.yaml disk
USER_LLM_API_KEY=<gemini key>
USER_LLM_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai
USER_LLM_MODEL=gemini-flash-latest
INSTAGRAM_VERIFY_TOKEN=   # hökmany däl
```

## Öňki bellikler
- Neşir (Showcase): URL https://jhv7lpcu.monkeycode-ai.gallery/ (slug jhv7lpcu, admin token c50439420fd000aca4ad140063f2f140, ticket b6d583909f827c2e147b87fbb18c4675).
- Image çäklendirmeleri (Showcase): 1 CPU, 1G RAM, daşarky tor ÝOK — LLM server-side işlemeýär (şol ýerde AI hem fallback-e gaçýar).

## Komandalar (gaýtadan gurmak)
- Klient build: `cd /workspace/client && npm run build`
- Lokal server: `cd /workspace/server && node index.js` (port 3001)
- Lokal dev (ikisi): `npm run dev` (scripts/dev.js)
- AI bilen test: `USER_LLM_API_KEY=... USER_LLM_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai USER_LLM_MODEL=gemini-flash-latest node index.js`
