<template>
  <router-view />
</template>
<script setup lang="ts">
window.api
  .getUserAndPhotos(1)
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.error(err)
  })
</script>
