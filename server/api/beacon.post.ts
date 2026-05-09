import { appendFile, mkdir } from "node:fs/promises"
import { join } from "node:path"
import { createHash } from "node:crypto"

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const storageRoot = process.env.SIRIUS_STORAGE_ROOT
  const siteId = config.siteId as string

  if (!storageRoot || !siteId) return { ok: false }

  // Skip preview sessions
  const previewCookie = getCookie(event, "preview_layer")
  if (previewCookie) return { ok: false }

  const body = await readBody(event).catch(() => ({}))
  const path = String(body?.path || "/").slice(0, 500)
  const rawRef = String(body?.ref || "")
  let ref = ""
  try { ref = rawRef ? new URL(rawRef).hostname : "" } catch { ref = "" }

  const ua = getRequestHeader(event, "user-agent") || ""
  const ip =
    getRequestHeader(event, "x-forwarded-for")?.split(",")[0]?.trim() ||
    getRequestHeader(event, "x-real-ip") ||
    "unknown"

  const today = new Date().toISOString().slice(0, 10)

  // Daily visitor hash — privacy-safe, no cookie needed
  const vh = createHash("sha256")
    .update(`${ip}|${ua}|${today}`)
    .digest("hex")
    .slice(0, 12)

  const mob = /mobile|android|iphone|phone/i.test(ua)
  const tab = /ipad|tablet/i.test(ua)
  const device = tab ? "tablet" : mob ? "mobile" : "desktop"

  const entry =
    JSON.stringify({ ts: new Date().toISOString(), path, ref, d: device, vh }) + "\n"

  const dir = join(storageRoot, siteId, "_analytics")
  await mkdir(dir, { recursive: true })
  await appendFile(join(dir, `${today}.jsonl`), entry, "utf-8")

  return { ok: true }
})
