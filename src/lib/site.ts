export const site = {
  brand: "Silio",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  phone: "9943969595",
  whatsapp: "919943969595",
  location: "Online & remote collaboration",
};
export type ServicePackage = {
  id: string;
  en: string;
  hi: string;
  price: number;
  detailEn: string;
  detailHi: string;
  cat: string;
  monthly?: boolean;
  quoteOnly?: boolean;
  unit?: "gram";
  minimum?: number;
};
export const prices: readonly ServicePackage[] = [
  {
    id: "cleaning",
    en: "Excel cleaning & formatting",
    hi: "एक्सेल डेटा क्लीनिंग और फॉर्मेटिंग",
    price: 499,
    detailEn: "One workbook, up to 5,000 rows; basic cleanup.",
    detailHi: "एक वर्कबुक, 5,000 पंक्तियों तक; सामान्य सफाई।",
    cat: "data",
  },
  {
    id: "charts",
    en: "Excel charts & reports",
    hi: "एक्सेल चार्ट और रिपोर्ट",
    price: 999,
    detailEn: "Up to 5 charts and one summary report.",
    detailHi: "5 चार्ट तक और एक सारांश रिपोर्ट।",
    cat: "data",
  },
  {
    id: "dashboard",
    en: "Excel dashboard",
    hi: "एक्सेल डैशबोर्ड",
    price: 1999,
    detailEn: "One dashboard with up to 5 KPIs.",
    detailHi: "5 KPI तक का एक डैशबोर्ड।",
    cat: "data",
  },
  {
    id: "large-data",
    en: "Large dataset processing",
    hi: "बड़े डेटासेट की प्रोसेसिंग",
    price: 2999,
    detailEn: "Basic processing of up to 100,000 rows; complexity reviewed.",
    detailHi: "1 लाख पंक्तियों तक की सामान्य प्रोसेसिंग; जटिलता की जाँच होगी।",
    cat: "data",
  },
  {
    id: "automation",
    en: "Excel workflow automation",
    hi: "एक्सेल वर्कफ़्लो ऑटोमेशन",
    price: 2499,
    detailEn: "One simple repeatable task or script.",
    detailHi: "एक सामान्य दोहराया जाने वाला काम या स्क्रिप्ट।",
    cat: "data",
  },
  {
    id: "landing",
    en: "One-page business website",
    hi: "एक पेज की बिज़नेस वेबसाइट",
    price: 3999,
    detailEn: "Responsive landing page, contact links, one revision.",
    detailHi: "मोबाइल-अनुकूल लैंडिंग पेज, संपर्क लिंक, एक संशोधन।",
    cat: "web",
  },
  {
    id: "business",
    en: "Business website (up to 5 pages)",
    hi: "बिज़नेस वेबसाइट (5 पेज तक)",
    price: 7999,
    detailEn: "Template-based site, basic SEO, enquiry form.",
    detailHi: "टेम्पलेट आधारित साइट, बेसिक SEO, पूछताछ फ़ॉर्म।",
    cat: "web",
  },
  {
    id: "catalogue",
    en: "E-commerce catalogue",
    hi: "ई-कॉमर्स कैटलॉग",
    price: 9999,
    detailEn: "Product listing and WhatsApp enquiry; no checkout.",
    detailHi: "प्रोडक्ट लिस्ट और WhatsApp पूछताछ; भुगतान चेकआउट नहीं।",
    cat: "web",
  },
  {
    id: "webapp",
    en: "Custom web-app prototype",
    hi: "कस्टम वेब ऐप प्रोटोटाइप",
    price: 14999,
    detailEn: "Small scoped MVP with one core workflow.",
    detailHi: "एक मुख्य वर्कफ़्लो वाला छोटा MVP।",
    cat: "webapps",
  },
  {
    id: "android",
    en: "Android app prototype",
    hi: "एंड्रॉइड ऐप प्रोटोटाइप",
    price: 9999,
    detailEn: "Up to 5 basic screens; no complex backend.",
    detailHi: "5 सामान्य स्क्रीन तक; जटिल बैकएंड नहीं।",
    cat: "mobile",
  },
  {
    id: "cross-platform",
    en: "Android + iOS MVP",
    hi: "एंड्रॉइड + iOS MVP",
    price: 24999,
    detailEn: "One simple cross-platform flow; store fees extra.",
    detailHi: "एक सामान्य क्रॉस-प्लेटफ़ॉर्म फ़्लो; स्टोर फ़ीस अलग।",
    cat: "mobile",
  },
  {
    id: "design",
    en: "UI/UX design",
    hi: "UI/UX डिज़ाइन",
    price: 2999,
    detailEn: "Up to 5 screens and one revision.",
    detailHi: "5 स्क्रीन और एक संशोधन तक।",
    cat: "design",
  },
  {
    id: "ai",
    en: "AI/ML proof of concept",
    hi: "AI/ML प्रूफ़ ऑफ़ कॉन्सेप्ट",
    price: 7999,
    detailEn: "Feasibility demo using available data or APIs.",
    detailHi: "उपलब्ध डेटा या API से व्यवहार्यता डेमो।",
    cat: "other",
  },
  {
    id: "saas",
    en: "SaaS MVP",
    hi: "SaaS MVP",
    price: 29999,
    detailEn: "One simple multi-user SaaS workflow.",
    detailHi: "एक सामान्य मल्टी-यूज़र SaaS वर्कफ़्लो।",
    cat: "webapps",
  },
  {
    id: "mentoring",
    en: "Student project mentoring",
    hi: "स्टूडेंट प्रोजेक्ट मार्गदर्शन",
    price: 1999,
    detailEn: "Guidance, debugging and review; not done-for-you submissions.",
    detailHi: "मार्गदर्शन, डिबगिंग और समीक्षा; तैयार असाइनमेंट जमा करना नहीं।",
    cat: "other",
  },
  {
    id: "deployment",
    en: "Domain & deployment setup",
    hi: "डोमेन और डिप्लॉयमेंट सेटअप",
    price: 999,
    detailEn: "Configuration only; domain/hosting fees extra.",
    detailHi: "केवल सेटअप; डोमेन/होस्टिंग शुल्क अलग।",
    cat: "support",
  },
  {
    id: "maintenance",
    monthly: true,
    en: "Website care plan",
    hi: "वेबसाइट केयर प्लान",
    price: 999,
    detailEn: "Basic updates up to 1 hour/month; hosting extra.",
    detailHi: "महीने में 1 घंटे तक सामान्य अपडेट; होस्टिंग अलग।",
    cat: "support",
  },
  {
    id: "whatsapp-catalogue",
    en: "WhatsApp product catalogue",
    hi: "WhatsApp प्रोडक्ट कैटलॉग",
    price: 1999,
    detailEn:
      "Up to 15 products, one category and WhatsApp enquiries; no payments.",
    detailHi: "15 प्रोडक्ट, एक श्रेणी और WhatsApp पूछताछ; ऑनलाइन भुगतान नहीं।",
    cat: "shops",
  },
  {
    id: "qr-menu",
    en: "QR restaurant menu",
    hi: "QR रेस्टोरेंट मेन्यू",
    price: 999,
    detailEn:
      "One mobile menu, up to 20 items and a printable QR code; no ordering backend.",
    detailHi:
      "एक मोबाइल मेन्यू, 20 आइटम और प्रिंट करने योग्य QR कोड; ऑर्डरिंग बैकएंड नहीं।",
    cat: "shops",
  },
  {
    id: "inventory",
    en: "Stock & inventory tracker",
    hi: "स्टॉक और इन्वेंटरी ट्रैकर",
    price: 2999,
    detailEn:
      "One spreadsheet, up to 100 products, stock-in/out and low-stock flags.",
    detailHi: "एक स्प्रेडशीट, 100 प्रोडक्ट, स्टॉक की एंट्री और कम स्टॉक का संकेत।",
    cat: "shops",
  },
  {
    id: "sales",
    en: "Sales & billing dashboard",
    hi: "बिक्री और बिलिंग डैशबोर्ड",
    price: 4999,
    detailEn:
      "One sales dashboard from your existing records; not tax-filing software.",
    detailHi: "मौजूदा रिकॉर्ड से एक बिक्री डैशबोर्ड; टैक्स फाइलिंग सॉफ्टवेयर नहीं।",
    cat: "shops",
  },
  {
    id: "shop-website",
    en: "WhatsApp ordering website",
    hi: "WhatsApp ऑर्डरिंग वेबसाइट",
    price: 7999,
    detailEn:
      "Up to 30 products, category filters and orders sent to WhatsApp; no payment gateway.",
    detailHi: "30 प्रोडक्ट, श्रेणी फ़िल्टर और WhatsApp पर ऑर्डर; पेमेंट गेटवे नहीं।",
    cat: "shops",
  },
  {
    id: "booking",
    en: "Appointment & booking setup",
    hi: "अपॉइंटमेंट और बुकिंग सेटअप",
    price: 4999,
    detailEn:
      "One service calendar and booking enquiry flow; third-party subscriptions extra.",
    detailHi: "एक सेवा कैलेंडर और बुकिंग पूछताछ फ़्लो; अन्य सब्सक्रिप्शन अलग।",
    cat: "business",
  },
  {
    id: "crm",
    en: "Customer & follow-up tracker",
    hi: "ग्राहक और फ़ॉलो-अप ट्रैकर",
    price: 7999,
    detailEn:
      "One small-team lead pipeline with five statuses; integrations quoted separately.",
    detailHi: "छोटी टीम के लिए पाँच स्थितियों वाला एक लीड ट्रैकर; इंटीग्रेशन अलग।",
    cat: "business",
  },
  {
    id: "attendance",
    en: "Employee attendance dashboard",
    hi: "कर्मचारी उपस्थिति डैशबोर्ड",
    price: 2999,
    detailEn:
      "One spreadsheet for up to 20 employees; no biometrics or payroll.",
    detailHi: "20 कर्मचारियों तक के लिए एक स्प्रेडशीट; बायोमेट्रिक या पेरोल नहीं।",
    cat: "business",
  },
  {
    id: "quotation",
    en: "Invoice & quotation templates",
    hi: "इनवॉइस और कोटेशन टेम्पलेट",
    price: 2999,
    detailEn:
      "Two editable templates with basic calculations; tax requirements reviewed separately.",
    detailHi: "बेसिक गणना के साथ दो एडिटेबल टेम्पलेट; टैक्स ज़रूरतों की अलग समीक्षा।",
    cat: "business",
  },
  {
    id: "workflow",
    en: "Custom business workflow",
    hi: "कस्टम बिज़नेस वर्कफ़्लो",
    price: 14999,
    detailEn:
      "One scoped internal workflow prototype; roles and data needs reviewed before a quote.",
    detailHi: "एक सीमित आंतरिक वर्कफ़्लो प्रोटोटाइप; भूमिका और डेटा ज़रूरतें पहले तय होंगी।",
    cat: "business",
  },
  {
    id: "social-design",
    en: "Social media post design",
    hi: "सोशल मीडिया पोस्ट डिज़ाइन",
    price: 999,
    detailEn:
      "Three static posts in one size with one revision; publishing not included.",
    detailHi: "एक साइज़ में तीन स्टैटिक पोस्ट और एक संशोधन; पब्लिशिंग शामिल नहीं।",
    cat: "marketing",
  },
  {
    id: "social-setup",
    en: "Instagram & Facebook setup",
    hi: "Instagram और Facebook सेटअप",
    price: 1499,
    detailEn:
      "Two business profiles, supplied branding and basic setup; account access required.",
    detailHi: "दो बिज़नेस प्रोफ़ाइल, आपकी ब्रांडिंग और बेसिक सेटअप; अकाउंट एक्सेस ज़रूरी।",
    cat: "marketing",
  },
  {
    id: "ads",
    en: "Google Ads campaign setup",
    hi: "Google Ads कैंपेन सेटअप",
    price: 2999,
    detailEn:
      "One search campaign and up to five keywords; ad spend extra, no results guarantee.",
    detailHi: "एक सर्च कैंपेन और पाँच कीवर्ड; विज्ञापन खर्च अलग, परिणाम की गारंटी नहीं।",
    cat: "marketing",
  },
  {
    id: "local-seo",
    en: "Local SEO essentials",
    hi: "लोकल SEO सेटअप",
    price: 2999,
    detailEn:
      "Metadata and local content review for up to five pages; no ranking guarantee.",
    detailHi: "पाँच पेज तक मेटाडेटा और स्थानीय कंटेंट की समीक्षा; रैंकिंग की गारंटी नहीं।",
    cat: "marketing",
  },
  {
    id: "promo",
    en: "Promotional landing page",
    hi: "प्रमोशनल लैंडिंग पेज",
    price: 3999,
    detailEn:
      "One campaign page with an enquiry CTA and supplied copy; ad spend extra.",
    detailHi: "आपके कंटेंट के साथ एक कैंपेन पेज और पूछताछ लिंक; विज्ञापन खर्च अलग।",
    cat: "marketing",
  },
  {
    id: "business-profile",
    en: "Google Business Profile assistance",
    hi: "Google Business Profile सहायता",
    price: 999,
    detailEn:
      "Eligibility review and setup assistance for one eligible business; verification is controlled by Google.",
    detailHi:
      "एक पात्र व्यवसाय की पात्रता समीक्षा और सेटअप सहायता; वेरिफ़िकेशन Google करता है।",
    cat: "marketing",
  },
  {
    id: "chatbot",
    en: "Website FAQ chatbot",
    hi: "वेबसाइट FAQ चैटबॉट",
    price: 4999,
    detailEn:
      "One website, up to 30 approved FAQs; API usage and hosting extra.",
    detailHi: "एक वेबसाइट और 30 स्वीकृत सवाल-जवाब; API और होस्टिंग अलग।",
    cat: "automation",
  },
  {
    id: "scheduled-reports",
    en: "Automated Excel / CSV reports",
    hi: "ऑटोमेटेड Excel / CSV रिपोर्ट",
    price: 2999,
    detailEn: "One repeatable report from one consistent input format.",
    detailHi: "एक निश्चित इनपुट फ़ॉर्मेट से एक दोहराने योग्य रिपोर्ट।",
    cat: "automation",
  },
  {
    id: "pdf-excel",
    en: "PDF-to-Excel processing",
    hi: "PDF से Excel प्रोसेसिंग",
    price: 2999,
    detailEn:
      "Up to 20 text-based pages using one layout; scanned-document OCR quoted separately.",
    detailHi: "एक लेआउट में 20 टेक्स्ट-आधारित पेज; स्कैन किए पेज की OCR अलग।",
    cat: "automation",
  },
  {
    id: "lead-classification",
    en: "Lead & enquiry classification",
    hi: "लीड और पूछताछ वर्गीकरण",
    price: 4999,
    detailEn:
      "One classification flow with up to five categories; human review and API costs extra.",
    detailHi: "पाँच श्रेणियों तक एक वर्गीकरण फ़्लो; मानवीय समीक्षा और API खर्च अलग।",
    cat: "automation",
  },
  {
    id: "product-copy",
    en: "AI-assisted product descriptions",
    hi: "AI की मदद से प्रोडक्ट विवरण",
    price: 2999,
    detailEn:
      "Draft descriptions for up to 30 products using supplied facts; client review required.",
    detailHi: "आपकी जानकारी से 30 प्रोडक्ट विवरण के ड्राफ़्ट; आपकी समीक्षा ज़रूरी।",
    cat: "automation",
  },
  {
    id: "knowledge",
    en: "Internal document search prototype",
    hi: "आंतरिक डॉक्यूमेंट सर्च प्रोटोटाइप",
    price: 14999,
    detailEn:
      "Up to 50 non-sensitive documents; access controls, hosting and API costs reviewed separately.",
    detailHi: "50 गैर-संवेदनशील डॉक्यूमेंट तक; एक्सेस, होस्टिंग और API की अलग समीक्षा।",
    cat: "automation",
  },
  {
    id: "email-setup",
    en: "Business email configuration",
    hi: "बिज़नेस ईमेल कॉन्फ़िगरेशन",
    price: 999,
    detailEn:
      "One domain and up to two mailboxes; mailbox and domain fees extra.",
    detailHi: "एक डोमेन और दो मेलबॉक्स तक; मेलबॉक्स और डोमेन फ़ीस अलग।",
    cat: "support",
  },
  {
    id: "performance",
    en: "Website performance review",
    hi: "वेबसाइट परफ़ॉर्मेंस समीक्षा",
    price: 1999,
    detailEn:
      "Review up to five pages and implement up to three agreed front-end improvements.",
    detailHi: "पाँच पेज की समीक्षा और तीन तय फ़्रंटएंड सुधार।",
    cat: "support",
  },
  {
    id: "care-plus",
    en: "Website care plus / month",
    hi: "वेबसाइट केयर प्लस / माह",
    price: 2999,
    detailEn:
      "Up to three hours of updates, backup checks and dependency review per month; hosting and recovery extra.",
    detailHi:
      "हर माह तीन घंटे तक अपडेट, बैकअप जाँच और डिपेंडेंसी समीक्षा; होस्टिंग और रिकवरी अलग।",
    cat: "support",
    monthly: true,
  },
  {
    id: "cad-design",
    en: "Basic CAD modeling",
    hi: "बेसिक CAD मॉडलिंग",
    price: 499,
    detailEn:
      "One simple part from supplied dimensions, one revision and an agreed export format; printing extra.",
    detailHi:
      "आपके माप से एक सरल पार्ट, एक संशोधन और तय एक्सपोर्ट फ़ॉर्मेट; प्रिंटिंग अलग।",
    cat: "3d",
  },
  {
    id: "stl-repair",
    en: "STL file repair",
    hi: "STL फ़ाइल रिपेयर",
    price: 299,
    detailEn:
      "One existing mesh with basic hole or normal repair; complex reconstruction quoted separately.",
    detailHi:
      "एक मौजूदा मेश में बेसिक होल या नॉर्मल रिपेयर; जटिल पुनर्निर्माण का अलग कोटेशन।",
    cat: "3d",
  },
  {
    id: "enclosure-design",
    en: "Electronics enclosure design",
    hi: "इलेक्ट्रॉनिक्स एनक्लोज़र डिज़ाइन",
    price: 999,
    detailEn:
      "One simple enclosure with supplied board dimensions and agreed connector cut-outs; printing and fit iterations extra.",
    detailHi:
      "बोर्ड के माप और तय कनेक्टर कट-आउट के साथ एक सरल बॉक्स; प्रिंट और फ़िट संशोधन अलग।",
    cat: "3d",
  },
  {
    id: "pla-printing",
    en: "PLA FDM 3D printing",
    hi: "PLA FDM 3D प्रिंटिंग",
    price: 5,
    unit: "gram",
    minimum: 299,
    detailEn:
      "Indicative PLA rate per gram of sliced material including supports; ₹299 minimum print charge. Feasibility, machine time and finish reviewed before confirmation.",
    detailHi:
      "सपोर्ट सहित स्लाइस किए गए PLA मटेरियल का सांकेतिक प्रति ग्राम रेट; न्यूनतम प्रिंट शुल्क ₹299। पुष्टि से पहले फ़ीज़िबिलिटी, मशीन समय और फ़िनिश की समीक्षा होगी।",
    cat: "3d",
  },
  {
    id: "prototype",
    en: "Custom physical prototypes",
    hi: "कस्टम भौतिक प्रोटोटाइप",
    price: 1499,
    detailEn:
      "One simple concept development scope; design, print material, finishing and delivery itemized in the final quote.",
    detailHi:
      "एक सरल कॉन्सेप्ट डेवलपमेंट स्कोप; डिज़ाइन, प्रिंट मटेरियल, फ़िनिशिंग और डिलीवरी अंतिम कोटेशन में अलग होंगे।",
    cat: "3d",
  },
  {
    id: "batch-printing",
    en: "Small-batch 3D printing",
    hi: "छोटे बैच की 3D प्रिंटिंग",
    price: 0,
    quoteOnly: true,
    detailEn:
      "A custom quote after file review, quantity, material and sample approval; production arranged through an external provider.",
    detailHi:
      "फ़ाइल, मात्रा, मटेरियल और सैंपल स्वीकृति के बाद कस्टम कोटेशन; उत्पादन बाहरी प्रदाता से तय होगा।",
    cat: "3d",
  },
  {
    id: "architectural-models",
    en: "Architectural & educational models",
    hi: "आर्किटेक्चरल और शैक्षिक मॉडल",
    price: 0,
    quoteOnly: true,
    detailEn:
      "Non-functional display or learning models quoted by dimensions, scale, detail and finishing.",
    detailHi:
      "आकार, स्केल, डिटेल और फ़िनिशिंग के अनुसार डिस्प्ले या शैक्षिक गैर-कार्यात्मक मॉडल का कोटेशन।",
    cat: "3d",
  },
];
export type Lang = "en" | "hi";
export const messages = {
  en: {
    navHome: "Home",
    navServices: "Services",
    navPricing: "Pricing",
    navContact: "Contact",
    navConnect: "Connect",
    navAbout: "About",
    estimate: "Get a quote",
    eyebrow: "Built for growing businesses",
    heroA: "Grow your business.",
    heroB: "Keep it simple.",
    heroDesc:
      "Website, web application and mobile app development for businesses of all sizes. Build your online presence, improve workflows and reach customers on the devices they use.",
    heroCta: "Start your project",
    heroAlt: "Explore services",
    stats1: "Transparent starting prices",
    stats2: "English & Hindi support",
    stats3: "Built around your business",
    servicesLabel: "WHAT WE DO",
    servicesTitle: "Websites. Web applications. Mobile apps.",
    servicesDesc:
      "Our core focus is building useful digital products for your business. UI/UX, 3D design and printing, data and other specialist services are available as additional support.",
    service1: "Website Development",
    desc1:
      "Responsive business websites, landing pages and product catalogues that clearly introduce your business.",
    service2: "Web Application Development",
    desc2:
      "Scoped web applications, portals and SaaS MVPs built around your users and business workflows.",
    service3: "Mobile App Development",
    desc3:
      "Android and cross-platform app MVPs, with clear screen, feature and backend requirements agreed first.",
    service4: "Website Care & Support",
    desc4:
      "Keep your website current with scoped updates, deployment and ongoing support.",
    pricingTitle: "Small packages. Clear starting prices.",
    pricingDesc:
      "Starter packages for defined scopes. Complex requirements receive a custom quote.",
    from: "Starting at",
    viewAll: "View all packages",
    processLabel: "OUR APPROACH",
    processTitle: "Simple process, from idea to launch.",
    process1: "Tell us the problem",
    process1Desc: "Message us about your project and objectives.",
    process2: "Agree on scope & price",
    process2Desc: "We confirm features, timeline and deliverables.",
    process3: "Build, test & launch",
    process3Desc: "We develop, review and help publish your solution.",
    contactTitle: "Have a project in mind?",
    contactDesc:
      "Tell us what you need. We will help find an affordable, practical way to build it.",
    contactButton: "Talk on WhatsApp",
    areas: "Working with businesses, founders and teams remotely",
    footer: "Digital solutions for real-world problems.",
    disclaimer:
      "Prices are starting estimates for limited-scope work. Domain, hosting, APIs, taxes and third-party fees are extra where applicable.",
    servicesPageTitle: "Websites, web applications & mobile apps.",
    servicesPageDesc:
      "Website, web application and mobile app development are our main services. Explore UI/UX, 3D design and printing, and other additional services below.",
    pricingPageTitle: "Straightforward freelance pricing",
    pricingPageDesc:
      "Transparent introductory packages. See scope limits before enquiring.",
    contactPageTitle: "Let’s build something useful.",
    contactPageDesc:
      "Share your requirements to request a personalized estimate.",
    name: "Your name",
    email: "Email address",
    phone: "Phone number",
    service: "Service interested in",
    budget: "Approximate budget (optional)",
    message: "Tell us about the project",
    send: "Send enquiry",
    waDirect: "Or chat directly on WhatsApp",
    submitSuccess:
      "Enquiry sent. We will respond using the details you provided.",
    submitFail:
      "Your enquiry could not be received right now. Please try again or contact us on WhatsApp.",
    privacy: "Privacy",
    privacyHeading: "Privacy Policy",
    privacyBody:
      "We use enquiry details only to communicate about your request and prepare project estimates. We do not sell your contact details. Avoid sending passwords or sensitive records in a public enquiry. Contact us to request deletion of enquiry data.",
    rights: "All rights reserved.",
    empty: "Please complete the required fields.",
    response: "Usually responds after reviewing the project details.",
    category: "All services",
    aboutTitle: "Digital work that moves your business forward.",
    aboutBody:
      "Silio focuses on website, web application and mobile app development for businesses, shops and founders. We also offer UI/UX, CAD design, data solutions and other supporting services.",
  },
  hi: {
    navHome: "होम",
    navServices: "सेवाएँ",
    navPricing: "कीमतें",
    navContact: "संपर्क",
    navConnect: "जुड़ें",
    navAbout: "हमारे बारे में",
    estimate: "कोटेशन पाएँ",
    eyebrow: "बढ़ते व्यवसायों के लिए",
    heroA: "अपने बिज़नेस को",
    heroB: "डिजिटल बनाइए।",
    heroDesc:
      "हर तरह के व्यवसायों के लिए वेबसाइट, वेब एप्लिकेशन और मोबाइल ऐप डेवलपमेंट। ऑनलाइन उपस्थिति बनाएँ, काम के तरीके बेहतर करें और ग्राहकों तक उनके डिवाइस पर पहुँचें।",
    heroCta: "अपना प्रोजेक्ट शुरू करें",
    heroAlt: "सेवाएँ देखें",
    stats1: "स्पष्ट शुरुआती कीमतें",
    stats2: "हिंदी और अंग्रेज़ी सहायता",
    stats3: "आपके व्यवसाय की ज़रूरतों के अनुसार",
    servicesLabel: "हमारी सेवाएँ",
    servicesTitle: "वेबसाइट। वेब एप्लिकेशन। मोबाइल ऐप।",
    servicesDesc:
      "हमारा मुख्य ध्यान आपके व्यवसाय के लिए उपयोगी डिजिटल प्रोडक्ट बनाना है। UI/UX, 3D डिज़ाइन और प्रिंटिंग, डेटा और अन्य विशेषज्ञ सेवाएँ अतिरिक्त सहायता के रूप में उपलब्ध हैं।",
    service1: "वेबसाइट डेवलपमेंट",
    desc1:
      "मोबाइल-अनुकूल बिज़नेस वेबसाइट, लैंडिंग पेज और प्रोडक्ट कैटलॉग जो आपके काम को स्पष्ट रूप से दिखाएँ।",
    service2: "वेब एप्लिकेशन डेवलपमेंट",
    desc2:
      "आपके यूज़र और बिज़नेस वर्कफ़्लो के अनुसार सीमित दायरे के वेब एप्लिकेशन, पोर्टल और SaaS MVP।",
    service3: "मोबाइल ऐप डेवलपमेंट",
    desc3:
      "Android और क्रॉस-प्लेटफ़ॉर्म ऐप MVP, जिनकी स्क्रीन, सुविधाएँ और बैकएंड ज़रूरतें पहले स्पष्ट रूप से तय हों।",
    service4: "वेबसाइट केयर और सहायता",
    desc4: "सीमित अपडेट, डिप्लॉयमेंट और नियमित सहायता से वेबसाइट को अपडेट रखें।",
    pricingTitle: "स्पष्ट शुरुआती कीमतें।",
    pricingDesc: "सीमित काम के लिए शुरुआती पैकेज; बड़े प्रोजेक्ट पर अलग कोटेशन।",
    from: "शुरुआती कीमत",
    viewAll: "सभी पैकेज देखें",
    processLabel: "हम कैसे काम करते हैं",
    processTitle: "आइडिया से लॉन्च तक आसान प्रक्रिया।",
    process1: "अपनी ज़रूरत बताइए",
    process1Desc: "अपने प्रोजेक्ट और लक्ष्य की जानकारी दें।",
    process2: "काम और कीमत तय करें",
    process2Desc: "फीचर, समय और डिलीवरी पहले तय होगी।",
    process3: "बनाएँ, जाँचें, लॉन्च करें",
    process3Desc: "हम डेवलपमेंट, टेस्टिंग और पब्लिशिंग में मदद करेंगे।",
    contactTitle: "कोई प्रोजेक्ट है?",
    contactDesc: "हमें अपनी ज़रूरत बताएँ। हम किफ़ायती और व्यावहारिक समाधान ढूँढेंगे।",
    contactButton: "WhatsApp पर बात करें",
    areas: "व्यवसायों, संस्थापकों और टीमों के लिए ऑनलाइन सेवाएँ",
    footer: "वास्तविक समस्याओं के लिए डिजिटल समाधान।",
    disclaimer:
      "ये सीमित काम की शुरुआती कीमतें हैं। डोमेन, होस्टिंग, API, टैक्स और अन्य शुल्क अलग हो सकते हैं।",
    servicesPageTitle: "वेबसाइट, वेब एप्लिकेशन और मोबाइल ऐप।",
    servicesPageDesc:
      "वेबसाइट, वेब एप्लिकेशन और मोबाइल ऐप डेवलपमेंट हमारी मुख्य सेवाएँ हैं। नीचे UI/UX, 3D डिज़ाइन और प्रिंटिंग तथा अन्य अतिरिक्त सेवाएँ भी देखें।",
    pricingPageTitle: "सरल फ्रीलांस प्राइसिंग",
    pricingPageDesc: "पारदर्शी शुरुआती पैकेज। पूछताछ से पहले सीमाएँ पढ़ें।",
    contactPageTitle: "मिलकर कुछ उपयोगी बनाएँ।",
    contactPageDesc: "अपनी ज़रूरत बताकर व्यक्तिगत कोटेशन पाएँ।",
    name: "आपका नाम",
    email: "ईमेल",
    phone: "फ़ोन नंबर",
    service: "कौन सी सेवा चाहिए",
    budget: "अनुमानित बजट (वैकल्पिक)",
    message: "अपने प्रोजेक्ट के बारे में बताएँ",
    send: "पूछताछ भेजें",
    waDirect: "या WhatsApp पर सीधे बात करें",
    submitSuccess: "पूछताछ भेज दी गई है। हम दिए गए संपर्क पर जवाब देंगे।",
    submitFail:
      "अभी आपकी पूछताछ प्राप्त नहीं हो सकी। फिर से कोशिश करें या WhatsApp पर संपर्क करें।",
    privacy: "गोपनीयता नीति",
    privacyHeading: "गोपनीयता नीति",
    privacyBody:
      "पूछताछ में दी गई जानकारी का उपयोग केवल आपसे संपर्क और कोटेशन तैयार करने के लिए होगा। हम आपका संपर्क डेटा नहीं बेचते। सार्वजनिक फ़ॉर्म में पासवर्ड या संवेदनशील रिकॉर्ड न भेजें। डेटा हटाने के लिए हमसे संपर्क करें।",
    rights: "सर्वाधिकार सुरक्षित।",
    empty: "कृपया आवश्यक जानकारी भरें।",
    response: "प्रोजेक्ट की जानकारी देखने के बाद जवाब दिया जाता है।",
    category: "सभी सेवाएँ",
    aboutTitle: "आपके व्यवसाय को आगे बढ़ाने वाले डिजिटल समाधान।",
    aboutBody:
      "Silio व्यवसायों, दुकानों और संस्थापकों के लिए वेबसाइट, वेब एप्लिकेशन और मोबाइल ऐप डेवलपमेंट पर केंद्रित है। हम UI/UX, CAD डिज़ाइन, डेटा समाधान और अन्य सहायक सेवाएँ भी देते हैं।",
  },
} as const;
export function langValid(input: string): input is Lang {
  return input === "en" || input === "hi";
}
export function waLink(text: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}
