import { promises as fs } from 'node:fs'
import path from 'node:path'

const STORAGE_ROOT =
  process.env.SIRIUS_STORAGE_ROOT ??
  path.join(process.cwd(), '..', '..', '..', 'storage')

const SITE_ID =
  process.env.NUXT_SITE_ID ??
  path.basename(process.cwd())

export const siteDataRoot = path.join(STORAGE_ROOT, SITE_ID)

export async function getActiveVersions(previewLayer?: string): Promise<string[]> {
  try {
    const raw = await fs.readFile(path.join(siteDataRoot, '_settings.json'), 'utf-8')
    const settings = JSON.parse(raw)

    let versions: string[]
    if (settings.defaultSiteVersion) {
      versions = [settings.defaultSiteVersion]
    } else if (Array.isArray(settings.activeVersions)) {
      versions = settings.activeVersions
    } else {
      versions = ['v1']
    }

    if (previewLayer && previewLayer !== 'clear') {
      versions = [previewLayer, ...versions.filter(v => v !== previewLayer)]
    }
    return versions
  } catch {
    return previewLayer && previewLayer !== 'clear' ? [previewLayer, 'v1'] : ['v1']
  }
}

export async function resolveFileInLayers(relativePath: string, previewLayer?: string) {
  const versions = await getActiveVersions(previewLayer)

  for (const version of versions) {
    const fullPath = path.join(siteDataRoot, version, relativePath)
    try {
      const content = await fs.readFile(fullPath, 'utf-8')
      if (relativePath.endsWith('.json')) {
        const parsed = JSON.parse(content)
        if (parsed._deleted) return { error: 'deleted_tombstone' as const }
      }
      return { content, versionSource: version, fullPath }
    } catch (e: any) {
      if (e.code !== 'ENOENT') console.error(`[meu-site] error reading ${fullPath}:`, e.message)
    }
  }
  return null
}
