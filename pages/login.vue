<template>
  <div class="min-h-screen bg-white flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

      <!-- Initial View: Login or Parent Signup Option -->
      <div v-if="!showLoginForm && !showSignupForm">
        <h1 class="text-3xl font-bold text-center text-gray-900 mb-2">Messy Mind</h1>
        <p class="text-gray-900 text-center mb-6">Please select your account type to continue:</p>
        
        <div class="space-y-4">
          <button 
            @click="selectUserType('Parent')" 
            class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors text-lg"
          >
            I am a Parent
          </button>
          <button 
            @click="selectUserType('Child')" 
            class="w-full border-2 border-blue-600 text-blue-600 font-bold py-3 px-4 rounded-xl hover:bg-blue-50 transition-colors text-lg"
          >
            I am a Child
          </button>
        </div>

        <div class="mt-8 text-center">
          <p class="text-gray-600 mb-2">New family?</p>
          <button 
            @click="prepareSignup"
            class="w-full bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Create Parent Account
          </button>
          <p class="text-xs text-gray-500 mt-2">Parents create accounts and add their children</p>
        </div>
        
        <p class="text-gray-400 text-xs text-center mt-10">
          Creating a structured and positive routine together
        </p>
      </div>
      
      <!-- Login Form (shown after user type selection) -->
      <form v-if="showLoginForm && !showSignupForm" @submit.prevent="handleLogin" class="space-y-4">
        <h1 class="text-3xl font-bold text-center text-gray-900 mb-2">
          {{ userType }} Login
        </h1>
        <p class="text-gray-500 text-center text-sm mb-6">
          Login to see your tasks for today
        </p>
        
        <!-- Email field for Parent -->
        <div v-if="userType === 'Parent'">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="email"
            v-model="email" 
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email"
          >
        </div>
        
        <!-- Username field for Child (placeholder for now) -->
        <div v-if="userType === 'Child'">
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

        <!-- Password field for Parent -->
        <div v-if="userType === 'Parent'">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your password"
          >
          <div class="text-right mt-1">
            <NuxtLink to="/forgot-password" class="text-sm text-blue-600 hover:text-blue-800 hover:underline">
              Forgot Password?
            </NuxtLink>
          </div>
        </div>

        <div v-if="authError" class="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">
          {{ authError }}
        </div>
        
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors text-lg mt-6 disabled:opacity-50"
        >
          {{ isLoading ? 'Processing...' : 'Login' }}
        </button>
        
        <div class="text-center mt-4">
          <button 
            @click="backToInitial"
            type="button"
            class="text-blue-600 hover:text-blue-800 text-sm transition-colors"
          >
            Back to Home
          </button>
        </div>
      </form>

      <!-- Parent Signup Form -->
      <div v-if="showSignupForm">
        <button @click="backToInitial" class="mb-4 text-blue-600 hover:text-blue-800 flex items-center">
          <span class="mr-1 text-xl">←</span> Back
        </button>
        <h1 class="text-2xl font-bold text-center text-gray-900 mb-4">Create Parent Account</h1>
        
        <div class="text-center mb-6">
          <span class="text-3xl">👤+</span> <!-- Placeholder for person+ icon -->
          <h2 class="text-xl font-semibold text-gray-800 mt-2">Parent Registration</h2>
          <p class="text-sm text-gray-600 mt-1">
            Create your parent account to manage your family's tasks. <br/>You'll be able to add your children after registration.
          </p>
        </div>

        <form @submit.prevent="handleSignup" class="space-y-4">
          <h3 class="text-lg font-medium text-gray-700">Personal Information</h3>
          <div>
            <label for="signupFullName" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input id="signupFullName" v-model="signupFullName" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your full name">
            <p v-if="signupFullNameError" class="text-red-500 text-xs mt-1">{{ signupFullNameError }}</p>
          </div>
          <div>
            <label for="signupEmail" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input id="signupEmail" v-model="signupEmail" type="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your email address">
            <p v-if="signupEmailError" class="text-red-500 text-xs mt-1">{{ signupEmailError }}</p>
          </div>

          <h3 class="text-lg font-medium text-gray-700 pt-2">Account Credentials</h3>
          <div>
            <label for="signupUsername" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input id="signupUsername" v-model="signupUsername" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Choose a username (this will be public)">
            <p v-if="signupUsernameError" class="text-red-500 text-xs mt-1">{{ signupUsernameError }}</p>
          </div>
          <div>
            <label for="signupPassword" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input id="signupPassword" v-model="signupPassword" type="password" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-xs" placeholder="Min 6 characters (Supabase default)">
            <p v-if="signupPasswordError" class="text-red-500 text-xs mt-1">{{ signupPasswordError }}</p>
          </div>
          <div>
            <label for="signupConfirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input id="signupConfirmPassword" v-model="signupConfirmPassword" type="password" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Confirm your password">
            <p v-if="signupConfirmPasswordError" class="text-red-500 text-xs mt-1">{{ signupConfirmPasswordError }}</p>
          </div>

          <h3 class="text-lg font-medium text-gray-700 pt-2">Family Information</h3>
          <div>
            <label for="signupFamilyName" class="block text-sm font-medium text-gray-700 mb-1">Family Name</label>
            <input id="signupFamilyName" v-model="signupFamilyName" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., The Johnson Family">
            <p v-if="signupFamilyNameError" class="text-red-500 text-xs mt-1">{{ signupFamilyNameError }}</p>
            <p class="text-xs text-gray-500 mt-1">
              You can add your children and other family members after creating your account.
            </p>
          </div>

          <div class="flex items-center mt-4">
            <input id="signupAgreedToTerms" v-model="signupAgreedToTerms" type="checkbox" required class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
            <label for="signupAgreedToTerms" class="ml-2 block text-sm text-gray-700">
              I agree to the <NuxtLink to="/terms" class="font-medium text-blue-600 hover:text-blue-800" target="_blank">Terms and Conditions</NuxtLink> and <NuxtLink to="/privacy-policy" class="font-medium text-blue-600 hover:text-blue-800" target="_blank">Privacy Policy</NuxtLink>
            </label>
          </div>
          <p v-if="signupTermsError" class="text-red-500 text-xs mt-1">{{ signupTermsError }}</p> <!-- Moved error below checkbox -->
          
          <div v-if="authError" class="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">
            {{ authError }}
          </div>

          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors text-lg mt-6 disabled:opacity-50"
          >
            {{ isLoading ? 'Creating Account...' : 'Create Parent Account' }}
          </button>

          <div class="text-center mt-4 space-y-1">
            <p class="text-sm text-gray-600">
              Already have an account? 
              <button @click="switchToLogin" type="button" class="font-medium text-blue-600 hover:text-blue-800">Sign in here</button>
            </p>
            <button @click="backToInitial" type="button" class="text-sm text-gray-600 hover:text-gray-800">Back to Home</button>
          </div>
        </form>
      </div>
      
      <!-- Footer (only shown on user type selection on initial screen) -->
      <!-- <p v-if="!showLoginForm && !showSignupForm" class="text-gray-400 text-xs text-center mt-8">
        Creating a structured and positive routine together
      </p> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useNuxtApp } from '#app';

