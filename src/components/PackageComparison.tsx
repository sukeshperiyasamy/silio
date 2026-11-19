import Link from "next/link";
import { type Lang, prices } from "@/lib/site";
import { featuredIds, quotePath } from "@/lib/growth";

export default function PackageComparison({ lang }: { lang: Lang }) {
  const hi = lang === "hi";
  return (
    <div
      className="comparison-scroll"
      role="region"
      tabIndex={0}
      aria-label={hi ? "पैकेज तुलना" : "Package comparison"}
    >
      <table className="comparison-table">
        <caption>
          {hi
            ? "अपनी ज़रूरत के हिसाब से पैकेज चुनें।"
            : "Choose a starting point that fits your everyday work."}
        </caption>
        <thead>
          <tr>
            <th scope="col">{hi ? "पैकेज" : "Package"}</th>
            <th scope="col">{hi ? "शुरुआती कीमत" : "Starting price"}</th>
            <th scope="col">{hi ? "क्या शामिल है" : "What’s included"}</th>
            <th scope="col">{hi ? "अगला कदम" : "Next step"}</th>
          </tr>
        </thead>
        <tbody>
          {featuredIds.map((id) => {
            const p = prices.find((p) => p.id === id)!;
            return (
              <tr key={id}>
                <th scope="row">{hi ? p.hi : p.en}</th>
                <td>
                  ₹{p.price.toLocaleString("en-IN")}
                  {p.monthly ? (hi ? " / माह" : " / mo") : ""}
                </td>
                <td>{hi ? p.detailHi : p.detailEn}</td>
                <td>
                  <Link className="text-link" href={quotePath(lang, id)}>
                    {hi ? "पूछताछ करें" : "Enquire"}
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
