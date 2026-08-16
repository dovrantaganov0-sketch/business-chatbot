const SERVICES = [
  {
    id: 'logo',
    name: 'Logo dizaýny',
    desc: 'Brendiňiziň ýüzüni görkezjek täsirli we özboluşly logo. Dizaýn konusypalaryňyz bilen birleşdirilýär.',
  },
  {
    id: 'biznes-kart',
    name: 'Wizitka',
    desc: 'Kärhanaňyzyň abraýyny ýokarlandyrjak döwrebap wizitka dizaýnlary.',
  },
  {
    id: '3d',
    name: '3D dizaýn',
    desc: 'Önümleriňizi ýa-da taslamalaryňyzy real görnüşde beýan edýän 3D görkezmeler.',
  },
  {
    id: 'smm',
    name: 'Sosial media postlary',
    desc: 'Instagram we beýleki platformalar üçin üns çekiji dizaýn işleri.',
  },
  {
    id: 'web',
    name: 'Web sahypa',
    desc: 'Brendiňizi internetde tanatmak üçin döwrebap web sahypalar.',
  },
  {
    id: 'logo-anim',
    name: 'Logo animasiýasy',
    desc: 'Logotiňizi janlandyryp, has dinamiki görnüşe getirýäris.',
  },
  {
    id: 'video',
    name: 'Düşündiriş wideolar',
    desc: 'Explainer, Training we Tender wideolar. Türkmen, rus we iňlis dillerinde.',
  },
]

const VIDEO_INFO =
  'Düşündiriş wideolarymyz (Motion Graphic) — önümiňizi, hyzmatyňyzy ýa-da taslamany düşnükli we täsirli görnüşde beýan edýär.\n\n' +
  'Görnüşleri:\n' +
  '• Explainer (düşündiriş) — önümiň manysyny gysga we aýdyň düşündirýär\n' +
  '• Training (okuw) — işgärleri okuw wideo arkaly taýýarlaýar\n' +
  '• Tender — tender taslamalary üçin resmi we ynam beriji wideo\n\n' +
  'Belli aýratynlyklar:\n' +
  '• Dilleri: türkmen, rus, iňlis\n' +
  '• Uzynlygy: 45-75 sekunt aralygynda\n' +
  '• Stil: 2D Motion Graphic, grafik, ikonkalar, ses beýany\n\n' +
  'Sargyt etmek üçin:\n' +
  '1. Haýsy wideo görnüşi gerek\n' +
  '2. Önüm/hyzmat barada maglumat\n' +
  '3. Adyňyz we telefon belgiňiz\n\n' +
  'Şu maglumatlary ýazyň — size takyk baha we möhlet teklip ederis.'

const CONTACTS =
  'Biz bilen aragatnaşyk:\n' +
  '📞 +993 62 017 373 ýa-da +993 61 847 337\n' +
  '📧 dovrantaganov0@gmail.com\n\n' +
  'Islendik soragyňyza jogap bermäge taýýar.'

const VALUE_TEXT =
  'Gowy dizaýn — diňe gözel surat däl, ol iş guraly! 💡\n\n' +
  'Logo dizaýnynyň peýdasy:\n' +
  '• Ykrar edilmek — adamyň ýüzü ýaly, logo brendiňizi ilkinji ýüz görnüşinde tanaýar. Göwünlilik we ynam döredýär.\n' +
  '• Özboluşlylyk — sizi bäsdeşlerden aýyrýar. Adamlar size deňeşdirende "şol, ýörite biz üçin edilen" diýip duýýar.\n' +
  '• Hemme ýerde işleýär — wizitkada, web sahypada, sosial mediada, wideoda. Bir gezek edilen logo köp ýerde hyzmat edýär.\n' +
  '• Doly paket — PNG, SVG, reňkli we monohrom wersiýalar. Hüjütde-de, suratda-da, çapda-da ajaýyp görünýär.\n\n' +
  'Wizitkanyň peýdasy:\n' +
  '• Abraý — hünärmen görnüşdäki wizitka sizi ygtybarly hünärmen edip görkezýär.\n' +
  '• Aragatnaşyk — telefon, e-poçta, salgy — bir kartoçkada. Müşderiňiz size ýüz tutmak üçin aňsatlyk tapýar.\n' +
  '• Ilki täsir — iş ýygnagynda ýa-da duşuşykda wizitka size hünär derejesini berýär.\n' +
  '• Ýadyňda galmak — logoňyz we reňkleriňiz bilen edilen wizitka sizi ýatda galdyrýar.\n\n' +
  'Logo + wizitka bilelikde sargyt edeniňizde — tutuş brend paketi. Endirim hem bar! "sargyt" ýazyň.'

