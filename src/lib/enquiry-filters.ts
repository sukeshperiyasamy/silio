export function enquiryFilters(query: Record<string, string | undefined>) {
  const q = (query.q || "").trim().slice(0, 120),
    status = ["new", "contacted", "quoted", "won", "lost"].includes(
      query.status || "",
    )
      ? query.status!
      : "";
  const days = [7, 30, 90, 365].includes(Number(query.days))
    ? Number(query.days)
    : 0;
  const page = Math.max(
    0,
    Math.min(1000000, Number.parseInt(query.page || "0") || 0),
  );
  const literal = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return {
    q,
    status,
    days,
    page,
    filter: {
      ...(days
        ? { createdAt: { $gte: new Date(Date.now() - days * 86400000) } }
        : {}),
      ...(status ? { status } : {}),
      ...(q
        ? {
            $or: ["name", "email", "phone", "service", "message"].map(
              (field) => ({ [field]: { $regex: literal, $options: "i" } }),
            ),
          }
        : {}),
    },
  };
}
