# BIRDE — Sanly hyzmatlar birleşigi

Web sahypa + çat bot + sargyt dolandyryş + **AI Logo & Wizitka dizaýn studia**.

## Funksiýalar

- **Dizaýn Studia**: Hero/Navbar-daky "Logo + Wizitka dizaýn et" düwmesi → modal açylýar.
  Ulanyjy kompaniýa adyny, ugruny, telefonuny, logo/wizitka stilini we reňkini saýlaýar.
  Generasiýa (AI ýa-da şablon) → nusgalar (logo, wizitka öňi/arkasy) → 3 gezek üýtgetme →
  töleg üçin admin bilen habarlaşma → admin tassyklasa faýl ýükleme açylýar.
- Çat bot (LLM ýa-da offlaýn düzgün esasly)
- Sargyt/müşderi/habar/statistika dolandyryş (admin panel)
- Instagram webhook

## Gurluş

```
client/   React + Vite (port 5173, /api proksi 3001-e)
server/   Express API (port 3001), JSON saýlama (server/data)
scripts/  ikisini birden işledýär (npm run dev)
```

## Gurmak

```bash
npm run install:all
npm run dev          # frontend + backend
```

Production build: `npm run build`, server: `npm start`.

## Render env

Render Dashboard → Environment (ýa-da render.yaml `sync: false`):

```
ADMIN_TOKEN=<admin paroly>
DATA_DIR=/data
USER_LLM_API_KEY=<chat bot üçin gemini ýa-da OpenAI-uygunly key>
USER_LLM_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai
USER_LLM_MODEL=gemini-flash-latest
CF_API_TOKEN=<Cloudflare API token — dizaýn studia surat generasiýasy>
CF_ACCOUNT_ID=<Cloudflare Account ID>
INSTAGRAM_VERIFY_TOKEN=<hökmany däl>
```

Dizaýn studia AI surat generasiýasy üçin **Cloudflare Workers AI FLUX.1 Schnell**
(1024x1024 JPEG döredýär). FLUX-a **tekstsiz dekoratiw fon** döredilýär; kompaniýa
ady, ugry we kontaktlar kod bilen SVG tekst hökmünde takyk goşulýar (hatlar bulaşmasyn
diýip). Preview-da "NUSGA · PREVIEW" suw alamaty, töleg tassyklanan soň final-da ýok.
Fon suraty SVG-iň içine base64 hökmünde gökmeýär — aýry
`/api/design/:id/raw/:kind` endpoint-den URL bilen çagrylýar (brauzer gabatlylygy).

Açar: Cloudflare Dashboard → My Profile → API Tokens; Account ID Dashboard
sahypasynda görkezilýär. Açar düzülmedik bolsa dizaýn studia şablon SVG
dizaýnlaryna gaýdýar.
