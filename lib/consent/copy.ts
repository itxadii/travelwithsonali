import type { ConsentLanguage } from "./config";

/**
 * Consent notice text. DPDP s.5(3) lets the visitor read the notice in English or a
 * language of the Eighth Schedule, so every string exists in English and Hindi.
 * Keep both languages in step and bump CONSENT_VERSION when the meaning changes.
 */
export interface CategoryCopy {
  title: string;
  description: string;
  /** Itemised personal data collected for this purpose (Rule 3: item-by-item) */
  dataItems: string[];
  retention: string;
  sharedWith?: string;
}

export interface ConsentCopy {
  languageLabel: string;
  bannerTitle: string;
  bannerBody: string;
  acceptAll: string;
  rejectAll: string;
  managePreferences: string;
  saveChoices: string;
  preferencesTitle: string;
  preferencesIntro: string;
  alwaysOn: string;
  dataWeCollect: string;
  retentionLabel: string;
  sharedWithLabel: string;
  essential: CategoryCopy;
  analytics: (withGoogle: boolean) => CategoryCopy;
  marketing: CategoryCopy;
  rightsTitle: string;
  rights: (email: string) => string[];
  complaint: string;
  complaintLink: string;
  minors: string;
  privacyPolicy: string;
  close: string;
  saving: string;
  saveError: string;
  noticeVersion: string;
}

