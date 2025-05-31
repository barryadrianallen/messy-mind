<template>
  <div class="min-h-screen bg-white flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

      <!-- Initial View: Login or Parent Signup Option -->
      <div v-if="!showLoginForm && !showSignupForm && !showChildLoginForm" data-testid="user-type-selection">
        <h1 class="text-3xl font-bold text-center text-gray-900 mb-2">Messy Mind</h1>
        <p class="text-gray-900 text-center mb-6">Please select your account type to continue:</p>
        
        <div class="space-y-4">
          <button 
            @click="selectUserType('Parent')" 
            data-testid="parent-button"
            class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors text-lg"
          >
            I am a Parent
          </button>
          <button 
            @click="selectUserType('Child')" 
            data-testid="child-button"
            class="w-full border-2 border-blue-600 text-blue-600 font-bold py-3 px-4 rounded-xl hover:bg-blue-50 transition-colors text-lg"
          >
            I am a Child
          </button>
        </div>

        <div class="mt-8 text-center">
          <p class="text-gray-600 mb-2">New family?</p>
          <button 
            @click="switchToSignup" 
            data-testid="create-parent-account-button"
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
      <form v-if="showLoginForm && !showSignupForm" @submit.prevent="handleLogin" class="space-y-4" data-testid="parent-login-form">
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
            v-model="loginEmail" 
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
            v-model="loginPassword"
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

        <div v-if="loginError" class="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">
          {{ loginError }}
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
            @click="switchToUserTypeSelection"
            type="button"
            data-testid="back-to-home-button-parent-login"
            class="text-blue-600 hover:text-blue-800 text-sm transition-colors"
          >
            Back to Home
          </button>
        </div>
      </form>

      <!-- Child Login Form -->
      <div v-if="showChildLoginForm" class="animate-fadeIn space-y-4" data-testid="child-login-form">
        <h1 class="text-3xl font-bold text-center text-gray-900 mb-2">Child Login</h1>
        <p class="text-gray-500 text-center text-sm mb-6">Enter your special username and password.</p>
        
        <form @submit.prevent="handleChildLogin" class="space-y-4">
          <div>
            <label for="childUsername" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input id="childUsername" v-model="childUsername" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Your unique username">
          </div>
          <div>
            <label for="childPassword" class="block text-sm font-medium text-gray-700 mb-1">Password (PIN)</label>
            <input id="childPassword" v-model="childPassword" type="password" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Your secret password">
          </div>

          <div v-if="childLoginError" class="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">
            {{ childLoginError }}
          </div>

          <button type="submit" :disabled="isLoading" class="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-xl hover:bg-green-600 transition-colors text-lg mt-6 disabled:opacity-50">
            {{ isLoading ? 'Logging in...' : 'Enter' }}
          </button>
        </form>

        <div class="text-center mt-4">
          <button @click="switchToUserTypeSelection" type="button" data-testid="back-to-home-button-child-login" class="text-sm text-gray-600 hover:text-gray-800">Back to Home</button>
        </div>
      </div>

      <!-- Parent Signup Form -->
      <div v-if="showSignupForm" data-testid="parent-signup-form">
        <button @click="switchToUserTypeSelection" data-testid="back-to-home-button-parent-signup" class="mb-4 text-blue-600 hover:text-blue-800 flex items-center">
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
          
          <div v-if="signupError" class="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">
            {{ signupError }}
          </div>

          <button 
            type="submit" 
            :disabled="isLoading"
            data-testid="signup-submit-button"
            class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors text-lg mt-6 disabled:opacity-50"
          >
            {{ isLoading ? 'Creating Account...' : 'Create Parent Account' }}
          </button>

          <div class="text-center mt-4 space-y-1">
            <p class="text-sm text-gray-600">
              Already have an account? 
              <button @click="switchToLogin" type="button" class="font-medium text-blue-600 hover:text-blue-800">Sign in here</button>
            </p>
            <button @click="switchToUserTypeSelection" type="button" class="text-sm text-gray-600 hover:text-gray-800">Back to Home</button>
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
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

