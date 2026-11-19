import { maxModelBytes, modelExtensions } from "./printing";
export class InquiryInputError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export type ModelAttachment = { filename: string; content: string };
export async function readInquiryBody(
  request: Request,
): Promise<{ body: Record<string, unknown>; attachment?: ModelAttachment }> {
  const type = request.headers.get("content-type") || "";
  const multipart = type.toLowerCase().startsWith("multipart/form-data");
  const limit = multipart ? maxModelBytes + 65536 : 12000;
  if (Number(request.headers.get("content-length") || 0) > limit)
    throw new InquiryInputError("Request too large", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new InquiryInputError("Invalid payload");
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > limit) {
      await reader.cancel();
      throw new InquiryInputError("Request too large", 413);
    }
    chunks.push(value);
  }
  const data = Buffer.concat(chunks);
  if (!multipart) {
    try {
      const body: unknown = JSON.parse(data.toString("utf8"));
      if (!body || typeof body !== "object" || Array.isArray(body))
        throw new Error();
      return { body: body as Record<string, unknown> };
    } catch {
      throw new InquiryInputError("Invalid payload");
    }
  }
  let form: FormData;
  try {
    form = await new Response(new Uint8Array(data), {
      headers: { "content-type": type },
    }).formData();
  } catch {
    throw new InquiryInputError("Invalid multipart payload");
  }
  const body: Record<string, unknown> = {};
  let textBytes = 0;
  for (const [key, value] of form) {
    if (typeof value === "string") {
      textBytes += Buffer.byteLength(value);
      if (textBytes > 12000)
        throw new InquiryInputError("Form text too large", 413);
      body[key] = value;
    } else if (key !== "model")
      throw new InquiryInputError("Only one model attachment is supported");
  }
  if (typeof body.campaign === "string") {
    try {
      body.campaign = JSON.parse(body.campaign);
    } catch {
      throw new InquiryInputError("Invalid campaign payload");
    }
  }
  const files = form.getAll("model");
  if (files.length > 1)
    throw new InquiryInputError("Send one model file at a time");
  const file = files[0];
  if (!file) return { body };
  if (typeof file === "string")
    throw new InquiryInputError("Invalid model attachment");
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  if (!modelExtensions.includes(extension))
    throw new InquiryInputError("Use an STL, STEP, STP, OBJ or 3MF model file");
  if (file.size === 0) throw new InquiryInputError("The model file is empty");
  if (file.size > maxModelBytes)
    throw new InquiryInputError("Model files must be 8 MB or smaller", 413);
  const filename = file.name
    .split(/[\\/]/)
    .pop()!
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(-160);
  return {
    body,
    attachment: {
      filename,
      content: Buffer.from(await file.arrayBuffer()).toString("base64"),
    },
  };
}