const { $supabase } = useNuxtApp();

const userType = ref('');
const showLoginForm = ref(false);
const email = ref(''); // For Parent login (changed from username)
const username = ref(''); // For Child login (placeholder) / Parent signup username
const password = ref(''); // For login
const pin = ref('');      // For login

// Parent Signup state variables
const showSignupForm = ref(false);
const signupFullName = ref('');
const signupEmail = ref('');
const signupUsername = ref(''); // This is the public username for the profile
const signupPassword = ref(''); 
const signupConfirmPassword = ref('');
const signupFamilyName = ref(''); // Note: FamilyName is not in profiles table yet
const signupAgreedToTerms = ref(false);

// Error message refs
const signupFullNameError = ref('');
const signupEmailError = ref('');
const signupUsernameError = ref('');
const signupPasswordError = ref('');
const signupConfirmPasswordError = ref('');
const signupFamilyNameError = ref('');
const signupTermsError = ref('');

// Supabase specific state
const isLoading = ref(false);
const authError = ref(''); // For displaying errors from Supabase

const resetLoginFields = () => {
  email.value = ''; // Changed from username
  username.value = ''; // Kept for child login / parent signup
  password.value = '';
  pin.value = '';
  authError.value = '';
};

const clearSignupErrors = () => {
  signupFullNameError.value = '';
  signupEmailError.value = '';
  signupUsernameError.value = '';
  signupPasswordError.value = '';
  signupConfirmPasswordError.value = '';
  signupFamilyNameError.value = '';
  signupTermsError.value = '';
  authError.value = '';
};

const resetSignupFields = () => {
  signupFullName.value = '';
  signupEmail.value = '';
  signupUsername.value = '';
  signupPassword.value = '';
  signupConfirmPassword.value = '';
  signupFamilyName.value = '';
  signupAgreedToTerms.value = false;
  clearSignupErrors();
};

const selectUserType = (type) => {
  userType.value = type;
  showLoginForm.value = true;
  showSignupForm.value = false;
  resetLoginFields();
  resetSignupFields(); 
};

