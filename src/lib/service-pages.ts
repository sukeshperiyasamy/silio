export const servicePages = [
  {
    id: "landing",
    slug: "business-websites-jodhpur",
    en: "Business websites in Jodhpur",
    hi: "जोधपुर में बिज़नेस वेबसाइट",
    audienceEn:
      "For local shops, independent professionals and small teams who need a clear introduction online.",
    audienceHi:
      "स्थानीय दुकानों, स्वतंत्र पेशेवरों और छोटी टीमों के लिए, जिन्हें ऑनलाइन अपना स्पष्ट परिचय चाहिए।",
    outcomesEn: [
      "Explain what you do in one mobile-friendly page",
      "Share your business details and a direct contact link",
      "Use your website in referrals, social profiles and printed materials",
    ],
    outcomesHi: [
      "एक मोबाइल-अनुकूल पेज में अपना काम बताएँ",
      "व्यवसाय की जानकारी और सीधा संपर्क लिंक साझा करें",
      "रेफ़रल, सोशल प्रोफ़ाइल और प्रिंट सामग्री में वेबसाइट का लिंक दें",
    ],
  },
  {
    id: "whatsapp-catalogue",
    slug: "whatsapp-catalogues-jodhpur",
    en: "WhatsApp product catalogues in Jodhpur",
    hi: "जोधपुर में WhatsApp प्रोडक्ट कैटलॉग",
    audienceEn:
      "For furniture makers, handicraft sellers and retailers who want buyers to browse products before getting in touch.",
    audienceHi:
      "फ़र्नीचर बनाने वालों, हस्तशिल्प विक्रेताओं और रिटेल दुकानों के लिए, जहाँ ग्राहक संपर्क से पहले प्रोडक्ट देखना चाहते हैं।",
    outcomesEn: [
      "Present up to 15 products with supplied images and details",
      "Share one catalogue link with interested customers",
      "Let customers enquire on WhatsApp without a checkout system",
    ],
    outcomesHi: [
      "आपकी फ़ोटो और जानकारी से 15 प्रोडक्ट तक दिखाएँ",
      "इच्छुक ग्राहकों को एक कैटलॉग लिंक भेजें",
      "बिना चेकआउट सिस्टम के WhatsApp पर पूछताछ पाएँ",
    ],
  },
  {
    id: "cleaning",
    slug: "excel-services-jodhpur",
    en: "Excel data cleanup in Jodhpur",
    hi: "जोधपुर में Excel डेटा क्लीनअप",
    audienceEn:
      "For shop owners and office teams working with inconsistent customer, stock or sales spreadsheets.",
    audienceHi:
      "ग्राहक, स्टॉक या बिक्री की अव्यवस्थित स्प्रेडशीट पर काम करने वाली दुकानों और ऑफ़िस टीमों के लिए।",
    outcomesEn: [
      "Standardize agreed text, dates and formatting",
      "Identify duplicates in one workbook",
      "Get a cleaner workbook ready for your next report",
    ],
    outcomesHi: [
      "तय टेक्स्ट, तारीख़ और फ़ॉर्मेट को एक जैसा करें",
      "एक वर्कबुक में डुप्लिकेट पहचानें",
      "अगली रिपोर्ट के लिए साफ़ वर्कबुक पाएँ",
    ],
  },
  {
    id: "qr-menu",
    slug: "qr-menus-jodhpur",
    en: "QR restaurant menus in Jodhpur",
    hi: "जोधपुर में QR रेस्टोरेंट मेन्यू",
    audienceEn:
      "For cafés, restaurants and small hospitality businesses that need an easy-to-read menu on a phone.",
    audienceHi:
      "कैफ़े, रेस्टोरेंट और छोटे हॉस्पिटैलिटी व्यवसायों के लिए, जिन्हें फ़ोन पर आसानी से पढ़ा जाने वाला मेन्यू चाहिए।",
    outcomesEn: [
      "Present up to 20 menu items on one mobile page",
      "Receive a printable QR code linking to your hosted menu",
      "Keep the menu simple, without payments or an ordering backend",
    ],
    outcomesHi: [
      "एक मोबाइल पेज पर 20 मेन्यू आइटम तक दिखाएँ",
      "होस्ट किए मेन्यू के लिए प्रिंट करने योग्य QR कोड पाएँ",
      "भुगतान या ऑर्डरिंग बैकएंड के बिना सरल मेन्यू रखें",
    ],
  },
  {
    id: "maintenance",
    slug: "website-maintenance-jodhpur",
    en: "Website maintenance in Jodhpur",
    hi: "जोधपुर में वेबसाइट मेंटेनेंस",
    audienceEn:
      "For small businesses with an existing website that needs occasional content updates and technical attention.",
    audienceHi:
      "मौजूदा वेबसाइट वाले छोटे व्यवसायों के लिए, जिन्हें समय-समय पर कंटेंट अपडेट और तकनीकी सहायता चाहिए।",
    outcomesEn: [
      "Plan up to one hour of agreed website updates each month",
      "Review small content and contact-link changes",
      "Discuss larger fixes separately before committing to extra work",
    ],
    outcomesHi: [
      "हर माह एक घंटे तक तय वेबसाइट अपडेट की योजना बनाएँ",
      "छोटे कंटेंट और संपर्क लिंक बदलावों की समीक्षा करें",
      "अतिरिक्त काम से पहले बड़े सुधारों पर अलग चर्चा करें",
    ],
  },
] as const;
export function servicePath(lang: string, id: string) {
  const item = servicePages.find((p) => p.id === id);
  return item ? `/${lang}/services/${item.slug}` : null;
}