const HELP_TEXT =
  'Size kömek etmekden şat! 🎯\n\n' +
  '"BIRDE" sanly hyzmatlar birleşigi Türkmenistanda aşakdakylary hödürleýär:\n' +
  '• Logo dizaýny — brendiňiziň özboluşly nyşany\n' +
  '• Wizitka — kärhananyň abraýly keşbi\n' +
  '• Sosial media postlary — üns çekiji dizaýnlar\n' +
  '• Logo animasiýasy — logotipiň janly görnüşi\n' +
  '• Web sahypa — internetdäki wizitkaňyz\n' +
  '• 3D dizaýn — önümleri real görkezmek\n' +
  '• Düşündiriş wideolar — Explainer / Training / Tender\n\n' +
  'Aşakdaky sözleri ýazyp sorag edip bilersiňiz:\n' +
  '• "hyzmatlar" — ähli hyzmatlaryň doly sanawy\n' +
  '• "logo" / "wizitka" / "3d" / "web" / "wideo" — hyzmatlar barada giňişleýin\n' +
  '• "baha" — bahalar nähili kesgitleýär\n' +
  '• "möhlet" — işleriň näderejede wagt alýar\n' +
  '• "diller" — haýsy dillerde işleýäris\n' +
  '• "töleg" — töleg tertibi\n' +
  '• "işler" — iş nusgalaryny nireden görýär\n' +
  '• "telegram" / "kontakt" — aragatnaşyk maglumatlary\n' +
  '• "sargyt" — sargyt etmek üçin\n\n' +
  'Islendik soragyňyzy beýle-de ýazyň — jogap bermäge taýýar!'

function normalize(text = '') {
  return text.toLowerCase().replace(/[ё]/g, 'е')
}