export const CONSENT_COPY: Record<ConsentLanguage, ConsentCopy> = {
  en: {
    languageLabel: "English",
    bannerTitle: "Your privacy, your choice",
    bannerBody:
      "We use essential cookies to run this website. With your permission, we would also like to use analytics cookies to understand which pages and trips interest visitors, so we can improve them. Nothing optional is switched on until you choose.",
    acceptAll: "Accept all",
    rejectAll: "Reject all",
    managePreferences: "Manage preferences",
    saveChoices: "Save my choices",
    preferencesTitle: "Privacy & cookie preferences",
    preferencesIntro:
      "Travel With Sonali is the Data Fiduciary for the data described below. Choose what you allow for each purpose. You can change or withdraw your choice at any time from \"Cookie settings\" at the bottom of every page.",
    alwaysOn: "Always on",
    dataWeCollect: "Data we collect",
    retentionLabel: "Kept for",
    sharedWithLabel: "Shared with",
    essential: {
      title: "Essential",
      description:
        "Needed for the website to work: remembering your cookie choice and keeping you securely signed in to the customer portal.",
      dataItems: [
        "Your cookie choice and a random consent ID",
        "Login session ID (only if you sign in to the customer portal)",
      ],
      retention: "Cookie choice: 12 months. Login session: until you log out or it expires.",
    },
    analytics: (withGoogle) => ({
      title: "Analytics",
      description:
        "Helps us understand how visitors use the website (for example, which trips are viewed most) so we can improve it. We do not use this to identify you personally.",
      dataItems: [
        "Pages you visit and when",
        "The website or campaign link that brought you here",
        "Device type, browser and operating system",
        "Approximate country (not your exact location)",
        "A random visitor ID stored in a cookie",
      ],
      retention: "12 months, then deleted. Deleted immediately if you withdraw consent.",
      sharedWith: withGoogle
        ? "Stored on our own database. Also sent to Google Analytics (Google LLC), which may process it outside India."
        : "Stored only on our own database. Not shared with anyone.",
    }),
    marketing: {
      title: "Marketing",
      description:
        "Measures how well our Instagram and Facebook ads work and helps show you relevant trips on those platforms.",
      dataItems: ["Pages you visit", "An advertising cookie ID set by Meta"],
      retention: "Up to 90 days, as set by Meta.",
      sharedWith: "Meta Platforms, Inc. (Facebook/Instagram), which may process it outside India.",
    },
    rightsTitle: "Your rights",
    rights: (email) => [
      "Withdraw consent at any time, as easily as you gave it, from \"Cookie settings\" at the bottom of any page.",
      `Ask to access, correct or erase your personal data, or raise a grievance, by emailing ${email}.`,
      "Nominate someone to exercise these rights for you in case of death or incapacity.",
    ],
    complaint: "If you are not satisfied with our response, you can complain to the",
    complaintLink: "Data Protection Board of India",
    minors:
      "This website is meant for adults. If you are under 18, please choose \"Reject all\" and ask a parent or guardian to contact us.",
    privacyPolicy: "Read our full Privacy Policy",
    close: "Close",
    saving: "Saving…",
    saveError: "We couldn't save your choice. Please try again.",
    noticeVersion: "Notice version",
  },
  hi: {
    languageLabel: "हिंदी",
    bannerTitle: "आपकी गोपनीयता, आपकी पसंद",
    bannerBody:
      "यह वेबसाइट चलाने के लिए हम आवश्यक कुकीज़ का उपयोग करते हैं। आपकी अनुमति से, हम एनालिटिक्स कुकीज़ का भी उपयोग करना चाहेंगे ताकि समझ सकें कि आगंतुकों को कौन-से पेज और ट्रिप पसंद आते हैं और उन्हें बेहतर बना सकें। जब तक आप चुनाव नहीं करते, कोई भी वैकल्पिक कुकी चालू नहीं होती।",
    acceptAll: "सभी स्वीकार करें",
    rejectAll: "सभी अस्वीकार करें",
    managePreferences: "प्राथमिकताएँ चुनें",
    saveChoices: "मेरी पसंद सेव करें",
    preferencesTitle: "गोपनीयता और कुकी प्राथमिकताएँ",
    preferencesIntro:
      "नीचे बताए गए डेटा के लिए Travel With Sonali डेटा फ़िड्यूशियरी है। हर उद्देश्य के लिए चुनें कि आप क्या अनुमति देते हैं। आप हर पेज के नीचे \"कुकी सेटिंग्स\" से कभी भी अपनी पसंद बदल सकते हैं या सहमति वापस ले सकते हैं।",
    alwaysOn: "हमेशा चालू",
    dataWeCollect: "हम कौन-सा डेटा लेते हैं",
    retentionLabel: "कितने समय तक रखा जाता है",
    sharedWithLabel: "किसके साथ साझा",
    essential: {
      title: "आवश्यक",
      description:
        "वेबसाइट चलाने के लिए ज़रूरी: आपकी कुकी पसंद याद रखना और कस्टमर पोर्टल में आपको सुरक्षित रूप से लॉग-इन रखना।",
      dataItems: [
        "आपकी कुकी पसंद और एक रैंडम सहमति ID",
        "लॉग-इन सेशन ID (केवल कस्टमर पोर्टल में साइन-इन करने पर)",
      ],
      retention: "कुकी पसंद: 12 महीने। लॉग-इन सेशन: लॉग-आउट करने या समाप्त होने तक।",
    },
    analytics: (withGoogle) => ({
      title: "एनालिटिक्स",
      description:
        "इससे हमें समझने में मदद मिलती है कि आगंतुक वेबसाइट का उपयोग कैसे करते हैं (जैसे कौन-सी ट्रिप सबसे ज़्यादा देखी जाती हैं) ताकि हम इसे बेहतर बना सकें। हम इसका उपयोग आपकी व्यक्तिगत पहचान के लिए नहीं करते।",
      dataItems: [
        "आप कौन-से पेज और कब देखते हैं",
        "वह वेबसाइट या कैंपेन लिंक जिससे आप यहाँ आए",
        "डिवाइस का प्रकार, ब्राउज़र और ऑपरेटिंग सिस्टम",
        "अनुमानित देश (आपकी सटीक लोकेशन नहीं)",
        "कुकी में सेव एक रैंडम विज़िटर ID",
      ],
      retention: "12 महीने, फिर हटा दिया जाता है। सहमति वापस लेने पर तुरंत हटा दिया जाता है।",
      sharedWith: withGoogle
        ? "हमारे अपने डेटाबेस में सेव होता है। Google Analytics (Google LLC) को भी भेजा जाता है, जो इसे भारत के बाहर प्रोसेस कर सकता है।"
        : "केवल हमारे अपने डेटाबेस में सेव होता है। किसी के साथ साझा नहीं किया जाता।",
    }),
    marketing: {
      title: "मार्केटिंग",
      description:
        "यह मापता है कि हमारे Instagram और Facebook विज्ञापन कितने प्रभावी हैं और उन प्लेटफ़ॉर्म पर आपको संबंधित ट्रिप दिखाने में मदद करता है।",
      dataItems: ["आप कौन-से पेज देखते हैं", "Meta द्वारा सेट की गई एक विज्ञापन कुकी ID"],
      retention: "Meta द्वारा तय, अधिकतम 90 दिन।",
      sharedWith: "Meta Platforms, Inc. (Facebook/Instagram), जो इसे भारत के बाहर प्रोसेस कर सकता है।",
    },
    rightsTitle: "आपके अधिकार",
    rights: (email) => [
      "आप किसी भी पेज के नीचे \"कुकी सेटिंग्स\" से कभी भी उतनी ही आसानी से सहमति वापस ले सकते हैं, जितनी आसानी से दी थी।",
      `अपने व्यक्तिगत डेटा को देखने, सुधारने या हटाने का अनुरोध करने, या शिकायत दर्ज करने के लिए ${email} पर ईमेल करें।`,
      "मृत्यु या असमर्थता की स्थिति में अपने अधिकारों का उपयोग करने के लिए किसी व्यक्ति को नामित करें।",
    ],
    complaint: "यदि आप हमारे जवाब से संतुष्ट नहीं हैं, तो आप यहाँ शिकायत कर सकते हैं:",
    complaintLink: "भारतीय डेटा संरक्षण बोर्ड",
    minors:
      "यह वेबसाइट वयस्कों के लिए है। यदि आपकी आयु 18 वर्ष से कम है, तो कृपया \"सभी अस्वीकार करें\" चुनें और अपने माता-पिता या अभिभावक से हमसे संपर्क करने को कहें।",
    privacyPolicy: "हमारी पूरी गोपनीयता नीति पढ़ें",
    close: "बंद करें",
    saving: "सेव हो रहा है…",
    saveError: "आपकी पसंद सेव नहीं हो सकी। कृपया फिर से कोशिश करें।",
    noticeVersion: "नोटिस संस्करण",
  },
};
