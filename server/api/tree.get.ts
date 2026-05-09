export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()

  const previewVersion = (query.version as string) || getCookie(event, 'preview_layer') || undefined

  try {
    return await $fetch<any>(`${config.sitesApiUrl}/tree`, {
      headers: { 'x-site': config.siteId },
      query: {
        path: query.path,
        node: query.node ?? query.prop,
        version: previewVersion,
        limit: query.limit,
        page: query.page,
      },
    })
  } catch (err: any) {
    throw createError({ statusCode: err.statusCode || 404, statusMessage: err.message })
  }
})
