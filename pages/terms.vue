<template>
  <div class="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Terms and Conditions</h1>
        <button 
          @click="goBack"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          Back
        </button>
      </div>
      
      <div v-if="pending" class="text-center text-gray-500">
        Loading terms...
      </div>
      <div v-else-if="error" class="text-center text-red-500">
        Failed to load terms. Please try again later.
        <pre class="mt-2 text-xs text-left bg-red-50 p-2 rounded">{{ error }}</pre>
      </div>
      <pre v-else class="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-md overflow-x-auto">{{ termsContent }}</pre>

      <div class="mt-8 text-center">
        <button 
          @click="goBack"
          class="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Previous Page
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const termsContent = ref('');
const pending = ref(true);
const error = ref(null);

const fetchTerms = async () => {
  pending.value = true;
  error.value = null;
  try {
    // In Nuxt 3, files in `public` are served at the root.
    // We use $fetch which is Nuxt's universal fetch utility.
    const response = await $fetch('/terms.txt', { method: 'GET', responseType: 'text' });
    termsContent.value = response;
  } catch (e) {
    console.error('Failed to fetch terms:', e);
    error.value = e.message || 'Unknown error occurred.';
  }
  pending.value = false;
};

onMounted(() => {
  fetchTerms();
});

const goBack = () => {
  router.push('/login'); // Navigate to the login page
};

useHead({
  title: 'Terms and Conditions - Messy Mind',
  meta: [
    { name: 'description', content: 'Messy Mind Terms and Conditions for using the service.' }
  ]
});
</script>

<style scoped>
/* Scoped styles for the terms page if needed */
pre {
  font-family: 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace;
}
</style>
