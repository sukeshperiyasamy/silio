import type { SVGProps } from "react";
const paths: Record<string, string> = {
  spark: "M12 2v20M2 12h20M5 5l14 14M5 19L19 5",
  website: "M3 8h18M6 5h.01M9 5h.01M8 12l-3 3 3 3M16 12l3 3-3 3",
  application: "M3 8h18M8 8v13M11 12h6M11 16h4",
  mobile: "M9 5h6M11 19h2",
  catalogue: "M5 7h14M5 12h14M5 17h9",
  chart: "M4 20h17M7 16v-5M12 16V5M17 16V9",
  menu: "M5 3v6c0 3 4 3 4 0V3M7 3v18M17 3c-4 4-4 9 0 9V3v18",
  care: "M12 3l8 3v6c0 4-4 7-8 9-4-2-8-5-8-9V6l8-3M8 12l3 3 5-6",
  table: "M3 8h18v4H3zM6 12v9M18 12v9",
  chair: "M6 12V4h12v8M4 12h16v5H4zM6 17v4M18 17v4",
  cabinet: "M4 3h16v17H4zM12 3v17M9 11v2M15 11v2M6 20v2M18 20v2",
  lamp: "M8 3h8l4 9H4l4-9M12 12v9M7 21h10",
  planter:
    "M5 12h14l-2 9H7l-2-9M12 12V4M12 8c-5 0-6-3-6-5 4 0 6 2 6 5M12 6c0-3 3-4 6-4 0 3-2 5-6 5",
  cushion: "M4 4q8-2 16 0-2 8 0 16-8-2-16 0 2-8 0-16M9 9l6 6M15 9l-6 6",
  diamond: "M12 3l3 6 6 3-6 3-3 6-3-6-6-3 6-3z",
};
/** Decorative vectors inherit color and never use a device's emoji font. */
export default function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: string }) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={name === "spark" ? 1.8 : 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {["website", "application"].includes(name) && (
        <rect x="2" y="2" width="20" height="20" rx="3" />
      )}
      {name === "mobile" && <rect x="6" y="2" width="12" height="20" rx="3" />}
      <path d={paths[name] || paths.spark} />
    </svg>
  );
}
