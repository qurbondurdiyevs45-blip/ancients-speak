export type Lesson = {
  id: string;
  title: string;
  subtitle: string;
  era: string;
  duration: string;
  category: string;
  paragraphs: string[];
  keyDates: { date: string; event: string }[];
};

export const LESSONS: Lesson[] = [
  {
    id: "temuriylar",
    title: "Temuriylar saltanati",
    subtitle: "Sohibqirondan Boburgacha — buyuk davlatchilik darsi",
    era: "XIV–XVI asrlar",
    duration: "8 daqiqa",
    category: "Hukmdorlar",
    keyDates: [
      { date: "1370", event: "Amir Temur Movarounnahr hokimi bo‘ldi" },
      { date: "1399–1404", event: "Yetti yillik yurish — Hindiston, Eron, Suriya" },
      { date: "1409", event: "Shohrux Mirzo Hirotda taxtga o‘tirdi" },
      { date: "1428", event: "Mirzo Ulug‘bek Samarqand rasadxonasini qurdi" },
      { date: "1526", event: "Bobur Hindistonda Boburiylar saltanatiga asos soldi" },
    ],
    paragraphs: [
      "Temuriylar saltanati — XIV asr ikkinchi yarmidan XVI asr boshigacha Markaziy Osiyo, Eron, Afg‘oniston va Hindistonning bir qismini birlashtirgan buyuk davlatdir. Uning asoschisi — Sohibqiron Amir Temur (1336–1405).",
      "Amir Temur Movarounnahrni tartibga keltirib, Samarqandni jahon poytaxtiga aylantirdi. U qurilish, savdo va ilmni qo‘llab-quvvatladi: Bibixonim masjidi, Go‘ri Amir maqbarasi va Shohi Zinda majmualari aynan o‘sha davrning shohidlari.",
      "Sohibqiron vafotidan so‘ng saltanat o‘g‘li Shohrux Mirzo qo‘liga o‘tdi. U Hirotni madaniyat markaziga aylantirdi. Shohruxning o‘g‘li — Mirzo Ulug‘bek esa Samarqandda mashhur rasadxonani qurib, yulduzlar jadvalini tuzdi.",
      "Temuriylar davrida Alisher Navoiy o‘zbek adabiy tilini boyitdi, Abdurahmon Jomiy, Husayn Boyqaro va Behzod kabi siymolar Sharq madaniyatining cho‘qqilarini yaratdi.",
      "Saltanat parchalanib borgan davrda Zahiriddin Muhammad Bobur Farg‘onadan Hindistonga yo‘l oldi va u yerda Boburiylar saltanatiga asos soldi — bu davlat XIX asrgacha yashadi. Shu tariqa Temuriylar merosi — davlatchilik, ilm va san’atda — bugungi O‘zbekistonning ruhiy poydevoriga aylandi.",
    ],
  },
  {
    id: "ilm-zarrin-asr",
    title: "Markaziy Osiyo ilmining zarrin asri",
    subtitle: "Al-Xorazmiy, Beruniy, ibn Sino — jahon faniga ulkan hissa",
    era: "IX–XI asrlar",
    duration: "7 daqiqa",
    category: "Ilm-fan",
    keyDates: [
      { date: "~825", event: "Al-Xorazmiy “Kitob al-jabr” asarini yozdi" },
      { date: "973", event: "Abu Rayhon Beruniy tug‘ildi" },
      { date: "1025", event: "Ibn Sino “Tib qonunlari”ni yakunladi" },
    ],
    paragraphs: [
      "IX asr boshida Bag‘doddagi “Bayt ul-hikma” (Hikmat uyi)da Al-Xorazmiy faoliyat yuritardi. U “al-jabr” atamasini fanga olib kirdi — bugungi ALGEBRA so‘zi ham, ALGORITM tushunchasi ham uning ismidan kelib chiqqan.",
      "Abu Rayhon Beruniy esa qomusiy olim edi: u Yer radiusini ajoyib aniqlikda hisoblab chiqdi, “Hindiston” asarida o‘sha mamlakat madaniyatini ilk bor ilmiy tahlil qildi.",
      "Abu Ali ibn Sino (Avitsenna) tibbiyot bo‘yicha “Tib qonunlari” asarini yozdi. Bu kitob Yevropa universitetlarida besh asr davomida darslik bo‘lib xizmat qildi.",
      "Bu uch siymoning umumiy xususiyati — fanga tizimli yondashuv, kuzatish va dalil. Aynan ular tufayli Markaziy Osiyo IX–XI asrlarda jahon ilm-fanining markaziga aylandi.",
    ],
  },
  {
    id: "navoiy-tili",
    title: "Alisher Navoiy va o‘zbek tili",
    subtitle: "Adabiy til shakllanishi va “Xamsa”",
    era: "XV asr",
    duration: "6 daqiqa",
    category: "Adabiyot",
    keyDates: [
      { date: "1441", event: "Alisher Navoiy Hirotda tug‘ildi" },
      { date: "1483–1485", event: "“Xamsa” dostonlarini yozdi" },
      { date: "1499", event: "“Muhokamat ul-lug‘atayn” asarini yaratdi" },
    ],
    paragraphs: [
      "XV asrda Hirot Sharqning ilm va san’at markazi edi. Sulton Husayn Boyqaro saroyida Alisher Navoiy davlat arbobi va shoir sifatida xizmat qildi.",
      "Navoiy o‘sha davrda eski o‘zbek (chig‘atoy) tilining adabiy salohiyatini isbotlash uchun “Xamsa” — beshlik dostonlarini yaratdi: “Hayrat ul-abror”, “Farhod va Shirin”, “Layli va Majnun”, “Sab’ai sayyor”, “Saddi Iskandariy”.",
      "“Muhokamat ul-lug‘atayn” asarida u o‘zbek tili go‘zalligi va boyligini fors tili bilan qiyosiy tahlil qildi. Bu asar — milliy o‘zlikni anglashning birinchi nazariy hujjati hisoblanadi.",
      "Navoiy nafaqat shoir, balki adolatli vazir, me’morchilik va xayriya homiysi edi. Uning merosi bugungi o‘zbek adabiy tilining poydevoridir.",
    ],
  },
  {
    id: "buyuk-ipak-yoli",
    title: "Buyuk Ipak yo‘li",
    subtitle: "Sharq va G‘arbni bog‘lagan tamaddun yo‘li",
    era: "Mil. avv. II asr — XV asr",
    duration: "5 daqiqa",
    category: "Jahon tarixi",
    keyDates: [
      { date: "~130 m.av.", event: "Xitoy elchisi Chjan Tsyan G‘arbga yo‘l ochdi" },
      { date: "VIII asr", event: "Samarqand, Buxoro savdo markazlariga aylandi" },
      { date: "XV asr", event: "Dengiz yo‘llari kashfi bilan rol kamaydi" },
    ],
    paragraphs: [
      "Buyuk Ipak yo‘li — Sharqdagi Xitoydan G‘arbdagi O‘rta Yer dengizigacha cho‘zilgan, mingdan ortiq shahar va manzilni bog‘lagan tarmoq edi. U bo‘ylab faqat ipak emas, balki qog‘oz, ziravor, shisha, va — eng muhimi — bilim, din va g‘oyalar oqib o‘tdi.",
      "Samarqand, Buxoro, Marv va Toshkent — bu yo‘lning gavhar shaharlari. Bu yerda turli xalqlar va dinlar tinch yashagan, savdo va ilm gullagan.",
      "Ipak yo‘li — globallashuvning birinchi shaklidir. U insoniyatga tarjima san’ati, xalqaro savdo qoidalari va madaniyatlararo muloqotni o‘rgatdi.",
    ],
  },
];

export function getLesson(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}