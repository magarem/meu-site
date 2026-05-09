/**
 * Resolve a media path to a browser-ready URL.
 *
 * The rule: image path structure mirrors the page URL structure.
 *   Page URL /services/consultoria  →  media lives at /data/services/consultoria/
 *
 * Pass pagePath as a getter () => props.pagePath so it is read at resolve-time,
 * not captured once at setup time.
 *
 * Resolution order:
 *   1. External URL (http/https) or data URI  → returned unchanged
 *   2. Already /data/… prefixed               → returned unchanged
 *   3. Bare filename + pagePath given          → /data/{pagePath}/{filename}
 *   4. Absolute path starting with /          → /data{path}
 *   5. Relative path with subfolders          → /data/{path}
 */
export function useMediaUrl(pagePath: string | (() => string) = '') {
  const getPagePath = typeof pagePath === 'function' ? pagePath : () => pagePath

  function resolve(path: string): string {
    if (!path) return ''
    if (path.startsWith('http') || path.startsWith('data:')) return path

    const clean = path.replace(/^\/+/, '')

    if (clean.startsWith('data/')) return `/${clean}`

    const pp = getPagePath()

    // Bare filename (no subfolder) — use the page's own folder
    if (!clean.includes('/') && pp) {
      return `/data/${pp}/${clean}`
    }

    // Absolute URL path, e.g. /services/consultoria/banner.jpg
    if (path.startsWith('/')) return `/data${path}`

    // Relative path with subfolder, e.g. shared/logo.png
    return `/data/${clean}`
  }

  return { resolve }
}
