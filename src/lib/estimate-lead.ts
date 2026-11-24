import { prices } from "./site";
import { estimatePackages } from "./growth";
import { printEstimate } from "./printing";
export type EstimateSelection =
  | { kind: "project"; packageIds: string[]; careId: string }
  | { kind: "printing"; grams: number; quantity: number; design: number };
export interface EstimateSnapshot {
  kind: "project" | "printing";
  currency: "INR";
  items: { id: string; name: string; amount: number; scope: string }[];
  oneTime: number;
  monthly: number;
  care: { id: string; name: string; amount: number; scope: string } | null;
  printing?: {
    grams: number;
    quantity: number;
    ratePerGram: number;
    minimum: number;
    printCharge: number;
    design: number;
  };
}
export function normalizeEstimate(value: unknown): EstimateSnapshot {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Invalid estimate");
  const input = value as Record<string, unknown>;
  if (input.kind === "project") {
    if (
      !Array.isArray(input.packageIds) ||
      !input.packageIds.length ||
      input.packageIds.length > 10 ||
      !input.packageIds.every((id) => typeof id === "string")
    )
      throw new Error("Invalid packages");
    const ids = [...new Set(input.packageIds as string[])];
    const packages = ids.map((id) => prices.find((p) => p.id === id));
    if (packages.some((p) => !p || p.monthly || p.quoteOnly || p.unit))
      throw new Error("Invalid fixed-price package");
    if (typeof input.careId !== "string") throw new Error("Invalid care plan");
    const care = input.careId
      ? prices.find((p) => p.id === input.careId && p.monthly)
      : null;
    if (input.careId && !care) throw new Error("Invalid care plan");
    const total = estimatePackages(ids, input.careId);
    return {
      kind: "project",
      currency: "INR",
      items: packages.map((p) => ({
        id: p!.id,
        name: p!.en,
        amount: p!.price,
        scope: p!.detailEn,
      })),
      ...total,
      care: care
        ? {
            id: care.id,
            name: care.en,
            amount: care.price,
            scope: care.detailEn,
          }
        : null,
    };
  }
  if (input.kind === "printing") {
    if (
      ![input.grams, input.quantity, input.design].every(
        (v) => typeof v === "number",
      )
    )
      throw new Error("Invalid printing inputs");
    const grams = input.grams as number,
      quantity = input.quantity as number,
      design = input.design as number;
    const result = printEstimate(grams, quantity, design);
    if (!result) throw new Error("Invalid printing inputs");
    return {
      kind: "printing",
      currency: "INR",
      items: [
        {
          id: "pla-printing",
          name: "PLA FDM printing",
          amount: result.printing,
          scope: `${grams} g per copy including supports; ${quantity} copies. External production, subject to review.`,
        },
        ...(design
          ? [
              {
                id: design === 499 ? "cad-model" : "enclosure-design",
                name:
                  design === 499
                    ? "Simple CAD model"
                    : "Simple enclosure design",
                amount: design,
                scope: "Starting design fee; final scope requires review.",
              },
            ]
          : []),
      ],
      oneTime: result.subtotal,
      monthly: 0,
      care: null,
      printing: {
        grams,
        quantity,
        ratePerGram: 5,
        minimum: 299,
        printCharge: result.printing,
        design,
      },
    };
  }
  throw new Error("Invalid estimate type");
}
export function estimateDescription(snapshot: EstimateSnapshot) {
  const money = (n: number) => `INR ${n.toLocaleString("en-IN")}`;
  return [
    "Starting estimate (not a final quotation):",
    ...snapshot.items.map(
      (item) => `${item.name}: ${money(item.amount)}. Scope: ${item.scope}`,
    ),
    `One-time starting total: ${money(snapshot.oneTime)}`,
    `Monthly care: ${money(snapshot.monthly)}${snapshot.care ? ` (${snapshot.care.name}; ${snapshot.care.scope})` : " (no monthly plan)"}`,
    "Scope, timeline and final pricing require review. Domain, hosting, third-party fees, taxes and delivery are extra where applicable.",
  ].join("\n");
}
