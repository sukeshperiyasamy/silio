import type { Lang } from "@/lib/site";
export default function PrintVisual({ lang }: { lang: Lang }) {
  return (
    <figure className="print-visual">
      <svg
        viewBox="0 0 560 410"
        role="img"
        aria-label={
          lang === "hi"
            ? "इलेक्ट्रॉनिक्स बॉक्स का सांकेतिक CAD चित्र"
            : "Illustrative exploded CAD concept of an electronics enclosure"
        }
      >
        <defs>
          <pattern
            id="cad-grid"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M28 0H0V28"
              fill="none"
              stroke="#b3c6a6"
              strokeWidth=".6"
            />
          </pattern>
        </defs>
        <rect width="560" height="410" fill="url(#cad-grid)" />
        <g strokeLinejoin="round">
          <path
            d="M130 230 310 140 450 215 270 310Z"
            fill="#b7d79a"
            stroke="#416747"
            strokeWidth="2"
          />
          <path
            d="M130 230v65l140 78v-63Z"
            fill="#446d50"
            stroke="#315039"
            strokeWidth="2"
          />
          <path
            d="m270 310 180-95v65l-180 93Z"
            fill="#6b925c"
            stroke="#315039"
            strokeWidth="2"
          />
          <path
            d="m160 231 151-73 108 58-150 78Z"
            fill="#1b3b2e"
            stroke="#8fb47e"
            strokeWidth="2"
          />
          <path d="m184 230 127-61 86 47-127 66Z" fill="#294c39" />
          <path
            d="m130 132 180-90 140 75-180 95Z"
            fill="#e1f0cf"
            stroke="#416747"
            strokeWidth="2"
          />
          <path
            d="M130 132v18l140 77v-15Z"
            fill="#7ea36c"
            stroke="#416747"
            strokeWidth="2"
          />
          <path
            d="m270 212 180-95v18l-180 92Z"
            fill="#a2c289"
            stroke="#416747"
            strokeWidth="2"
          />
          <path
            d="m204 126 96-47 43 23-96 49Z"
            fill="#bbd99e"
            stroke="#779c62"
          />
          <g fill="#527943">
            <ellipse cx="160" cy="134" rx="5" ry="3" />
            <ellipse cx="312" cy="61" rx="5" ry="3" />
            <ellipse cx="421" cy="119" rx="5" ry="3" />
            <ellipse cx="270" cy="195" rx="5" ry="3" />
          </g>
          <g stroke="#759366" strokeDasharray="5 5">
            <path d="M130 154v72M450 139v70M270 231v67" />
          </g>
          <path d="m299 315 23-12v21l-23 12Z" fill="#153325" />
          <path d="m344 291 48-25v10l-48 25Z" fill="#153325" />
          <g stroke="#68875c" fill="none">
            <path d="m110 317 142 80M109 309v16m143 64v16M469 220v65m-7-66h14m-14 65h14" />
          </g>
        </g>
        <g fontFamily="Arial,sans-serif" fill="#45613f" fontSize="11">
          <text x="44" y="32">
            SILIO / CONCEPT STUDY
          </text>
          <text x="395" y="370">
            NOT TO SCALE
          </text>
          <text x="476" y="255">
            Z
          </text>
          <text x="170" y="382">
            X
          </text>
        </g>
      </svg>
      <figcaption>
        {lang === "hi"
          ? "एनक्लोज़र कॉन्सेप्ट · सांकेतिक चित्र, ग्राहक प्रोजेक्ट नहीं"
          : "Enclosure concept · illustrative study, not a client project"}
      </figcaption>
    </figure>
  );
}
