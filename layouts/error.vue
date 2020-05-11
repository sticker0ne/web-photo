<template>
  <div class="error-page-wrapper">
    <h1 class="font-weight-bold mb-4">{{ error.title }}</h1>
    <h2>{{ error.message }}</h2>
  </div>
</template>

<script>
export default {
  layout: 'errorLayout',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  mounted() {
    this.$socket.disconnect()
  },
  head() {
    const title = this.error.title
    return {
      title
    }
  }
}
</script>

<style scoped lang="scss">
.error-page-wrapper {
  background-color: #343334;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

h1,
h2 {
  text-align: center;
}
</style>
