import { writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

export default defineEventHandler(async (event) => {
  const siteId = event.context.siteId as string
  const body = await readBody(event)
  const fields = body?.fields || body || {}

  const id = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
  const message = {
    id,
    receivedAt: new Date().toISOString(),
    status: 'novo',
    fields,
  }

  const dir = join(process.env.SIRIUS_STORAGE_ROOT || '', siteId, '_messages')
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, `${id}.json`), JSON.stringify(message, null, 2))

  return { success: true, id }
})