const prepareSignup = () => {
  showSignupForm.value = true;
  showLoginForm.value = false;
  userType.value = ''; 
  resetLoginFields();
  resetSignupFields(); 
};

const backToInitial = () => {
  userType.value = '';
  showLoginForm.value = false;
  showSignupForm.value = false;
  resetLoginFields();
  resetSignupFields(); 
};

const switchToLogin = () => {
  showSignupForm.value = false;
  showLoginForm.value = false; // Will show initial selection
  userType.value = '';
  resetLoginFields();
  resetSignupFields();
  // To default to Parent login form directly:
  // selectUserType('Parent'); 
};

const handleLogin = async () => {
  authError.value = '';
  if (userType.value === 'Parent') {
    if (!email.value || !password.value) {
      authError.value = 'Email and password are required.';
      return;
    }
    isLoading.value = true;
    try {
      const { data, error } = await $supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      });
      if (error) throw error;
      console.log('Parent logged in:', data.user);
      // User session is automatically managed by Supabase client
      navigateTo('/parent-dashboard'); 
    } catch (error) { 
      console.error('Login error:', error);
      authError.value = error.message || 'Failed to login. Please check your credentials.';
    } finally {
      isLoading.value = false;
    }
  } else if (userType.value === 'Child') {
    // Child PIN login logic is not implemented with Supabase yet.
    // This will require custom implementation (e.g., fetching profile by username, verifying PIN).
    console.log('Attempting Child login (placeholder):', username.value, 'PIN:', pin.value);
    authError.value = 'Child login with PIN is not yet implemented with Supabase.';
    // For now, do not navigate or attempt Supabase auth for child.
    // navigateTo('/child-dashboard'); 
  }
};

const validateSignupForm = () => {
  clearSignupErrors();
  let isValid = true;

  if (!signupFullName.value.trim()) {
    signupFullNameError.value = 'Full Name is required.';
    isValid = false;
  }
  if (!signupEmail.value.trim()) {
    signupEmailError.value = 'Email Address is required.';
    isValid = false;
  } else {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(signupEmail.value)) {
      signupEmailError.value = 'Please enter a valid email address.';
      isValid = false;
    }
  }
  if (!signupUsername.value.trim()) {
    signupUsernameError.value = 'Username is required.';
    isValid = false;
  }
  // Supabase default minimum password length is 6
  if (!signupPassword.value) {
    signupPasswordError.value = 'Password is required.';
    isValid = false;
  } else if (signupPassword.value.length < 6) { 
    signupPasswordError.value = 'Password must be at least 6 characters long.';
    isValid = false;
  }
  // Removed custom special character validation for now, Supabase has its own checks.
  // Can be added back if specific local validation is desired before hitting API.

  if (!signupConfirmPassword.value) {
    signupConfirmPasswordError.value = 'Confirm Password is required.';
    isValid = false;
  } else if (signupPassword.value !== signupConfirmPassword.value) {
    signupConfirmPasswordError.value = 'Passwords do not match.';
    isValid = false;
  }
  if (!signupFamilyName.value.trim()) {
    // Note: FamilyName is not currently part of the 'profiles' table schema.
    // This field is collected but not sent to Supabase for profile creation.
    // If it's needed, the 'profiles' table and trigger should be updated.
    signupFamilyNameError.value = 'Family Name is required.';
    isValid = false;
  }
  if (!signupAgreedToTerms.value) {
    signupTermsError.value = 'You must agree to the Terms and Conditions and Privacy Policy.';
    isValid = false;
  }
  return isValid;
};

const handleSignup = async () => {
  if (!validateSignupForm()) {
    return; // Stop if client-side validation fails
  }

  isLoading.value = true;
  authError.value = '';

  try {
    const { data, error } = await $supabase.auth.signUp({
      email: signupEmail.value,
      password: signupPassword.value,
      options: {
        data: {
          full_name: signupFullName.value.trim(),
          username: signupUsername.value.trim(),
          role: 'parent', // Changed to lowercase 'parent'
        }
      }
    });

    if (error) throw error;

    // data.user will be null if email confirmation is required, but data.session will also be null.
    // data.user will exist if email confirmation is NOT required.
    // For our case, email confirmation IS enabled.
    console.log('Signup successful, user data (pending confirmation):', data.user);
    resetSignupFields();
    navigateTo('/please-confirm'); 

  } catch (error) { 
    console.error('Signup error:', error);
    authError.value = error.message || 'Failed to create account. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

</script>

<style scoped>
/* Add any custom styles here if needed */
</style>
