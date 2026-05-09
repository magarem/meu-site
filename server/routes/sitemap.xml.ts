export default defineEventHandler(async (event) => {
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')

  const config = useRuntimeConfig()
  const siteUrl = (config.public.siteUrl as string || '').replace(/\/$/, '')

  // Fetch full page tree from sites API
  let tree: any = null
  try {
    tree = await $fetch<any>(`${config.sitesApiUrl}/tree`, {
      headers: { 'x-site': config.siteId as string },
      query: { path: '' },
    })
  } catch {
    tree = null
  }

  // Flatten all page paths recursively
  function flatten(nodes: any[], paths: string[] = []): string[] {
    for (const node of nodes ?? []) {
      if (node.type === 'page' || node.type === 'collection') {
        const p = (node.path || node.slug || '').replace(/^\/+/, '')
        if (p) paths.push(p)
      }
      if (node.children?.length) flatten(node.children, paths)
    }
    return paths
  }

  const pagePaths = flatten(tree?.children ?? [])
  const allPaths = ['', ...pagePaths] // '' = root /

  const today = new Date().toISOString().split('T')[0]

  const urls = allPaths.map((p) => {
    const loc = p ? `${siteUrl}/${p}` : `${siteUrl}/`
    const priority = p === '' ? '1.0' : p.split('/').length === 1 ? '0.8' : '0.6'
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.join('\n')}
</urlset>`
})
