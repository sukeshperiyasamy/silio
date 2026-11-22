export async function boundedText(
  request: Request,
  limit: number,
): Promise<string | null> {
  if (Number(request.headers.get("content-length") || 0) > limit) return null;
  const reader = request.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > limit) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString("utf8");
}
export async function adminForm(request: Request) {
  if (
    !request.headers
      .get("content-type")
      ?.startsWith("application/x-www-form-urlencoded")
  )
    return null;
  const text = await boundedText(request, 4096);
  return text === null ? null : new URLSearchParams(text);
}
