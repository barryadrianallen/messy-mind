<template>
  <div class="min-h-screen bg-white flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">


      <!-- Header -->
      <h1 class="text-3xl font-bold text-center text-gray-900 mb-2">
        {{ userType ? `${userType} Login` : 'Messy Mind' }}
      </h1>
      
      <!-- Subtitle (only shown on login form) -->
      <p v-if="showLoginForm" class="text-gray-500 text-center text-sm mb-6">
        Login to see your tasks for today
      </p>
      
      <!-- User Type Selection (shown by default) -->
      <div v-if="!showLoginForm">
        <p class="text-gray-900 text-center mb-6">Please select your account type to continue:</p>
        
        <div class="space-y-4">
          <button 
            @click="selectUserType('Parent')" 
            class="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors"
          >
            I am a Parent
          </button>
          <button 
            @click="selectUserType('Child')" 
            class="w-full border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
          >
            I am a Child
          </button>
        </div>
      </div>
      
      <!-- Login Form (shown after user type selection) -->
      <form v-if="showLoginForm" @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your username"
          >
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your password"
          >
        </div>
        
        <button
          type="submit"
          class="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors mt-6"
        >
          Login
        </button>
        
        <div class="text-center mt-4">
          <button 
            @click="backToUserType"
            class="text-blue-600 hover:text-blue-800 text-sm transition-colors"
          >
            Back to Home
          </button>
        </div>
      </form>
      
      <!-- Footer (only shown on user type selection) -->
      <p v-if="!showLoginForm" class="text-gray-400 text-xs text-center mt-8">
        Creating a structured and positive routine together
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const userType = ref('');
const showLoginForm = ref(false);
const username = ref('');
const password = ref('');

const selectUserType = (type) => {
  userType.value = type;
  showLoginForm.value = true;
};

const backToUserType = () => {
  userType.value = '';
  showLoginForm.value = false;
  username.value = '';
  password.value = '';
};

const handleLogin = () => {
  // Handle login logic here
  console.log('Logging in as:', userType.value, username.value);
  // You would typically make an API call to authenticate the user
};
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>
