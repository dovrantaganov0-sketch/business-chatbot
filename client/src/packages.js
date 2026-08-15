export const PACKAGES = [
  {
    id: 'mini-brand',
    name: 'Mini Brand pakedi',
    short: 'Brendiňizi doly döretmek',
    items: [
      'Logo nyşany, wordmark we 2 wariant',
      'Wizitka dizaýny, çap üçin taýýar',
      '3 sosial media post şablony',
      '5–10 sekuntlyk logo animasiýasy',
      'Reňk, font we ulanma gollanmasy',
      '2 tapgyr düzediş, arhiw faýllary',
    ],
  },
  {
    id: 'explainer',
    name: 'Düşündiriş pakedi',
    short: '45-75 sekuntlyk motion wideo',
    items: [
      'Tehniki zady düşündir — önüm, enjam ýa-da hyzmat üçin 45-75 sekuntlyk motion wideo',
      'Işgäri howpsuz öwret — HSE, onboarding we standart proseduralar üçin modul animasiýasy',
      'Teklipi ýatda galdyr — Deck, hero video, social cut we kompaniýa profili bir paketde',
      'Briefden faýla çenli — ssenariý, storyboard, animatika, ses, caption we lokalizasiýa',
    ],
  },
]

export function getPackageById(id) {
  return PACKAGES.find((p) => p.id === id) || PACKAGES[0]
}

export const SERVICE_TO_PACKAGE = {
  'Logo dizaýny': ['mini-brand'],
  'Wizitka': ['mini-brand'],
  'Sosial media postlary': ['mini-brand'],
  'Logo animasiýasy': ['mini-brand'],
  'Düşündiriş wideolar': ['explainer'],
}
