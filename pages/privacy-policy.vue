<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      <div class="bg-sky-600 p-6">
        <h1 class="text-4xl font-bold text-white text-center">Privacy Policy</h1>
      </div>
      <div class="p-8 prose prose-slate max-w-none prose-headings:text-sky-700 prose-a:text-sky-600 hover:prose-a:text-sky-700">
        <div v-if="loading" class="text-center py-10">
          <p class="text-lg text-slate-600">Loading Privacy Policy...</p>
          <!-- You can add a simple spinner here if desired -->
        </div>
        <div v-else-if="error" class="text-center py-10">
          <p class="text-lg text-red-600">Could not load the Privacy Policy. Please try again later.</p>
        </div>
        <div v-else v-html="policyContent" class="whitespace-pre-wrap"></div>
      </div>
      <div class="p-6 bg-slate-50 border-t border-slate-200 flex justify-center">
        <button 
          @click="goBack"
          class="px-8 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75 transition-colors duration-150 ease-in-out"
        >
          Back to Sign Up
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useHead } from '#app'; // Or 'nuxt/app' for Nuxt 3

const policyContent = ref('');
const loading = ref(true);
const error = ref(false);
const router = useRouter();

const fetchPolicy = async () => {
  loading.value = true;
  error.value = false;
  try {
    const response = await fetch('/privacy-policy.txt');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    policyContent.value = await response.text();
  } catch (e) {
    console.error("Failed to fetch privacy policy:", e);
    error.value = true;
    policyContent.value = 'Failed to load privacy policy.';
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push('/login'); // Navigate to the login page
};

onMounted(() => {
  fetchPolicy();
});

useHead({
  title: 'Privacy Policy - Messy Mind',
  meta: [
    { name: 'description', content: 'Messy Mind Privacy Policy' }
  ]
});
</script>

<style scoped>
/* Scoped styles if needed, prose classes from Tailwind handle most styling */
.prose :where(pre):not(:where([class~="not-prose"] *)) {
  white-space: pre-wrap; /* Ensures preformatted text wraps */
  word-wrap: break-word; /* Breaks long words if necessary */
}
</style>
