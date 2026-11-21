"use client";
import Link from "next/link";
import { useState } from "react";
import { type Lang } from "@/lib/site";
import { quotePath } from "@/lib/growth";

const products = [
  {
    en: "Oak side table",
    hi: "ओक साइड टेबल",
    category: "furniture",
    price: 2400,
    symbol: "▤",
  },
  {
    en: "Woven lounge chair",
    hi: "बुनी हुई लाउंज चेयर",
    category: "furniture",
    price: 4800,
    symbol: "◫",
  },
  {
    en: "Handcrafted cabinet",
    hi: "हस्तनिर्मित कैबिनेट",
    category: "furniture",
    price: 8900,
    symbol: "▥",
  },
  {
    en: "Brass desk lamp",
    hi: "पीतल का डेस्क लैंप",
    category: "decor",
    price: 1600,
    symbol: "◉",
  },
  {
    en: "Ceramic planter",
    hi: "सिरेमिक प्लांटर",
    category: "decor",
    price: 650,
    symbol: "◒",
  },
  {
    en: "Block-print cushion",
    hi: "ब्लॉक प्रिंट कुशन",
    category: "decor",
    price: 450,
    symbol: "▧",
  },
];
const menu = [
  { en: "Masala chai", hi: "मसाला चाय", category: "drinks", price: 40 },
  { en: "Cold coffee", hi: "कोल्ड कॉफ़ी", category: "drinks", price: 120 },
  { en: "Paneer sandwich", hi: "पनीर सैंडविच", category: "food", price: 150 },
  { en: "Vegetable poha", hi: "वेज पोहा", category: "food", price: 80 },
];
const rawRows = [
  { name: "  anita ", product: "Chair", quantity: 2, amount: 4800 },
  { name: "RAHUL", product: "Table", quantity: 1, amount: 2400 },
  { name: "  anita ", product: "Chair", quantity: 2, amount: 4800 },
  { name: " neha  ", product: "Lamp", quantity: 3, amount: 1600 },
];
export default function BusinessDemos({ lang }: { lang: Lang }) {
  const hi = lang === "hi";
  const [search, setSearch] = useState(""),
    [kind, setKind] = useState("all"),
    [chosen, setChosen] = useState(""),
    [menuCategory, setMenuCategory] = useState("all"),
    [clean, setClean] = useState(false),
    [websiteTab, setWebsiteTab] = useState("about"),
    [tasks, setTasks] = useState<string[]>([]);
  const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  const rows = clean
    ? rawRows
        .filter(
          (r, i, a) =>
            a.findIndex((x) => x.name === r.name && x.product === r.product) ===
            i,
        )
        .map((r) => ({
          ...r,
          name: r.name
            .trim()
            .toLowerCase()
            .replace(/^./, (c) => c.toUpperCase()),
        }))
    : rawRows;
  return (
    <>
      <div className="container demo-directory">
        <span>{hi ? "डेमो चुनें" : "Jump to a demo"}</span>
        {[
          ["website", hi ? "वेबसाइट" : "Website"],
          ["catalogue", hi ? "कैटलॉग" : "Catalogue"],
          ["excel", hi ? "Excel" : "Excel"],
          ["menu", hi ? "मेन्यू" : "Menu"],
          ["care", hi ? "केयर" : "Care"],
        ].map(([id, title]) => (
          <a href={`#${id}`} key={id}>
            {title}
          </a>
        ))}
      </div>
      <section className="section" id="catalogue">
        <div className="container">
          <div className="section-head">
            <span className="label">
              {hi ? "रिटेल और हस्तशिल्प" : "RETAIL & HANDICRAFTS"}
            </span>
            <h2>
              {hi ? "आपकी दुकान, अब ऑनलाइन।" : "Your showroom, one link away."}
            </h2>
            <p className="subtitle">
              {hi
                ? "काल्पनिक प्रोडक्ट खोजें, श्रेणी चुनें और पूछताछ बटन आज़माएँ। असली ऑर्डर नहीं भेजा जाएगा।"
                : "Search fictional products, filter a category and try a product enquiry. This demo does not place an order."}
            </p>
          </div>
          <div className="demo-window">
            <div className="demo-topline">
              <b>
                {hi
                  ? "मरुधर स्टूडियो · काल्पनिक दुकान"
                  : "Marudhar Studio · fictional shop"}
              </b>
              <span>{hi ? "डेमो" : "DEMO"}</span>
            </div>
            <div className="demo-toolbar">
              <div className="field">
                <label htmlFor="product-search">
                  {hi ? "प्रोडक्ट खोजें" : "Search products"}
                </label>
                <input
                  id="product-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={hi ? "कुर्सी, टेबल…" : "Table, lamp…"}
                />
              </div>
              <div className="field">
                <label htmlFor="product-category">
                  {hi ? "श्रेणी" : "Category"}
                </label>
                <select
                  id="product-category"
                  value={kind}
                  onChange={(e) => setKind(e.target.value)}
                >
                  <option value="all">
                    {hi ? "सभी प्रोडक्ट" : "All products"}
                  </option>
                  <option value="furniture">
                    {hi ? "फ़र्नीचर" : "Furniture"}
                  </option>
                  <option value="decor">{hi ? "सजावट" : "Decor"}</option>
                </select>
              </div>
            </div>
            <div className="demo-products">
              {products
                .filter(
                  (p) =>
                    (kind === "all" || p.category === kind) &&
                    `${p.en} ${p.hi}`
                      .toLowerCase()
                      .includes(search.toLowerCase()),
                )
                .map((p) => (
                  <article key={p.en} className="demo-product">
                    <div className="product-symbol" aria-hidden="true">
                      {p.symbol}
                    </div>
                    <h3>{hi ? p.hi : p.en}</h3>
                    <p>{money(p.price)}</p>
                    <button
                      className="pill outline"
                      onClick={() => setChosen(hi ? p.hi : p.en)}
                    >
                      {hi ? "पूछताछ का उदाहरण" : "Try enquiry"}
                    </button>
                  </article>
                ))}
            </div>
            {!products.some(
              (p) =>
                (kind === "all" || p.category === kind) &&
                `${p.en} ${p.hi}`.toLowerCase().includes(search.toLowerCase()),
            ) && (
              <p role="status">
                {hi
                  ? "कोई प्रोडक्ट नहीं मिला।"
                  : "No matching products. Try another search."}
              </p>
            )}
            {chosen && (
              <div className="demo-notice" role="status">
                {hi
                  ? `उदाहरण संदेश: नमस्ते, मुझे ${chosen} के बारे में जानकारी चाहिए। कोई संदेश नहीं भेजा गया।`
                  : `Preview message: Hello, I’d like to know more about ${chosen}. No message was sent.`}
              </div>
            )}
          </div>
          <Link
            className="text-link demo-enquire"
            href={quotePath(lang, "whatsapp-catalogue")}
          >
            {hi
              ? "अपना कैटलॉग बनवाएँ · ₹1,999 से"
              : "Get your own catalogue · from ₹1,999"}
          </Link>
        </div>
      </section>
      <section className="section dark-section" id="menu">
        <div className="container demo-split">
          <div className="section-head">
            <span className="label">
              {hi ? "कैफ़े और रेस्टोरेंट" : "CAFÉS & RESTAURANTS"}
            </span>
            <h2>
              {hi
                ? "स्कैन करें। मेन्यू देखें।"
                : "A menu that goes wherever your guests do."}
            </h2>
            <p className="subtitle">
              {hi
                ? "यह एक काल्पनिक डिजिटल मेन्यू है। ग्राहक के फ़ोन पर वही मेन्यू खुलेगा जिसे आप QR कोड से साझा कर सकते हैं।"
                : "Try this fictional digital menu. A QR code supplied with your package can link customers to a menu like this."}
            </p>
            <Link className="pill" href={quotePath(lang, "qr-menu")}>
              {hi ? "अपना QR मेन्यू बनवाएँ" : "Ask about a QR menu"}
            </Link>
          </div>
          <div className="menu-demo">
            <span className="label">
              {hi ? "काल्पनिक कैफ़े · डेमो" : "FICTIONAL CAFÉ · DEMO"}
            </span>
            <h3>Blue Courtyard</h3>
            <p>
              {hi ? "ताज़ा स्वाद। सरल मेन्यू।" : "Fresh flavours. A simpler menu."}
            </p>
            <div className="filters">
              {[
                ["all", hi ? "सभी" : "All"],
                ["food", hi ? "खाना" : "Food"],
                ["drinks", hi ? "पेय" : "Drinks"],
              ].map(([id, title]) => (
                <button
                  className={`filter ${menuCategory === id ? "active" : ""}`}
                  aria-pressed={menuCategory === id}
                  onClick={() => setMenuCategory(id)}
                  key={id}
                >
                  {title}
                </button>
              ))}
            </div>
            {menu
              .filter(
                (x) => menuCategory === "all" || x.category === menuCategory,
              )
              .map((x) => (
                <div className="menu-row" key={x.en}>
                  <span>{hi ? x.hi : x.en}</span>
                  <b>{money(x.price)}</b>
                </div>
              ))}
            <small>
              {hi
                ? "उदाहरण कीमतें; ऑर्डर या भुगतान नहीं लिया जाता।"
                : "Sample prices. No orders or payments are taken."}
            </small>
          </div>
        </div>
      </section>
      <section className="section" id="excel">
        <div className="container">
          <div className="section-head">
            <span className="label">
              {hi ? "Excel और डेटा" : "EXCEL & DATA"}
            </span>
            <h2>
              {hi
                ? "उलझे रिकॉर्ड से साफ़ रिपोर्ट तक।"
                : "Messy records. Clearer decisions."}
            </h2>
            <p className="subtitle">
              {hi
                ? "एक डुप्लिकेट हटाएँ और नामों का फ़ॉर्मेट ठीक करें। सभी रिकॉर्ड काल्पनिक हैं।"
                : "Remove a duplicate and standardize names in this fictional sales sheet."}
            </p>
          </div>
          <div className="demo-window">
            <div className="demo-topline">
              <b>{hi ? "उदाहरण बिक्री रिकॉर्ड" : "Sample sales records"}</b>
              <button className="pill" onClick={() => setClean(!clean)}>
                {clean
                  ? hi
                    ? "मूल डेटा देखें"
                    : "Reset sample"
                  : hi
                    ? "डेटा साफ़ करें"
                    : "Clean sample data"}
              </button>
            </div>
            <div className="comparison-scroll">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>{hi ? "ग्राहक" : "Customer"}</th>
                    <th>{hi ? "प्रोडक्ट" : "Product"}</th>
                    <th>{hi ? "मात्रा" : "Quantity"}</th>
                    <th>{hi ? "प्रति इकाई" : "Unit price"}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      <td style={{ whiteSpace: "pre" }}>{r.name}</td>
                      <td>{r.product}</td>
                      <td>{r.quantity}</td>
                      <td>{money(r.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="demo-notice" role="status">
              {clean
                ? hi
                  ? "एक डुप्लिकेट हटाया गया। तीन नामों का फ़ॉर्मेट ठीक किया गया।"
                  : "One duplicate removed. Three customer names standardized."
                : hi
                  ? "नामों में अतिरिक्त स्पेस और एक डुप्लिकेट है।"
                  : "Extra spaces, inconsistent names and one duplicate row."}
            </p>
          </div>
          <Link
            className="text-link demo-enquire"
            href={quotePath(lang, "cleaning")}
          >
            {hi
              ? "अपने Excel डेटा पर सहायता पाएँ · ₹499 से"
              : "Get help with your Excel data · from ₹499"}
          </Link>
        </div>
      </section>
      <section className="section dark-section" id="website">
        <div className="container demo-split">
          <div className="section-head">
            <span className="label">
              {hi ? "बिज़नेस वेबसाइट" : "BUSINESS WEBSITE"}
            </span>
            <h2>
              {hi
                ? "पहली मुलाक़ात को बेहतर बनाइए।"
                : "Make a useful first impression."}
            </h2>
            <p className="subtitle">
              {hi
                ? "आपकी सेवाएँ, परिचय और पूछताछ लिंक एक मोबाइल-अनुकूल पेज में। नीचे का व्यवसाय काल्पनिक है।"
                : "Introduce your services and give customers a clear way to enquire. The sample business below is fictional."}
            </p>
            <Link className="pill" href={quotePath(lang, "landing")}>
              {hi
                ? "वेबसाइट पर बात करें · ₹3,999 से"
                : "Discuss a website · from ₹3,999"}
            </Link>
          </div>
          <div className="website-demo">
            <div className="demo-topline">
              <b>Maru Interiors</b>
              <span>DEMO</span>
            </div>
            <h3>
              {hi ? "आपकी जगह। आपकी पहचान।" : "Spaces with a sense of you."}
            </h3>
            <div className="filters">
              {[
                ["about", hi ? "परिचय" : "About"],
                ["services", hi ? "सेवाएँ" : "Services"],
                ["contact", hi ? "संपर्क" : "Contact"],
              ].map(([id, title]) => (
                <button
                  className={`filter ${websiteTab === id ? "active" : ""}`}
                  onClick={() => setWebsiteTab(id)}
                  aria-pressed={websiteTab === id}
                  key={id}
                >
                  {title}
                </button>
              ))}
            </div>
            <div className="website-panel" aria-live="polite">
              {websiteTab === "about" ? (
                <p>
                  {hi
                    ? "एक काल्पनिक इंटीरियर स्टूडियो का परिचय। अपने असली व्यवसाय की कहानी यहाँ साझा करें।"
                    : "A fictional interiors studio. Your website can tell your real business story here."}
                </p>
              ) : websiteTab === "services" ? (
                <ul>
                  <li>{hi ? "घर की स्टाइलिंग" : "Home styling"}</li>
                  <li>{hi ? "फ़र्नीचर की योजना" : "Furniture planning"}</li>
                  <li>{hi ? "वर्कस्पेस डिज़ाइन" : "Workspace design"}</li>
                </ul>
              ) : (
                <p>
                  {hi
                    ? "आपके प्रोजेक्ट में यहाँ आपका वास्तविक फ़ोन, पता और पूछताछ लिंक होगा। इस डेमो में ग्राहक की जानकारी नहीं ली जाती।"
                    : "Your real phone number, location and enquiry link would go here. This fictional demo does not collect customer details."}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="section" id="care">
        <div className="container demo-split">
          <div className="section-head">
            <span className="label">{hi ? "वेबसाइट केयर" : "WEBSITE CARE"}</span>
            <h2>
              {hi ? "लॉन्च के बाद भी साथ।" : "A little care, after launch."}
            </h2>
            <p className="subtitle">
              {hi
                ? "एक उदाहरण केयर चेकलिस्ट आज़माएँ। यह आपकी असली वेबसाइट को स्कैन या बदलती नहीं है। बेसिक प्लान में हर माह एक घंटे तक काम शामिल है।"
                : "Try an example care checklist. It does not scan or change your website. The basic plan includes up to one hour of work per month."}
            </p>
            <Link className="pill" href={quotePath(lang, "maintenance")}>
              {hi
                ? "केयर प्लान · ₹999 / माह से"
                : "Care plans · from ₹999 / month"}
            </Link>
          </div>
          <div className="care-demo">
            <h3>
              {hi ? "इस महीने की उदाहरण चेकलिस्ट" : "Example monthly checklist"}
            </h3>
            {[
              ["content", hi ? "कंटेंट अपडेट की समीक्षा" : "Review content updates"],
              ["links", hi ? "संपर्क लिंक की जाँच" : "Check contact links"],
              [
                "dependencies",
                hi ? "डिपेंडेंसी अपडेट की समीक्षा" : "Review dependency updates",
              ],
            ].map(([id, title]) => (
              <label key={id}>
                <input
                  type="checkbox"
                  checked={tasks.includes(id)}
                  onChange={(e) =>
                    setTasks(
                      e.target.checked
                        ? [...tasks, id]
                        : tasks.filter((x) => x !== id),
                    )
                  }
                />
                {title}
              </label>
            ))}
            <progress
              max={3}
              value={tasks.length}
              aria-label={
                hi ? "डेमो चेकलिस्ट की प्रगति" : "Demo checklist progress"
              }
            />
            <p role="status">
              {tasks.length} / 3 {hi ? "डेमो काम चुने गए" : "sample tasks checked"}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
