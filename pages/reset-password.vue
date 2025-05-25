<template>
  <div class="min-h-screen bg-white flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-block mb-6">
          <img src="/images/logo.png" alt="Messy Mind Logo" class="h-16 w-auto">
        </NuxtLink>
        <h1 class="text-3xl font-extrabold text-gray-900">Set New Password</h1>
        <p class="mt-2 text-sm text-gray-600">
          Enter your new password below. Make sure it's strong and memorable.
        </p>
      </div>

      <form v-if="!recoveryComplete" @submit.prevent="handleResetPassword" class="space-y-6">
        <div>
          <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input 
            id="newPassword" 
            v-model="newPassword" 
            name="newPassword" 
            type="password" 
            required 
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-150 shadow-sm"
            placeholder="Enter new password"
          />
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input 
            id="confirmPassword" 
            v-model="confirmPassword" 
            name="confirmPassword" 
            type="password" 
            required 
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-150 shadow-sm"
            placeholder="Confirm new password"
          />
        </div>

        <div v-if="passwordError" class="text-sm text-red-600 bg-red-50 p-3 rounded-md">
          {{ passwordError }}
        </div>

        <div>
          <button 
            type="submit" 
            :disabled="isLoading" 
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
            {{ isLoading ? 'Updating...' : 'Update Password' }}
          </button>
        </div>
      </form>

      <div v-if="message" :class="['mt-4 text-sm p-3 rounded-md', messageType === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700']">
        {{ message }}
      </div>
      
      <div v-if="recoveryComplete && messageType === 'success'" class="mt-6 text-center">
        <NuxtLink to="/login" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-150 ease-in-out transform hover:scale-105">
          Proceed to Login
        </NuxtLink>
      </div>
      <div v-else-if="!recoveryComplete" class="mt-6 text-center">
         <NuxtLink to="/login" class="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
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
import { ref, onMounted } from 'vue';
import { useRouter } //, useSupabaseClient, useSupabaseUser 
from '#imports'; // Assuming Nuxt 3 auto-imports

const router = useRouter();
// const supabase = useSupabaseClient();
// const user = useSupabaseUser();

const newPassword = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const message = ref('');
const messageType = ref(''); // 'success' or 'error'
const passwordError = ref('');
const recoveryComplete = ref(false);

// This will be triggered when Supabase redirects the user here after they click the email link
// and the auth state changes to PASSWORD_RECOVERY.
onMounted(() => {
  // supabase.auth.onAuthStateChange((event, session) => {
  //   if (event === 'PASSWORD_RECOVERY') {
  //     console.log('Password recovery event detected, session:', session);
  //     // User is now in a state where they can update their password.
  //     // The session object might contain the access token needed for the updateUser call.
  //     // No explicit token handling from URL is typically needed if Supabase handles the redirect and session correctly.
  //     message.value = 'You can now set a new password.';
  //     messageType.value = 'success'; 
  //   } else if (event === 'SIGNED_IN' && session?.user && !session?.user.new_user) {
       // If already signed in and not a new user (which might happen if they navigate away and back)
       // and not in recovery mode, perhaps redirect them or show a different message.
  //   } else if (!session) {
       // If there's no session and not in recovery mode (e.g. direct navigation without token)
  //      message.value = 'Invalid or expired password reset link. Please request a new one.';
  //      messageType.value = 'error';
  //      recoveryComplete.value = true; // Prevent form submission
  //   }
  // });

  // For now, simulate that the user is in a valid state to reset password
  // In a real app, you'd rely on Supabase's onAuthStateChange or check for a valid session.
  if (!router.currentRoute.value.hash && !router.currentRoute.value.query.token) { // Basic check if token is missing
    // This is a very basic check. Supabase handles this more robustly.
    // message.value = 'No reset token found. This page should be accessed via a password reset email link.';
    // messageType.value = 'error';
    // recoveryComplete.value = true; // To hide form
  }
});

const handleResetPassword = async () => {
  isLoading.value = true;
  message.value = '';
  messageType.value = '';
  passwordError.value = '';

  if (newPassword.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters long.';
    isLoading.value = false;
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = 'Passwords do not match.';
    isLoading.value = false;
    return;
  }

  try {
    // In a real scenario with Supabase:
    // const { data, error } = await supabase.auth.updateUser({
    //   password: newPassword.value
    // });
    // if (error) throw error;
    // console.log('Password updated successfully:', data);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    message.value = 'Your password has been updated successfully! You can now log in with your new password.';
    messageType.value = 'success';
    recoveryComplete.value = true;
    newPassword.value = '';
    confirmPassword.value = '';

  } catch (error) {
    console.error('Error updating password:', error);
    message.value = error.message || 'Failed to update password. The reset link may be invalid or expired. Please try again.';
    messageType.value = 'error';
  } finally {
    isLoading.value = false;
  }
};

useHead({
  title: 'Reset Password - Messy Mind',
  meta: [
    { name: 'description', content: 'Set a new password for your Messy Mind account.' }
  ]
});

</script>

<style scoped>
/* Add any page-specific styles here if needed */
</style>