const { $supabase } = useNuxtApp(); // Now provided by @nuxtjs/supabase
const router = useRouter();
const user = useSupabaseUser();

// State for user type selection
const userType = ref(''); // 'parent' or 'child'
const showUserTypeSelection = ref(true);

// State for login form
const showLoginForm = ref(false);
const loginEmail = ref('');
const loginPassword = ref('');
const loginError = ref('');
const isLoading = ref(false); // Added for loading state

// State for signup form
const showSignupForm = ref(false);
const signupEmail = ref('');
const signupPassword = ref('');
const signupConfirmPassword = ref('');
const signupError = ref('');
const signupSuccess = ref('');
const signupFullName = ref(''); // Added for signup form
const signupUsername = ref(''); // Added for signup form
const signupFamilyName = ref(''); // Added for signup form
const signupAgreedToTerms = ref(false); // Added for signup form
const signupFullNameError = ref('');
const signupEmailError = ref('');
const signupUsernameError = ref('');
const signupPasswordError = ref('');
const signupConfirmPasswordError = ref('');
const signupFamilyNameError = ref('');
const signupTermsError = ref('');

// State for child login
const showChildLoginForm = ref(false);
const childUsername = ref('');
const childPassword = ref(''); // Added for child login form
const childPin = ref('');
const childLoginError = ref('');

// Watch for user changes (e.g., after login/signup)
watch(user, (currentUser) => {
  if (currentUser) {
    // Determine user role and redirect
    // This logic might need adjustment based on how roles are stored/fetched
    // For now, assuming a parent logs in, redirect to parent dashboard
    // If child login is implemented, redirect to child dashboard
    if (userType.value === 'parent' || (currentUser.email && !childUsername.value)) {
      router.push('/parent-dashboard');
    } else if (userType.value === 'child') {
      // Add logic to verify child user and redirect to child dashboard
      // This part is tricky because useSupabaseUser won't reflect a custom child session easily.
      // For now, direct navigation might be the simplest for the placeholder.
      router.push('/child-dashboard'); 
    }
  } else {
    // User is logged out, ensure they are on a login/selection page
    // or handle as per your app's flow
    if (router.currentRoute.value.path !== '/login' && 
        router.currentRoute.value.path !== '/' && 
        !showUserTypeSelection.value && 
        !showLoginForm.value && 
        !showSignupForm.value && 
        !showChildLoginForm.value) {
      // router.push('/login'); // Or back to user type selection
    }
  }
}, { immediate: true });

const selectUserType = (type) => {
  console.log('[Login Page] selectUserType called with type:', type);
  const lowerCaseType = type.toLowerCase();
  userType.value = type; // Keep original casing for display or other logic if needed, or use lowerCaseType
  showUserTypeSelection.value = false;
  console.log('[Login Page] In selectUserType, showUserTypeSelection is now:', showUserTypeSelection.value);
  if (lowerCaseType === 'parent') {
    showLoginForm.value = true; // Default to showing login form for parent
    console.log('[Login Page] showLoginForm set to:', showLoginForm.value);
  } else if (lowerCaseType === 'child') {
    showChildLoginForm.value = true;
    console.log('[Login Page] showChildLoginForm set to:', showChildLoginForm.value);
  }
};

const handleParentLogin = async () => {
  loginError.value = '';
  isLoading.value = true;
  try {
    const { error } = await $supabase.auth.signInWithPassword({
      email: loginEmail.value,
      password: loginPassword.value,
    });
    if (error) throw error;
    // User will be redirected by the watcher
  } catch (error) {
    loginError.value = error.message;
    console.error('Login error:', error.message);
  } finally {
    isLoading.value = false;
  }
};

