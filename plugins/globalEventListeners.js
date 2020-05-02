export default function({ store }) {
  window.addEventListener('beforeunload', function() {
    debugger
    store.dispatch('peer/closeAll')
  })
  window.addEventListener('unload', function() {
    debugger
    store.dispatch('peer/closeAll')
  })
}
