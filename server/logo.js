const COLORS = {
  Fiolet: { main: '#7c5cff', dark: '#5a3ce8', light: '#a28aff' },
  Mawi: { main: '#3b82f6', dark: '#2563eb', light: '#7ab0ff' },
  'Gök': { main: '#06b6d4', dark: '#0891b2', light: '#67e8f9' },
  Gyzyl: { main: '#ef4444', dark: '#dc2626', light: '#fca5a5' },
  'Ýaşyl': { main: '#10b981', dark: '#059669', light: '#6ee7b7' },
  'Gara-ak': { main: '#1f2937', dark: '#111827', light: '#4b5563' },
  'Gülgüne': { main: '#ec4899', dark: '#be185d', light: '#f9a8d4' },
  Narynjy: { main: '#f97316', dark: '#ea580c', light: '#fdba74' },
  'Altyn': { main: '#d4af37', dark: '#a8842c', light: '#f2d98a' },
  'Gökmawy': { main: '#6366f1', dark: '#4338ca', light: '#a5b4fc' },
  'Meniw': { main: '#8b5cf6', dark: '#6d28d9', light: '#c4b5fd' },
  'Söhbet': { main: '#14b8a6', dark: '#0f766e', light: '#5eead4' },
  'Ýakyn': { main: '#eab308', dark: '#a16207', light: '#fde047' },
  'Goňur': { main: '#8d5524', dark: '#6f3d12', light: '#c8a265' },
  'Gümüş': { main: '#64748b', dark: '#475569', light: '#cbd5e1' },
  'Reňkli': { main: '#7c5cff', dark: '#ec4899', light: '#06b6d4' },
}

const INDUSTRY_LABELS = {
  Telekeçilik: 'TELEKEÇILIK WE KONSULTING',
  Senagat: 'SENAGAT WE ÖNÜMÇILIK',
  Logistika: 'LOGISTIKA WE ELTIP BERIŞ',
  Saglyk: 'SAGLYGY GORAMAK',
  'Iýmit': 'IÝMIT ÖNÜMLERI',
  Gurluşyk: 'GURLUŞYK WE LAHYY',
  Suratçylyk: 'FOTO WE WIDEO',
  'Wideooperator': 'FOTO WE WIDEO',
  Studio: 'STUDIO',
  Dizaýn: 'DIZAÝN WE KREATIW',
  Atelýe: 'ATELÝE WE TIKINÇILIK',
  Gözellik: 'GÖZELLIK SALONY',
  Sport: 'SPORT WE SAĞDYKLYK',
  Bilim: 'BILIM WE OKUW',
  Turizm: 'TURIZM WE SYÝAHAT',
  Awto: 'AWTO WE SERWIS',
  Restoran: 'RESTORAN WE KOFE',
  Mebel: 'MEBEL ÖNÜMÇILIK',
  Beýleki: 'HYZMATLAR',
}

function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'BI'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