const KEYWORDS = [
  {
    key: 'peýda',
    priority: true,
    words: ['peýda', 'peýdasy', 'näme üçin', 'name ucin', 'näme gerek', 'why', 'зачем', 'польз', 'mysal bilen'],
    reply: () => VALUE_TEXT,
  },
  {
    key: 'mahabat',
    priority: true,
    words: ['mahabat', 'reklam', 'reklama', 'реклам', 'advertising', 'promo', 'ündeýji', 'tanat'],
    reply: () =>
      'Mahabat — işiňiziň ösüşiniň iň güýçli guraly! 📣\n\n' +
      'Mahabatyň peýdasy:\n' +
      '• Tanatmak — adamlara siziň baradygyňyzy we nämäni hödürleýändigiňizi aýdýar\n' +
      '• Müşderi çekmek — satuwy artdyrýar, täze müşderiler getirýär\n' +
      '• Ýatda galmak — brendiňizi yzygiderli görsäňler, sizi saýlap alýarlar\n' +
      '• Bäsdeşlerden aýrylmak — özboluşlylygyňyzy görkezýär\n' +
      '• Ynam döretmek — hünärmen görnüşdäki mahabat ynam berýär\n\n' +
      'Nireden başlamaly:\n' +
      '1. Gowy logo we brend görnüşi (wizitka, sosial media şablonlary)\n' +
      '2. Instagram / TikTok akkaunt — yzygiderli postlar we storiler\n' +
      '3. Reklama kampaniýalary (targetleşdirilen mahabat)\n\n' +
      'BIRDE size logo, wizitka we sosial media postlary taýýarlap berýär — mahabatyňyzyň esasyny döredýäris. "sargyt" ýazyň.',
  },
  {
    key: 'biznes',
    priority: true,
    words: ['biznes ideýa', 'biznes ideý', 'ideýa', 'ideya', 'idea', 'бизнес иде', 'kiçi biznes', 'small business', 'näme etmeli', 'iş aç'],
    reply: () =>
      'Kiçi biznes ideýalary — kiçi maýa bilen başlap bolýan ugurlar! 💡\n\n' +
      'Türkmenistana laýyk ideýalar:\n' +
      '1. Onlaýn söwda (wiber) — önümleri Instagram/TikTok arkaly satmak. Başlamak: bir-iki önüm saýla, surata düşür, sahypa aç.\n' +
      '2. Aşpezlik / öý iýmitleri — halk köpçüligine iýmit taýýarlap satmak. Başlamak: ýöriteleşen iýmitiňizden başlaň.\n' +
      '3. Suratçylyk we wideo — nika, wagtlaýyn suratlar, önüm suratlary. Başlamak: telefon bilen başlap, portfeliňizi ýygnap başlaň.\n' +
      '4. Sosial media menedžment (SMM) — beýleki edaralara sahypalaryny ýöretmek. Başlamak: öz sahypaňyzda tejribe toplaň.\n' +
      '5. Gözellik hyzmatlary — manikýur, saç, brij. Başlamak: kurs okaň, ilki tanşylara ediň.\n' +
      '6. Okuw we repetitorlyk — iňlis dili, kompýuter, okuw sapaklary. Başlamak: onlaýn ýa-da ýüzbe-ýüz sapaklar.\n' +
      '7. Awto serwis ýa-da detaliň — ulag söýýänlere hyzmat. Başlamak: kiçi gural toplumy we mahabat.\n' +
      '8. Kofe / çörek önümleri — iş ýerleriniň ýanynda kiçi nokat. Başlamak: mobil ýa-da kiçi kiosk.\n\n' +
      'Islendik ideýa üçin iň wajyp zat — görnükli brend: logo, wizitka, sosial media sahypa. ' +
      'Şonda müşderiler size ynanýar. BIRDE size şol esaslary taýýarlap berýär. "sargyt" ýazyň.',
  },
  {
    key: 'sargyt',
    words: ['sargyt', 'order', 'заказ', 'zakaz', 'satyn al', 'покуп', 'хочу'],
    reply: () =>
      'Sargyt kabul edýäris! 🌟\n\n' +
      'Sargyt etmek üçin aşakdaky maglumatlary ýazyň:\n' +
      '1. Haýsy hyzmat gerek (logo / wizitka / web / wideo / 3D / SMM)\n' +
      '2. Adyňyz\n' +
      '3. Telefon belgiňiz\n\n' +
      'Şeýle-de bolsa, taslamanyňyz barada goşmaça maglumat bersefiiz (görnüş, reňk, stil), ' +
      'size has takyk baha we möhlet teklip edip bileris.\n\n' +
      'Maglumatlar gelende, sargydyňyzy hasaba alarys we size habarlaşarys.',
  },
  {
    key: 'hyzmat',
    words: ['hyzmat', 'service', 'uslugi', 'услуги', 'сервис'],
    reply: () =>
      'BIRDE sanly hyzmatlar birleşigi size aşakdaky hyzmatlary hödürleýär:\n\n' +
      SERVICES.map((s, i) => `${i + 1}. ${s.name} - ${s.desc}`).join('\n') +
      '\n\nHaýsy hyzmat sizi gyzyklandyrýar? Ýa-da "sargyt" ýazyň.',
  },
  {
    key: 'logo',
    words: ['logo', 'логотип', 'ло'],
    reply: () =>
      'Logo dizaýny — brendiňiziň ýüzü we ykrar edilýän nyşany. 🌟\n\n' +
      'Nämä aýratyn üns berýäris:\n' +
      '• Özboluşlylyk — kopiýa däl, diňe size degişli nyşan\n' +
      '• Reňk gammasy — ugryňyza we brendiňize laýyk reňkler\n' +
      '• Universal bolmaly — wizitkada, webde, sosial mediada we wideoda ajaýyp görünmeli\n' +
      '• Formatlar — PNG, SVG, doly reňk we monohrom wersiýalar\n\n' +
      'Iş tertibi:\n' +
      '1. Kompaniýanyň ady we ugry\n' +
      '2. Gowy görýän stiliňiz (döwrebap / klasik / minimalist)\n' +
      '3. Reňk islegiňiz bolsa\n' +
      '4. Telefon belgiňiz\n\n' +
      'Wariantlar hödürleýäris, saýlaýarsyňyz, düzedýäris. Sargyt etmek üçin şu maglumatlary ýazyň.',
  },
  {
    key: 'wizitka',
    words: ['wizitka', 'biznes kart', 'business card', 'визитка', 'karta'],
    reply: () =>
      'Wizitka — kärhanaňyzyň abraýyny ýokarlandyrýan kiçijik, ýöne täsirli gural. 💳\n\n' +
      'Wizitka dizaýnynyň içine girýär:\n' +
      '• Döwrebap dizaýn (reňk, şrift, logo goşulmasy)\n' +
      '• Bir we iki taraplaýyn wersiýalar\n' +
      '• Çap etmäge taýýar fayllar (PDF, CMYK)\n\n' +
      'Sargyt etmek üçin:\n' +
      '1. Adyňyz, wezipesiňiz we kompaniýa ady\n' +
      '2. Telefon, e-poçta, salgy\n' +
      '3. Telefon belgiňiz (aýratyn sargyt üçin)\n\n' +
      'Şu maglumatlary ýazyň — dizaýny taýýarlap bereý.',
  },
  {
    key: '3d',
    words: ['3d', '3 д', 'three d', 'модель'],
    reply: () =>
      '3D dizaýn — önümiňizi ýa-da taslamany real we göz ýetirip bolýan görnüşde görkezmek. 🧊\n\n' +
      'Nireden peýdalanýar:\n' +
      '• Önümi sargyt etmezden öň görkezmek (prototip)\n' +
      '• Arhitektura we interýer görkezmeler\n' +
      '• Reklama we sosial media üçin 3D suratlar\n' +
      '• Täze önümi tanyşdyrmak\n\n' +
      'Iş tertibi:\n' +
      '1. Önümiň ýa-da taslamanyň suratlary / eskizleri\n' +
      '2. Görnüş islegiňiz (stil, reňkler)\n' +
      '3. Telefon belgiňiz\n\n' +
      'Maglumatlary ýazyň — teklip taýýarlap bereý.',
  },
  {
    key: 'web',
    words: ['web', 'site', 'sahypa', 'veb', 'сайт', 'веб', 'вэб'],
    reply: () =>
      'Web sahypa — brendiňiziň internetdäki wizitkasy we satuw guraly. 🌐\n\n' +
      'Web sahypanyň görnüşleri:\n' +
      '• Wizitka sahypa — kompaniýa barada gysga maglumat (1-5 sahypa)\n' +
      '• Onlaýn dükan — önümleri satmak, kartoçka bilen töleg\n' +
      '• Korporatiw sahypa — ullakan kompaniýalar üçin doly çözgüt\n\n' +
      'Hyzmatymyza girýär:\n' +
      '• Döwrebap dizaýn, telefon we planşet üçin uýgunlaşma\n' +
      '• Sazlamalary (tizlik, howpsuzlyk, poçta)\n' +
      '• Diller: türkmen, rus, iňlis\n\n' +
      'Sargyt üçin:\n' +
      '1. Sahypa görnüşi (wizitka / dükan / korporatiw)\n' +
      '2. Sahypada nämeler gerek (bölümler)\n' +
      '3. Adyňyz we telefon belgiňiz\n\n' +
      'Maglumatlary ýazyň — size baha we möhlet bilen teklip taýýarlap bereý.',
  },
  {
    key: 'wizitka',
    words: ['wizitka', 'biznes kart', 'business card', 'визитка', 'кarta'],
    reply: () =>
      'Wizitka: Kärhanaňyzyň abraýyny ýokarlandyrjak döwrebap wizitka dizaýnlary döredýäris.\n\n' +
      'Sargyt üçin adyňyzy we telefon belgiňizi ýazyň.',
  },
  {
    key: '3d',
    words: ['3d', '3 д', 'three d', 'модель'],
    reply: () =>
      '3D dizaýn: Önümleriňizi ýa-da taslamalaryňyzy real görnüşde beýan etmek üçin 3D görkezmeler taýýarlaýarys.\n\n' +
      'Sargyt üçin adyňyzy we telefon belgiňizi ýazyň.',
  },
  {
    key: 'web',
    words: ['web', 'site', 'sahypa', 'veb', 'сайт', 'веб', 'вэб'],
    reply: () =>
      'Web sahypa: Brendiňizi internetde tanatmak üçin döwrebap web sahypalary düzýäris.\n\n' +
      'Web sahypa sargyt etmek üçin:\n' +
      '1. Sahypa görnüşi (wizitka / dükan / korporatiw)\n' +
      '2. Adyňyz we telefon belgiňiz\n\n' +
      'Maglumatlary ýazyň, size teklip taýýarlap bereý.',
  },
  {
    key: 'video',
    words: ['wideo', 'wide', 'видео', 'video', 'explainer', 'motion', 'график'],
    reply: () => VIDEO_INFO,
  },
  {
    key: 'möhlet',
    words: ['möhlet', 'mohlet', 'how long', 'сколько', 'срок', 'deadline', 'haçan', 'wagty', 'bada'],
    reply: () =>
      'Işleriň takmynan möhletleri: 📅\n' +
      '• Logo dizaýny: 3-5 iş güni (2-3 wariant taýýarlaýarys)\n' +
      '• Wizitka: 1-3 iş güni\n' +
      '• Sosial media postlary: 1-2 gün (paketde)\n' +
      '• Logo animasiýasy: 2-4 iş güni\n' +
      '• Düşündiriş wideo: 5-10 iş güni (45-75 sekunt)\n' +
      '• Web sahypa: taslamanyň göwrümine bagly (2-4 hepde)\n' +
      '• 3D dizaýn: çylşyrymlylyga bagly\n\n' +
      'Takyk möhlet sargyt edilende we taslamanyň göwrümi belli bolanda aýdyňlaşýar. ' +
      'Gyssagly sargytlar üçin ýörite şertler hem bar — "sargyt" ýazyň.',
  },
  {
    key: 'diller',
    words: ['dil', 'dilde', 'diller', 'language', 'язык', 'türkmençe', 'rusça', 'iňlisçe', 'на русском', 'по-русски', 'english'],
    reply: () =>
      'Hyzmatlarymyzy üç dilde hödürleýäris: 🌍\n' +
      '• Türkmen dili 🇹🇲\n' +
      '• Rus dili 🇷🇺\n' +
      '• Iňlis dili 🇬🇧\n\n' +
      'Düşündiriş wideolar, sahypa tekstleri, ssenariýalar we dizaýndaky ýazgylar ' +
      'bu dilleriň islendiginde taýýarlanylýar.\n\n' +
      'Haýsy dilde iş almak isleýäňiz, sargyt wagtynda aýdyň — dogrusyny taýýarlap bereý.',
  },
  {
    key: 'işwagty',
    words: ['iş wagty', 'saat', 'work time', 'график', 'режим работы', 'часы', 'kabul edýär', 'kabul edýärsiňiz'],
    reply: () =>
      'Biz her gün işleýäris! 🕐\n' +
      'Telefon we çat arkaly islendik wagt sargyt edip bilersiňiz.\n\n' +
      '📞 +993 62 017 373 ýa-da +993 61 847 337\n' +
      '📧 dovrantaganov0@gmail.com',
  },
  {
    key: 'töleg',
    words: ['töleg', 'toleg', 'payment', 'оплат', 'деньги', 'düşündiň', 'awans', 'порядок оплаты'],
    reply: () =>
      'Töleg tertibi — ähli zat aýdyň we ynamly: 💳\n\n' +
      '1. Şertnama baglaşylanda başlangyç bölegi (adaty 50%)\n' +
      '2. Galan bölegi iş tämamlananda we siz makul diýeniňizde\n\n' +
      'Töleg usullary barada telefon edip ýa-da çat arkaly sorap bilersiňiz.\n\n' +
      'Her bir sargyt üçin anyk baha we töleg şertleri aýratyn kesgitlenýär. ' +
      'Takyk teklip almak üçin "sargyt" ýazyň.',
  },
  {
    key: 'işler',
    words: ['işler', 'portfolio', 'nusga', 'пример', 'наши работы', 'работ', 'görkez', 'mysal', 'образц'],
    reply: () =>
      'Işlerimiziň nusgalaryny görmek üçin birnäçe usul bar! 📱\n\n' +
      '• Instagram we TikTok akkauntlarymyzda — iň täze işler we beýan\n' +
      '• Bu sahypanyň aşagynda "Işlerimiz" bölümi — görkezilen nusgalar\n' +
      '• Haýsydyr bir hyzmat sizi gyzyklandyrýan bolsa, aýdyň — şol ugurda has jikme-jik nusgalary we maglumatlary iberip bileris.\n\n' +
      'Haýsy hyzmat sizi gyzyklandyrýar?',
  },
  {
    key: 'telegram',
    words: ['telegram', 'whatsapp', 'ватсап', 'телеграм', 'wotsapp'],
    reply: () =>
      'Elbetde, Telegram we WhatsApp arkaly hem habarlaşyp bilersiňiz! 💬\n' +
      'Telefon belgilerimiz:\n' +
      '• +993 62 017 373\n' +
      '• +993 61 847 337\n\n' +
      'Şeýle-de, bu sahypadaky "Sargyt formasy" arkaly hem sargyt edip bilersiňiz — ' +
      'formany dolduryň, operatorymyz size habarlaşar.',
  },
  {
    key: 'endirim',
    words: ['endirim', 'arzan', 'discount', 'скидк', 'акци', 'sowgat'],
    reply: () =>
      'Endirimler! 🎉\n' +
      '• Birnäçe hyzmaty bilelikde sargyt edeniňizde endirim\n' +
      '• Yzygiderli müşderilerimize ýörite şertler\n\n' +
      'Konkret teklip üçin "sargyt" ýazyň ýa-da telefon ediň: +993 62 017 373',
  },
  {
    key: 'smm',
    words: ['smm', 'post', 'sosial', 'instagram post', 'пост'],
    reply: () =>
      'Sosial media postlary — Instagram we beýleki platformalarda üns çekiji dizaýnlar. 📱\n\n' +
      'Nämeler taýýarlaýarys:\n' +
      '• Postlar we karuseller (birnäçe suratly)\n' +
      '• Storiler üçin dizaýnlar\n' +
      '• Bannery we aksentler\n\n' +
      'Sargyt üçin:\n' +
      '1. Platforma (Instagram / TikTok / beýleki)\n' +
      '2. Post sany ýa-da paket\n' +
      '3. Telefon belgiňiz\n\n' +
      'Maglumatlary ýazyň — teklip taýýarlap bereý.',
  },
  {
    key: 'anim',
    words: ['animasiýa', 'animat', 'анимац'],
    reply: () =>
      'Logo animasiýasy — logotiňizi janlandyryp, has dinamiki görnüşe getirýäris. ✨\n\n' +
      'Animasiýanyň görnüşleri:\n' +
      '• Görünmek / ýitmek effektleri\n' +
      '• Aýlanma we hereket\n' +
      '• Harplaryň janlanmasy\n' +
      '• Intro/outro wersiýasy (wideoňyzyň başy/ahyry üçin)\n\n' +
      'Sargyt üçin:\n' +
      '1. Logotipiňiz (fayl ýa-da surat)\n' +
      '2. Islän stiliňiz\n' +
      '3. Telefon belgiňiz\n\n' +
      'Maglumatlary ýazyň — teklip taýýarlap bereý.',
  },
  {
    key: 'baha',
    words: ['baha', 'baxa', 'price', 'pricing', 'стоимость', 'цена', 'сколько'],
    reply: () =>
      'Bahalar — her bir taslama aýratyn bahalanýar, çünki baha şulardan bagly: 💰\n\n' +
      '• Hyzmatyň görnüşi (logo / web / wideo / 3D we ş.m.)\n' +
      '• Taslamanyň göwrümi we çylşyrymlylygy\n' +
      '• Wariantlaryň sany\n' +
      '• Gyssaglylyk derejesi\n\n' +
      'Takyk baha almak üçin:\n' +
      '1. Haýsy hyzmat gerek\n' +
      '2. Taslamanyň göwrümini aýdyň\n' +
      '3. Telefon belgiňizi ýazyň\n\n' +
      'Maglumatlary ýazan badyňyza 24 sagadyň içinde teklip ibereris. Takmynan baha bilen tanyşmak üçin "sargyt" ýazyň.',
  },
  {
    key: 'kontakt',
    words: ['kontakt', 'aragatnaşyk', 'почта', 'email', 'mail', 'контакт', 'связ', 'номер', 'belgiňiz', 'nomer', 'ýazgyt'],
    reply: () => CONTACTS,
  },
  {
    key: 'salam',
    words: ['salam', 'hello', 'hi', 'привет', 'здравств', 'добрый', 'hey'],
    reply: () =>
      "Salam! \"BIRDE\" sanly hyzmatlar birleşigine hoş geldiňiz! 😊\n\n" +
      'Size kömek etmekden şat. "hyzmatlar" ýazyň - nämeler edýändigimizi görkezeý, ýa-da "sargyt" ýazyň.',
  },
]