const handleParentSignup = async () => {
  signupError.value = '';
  signupSuccess.value = '';
  isLoading.value = true;
  // Basic validation example (can be expanded)
  if (signupPassword.value !== signupConfirmPassword.value) {
    signupError.value = 'Passwords do not match.';
    isLoading.value = false;
    return;
  }
  if (!signupAgreedToTerms.value) { // Assuming signupAgreedToTerms is defined
    signupError.value = 'You must agree to the terms and conditions.';
    isLoading.value = false;
    return;
  }

  try {
    const { data, error } = await $supabase.auth.signUp({
      email: signupEmail.value,
      password: signupPassword.value,
      // You might want to pass additional user metadata here if your Supabase setup expects it
      // options: {
      //   data: {
      //     full_name: signupFullName.value, // Example
      //     username: signupUsername.value, // Example
      //     family_name: signupFamilyName.value // Example
      //   }
      // }
    });
    if (error) throw error;
    signupSuccess.value = 'Signup successful! Please check your email to confirm your account.';
    // Optionally clear form or switch to login view
    // showSignupForm.value = false;
    // showLoginForm.value = true;
  } catch (error) {
    signupError.value = error.message;
    console.error('Signup error:', error.message);
  } finally {
    isLoading.value = false;
  }
};

const handleChildLogin = async () => {
  childLoginError.value = '';
  // Placeholder for child login logic
  // This will involve fetching child profile by username and verifying PIN
  // For now, simulate a successful login for navigation testing
  console.log(`Attempting child login for: ${childUsername.value}`);
  if (childUsername.value && childPin.value) {
    // In a real scenario, you would query Supabase for the child profile
    // and verify the hashed PIN.
    // For now, let's assume login is successful if fields are filled.
    console.log('Child login successful (simulated), redirecting...');
    // To make the watcher redirect, we'd typically set the `user` object.
    // Since this is a mock, we'll directly navigate for now, but ideally,
    // child auth would also result in a user session recognized by useSupabaseUser
    // or a custom child user state.
    userType.value = 'child'; // Ensure userType is set for watcher logic
    // This is tricky because useSupabaseUser won't reflect a custom child session easily.
    // For now, direct navigation might be the simplest for the placeholder.
    router.push('/child-dashboard'); 
  } else {
    childLoginError.value = 'Username and PIN are required.';
  }
};

const switchToSignup = () => {
  showLoginForm.value = false;
  showSignupForm.value = true;
  loginError.value = '';
};

const switchToLogin = () => {
  showSignupForm.value = false;
  showLoginForm.value = true;
  signupError.value = '';
  signupSuccess.value = '';
};

const switchToUserTypeSelection = () => {
  console.log('[Login Page] switchToUserTypeSelection called.');
  console.log('[Login Page] Before state change: showLoginForm:', showLoginForm.value, 'showSignupForm:', showSignupForm.value, 'showChildLoginForm:', showChildLoginForm.value, 'showUserTypeSelection:', showUserTypeSelection.value, 'userType:', userType.value);
  showLoginForm.value = false;
  showSignupForm.value = false;
  showChildLoginForm.value = false;
  showUserTypeSelection.value = true;
  userType.value = ''; // Ensure userType is reset
  // Clear any errors
  loginError.value = '';
  signupError.value = '';
  signupSuccess.value = '';
  childLoginError.value = '';
  console.log('[Login Page] After state change: showLoginForm:', showLoginForm.value, 'showSignupForm:', showSignupForm.value, 'showChildLoginForm:', showChildLoginForm.value, 'showUserTypeSelection:', showUserTypeSelection.value, 'userType:', userType.value);
};

</script>

<style scoped>
/* Add any specific styles for the login page here */
.user-type-button {
  /* Example: Tailwind classes for styling, adjust as needed */
  @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-xl shadow-md transition duration-150 ease-in-out m-2;
}

.form-container {
  @apply mt-8 p-6 bg-white rounded-lg shadow-xl w-full max-w-md;
}

.form-input {
  @apply mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm;
}

.form-button {
  @apply w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500;
}

.error-message {
  @apply mt-2 text-sm text-red-600;
}

.success-message {
  @apply mt-2 text-sm text-green-600;
}

.toggle-link {
  @apply font-medium text-indigo-600 hover:text-indigo-500;
}

.back-button {
    @apply absolute top-4 left-4 text-indigo-600 hover:text-indigo-800;
}
</style>