function esc(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function watermark() {
  return (
    '<g opacity="0.45">' +
    '<text transform="rotate(-18 200 80)" x="200" y="74" font-family="Arial, sans-serif" font-weight="800" font-size="24" fill="#ff5c8a" text-anchor="middle">NUSGA · PREVIEW</text>' +
    '<text transform="rotate(-18 200 80)" x="200" y="98" font-family="Arial, sans-serif" font-weight="700" font-size="12" fill="#0b0d12" text-anchor="middle">TÖLEG SOŇUNDAN DOLY NUSGA</text>' +
    '</g>'
  )
}

const ACCENTS = ['#ff5c8a', '#00e0c6', '#ffb020', '#ff5c8a', '#7c5cff']

function gradientDef(id, c, angle = '1 1', variant = 0) {
  const accent = ACCENTS[Math.abs(variant || 0) % ACCENTS.length]
  const stops =
    c.name === 'Reňkli'
      ? [
          '<stop offset="0" stop-color="#7c5cff"/>',
          '<stop offset="0.5" stop-color="#ec4899"/>',
          '<stop offset="1" stop-color="#06b6d4"/>',
        ].join('')
      : `<stop offset="0" stop-color="${c.main}"/><stop offset="1" stop-color="${accent}"/>`
  const [ax, ay] = String(angle).split(' ').map(Number)
  const sx = ax || 1
  const sy = ay || 1
  return `<linearGradient id="${id}" x1="0" y1="0" x2="${sx}" y2="${sy}">${stops}</linearGradient>`
}

const FONTS = {
  modern: 'Arial, Helvetica, "Segoe UI", sans-serif',
  display: '"Trebuchet MS", "Segoe UI", Arial, sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
}

function font(name) {
  return (FONTS[name] || FONTS.modern).replace(/"/g, '&quot;')
}

export function sanitizeSVG(svg) {
  const s = String(svg)
  let out = ''
  let inTag = false
  let inValue = false
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (!inTag) {
      out += ch
      if (ch === '<') inTag = true
      continue
    }
    if (inValue) {
      if (ch === '"') {
        inValue = false
        out += '"'
      } else {
        out += ch
      }
      continue
    }
    if (ch === '"') {
      let j = out.length - 1
      while (j >= 0 && out[j] === ' ') j--
      if (out[j] === '=') {
        inValue = true
        out += ch
      } else {
        out += '&quot;'
      }
      continue
    }
    out += ch
    if (ch === '>') inTag = false
  }
  return out
}

const WATERMARK_RE = /<g opacity="0\.45">[\s\S]*?<\/g>/g

export function stripWatermark(svg) {
  return String(svg).replace(WATERMARK_RE, '')
}

export function injectWatermark(svg) {
  if (/NUSGA/.test(svg)) return svg
  return svg.replace('</svg>', watermark() + '</svg>')
}

function logoMonogram({ name, industry, color }) {
  const c = COLORS[color] || COLORS.Fiolet
  const init = esc(initials(name))
  const ind = esc(INDUSTRY_LABELS[industry] || industry)
  return (
    '<rect x="8" y="24" width="112" height="112" rx="26" fill="url(#g)"/>' +
    '<rect x="20" y="36" width="88" height="88" rx="18" fill="#ffffff" opacity="0.14"/>' +
    `<text x="64" y="108" font-family="${font('display')}" font-weight="900" font-size="54" fill="#ffffff" text-anchor="middle" letter-spacing="1">${init}</text>` +
    `<text x="140" y="90" font-family="${font('display')}" font-weight="800" font-size="40" fill="#0b0d12">${esc(name)}</text>` +
    '<rect x="140" y="100" width="34" height="5" rx="2.5" fill="url(#g)"/>' +
    `<text x="140" y="126" font-family="${font('modern')}" font-weight="600" font-size="13" fill="#8a93a8" letter-spacing="3">${ind}</text>` +
    watermark()
  )
}

function logoMinimal({ name, industry, color }) {
  const c = COLORS[color] || COLORS.Fiolet
  const init = esc(initials(name))
  const ind = esc(INDUSTRY_LABELS[industry] || industry)
  return (
    `<circle cx="70" cy="80" r="36" fill="url(#g)" opacity="0.12"/>` +
    `<circle cx="70" cy="80" r="30" fill="none" stroke="${c.main}" stroke-width="8" stroke-linecap="round"/>` +
    `<text x="70" y="90" font-family="${font('display')}" font-weight="800" font-size="28" fill="${c.main}" text-anchor="middle">${init}</text>` +
    `<text x="130" y="82" font-family="${font('display')}" font-weight="800" font-size="36" fill="#0b0d12">${esc(name)}</text>` +
    `<text x="130" y="108" font-family="${font('modern')}" font-weight="500" font-size="13" fill="#8a93a8" letter-spacing="2">${ind}</text>` +
    watermark()
  )
}

function logoBadge({ name, industry, color }) {
  const c = COLORS[color] || COLORS.Fiolet
  const init = esc(initials(name))
  return (
    '<path d="M70 20 L110 46 L110 102 Q110 124 70 140 Q30 124 30 102 L30 46 Z" fill="url(#g)"/>' +
    '<path d="M70 30 L100 50 L100 98 Q100 116 70 130 Q40 116 40 98 L40 50 Z" fill="#ffffff" opacity="0.12"/>' +
    `<text x="70" y="96" font-family="${font('display')}" font-weight="900" font-size="34" fill="#ffffff" text-anchor="middle" letter-spacing="1">${init}</text>` +
    `<text x="130" y="88" font-family="${font('display')}" font-weight="800" font-size="40" fill="#0b0d12">${esc(name)}</text>` +
    '<rect x="130" y="100" width="30" height="6" rx="3" fill="url(#g)"/>' +
    `<circle cx="300" cy="40" r="4" fill="${c.main}"/>` +
    `<circle cx="300" cy="52" r="2" fill="${c.main}" opacity="0.6"/>` +
    watermark()
  )
}

function logoBoxed({ name, color }) {
  const c = COLORS[color] || COLORS.Fiolet
  const init = esc(initials(name))
  return (
    '<rect x="20" y="34" width="100" height="100" rx="16" fill="url(#g)" opacity="0.1"/>' +
    '<rect x="20" y="34" width="100" height="100" rx="16" fill="none" stroke="url(#g)" stroke-width="6"/>' +
    `<text x="70" y="102" font-family="${font('display')}" font-weight="900" font-size="40" fill="url(#g)" text-anchor="middle">${init}</text>` +
    `<text x="145" y="90" font-family="${font('display')}" font-weight="800" font-size="38" fill="#0b0d12">${esc(name)}</text>` +
    `<rect x="145" y="100" width="26" height="5" rx="2.5" fill="${c.main}"/>` +
    watermark()
  )
}

function logoLine({ name, color }) {
  const c = COLORS[color] || COLORS.Fiolet
  const init = esc(initials(name))
  return (
    '<rect x="24" y="40" width="86" height="86" rx="43" fill="url(#g)"/>' +
    '<rect x="34" y="50" width="66" height="66" rx="33" fill="#ffffff"/>' +
    `<text x="67" y="95" font-family="${font('display')}" font-weight="900" font-size="32" fill="url(#g)" text-anchor="middle">${init}</text>` +
    `<text x="135" y="88" font-family="${font('display')}" font-weight="800" font-size="38" fill="#0b0d12">${esc(name)}</text>` +
    `<line x1="135" y1="100" x2="260" y2="100" stroke="${c.main}" stroke-width="3"/>` +
    `<circle cx="260" cy="100" r="4" fill="${c.main}"/>` +
    watermark()
  )
}

function logoNeon({ name, color }) {
  const c = COLORS[color] || COLORS.Fiolet
  const init = esc(initials(name))
  return (
    `<circle cx="70" cy="80" r="46" fill="${c.main}" opacity="0.15"/>` +
    '<circle cx="70" cy="80" r="42" fill="#0b0d12" stroke="none"/>' +
    `<circle cx="70" cy="80" r="50" fill="none" stroke="${c.main}" stroke-width="5" stroke-linecap="round" stroke-dasharray="10 8"/>` +
    `<text x="70" y="92" font-family="${font('display')}" font-weight="900" font-size="36" fill="${c.light}" text-anchor="middle">${init}</text>` +
    `<text x="135" y="88" font-family="${font('display')}" font-weight="800" font-size="38" fill="#0b0d12">${esc(name)}</text>` +
    `<text x="135" y="112" font-family="${font('modern')}" font-weight="500" font-size="11" fill="${c.main}" letter-spacing="4">EST. 2026</text>` +
    watermark()
  )
}

function logoGold({ name }) {
  const init = esc(initials(name))
  return (
    '<defs><linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f9e9a1"/><stop offset="0.45" stop-color="#d4af37"/><stop offset="1" stop-color="#8a6d1c"/></linearGradient></defs>' +
    '<rect x="24" y="40" width="92" height="86" rx="12" fill="url(#gold)"/>' +
    '<rect x="34" y="50" width="72" height="66" rx="8" fill="#ffffff" opacity="0.16"/>' +
    `<text x="70" y="99" font-family="${font('serif')}" font-weight="700" font-size="36" fill="#ffffff" text-anchor="middle">${init}</text>` +
    `<text x="140" y="90" font-family="${font('serif')}" font-weight="700" font-size="38" fill="#9c7a1e">${esc(name)}</text>` +
    '<rect x="140" y="102" width="34" height="3" fill="url(#gold)"/>' +
    watermark()
  )
}

function logoRetro({ name }) {
  const init = esc(initials(name))
  return (
    '<rect x="28" y="44" width="88" height="80" fill="#f4f1ea" stroke="#0b0d12" stroke-width="4"/>' +
    '<rect x="36" y="52" width="72" height="64" fill="none" stroke="#0b0d12" stroke-width="1.5" stroke-dasharray="4 3"/>' +
    `<text x="72" y="95" font-family="${font('serif')}" font-weight="700" font-size="34" fill="#0b0d12" text-anchor="middle">${init}</text>` +
    `<text x="138" y="88" font-family="${font('serif')}" font-weight="700" font-size="36" fill="#0b0d12">${esc(name)}</text>` +
    '<rect x="138" y="100" width="30" height="4" fill="#c05621"/>' +
    watermark()
  )
}

function logoCircle({ name, color }) {
  const c = COLORS[color] || COLORS.Fiolet
  const init = esc(initials(name))
  return (
    `<circle cx="70" cy="80" r="50" fill="${c.main}" opacity="0.14"/>` +
    '<circle cx="70" cy="80" r="46" fill="url(#g)"/>' +
    `<circle cx="70" cy="80" r="38" fill="#ffffff" opacity="0.14"/>` +
    `<text x="70" y="92" font-family="${font('display')}" font-weight="900" font-size="34" fill="#ffffff" text-anchor="middle">${init}</text>` +
    `<text x="135" y="86" font-family="${font('display')}" font-weight="800" font-size="38" fill="#0b0d12">${esc(name)}</text>` +
    `<rect x="135" y="98" width="26" height="5" rx="2.5" fill="${c.main}"/>` +
    watermark()
  )
}

const LOGO_STYLES = {
  monogram: logoMonogram,
  minimal: logoMinimal,
  badge: logoBadge,
  boxed: logoBoxed,
  line: logoLine,
  neon: logoNeon,
  gold: logoGold,
  retro: logoRetro,
  circle: logoCircle,
}

function cardDark({ name, industry, color, phone = '', email = '', instagram = '' }) {
  const c = COLORS[color] || COLORS.Fiolet
  const init = esc(initials(name))
  const ind = esc(INDUSTRY_LABELS[industry] || industry)
  const contactLines = [
    phone && `<text x="34" y="150" font-family="${font('modern')}" font-size="13" fill="#9aa5bb">${esc(phone)}</text>`,
    email && `<text x="34" y="172" font-family="${font('modern')}" font-size="13" fill="#9aa5bb">${esc(email)}</text>`,
    instagram && `<text x="34" y="194" font-family="${font('modern')}" font-size="13" fill="#9aa5bb">${esc(instagram)}</text>`,
  ].filter(Boolean).join('')
  return (
    '<rect x="20" y="20" width="360" height="200" rx="16" fill="#0b0d12"/>' +
    '<circle cx="330" cy="40" r="70" fill="url(#g)" opacity="0.12"/>' +
    '<circle cx="20" cy="220" r="60" fill="#ffffff" opacity="0.04"/>' +
    `<rect x="34" y="34" width="58" height="58" rx="14" fill="url(#g)"/>` +
    `<text x="63" y="72" font-family="${font('display')}" font-weight="900" font-size="28" fill="#fff" text-anchor="middle">${init}</text>` +
    `<text x="106" y="60" font-family="${font('display')}" font-weight="800" font-size="22" fill="#fff">${esc(name)}</text>` +
    `<text x="106" y="82" font-family="${font('modern')}" font-weight="500" font-size="11" fill="#9aa5bb" letter-spacing="2">${ind}</text>` +
    '<line x1="34" y1="112" x2="366" y2="112" stroke="#262e40" stroke-width="2"/>' +
    contactLines +
    `<circle cx="350" cy="196" r="12" fill="${c.main}"/>` +
    watermark()
  )
}

function cardGradient({ name, industry }) {
  const init = esc(initials(name))
  return (
    '<rect x="20" y="20" width="360" height="200" rx="16" fill="url(#g)"/>' +
    `<text x="200" y="78" font-family="Arial, sans-serif" font-weight="900" font-size="30" fill="#fff" text-anchor="middle">${esc(name)}</text>` +
    `<text x="200" y="104" font-family="Arial, sans-serif" font-weight="500" font-size="12" fill="#ffe4f0" letter-spacing="2" text-anchor="middle">${esc(INDUSTRY_LABELS[industry] || industry)}</text>` +
    '<circle cx="200" cy="160" r="22" fill="#ffffff" opacity="0.18"/>' +
    `<text x="200" y="166" font-family="Arial, sans-serif" font-weight="900" font-size="18" fill="#fff" text-anchor="middle">${init}</text>` +
    watermark()
  )
}

function cardLight({ name, industry }) {
  const init = esc(initials(name))
  return (
    '<rect x="20" y="20" width="360" height="200" rx="16" fill="#f8f9fb"/>' +
    `<text x="200" y="80" font-family="Arial, sans-serif" font-weight="800" font-size="30" fill="#0b0d12" text-anchor="middle">${esc(name)}</text>` +
    `<text x="200" y="106" font-family="Arial, sans-serif" font-weight="500" font-size="12" fill="#6b7280" letter-spacing="2" text-anchor="middle">${esc(INDUSTRY_LABELS[industry] || industry)}</text>` +
    '<circle cx="200" cy="155" r="20" fill="#7c5cff"/>' +
    `<text x="200" y="161" font-family="Arial, sans-serif" font-weight="900" font-size="17" fill="#fff" text-anchor="middle">${init}</text>` +
    watermark()
  )
}

function cardSplit({ name, industry, color, phone = '', email = '', instagram = '' }) {
  const c = COLORS[color] || COLORS.Fiolet
  const init = esc(initials(name))
  const contactLines = [
    phone && `<text x="190" y="150" font-family="Arial, sans-serif" font-size="12" fill="#4b5563">${esc(phone)}</text>`,
    email && `<text x="190" y="170" font-family="Arial, sans-serif" font-size="12" fill="#4b5563">${esc(email)}</text>`,
    instagram && `<text x="190" y="190" font-family="Arial, sans-serif" font-size="12" fill="#4b5563">${esc(instagram)}</text>`,
  ].filter(Boolean).join('')
  return (
    '<rect x="20" y="20" width="150" height="200" rx="16" fill="url(#g)"/>' +
    `<text x="95" y="100" font-family="Arial, sans-serif" font-weight="900" font-size="34" fill="#fff" text-anchor="middle">${init}</text>` +
    `<text x="190" y="78" font-family="Arial, sans-serif" font-weight="800" font-size="22" fill="#0b0d12">${esc(name)}</text>` +
    `<text x="190" y="100" font-family="Arial, sans-serif" font-weight="500" font-size="11" fill="#8a93a8" letter-spacing="1.5">${esc(INDUSTRY_LABELS[industry] || industry)}</text>` +
    contactLines +
    watermark()
  )
}

function cardFrame({ name, industry, color }) {
  const c = COLORS[color] || COLORS.Fiolet
  const init = esc(initials(name))
  return (
    '<rect x="20" y="20" width="360" height="200" rx="16" fill="#ffffff"/>' +
    `<rect x="32" y="32" width="336" height="176" rx="10" fill="none" stroke="${c.main}" stroke-width="3"/>` +
    `<text x="200" y="86" font-family="Arial, sans-serif" font-weight="800" font-size="30" fill="#0b0d12" text-anchor="middle">${esc(name)}</text>` +
    `<text x="200" y="112" font-family="Arial, sans-serif" font-weight="500" font-size="11" fill="${c.dark}" letter-spacing="2" text-anchor="middle">${esc(INDUSTRY_LABELS[industry] || 'SANLY HYZMATLAR')}</text>` +
    `<circle cx="200" cy="160" r="18" fill="${c.main}"/>` +
    `<text x="200" y="166" font-family="Arial, sans-serif" font-weight="900" font-size="15" fill="#fff" text-anchor="middle">${init}</text>` +
    watermark()
  )
}

function cardNeon({ name, industry, color }) {
  const c = COLORS[color] || COLORS.Fiolet
  return (
    '<rect x="20" y="20" width="360" height="200" rx="16" fill="#0b0d12"/>' +
    `<rect x="28" y="28" width="344" height="184" rx="12" fill="none" stroke="${c.main}" stroke-width="3"/>` +
    `<text x="200" y="84" font-family="Arial, sans-serif" font-weight="800" font-size="30" fill="${c.light}" text-anchor="middle">${esc(name)}</text>` +
    `<text x="200" y="110" font-family="Arial, sans-serif" font-weight="500" font-size="11" fill="#9aa5bb" letter-spacing="2" text-anchor="middle">${esc(INDUSTRY_LABELS[industry] || 'SANLY HYZMATLAR')}</text>` +
    watermark()
  )
}

function cardGold({ name }) {
  return (
    '<rect x="20" y="20" width="360" height="200" rx="16" fill="#12100a"/>' +
    '<defs><linearGradient id="goldc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f5d060"/><stop offset="1" stop-color="#9c7a1e"/></linearGradient></defs>' +
    `<text x="200" y="86" font-family="Georgia, serif" font-weight="700" font-size="32" fill="url(#goldc)" text-anchor="middle">${esc(name)}</text>` +
    '<line x1="150" y1="102" x2="250" y2="102" stroke="url(#goldc)" stroke-width="2"/>' +
    watermark()
  )
}

function cardMinimal({ name, color }) {
  const c = COLORS[color] || COLORS.Fiolet
  const init = esc(initials(name))
  return (
    '<rect x="20" y="20" width="360" height="200" rx="16" fill="#ffffff"/>' +
    `<text x="200" y="90" font-family="Arial, sans-serif" font-weight="800" font-size="30" fill="#0b0d12" text-anchor="middle">${esc(name)}</text>` +
    `<circle cx="200" cy="150" r="16" fill="${c.main}"/>` +
    `<text x="200" y="156" font-family="Arial, sans-serif" font-weight="900" font-size="14" fill="#fff" text-anchor="middle">${init}</text>` +
    `<line x1="160" y1="132" x2="240" y2="132" stroke="${c.main}" stroke-width="2"/>` +
    watermark()
  )
}

const CARD_STYLES = {
  dark: cardDark,
  gradient: cardGradient,
  light: cardLight,
  split: cardSplit,
  frame: cardFrame,
  neon: cardNeon,
  gold: cardGold,
  minimal: cardMinimal,
}

function fit(inner, dw, dh, tw, th) {
  const s = Math.min(tw / dw, th / dh)
  const tx = Math.round((tw - dw * s) / 2)
  const ty = Math.round((th - dh * s) / 2)
  return `<g transform="translate(${tx} ${ty}) scale(${s})">${inner}</g>`
}

export function generateLogo(order = {}, opts = {}) {
  const { final = false, variant = 0 } = opts
  const style = LOGO_STYLES[order.style] || LOGO_STYLES.monogram
  const inner = fit(style(order, variant), 400, 160, 850, 850)
  let svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 850" width="850" height="850">` +
    `<defs>${gradientDef('g', COLORS[order.color] || COLORS.Fiolet, '1 1', variant)}</defs>` +
    inner +
    '</svg>'
  if (final) svg = stripWatermark(svg)
  return svg
}

export function generateCard(order = {}, opts = {}) {
  const { final = false, variant = 0 } = opts
  const style = CARD_STYLES[order.card_style] || CARD_STYLES.dark
  const inner = fit(style(order, variant), 400, 240, 850, 550)
  let svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 550" width="850" height="550">` +
    `<defs>${gradientDef('g', COLORS[order.color] || COLORS.Fiolet, '1 1', variant)}</defs>` +
    inner +
    '</svg>'
  if (final) svg = stripWatermark(svg)
  return svg
}

function cardBack({ name, industry, color, card_style, variant = 0, phone = '', email = '', instagram = '' }) {
  const c = COLORS[color] || COLORS.Fiolet
  const init = esc(initials(name))
  const light = ['light', 'minimal', 'frame'].includes(card_style)
  const bg = light ? '#ffffff' : '#0b0d12'
  const fg = light ? '#0b0d12' : '#ffffff'
  const sub = light ? '#8a93a8' : '#9aa5bb'
  const center = 200
  const mark =
    `<rect x="${center - 30}" y="70" width="60" height="60" rx="15" fill="url(#g)"/>` +
    `<text x="${center}" y="106" font-family="Arial, sans-serif" font-weight="900" font-size="26" fill="#ffffff" text-anchor="middle">${init}</text>`
  const tagline = [instagram, phone, email].filter(Boolean).join(' · ')
  return (
    `<rect x="20" y="20" width="360" height="200" rx="16" fill="${bg}"/>` +
    (light
      ? `<rect x="20" y="20" width="360" height="200" rx="16" fill="none" stroke="${c.main}" stroke-width="2"/>`
      : '') +
    mark +
    `<text x="${center}" y="158" font-family="Arial, sans-serif" font-weight="800" font-size="17" fill="${fg}" text-anchor="middle">${esc(name)}</text>` +
    `<text x="${center}" y="180" font-family="Arial, sans-serif" font-weight="500" font-size="10" fill="${sub}" letter-spacing="2" text-anchor="middle">${esc(INDUSTRY_LABELS[industry] || 'SANLY HYZMATLAR')}</text>` +
    (tagline ? `<text x="${center}" y="204" font-family="Arial, sans-serif" font-weight="500" font-size="9" fill="${sub}" text-anchor="middle">${esc(tagline)}</text>` : '') +
    watermark()
  )
}

export function generateCardBack(order = {}, opts = {}) {
  const { final = false, variant = 0 } = opts
  const inner = fit(cardBack(order, variant), 400, 240, 850, 550)
  let svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 550" width="850" height="550">` +
    `<defs>${gradientDef('g', COLORS[order.color] || COLORS.Fiolet, '1 1', variant)}</defs>` +
    inner +
    '</svg>'
  if (final) svg = stripWatermark(svg)
  return svg
}

export function designOptions() {
  return {
    colors: Object.entries(COLORS).map(([k, v]) => ({ name: k, color: v.main })),
    logoStyles: Object.keys(LOGO_STYLES),
    cardStyles: Object.keys(CARD_STYLES),
    industries: Object.keys(INDUSTRY_LABELS),
    services: [
      'Logo + Wizitka',
      'Diňe Logo',
      'Diňe Wizitka',
      'Logo + Wizitka + Web',
      'Logo + Wizitka + 3D',
      'Logo animasiýasy',
      'Düşündiriş wideo',
      'Doly brend paket',
    ],
  }
}
