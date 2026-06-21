import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { getSiteRoot } from '../utils/versioning'

export default defineEventHandler(async (event) => {
  const siteId = event.context.siteId as string
  if (!siteId) return {}

  const root = getSiteRoot(siteId)
  let cmsConfig: Record<string, any> = {}
  let publicSettings: Record<string, any> = {}

  try {
    const configPath = join(root, '_cms.json')
    if (existsSync(configPath))
      cmsConfig = JSON.parse(await readFile(configPath, 'utf-8'))
  } catch {}

  try {
    const settingsPath = join(root, '_settings.json')
    if (existsSync(settingsPath)) {
      const s = JSON.parse(await readFile(settingsPath, 'utf-8'))
      // expose only safe, frontend-relevant settings
      if (s.breadcrumbMode)        publicSettings.breadcrumbMode        = s.breadcrumbMode
      if (s.blocksGap)             publicSettings.blocksGap             = s.blocksGap
      if (s.pageVerticalPadding)   publicSettings.pageVerticalPadding   = s.pageVerticalPadding
      if (s.showPageTitle !== undefined) publicSettings.showPageTitle = s.showPageTitle
    }
  } catch {}

  return { ...cmsConfig, ...publicSettings }
})
