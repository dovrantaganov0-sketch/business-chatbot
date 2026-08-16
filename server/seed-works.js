import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { listWorks, createWork } from './store.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data')
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads')

const WORKS = [
  {
    title: "Kärendes",
    type: "Logo dizaýny",
    tag: "Logo",
    description: "Telekeçilik üçin altyn monogramma stili",
    image: "/uploads/work-1.svg",
    sort: 5,
    svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 850 850\" width=\"850\" height=\"850\">\n  <!-- Geometric Emblem -->\n  <g id=\"emblem\" transform=\"translate(425, 275)\">\n    <path d=\"M-125,0 C-100,50 50,50 75,0 100,-50 -50,-50 -125,0\" \n          style=\"fill:none; stroke:url(#goldfoil); stroke-width:20; stroke-linecap:round\"/>\n    <circle cx=\"0\" cy=\"0\" r=\"50\" \n            style=\"fill:url(#goldfoil); opacity:0.8\"/>\n    <circle cx=\"0\" cy=\"0\" r=\"25\" \n            style=\"fill:#FFFFFF; opacity:0.8\"/>\n    <line x1=\"-50\" y1=\"25\" x2=\"50\" y2=\"25\" \n          style=\"stroke:#FFFFFF; stroke-width:5; opacity:0.8\"/>\n    <line x1=\"-25\" y1=\"-50\" x2=\"-25\" y2=\"50\" \n          style=\"stroke:#FFFFFF; stroke-width:5; opacity:0.8\"/>\n  </g>\n  \n  <!-- Company Name -->\n  <text x=\"425\" y=\"525\" font-family=\"Helvetica\" font-size=\"64\" font-weight=\"400\" text-anchor=\"middle\" letter-spacing=\"4\">\n    <tspan fill=\"#FFFFFF\" x=\"425\" y=\"525\">Kärendes</tspan>\n    <tspan fill=\"url(#goldfoil)\" x=\"425\" y=\"525\" dx=\"0\" dy=\"4\" font-size=\"64\" font-weight=\"700\" opacity=\"0.8\">Kärendes</tspan>\n  </text>\n  \n  <!-- Industry Tagline -->\n  <text x=\"425\" y=\"595\" font-family=\"Helvetica\" font-size=\"24\" font-weight=\"300\" text-anchor=\"middle\" letter-spacing=\"2\">\n    <tspan fill=\"#FFFFFF\" opacity=\"0.6\">Business Consulting</tspan>\n  </text>\n  \n  <!-- Decorative Elements -->\n  <g id=\"decorative\" fill=\"#FFFFFF\" opacity=\"0.4\">\n    <circle cx=\"300\" cy=\"700\" r=\"10\"/>\n    <circle cx=\"550\" cy=\"700\" r=\"10\"/>\n    <line x1=\"300\" y1=\"710\" x2=\"550\" y2=\"710\" style=\"stroke-width:5\"/>\n  </g>\n  \n  <!-- Gold Foil Gradient -->\n  <defs>\n    <linearGradient id=\"goldfoil\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\">\n      <stop offset=\"0%\" stop-color=\"#F8E231\" stop-opacity=\"1\"/>\n      <stop offset=\"100%\" stop-color=\"#FFD700\" stop-opacity=\"1\"/>\n    </linearGradient>\n  </defs>\n</svg>",
  },
  {
    title: "Onlaýn dükan",
    type: "Web sahypa",
    tag: "Web",
    description: "Onlaýn söwda üçin döwrebap görnüş",
    image: "/uploads/work-2.svg",
    sort: 4,
    svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 850 550\" width=\"850\" height=\"550\">\n  <!-- Background Gradient -->\n  <rect x=\"0\" y=\"0\" width=\"850\" height=\"550\" fill=\"url(#bgGrad)\" />\n  \n  <!-- Background Gradient Definition -->\n  <defs>\n    <linearGradient id=\"bgGrad\" x1=\"0%\" y1=\"0%\" x2=\"0%\" y2=\"100%\">\n      <stop offset=\"0%\" stop-color=\"#FFFFFF\" />\n      <stop offset=\"100%\" stop-color=\"#F7F7F7\" />\n    </linearGradient>\n  </defs>\n  \n  <!-- Company Name -->\n  <text x=\"50\" y=\"120\" font-family=\"Arial\" font-size=\"48\" font-weight=\"bold\" fill=\"#007bff\">\n    <tspan>Onlaýn dükan</tspan>\n  </text>\n  \n  <!-- Industry -->\n  <text x=\"50\" y=\"180\" font-family=\"Arial\" font-size=\"24\" fill=\"#666666\">\n    <tspan>Business Consulting</tspan>\n  </text>\n  \n  <!-- Emblem/Monogram -->\n  <g transform=\"translate(730, 50)\">\n    <circle cx=\"50\" cy=\"50\" r=\"50\" fill=\"#007bff\" />\n    <text x=\"50\" y=\"65\" font-family=\"Arial\" font-size=\"32\" font-weight=\"bold\" fill=\"#FFFFFF\" text-anchor=\"middle\">\n      <tspan>OD</tspan>\n    </text>\n  </g>\n</svg>",
  },
  {
    title: "Önüm tanadyş",
    type: "Düşündiriş wideo",
    tag: "Motion",
    description: "Wideo önümi üçin neýon stili",
    image: "/uploads/work-3.svg",
    sort: 3,
    svg: "<svg viewBox=\"0 0 850 550\" width=\"850\" height=\"550\" xmlns=\"http://www.w3.org/2000/svg\">\n  <!-- Background Gradient -->\n  <rect x=\"0\" y=\"0\" width=\"850\" height=\"550\" rx=\"10\" fill=\"url(#bgGrad)\"/>\n  <defs>\n    <linearGradient id=\"bgGrad\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\">\n      <stop offset=\"0%\" stop-color=\"#440077\" stop-opacity=\"1\"/>\n      <stop offset=\"100%\" stop-color=\"#6600CC\" stop-opacity=\"1\"/>\n    </linearGradient>\n  </defs>\n  \n  <!-- Company Name -->\n  <text x=\"50\" y=\"120\" font-family=\"Arial\" font-size=\"48\" font-weight=\"bold\" fill=\"#FFFFFF\">\n    <tspan x=\"50\" y=\"120\">Önüm tanadyş</tspan>\n  </text>\n  \n  <!-- Industry -->\n  <text x=\"50\" y=\"170\" font-family=\"Arial\" font-size=\"24\" fill=\"#FFFFFF\">\n    <tspan x=\"50\" y=\"170\">Video Production</tspan>\n  </text>\n  \n  <!-- Emblem/Monogram -->\n  <g transform=\"translate(730, 50)\">\n    <circle cx=\"50\" cy=\"50\" r=\"50\" fill=\"url(#emblemGrad)\"/>\n    <text x=\"50\" y=\"55\" font-family=\"Arial\" font-size=\"30\" font-weight=\"bold\" fill=\"#FFFFFF\" text-anchor=\"middle\">\n      <tspan dy=\"0.3em\">O</tspan>\n      <tspan dy=\"1.5em\" font-size=\"20\" x=\"50\" text-anchor=\"middle\">T</tspan>\n    </text>\n    <defs>\n      <linearGradient id=\"emblemGrad\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\">\n        <stop offset=\"0%\" stop-color=\"#5500AA\" stop-opacity=\"1\"/>\n        <stop offset=\"100%\" stop-color=\"#7700EE\" stop-opacity=\"1\"/>\n      </linearGradient>\n    </defs>\n  </g>\n</svg>",
  },
  {
    title: "Önüm modeli",
    type: "3D dizaýn",
    tag: "3D",
    description: "Senagat önümi üçin geometrik emblem",
    image: "/uploads/work-4.svg",
    sort: 2,
    svg: "<svg viewBox=\"0 0 850 850\" width=\"850\" height=\"850\" xmlns=\"http://www.w3.org/2000/svg\">\n  <!-- Main Cyan Color: #00BFFF (Customizable) -->\n  <style>\n    .main-cyan { fill: #00BFFF; }\n    .main-cyan-opaque { fill: rgba(0, 191, 255, 0.7); }\n    .decorative { stroke: #00BFFF; stroke-width: 4; fill: none; }\n    .text { font-family: Arial, sans-serif; }\n    .title { font-size: 54px; letter-spacing: 2px; }\n    .subtitle { font-size: 24px; letter-spacing: 1px; opacity: 0.8; }\n  </style>\n  \n  <!-- Concentric Circles -->\n  <circle cx=\"425\" cy=\"425\" r=\"375\" class=\"main-cyan\" opacity=\"0.2\"/>\n  <circle cx=\"425\" cy=\"425\" r=\"300\" class=\"main-cyan-opaque\"/>\n  <circle cx=\"425\" cy=\"425\" r=\"225\" class=\"decorative\"/>\n  <circle cx=\"425\" cy=\"425\" r=\"150\" class=\"decorative\"/>\n  \n  <!-- Geometric Emblem (Center) -->\n  <g transform=\"translate(425, 425)\">\n    <!-- Central Circle with Gradient -->\n    <circle r=\"60\" class=\"main-cyan\">\n      <linearGradient id=\"grad1\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\">\n        <stop offset=\"0%\" stop-color=\"#00BFFF\"/>\n        <stop offset=\"100%\" stop-color=\"#0055FF\"/>\n      </linearGradient>\n      <animateTransform attributeName=\"transform\" type=\"rotate\" from=\"0 0 0\" to=\"360 0 0\" dur=\"10s\" repeatCount=\"indefinite\"/>\n    </circle>\n    \n    <!-- Overlapping Shapes (Example: Triangles, customizable) -->\n    <polygon points=\"-40,-20 0,-60 40,-20\" transform=\"rotate(60)\" fill=\"#FFFFFF\" opacity=\"0.8\"/>\n    <polygon points=\"-40,-20 0,-60 40,-20\" transform=\"rotate(180)\" fill=\"#FFFFFF\" opacity=\"0.8\"/>\n    <polygon points=\"-40,-20 0,-60 40,-20\" transform=\"rotate(300)\" fill=\"#FFFFFF\" opacity=\"0.8\"/>\n    \n    <!-- Decorative Dots -->\n    <circle cx=\"0\" cy=\"-90\" r=\"10\" class=\"main-cyan\"/>\n    <circle cx=\"-70\" cy=\"0\" r=\"10\" class=\"main-cyan\"/>\n    <circle cx=\"70\" cy=\"0\" r=\"10\" class=\"main-cyan\"/>\n    <circle cx=\"0\" cy=\"90\" r=\"10\" class=\"main-cyan\"/>\n  </g>\n  \n  <!-- Company Name -->\n  <text x=\"425\" y=\"280\" text-anchor=\"middle\" class=\"text title\">\n    <tspan x=\"425\" dy=\"0\">Önüm modeli</tspan>\n  </text>\n  \n  <!-- Industry Tagline -->\n  <text x=\"425\" y=\"820\" text-anchor=\"middle\" class=\"text subtitle\">\n    <tspan x=\"425\" dy=\"0\">Manufacturing Industry</tspan>\n  </text>\n</svg>",
  },
  {
    title: "Korporatiw stil",
    type: "Wizitka",
    tag: "Dizaýn",
    description: "Kompakt, minimal korporatiw görnüş",
    image: "/uploads/work-5.svg",
    sort: 1,
    svg: "<svg viewBox=\"0 0 850 550\" width=\"850\" height=\"550\">\n  <rect x=\"0\" y=\"0\" width=\"850\" height=\"550\" fill=\"#FFFFFF\"/>\n  \n  <!-- Company Name -->\n  <text x=\"100\" y=\"220\" font-family=\"Helvetica\" font-size=\"48\" font-weight=\"bold\" fill=\"#000000\">\n    <tspan x=\"100\" y=\"220\">Korporatiw stil</tspan>\n  </text>\n  \n  <!-- Industry -->\n  <text x=\"100\" y=\"280\" font-family=\"Helvetica\" font-size=\"24\" font-weight=\"normal\" fill=\"#000000\">\n    <tspan x=\"100\" y=\"280\">Design &amp; Creative</tspan>\n  </text>\n  \n  <!-- Matching Emblem/Monogram (Simple &quot;KS&quot; within a Circle) -->\n  <circle cx=\"750\" cy=\"275\" r=\"50\" fill=\"#000000\" opacity=\"0.2\"/>\n  <text x=\"750\" y=\"275\" font-family=\"Helvetica\" font-size=\"36\" font-weight=\"bold\" fill=\"#FFFFFF\" text-anchor=\"middle\" dominant-baseline=\"middle\">\n    <tspan>K</tspan><tspan x=\"750\" dy=\"1.2em\" font-size=\"30\">S</tspan>\n  </text>\n</svg>",
  },
  {
    title: "Brend janlanmasy",
    type: "Logo animasiýasy",
    tag: "Anim",
    description: "Studio üçin inçe çyzykly monogram",
    image: "/uploads/work-6.svg",
    sort: 0,
    svg: "<svg viewBox=\"0 0 850 550\" width=\"850\" height=\"550\">\n  <!-- Background -->\n  <rect x=\"0\" y=\"0\" width=\"850\" height=\"550\" fill=\"#FFFFFF\"/>\n  \n  <!-- Ornamental Lines (Classic Timeless) -->\n  <line x1=\"50\" y1=\"25\" x2=\"800\" y2=\"25\" stroke=\"#CCCCCC\" stroke-width=\"1\"/>\n  <line x1=\"50\" y1=\"525\" x2=\"800\" y2=\"525\" stroke=\"#CCCCCC\" stroke-width=\"1\"/>\n  <line x1=\"25\" y1=\"50\" x2=\"25\" y2=\"500\" stroke=\"#CCCCCC\" stroke-width=\"1\"/>\n  <line x1=\"825\" y1=\"50\" x2=\"825\" y2=\"500\" stroke=\"#CCCCCC\" stroke-width=\"1\"/>\n  \n  <!-- Large Elegant Centered Monogram &quot;BJ&quot; -->\n  <g transform=\"translate(425, 275)\">\n    <circle cx=\"0\" cy=\"0\" r=\"120\" fill=\"#FF9900\"/>\n    <text x=\"0\" y=\"5\" font-family=\"Arial\" font-size=\"96\" text-anchor=\"middle\" fill=\"#FFFFFF\">BJ</text>\n  </g>\n  \n  <!-- Company Name -->\n  <text x=\"425\" y=\"425\" font-family=\"Georgia\" font-size=\"36\" text-anchor=\"middle\" fill=\"#333333\">Brend janlanmasy</text>\n</svg>",
  }
]

export function seedWorksIfEmpty() {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })
  const existing = listWorks()
  const existingImages = new Set(existing.map((w) => w.image))
  let seeded = 0
  for (const w of WORKS) {
    const file = path.join(UPLOADS_DIR, path.basename(w.image))
    if (!fs.existsSync(file)) fs.writeFileSync(file, w.svg, 'utf8')
    if (!existingImages.has(w.image)) {
      createWork({ title: w.title, type: w.type, tag: w.tag, description: w.description, image: w.image, sort: w.sort })
      seeded++
    }
  }
  return seeded
}
