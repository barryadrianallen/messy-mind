<template>
  <div class="min-h-screen bg-white flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-block mb-6">
          <img src="/images/logo.png" alt="Messy Mind Logo" class="h-16 w-auto">
        </NuxtLink>
        <h1 class="text-3xl font-extrabold text-gray-900">Forgot Your Username?</h1>
        <p class="mt-2 text-sm text-gray-600">
          Enter your email address below. If an account is associated with this email, we'll send you your username(s).
        </p>
      </div>

      <form @submit.prevent="handleForgotUsername" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input 
            id="email" 
            v-model="email" 
            name="email" 
            type="email" 
            autocomplete="email" 
            required 
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow duration-150 shadow-sm"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <button 
            type="submit" 
            :disabled="isLoading" 
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-150 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
            {{ isLoading ? 'Sending...' : 'Send Username(s)' }}
          </button>
        </div>
      </form>

      <div v-if="message" :class="['mt-4 text-sm p-3 rounded-md', messageType === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700']">
        {{ message }}
      </div>

      <div class="mt-6 text-center">
        <NuxtLink to="/login" class="font-medium text-cyan-600 hover:text-cyan-500 hover:underline">
          Back to Login
        </NuxtLink>
      </div>
    </div>
    <footer class="absolute bottom-0 left-0 right-0 py-8 text-center text-sm text-gray-600">
      &copy; {{ new Date().getFullYear() }} Messy Mind. All rights reserved.
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const isLoading = ref(false);
const message = ref('');
const messageType = ref(''); // 'success' or 'error'

// Placeholder for Supabase client
// const supabase = useSupabaseClient(); 

const handleForgotUsername = async () => {
  isLoading.value = true;
  message.value = '';
  messageType.value = '';

  if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
    message.value = 'Please enter a valid email address.';
    messageType.value = 'error';
    isLoading.value = false;
    return;
  }

  try {
    // In a real scenario, you would call a Supabase Edge Function here:
    // const { data, error } = await supabase.functions.invoke('send-username-reminder', {
    //   body: { email: email.value }
    // });
    // if (error) throw error;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    message.value = 'If an account with that email exists, your username(s) have been sent. Please check your inbox (and spam folder).';
    messageType.value = 'success';
    // email.value = ''; // Optionally clear email field

  } catch (error) {
    console.error('Error sending username reminder:', error);
    message.value = error.message || 'An error occurred. Please try again.';
    messageType.value = 'error';
  } finally {
    isLoading.value = false;
  }
};

useHead({
  title: 'Forgot Username - Messy Mind',
  meta: [
    { name: 'description', content: 'Retrieve your Messy Mind account username(s).' }
  ]
});
</script>

<style scoped>
/* Add any page-specific styles here if needed */
</style>
