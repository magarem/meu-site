export default defineEventHandler((event) => {
  // Caddy/nginx can inject X-Site-Id header per virtual host — preferred in production
  const explicit = getHeader(event, 'x-site-id')
  if (explicit) {
    event.context.siteId = explicit
    return
  }

  const hostHeader = getHeader(event, 'x-forwarded-host') || getHeader(event, 'host') || ''
  const hostname = hostHeader.split(':')[0]   // strip port (e.g. localhost:10038 → localhost)
  const subdomain = hostname.split('.')[0]

  // Local dev: localhost has no meaningful subdomain — fall back to env var
  if (!subdomain || subdomain === 'localhost' || /^127\./.test(subdomain)) {
    event.context.siteId = process.env.NUXT_SITE_ID || 'default'
    return
  }

  event.context.siteId = subdomain
})
