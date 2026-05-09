export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()

  const previewVersion = (query.version as string) || getCookie(event, 'preview_layer') || undefined

  try {
    const result = await $fetch<any>(`${config.sitesApiUrl}/content`, {
      headers: { 'x-site': config.siteId },
      query: {
        path: query.path,
        node: query.node,
        version: previewVersion,
      },
    })

    // Normalize markdown response for backward compatibility with ContentMD.vue
    if (result && result.type === 'md' && result.data) {
      const { _markdown, ...frontmatter } = result.data
      return {
        type: 'markdown',
        data: result.data,
        md_data: frontmatter,
        md_content: _markdown || '',
        _layer: result._layer,
      }
    }

    return result
  } catch (err: any) {
    throw createError({ statusCode: err.statusCode || 404, statusMessage: err.message })
  }
})
