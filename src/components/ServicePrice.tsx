import type { Lang, ServicePackage } from "@/lib/site";
export default function ServicePrice({
  item,
  lang,
}: {
  item: ServicePackage;
  lang: Lang;
}) {
  const hi = lang === "hi";
  return (
    <>
      <div className={`amount ${item.quoteOnly ? "quote-amount" : ""}`}>
        {item.quoteOnly ? (
          hi ? (
            "कस्टम कोटेशन"
          ) : (
            "Custom quote"
          )
        ) : (
          <>
            ₹{item.price.toLocaleString("en-IN")}
            {(item.monthly || item.unit) && (
              <span className="price-period">
                {item.unit
                  ? hi
                    ? " / ग्राम"
                    : " / gram"
                  : hi
                    ? " / माह"
                    : " / mo"}
              </span>
            )}
          </>
        )}
      </div>
      {item.minimum && (
        <small className="minimum-charge">
          {hi
            ? `न्यूनतम प्रिंट शुल्क ₹${item.minimum}`
            : `Minimum print charge ₹${item.minimum}`}
        </small>
      )}
    </>
  );
}
