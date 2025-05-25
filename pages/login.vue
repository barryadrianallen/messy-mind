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
            <span class="text-sm text-gray-400 mx-1">|</span>
            <NuxtLink to="/forgot-username" class="text-sm text-blue-600 hover:text-blue-800 hover:underline">
              Forgot Username?
            </NuxtLink>
          </div>
        </div>

        <!-- PIN field for Child -->
        <div v-if="userType === 'Child'">
          <label for="pin" class="block text-sm font-medium text-gray-700 mb-1">PIN</label>
          <input
            id="pin"
            v-model="pin"
            type="password" 
            inputmode="numeric"
            pattern="\d{4,6}" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your 4-6 digit PIN"
          >
        </div>
        
        <button
          type="submit"
          class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors text-lg mt-6"
        >
          Login
        </button>
        
        <div class="text-center mt-4">
          <button 
            @click="backToInitial"
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
            <input id="signupUsername" v-model="signupUsername" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Choose a username">
            <p v-if="signupUsernameError" class="text-red-500 text-xs mt-1">{{ signupUsernameError }}</p>
          </div>
          <div>
            <label for="signupPassword" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input id="signupPassword" v-model="signupPassword" type="password" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-xs" placeholder="Min 5 characters and 1 special character eg (*&$)">
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
            <p v-if="signupTermsError" class="text-red-500 text-xs mt-1">{{ signupTermsError }}</p>
          </div>
          
          <button type="submit" class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors text-lg mt-6">
            Create Parent Account
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

const userType = ref('');
const showLoginForm = ref(false);
const username = ref(''); // For login
const password = ref(''); // For login
const pin = ref('');      // For login

// Parent Signup state variables
const showSignupForm = ref(false);
const signupFullName = ref('');
const signupEmail = ref('');
const signupUsername = ref(''); // For signup
const signupPassword = ref(''); // For signup
const signupConfirmPassword = ref('');
const signupFamilyName = ref('');
const signupAgreedToTerms = ref(false);

// Signup error message refs
const signupFullNameError = ref('');
const signupEmailError = ref('');
const signupUsernameError = ref('');
const signupPasswordError = ref('');
const signupConfirmPasswordError = ref('');
const signupFamilyNameError = ref('');
const signupTermsError = ref('');

const resetLoginFields = () => {
  username.value = '';
  password.value = '';
  pin.value = '';
  signupFamilyName.value = '';
  signupAgreedToTerms.value = false;
  clearSignupErrors();
};

const clearSignupErrors = () => {
  signupFullNameError.value = '';
  signupEmailError.value = '';
  signupUsernameError.value = '';
  signupPasswordError.value = '';
  signupConfirmPasswordError.value = '';
  signupFamilyNameError.value = '';
  signupTermsError.value = '';
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
  resetSignupFields(); // This will also clear signup errors
};

const prepareSignup = () => {
  showSignupForm.value = true;
  showLoginForm.value = false;
  userType.value = ''; // Clear login type selection
  resetLoginFields();
  resetSignupFields(); // This will also clear signup errors
};

const backToInitial = () => {
  userType.value = '';
  showLoginForm.value = false;
  showSignupForm.value = false;
  resetLoginFields();
  resetSignupFields(); // This will also clear signup errors
};

const switchToLogin = () => {
  backToInitial(); // Easiest way to ensure clean state for login selection
  // Or, if you want to default to Parent login immediately:
  // selectUserType('Parent'); 
};

const handleLogin = () => {
  if (userType.value === 'Parent') {
    console.log('Logging in as Parent:', username.value, 'Password:', password.value);
    // Navigate to parent dashboard
    navigateTo('/parent-dashboard'); 
  } else if (userType.value === 'Child') {
    console.log('Logging in as Child:', username.value, 'PIN:', pin.value);
    // Navigate to child dashboard
    navigateTo('/child-dashboard'); 
  }
  // Placeholder for actual authentication
  // alert(`Login attempt for ${userType.value}: ${username.value}`); // Commenting out alert for smoother navigation
};

const handleSignup = () => {
  clearSignupErrors();
  let isValid = true;

  // Validate Full Name
  if (!signupFullName.value.trim()) {
    signupFullNameError.value = 'Full Name is required.';
    isValid = false;
  }

  // Validate Email
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

  // Validate Username
  if (!signupUsername.value.trim()) {
    signupUsernameError.value = 'Username is required.';
    isValid = false;
  }

  // Validate Password
  if (!signupPassword.value) {
    signupPasswordError.value = 'Password is required.';
    isValid = false;
  } else {
    if (signupPassword.value.length < 5) {
      signupPasswordError.value = 'Password must be at least 5 characters long.';
      isValid = false;
    } else {
      const specialCharPattern = /[^A-Za-z0-9]/;
      if (!specialCharPattern.test(signupPassword.value)) {
        signupPasswordError.value = 'Password must include at least one special character.';
        isValid = false;
      }
    }
  }

  // Validate Confirm Password
  if (!signupConfirmPassword.value) {
    signupConfirmPasswordError.value = 'Confirm Password is required.';
    isValid = false;
  } else if (signupPassword.value !== signupConfirmPassword.value) {
    signupConfirmPasswordError.value = 'Passwords do not match.';
    isValid = false;
  }

  // Validate Family Name
  if (!signupFamilyName.value.trim()) {
    signupFamilyNameError.value = 'Family Name is required.';
    isValid = false;
  }

  // Validate Terms and Conditions
  if (!signupAgreedToTerms.value) {
    signupTermsError.value = 'You must agree to the Terms and Conditions and Privacy Policy.';
    isValid = false;
  }

  if (!isValid) {
    return; // Stop if validation fails
  }

  // If all validations pass
  console.log('Parent Signup Details:', {
    fullName: signupFullName.value,
    email: signupEmail.value,
    username: signupUsername.value,
    password: signupPassword.value, // In a real app, hash this before sending
    familyName: signupFamilyName.value,
    agreedToTerms: signupAgreedToTerms.value
  });
  alert('Parent account creation request received! (See console for details)');
  // Placeholder for actual API call to register parent
  // After successful signup, navigate to login or parent dashboard
  backToInitial(); // Go back to the initial screen for now
};

</script>

<style scoped>
/* Add any custom styles here if needed */
</style>
