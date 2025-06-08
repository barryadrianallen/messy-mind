<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig();
console.log('Runtime Supabase URL from nuxt.config.js:', runtimeConfig.public.supabaseUrl);
console.log('Runtime Supabase Anon Key from nuxt.config.js:', runtimeConfig.public.supabaseAnonKey);

const supabase = useSupabaseClient();
console.log('Supabase client instance URL:', supabase.supabaseUrl);
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
  ],
})
</script>
