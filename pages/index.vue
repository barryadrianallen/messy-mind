<template>
  <div>
    <p>Redirecting to login...</p>
  </div>
</template>

<script setup>
import { navigateTo } from '#app';
import { onMounted } from 'vue';

onMounted(() => {
  navigateTo('/login', { replace: true });
});
</script>

<style scoped>
/* You can add some basic styling if you want */
div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: sans-serif;
}
</style>
