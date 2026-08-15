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
USER_LLM_API_KEY=<gemini ýa-da OpenAI-uygunly key>
USER_LLM_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai
USER_LLM_MODEL=gemini-flash-latest
INSTAGRAM_VERIFY_TOKEN=<hökmany däl>
```

Gemini free tier surat generasiýasyny (nanobanana/imagen) açmaýar — şol sebäpli dizaýn
studia Gemini tekst bilen **SVG generasiýa** edýär; ýalňyş bolsa şablona gaýdýar.
