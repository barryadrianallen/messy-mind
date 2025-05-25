<template>
  <div class="confirm-container">
    <div class="confirm-box">
      <h1 class="title">Check Your Email</h1>
      <p class="message">
        We've sent a confirmation link to your email address. Please click the link
        in the email to activate your account.
      </p>
      <p class="note">
        If you don't see the email, please check your spam or junk folder.
      </p>
      <NuxtLink to="/login" class="back-link">Back to Login</NuxtLink>
    </div>
  </div>
</template>

<script setup>
// No specific script needed for this simple page
</script>

<style scoped>
.confirm-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh; /* Adjusted for better centering */
  background-color: #f7fafc; /* Light gray background */
  padding: 2rem;
  font-family: 'Arial', sans-serif; /* Example font */
}

.confirm-box {
  background-color: white;
  padding: 2.5rem; /* Increased padding */
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Softer shadow */
  text-align: center;
  max-width: 500px; /* Limit width */
  width: 100%;
}

.title {
  font-size: 1.75rem; /* Slightly smaller title */
  color: #2d3748; /* Darker gray */
  margin-bottom: 1rem;
}

.message {
  font-size: 1rem;
  color: #4a5568; /* Medium gray */
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.note {
  font-size: 0.9rem;
  color: #718096; /* Lighter gray */
  margin-bottom: 2rem;
}

.back-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #4299e1; /* Blue */
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.2s ease-in-out;
}

.back-link:hover {
  background-color: #3182ce; /* Darker blue */
}
</style>
