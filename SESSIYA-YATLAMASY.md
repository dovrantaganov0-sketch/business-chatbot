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

## Render deploy (2026-08-15) — TAMAMLANDY
- Render service: `srv-d9vhvpjl550s738luf50`, URL https://business-chatbot-gdvq.onrender.com
- Config PATCH (format `serviceDetails.envSpecificDetails`): `buildCommand="npm run install:all && npm run build"`, `startCommand="npm start"`, `healthCheckPath="/api/health"` — 200 OK
- Env-vars PUT `/env-vars` bilen goşuldy: ADMIN_TOKEN, DATA_DIR=./server/data, USER_LLM_* (Gemini) — 200 OK
- Deploy: `POST /services/{id}/deploys` → dep-da0579gu01pc738e6ijg, 38 sekundda **live**
- Onlaýn barlag: /api/health OK, /api/design/options 200, ai-status `{ai:true, provider:gemini-flash-latest}`, generate/regenerate/status/download/previews (final, suw belgisiz) ählisi işleýär, admin verify OK
- Onlaýn generate/regenerate `ai:false` (Gemini 429 free tier limit) → fallback şablon işleýär, UI bozulmaýar
- **Test order**: produksiýada id=1 "Online Test" (paid statusda) galdy — admin panelde görünýär, isleseň admin panelden pozmaly

## Wizitkadan BIRDE branding aýyrmak (2026-08-15)
- Sorag: "wizitkada biziň hiç zadymyz bolmaly däl, diňe müşderä degişli maglumat"
- `server/logo.js`: cardDark/cardSplit/cardBack şablonlaryndan `@birde.design`, `+993 62 017 373`, `dovrantaganov0@gmail.com` aýryldy → müşderiniň öz `phone/email/instagram`-y ulanylýar (boş bolsa kontakt setiri hiç döremän)
- `server/aiDesign.js`: default BIRDE kontaktlary aýryldy (contact/email/ig diňe müşderiň beren maglumatlary), promptlara "Biziň ýa-da üçünji tarapyň maglumatlaryny goşma" goşuldy
- `server/index.js` designConfig: `base`-dan (design.base) instagram/phone/email geçirilýär
- Deploy: dep-da05fg7lk1mc73f6k6p0 (commit daa98cf, main), live — onlaýn wizitkada BIRDE branding 0, müşderi maglumatlary bar
- **GitHub-da default branch `main`** (Render şondan deploy edýär) — `master` branch hem bar, push `git push origin master:main`
- **MÖHÜM çäklendirme**: Render free tier-de persistent disk ÝOK (Add disk API 402 "Payment required") — **her deploy-da DATA_DIR (./server/data) pozulýar, ähli sargytlar ýitýär**. Ulanyjy "şeýle goý" diýdi — şu wagt çözülmeýär. Ejesha sargydy (id 8) şeýle ýitdi.

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
