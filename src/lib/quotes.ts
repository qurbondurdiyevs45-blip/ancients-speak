export type Quote = { text: string; author: string };

export const QUOTES: Quote[] = [
  { text: "Ilm — eng buyuk meros, jaholat — eng og‘ir yuk.", author: "Abu Ali ibn Sino" },
  { text: "Adolat — saltanatning tayanchi.", author: "Amir Temur" },
  { text: "Bilim olishda uyalish va manmanlik o‘rin tutmaydi.", author: "Al-Xorazmiy" },
  { text: "Yulduzlar dinlar kabi o‘zgaradi, lekin haqiqat boqiy.", author: "Mirzo Ulug‘bek" },
  { text: "Til — millatning ko‘zgusi.", author: "Alisher Navoiy" },
  { text: "Aqlli kishi — o‘z xatosidan saboq oluvchi.", author: "Abu Nasr Forobiy" },
  { text: "Vatan — taqdir, taqdir — vatan.", author: "Zahiriddin Bobur" },
  { text: "Insonning eng katta dushmani — nodonligi.", author: "Abu Rayhon Beruniy" },
  { text: "Yaxshi so‘z — yarim davlat.", author: "Xalq hikmati" },
  { text: "Ilm hech qachon ortiqcha bo‘lmaydi.", author: "Imom al-Buxoriy" },
  { text: "Sabr — barcha eshiklarning kalitidir.", author: "Xoja Ahmad Yassaviy" },
  { text: "Zamonni o‘rgan, o‘zingni anglaysan.", author: "Mahmud Qoshg‘ariy" },
];

export function quoteOfTheDay(): Quote {
  const day = Math.floor(Date.now() / 86400000);
  return QUOTES[day % QUOTES.length];
}