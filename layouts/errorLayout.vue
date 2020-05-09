<template>
  <v-app>
    <v-content>
      <div class="error-layout">
        <nuxt />
      </div>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'ErrorLayout'
}
</script>

<style scoped lang="scss">
.error-layout {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
