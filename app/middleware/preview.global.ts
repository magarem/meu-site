export default defineNuxtRouteMiddleware((to) => {
  const previewCookie = useCookie('preview_layer', { path: '/', maxAge: 3600 })

  if (to.query.version === 'clear') {
    previewCookie.value = null
  } else if (to.query.version) {
    previewCookie.value = to.query.version as string
  }
})
