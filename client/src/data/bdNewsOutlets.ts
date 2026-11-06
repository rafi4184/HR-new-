export interface NewsOutlet {
  name: string;
  domain: string;
  url: string;
}

export interface NewsOutletGroup {
  key: string;
  outlets: NewsOutlet[];
}

// A directory of major, real Bangladeshi newspapers and news channels, so the
// news hub works as a links directory even for outlets the auto-fetch
// pipeline can't pull live headlines from (many block automated requests).
export const BD_NEWS_OUTLET_GROUPS: NewsOutletGroup[] = [
  {
    key: "banglaDailies",
    outlets: [
      { name: "প্রথম আলো (Prothom Alo)", domain: "prothomalo.com", url: "https://www.prothomalo.com" },
      { name: "কালের কণ্ঠ (Kaler Kantho)", domain: "kalerkantho.com", url: "https://www.kalerkantho.com" },
      { name: "যুগান্তর (Jugantor)", domain: "jugantor.com", url: "https://www.jugantor.com" },
      { name: "সমকাল (Samakal)", domain: "samakal.com", url: "https://samakal.com" },
      { name: "ইত্তেফাক (Ittefaq)", domain: "ittefaq.com.bd", url: "https://www.ittefaq.com.bd" },
      { name: "বাংলাদেশ প্রতিদিন (Bangladesh Pratidin)", domain: "bd-pratidin.com", url: "https://www.bd-pratidin.com" },
      { name: "জনকণ্ঠ (Janakantha)", domain: "dailyjanakantha.com", url: "https://www.dailyjanakantha.com" },
      { name: "নয়া দিগন্ত (Naya Diganta)", domain: "dailynayadiganta.com", url: "https://www.dailynayadiganta.com" },
      { name: "ভোরের কাগজ (Bhorer Kagoj)", domain: "bhorerkagoj.com", url: "https://www.bhorerkagoj.com" },
      { name: "মানবজমিন (Manab Zamin)", domain: "mzamin.com", url: "https://mzamin.com" },
      { name: "আমাদের সময় (Amader Shomoy)", domain: "dainikamadershomoy.com", url: "https://dainikamadershomoy.com" },
      { name: "দেশ রূপান্তর (Desh Rupantor)", domain: "deshrupantor.com", url: "https://deshrupantor.com" },
      { name: "বাংলা ট্রিবিউন (Bangla Tribune)", domain: "banglatribune.com", url: "https://www.banglatribune.com" },
    ],
  },
  {
    key: "englishDailies",
    outlets: [
      { name: "The Daily Star", domain: "thedailystar.net", url: "https://www.thedailystar.net" },
      { name: "The Business Standard", domain: "tbsnews.net", url: "https://www.tbsnews.net" },
      { name: "Dhaka Tribune", domain: "dhakatribune.com", url: "https://www.dhakatribune.com" },
      { name: "New Age", domain: "newagebd.net", url: "https://www.newagebd.net" },
      { name: "The Financial Express", domain: "thefinancialexpress.com.bd", url: "https://thefinancialexpress.com.bd" },
      { name: "The Daily Observer", domain: "observerbd.com", url: "https://www.observerbd.com" },
      { name: "Daily Sun", domain: "daily-sun.com", url: "https://www.daily-sun.com" },
      { name: "The Independent", domain: "theindependentbd.com", url: "https://www.theindependentbd.com" },
    ],
  },
  {
    key: "newsPortals",
    outlets: [
      { name: "bdnews24", domain: "bdnews24.com", url: "https://bdnews24.com" },
      { name: "Jagonews24", domain: "jagonews24.com", url: "https://www.jagonews24.com" },
      { name: "banglanews24", domain: "banglanews24.com", url: "https://www.banglanews24.com" },
      { name: "UNB", domain: "unb.com.bd", url: "https://unb.com.bd" },
      { name: "risingbd", domain: "risingbd.com", url: "https://www.risingbd.com" },
    ],
  },
  {
    key: "tvChannels",
    outlets: [
      { name: "Somoy TV", domain: "somoynews.tv", url: "https://www.somoynews.tv" },
      { name: "Channel i", domain: "channelionline.com", url: "https://www.channelionline.com" },
      { name: "Jamuna TV", domain: "jamuna.tv", url: "https://jamuna.tv" },
      { name: "NTV", domain: "ntvbd.com", url: "https://www.ntvbd.com" },
      { name: "RTV", domain: "rtvonline.com", url: "https://rtvonline.com" },
      { name: "Ekattor TV", domain: "ekattor.tv", url: "https://ekattor.tv" },
      { name: "DBC News", domain: "dbcnews.tv", url: "https://dbcnews.tv" },
      { name: "Independent TV", domain: "independent24.com", url: "https://www.independent24.com" },
    ],
  },
];