export function servicesList() {
  return SERVICES
}

export function botReply(text = '') {
  const t = normalize(text)

  if (!t.trim()) {
    return { text: HELP_TEXT, intent: 'help' }
  }

  let best = null
  let bestScore = 0
  for (const kw of KEYWORDS) {
    for (const w of kw.words) {
      if (t.includes(w) && w.length > bestScore) {
        best = kw
        bestScore = w.length
      }
    }
  }

  if (best) {
    for (const kw of KEYWORDS) {
      if (kw.priority && kw.words.some((w) => t.includes(w))) {
        return { text: kw.reply(), intent: kw.key }
      }
    }
    return { text: best.reply(), intent: best.key }
  }

  const isOrderInfo =
    /\d{8,}/.test(t) || (t.includes('derýar') && (t.includes('telefon') || t.includes('ady')))
  if (isOrderInfo) {
    return {
      text: 'Maglumatlaryňyz alnyndy! Sargydyňyz hasaba alyndy. Ýakyn wagtda operatorymyz size telefon eder. 📞',
      intent: 'order',
    }
  }

  return {
    text:
      'Soragyňyzy aldyk. Size şeýle kömek edip bilerin! 😊\n\n' +
      '• "hyzmatlar" — ähli hyzmatlarymyzyň doly sanawy\n' +
      '• "logo" / "wizitka" / "3d" / "web" / "wideo" — hyzmat barada giňişleýin\n' +
      '• "baha" — bahalar nädip kesgitleýär\n' +
      '• "möhlet" — işleriň möhletleri\n' +
      '• "töleg" — töleg tertibi\n' +
      '• "kontakt" — aragatnaşyk maglumatlary\n' +
      '• "sargyt" — sargyt etmek üçin\n\n' +
      'Eger sargyt etmek isleseňiz, adyňyzy we telefon belgiňizi ýazyň — hasaba alarys!',
    intent: 'unknown',
  }
}

export function detectOrderIntent(text = '') {
  const t = normalize(text)
  const hasService = SERVICES.some((s) => {
    const nameParts = s.name.toLowerCase().split(' ')
    return nameParts.some((p) => p.length > 2 && t.includes(p))
  })
  const hasPhone = /\d{8,}/.test(t)
  const hasName = /(ady:|ady ).{2,}/.test(t)
  return hasService && (hasPhone || hasName)
}
