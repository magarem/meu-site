export default defineEventHandler(async (event) => {
  const rawPath = event.path.replace(/^\/data\//, '').replace(/\.\./g, '')
  const config = useRuntimeConfig()

  const previewVersion =
    (getQuery(event).version as string | undefined) ??
    getCookie(event, 'preview_layer')

  const params = new URLSearchParams({ path: rawPath })
  if (previewVersion) params.set('version', previewVersion)

  const response = await fetch(
    `${config.sitesApiUrl}/media?${params}`,
    { headers: { 'x-site': config.siteId } }
  )

  if (!response.ok) throw createError({ statusCode: 404, statusMessage: 'Media not found' })

  setResponseHeader(event, 'content-type', response.headers.get('content-type') || 'application/octet-stream')
  setResponseHeader(event, 'cache-control', 'public, max-age=31536000')

  return sendStream(event, response.body!)
})
