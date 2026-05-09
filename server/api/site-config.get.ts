import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { existsSync } from "node:fs"

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const storageRoot = process.env.SIRIUS_STORAGE_ROOT
  const siteId = config.siteId as string

  if (!storageRoot || !siteId) return {}

  const configPath = join(storageRoot, siteId, "_cms.json")
  if (!existsSync(configPath)) return {}

  try {
    return JSON.parse(await readFile(configPath, "utf-8"))
  } catch {
    return {}
  }
})
