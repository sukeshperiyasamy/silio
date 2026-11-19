export const maxModelBytes = 8 * 1024 * 1024;
export const modelExtensions = ["stl", "step", "stp", "obj", "3mf"];
export function printEstimate(
  grams: number,
  quantity: number,
  design: number = 0,
) {
  if (
    !Number.isFinite(grams) ||
    grams < 1 ||
    grams > 10000 ||
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > 1000 ||
    ![0, 499, 999].includes(design)
  )
    return null;
  const printing = Math.max(299, Math.ceil(grams * quantity * 5));
  return { printing, design, subtotal: printing + design };
}
