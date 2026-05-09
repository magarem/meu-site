export const useEditPageHotkey = () => {
  const route = useRoute()
  const config = useRuntimeConfig()

  onMounted(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.code === 'KeyE') {
        event.preventDefault()
        const cmsUrl = `${config.public.cmsEditorUrl}/${config.public.siteId}/pages${route.path}`
        window.open(cmsUrl, 'cms-editor')
      }
    }

    window.addEventListener('keydown', handleKeydown)

    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeydown)
    })
  })
}
