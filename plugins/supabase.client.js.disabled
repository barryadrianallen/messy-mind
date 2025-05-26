import { createClient } from '@supabase/supabase-js'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()

  const supabaseUrl = config.public.supabaseUrl
  const supabaseAnonKey = config.public.supabaseAnonKey

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon Key is missing from runtime config. Supabase client not initialized.')
    // Provide a null or dummy client if you want the app to run without Supabase
    // Or throw an error to halt execution if Supabase is critical
    nuxtApp.provide('supabase', null)
    return
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  // Provide the Supabase client to the Nuxt app
  // It will be available as $supabase in components and nuxtApp.$supabase elsewhere
  nuxtApp.provide('supabase', supabase)

  // You can also make it available on the context for composables, etc.
  // nuxtApp.vueApp.provide('supabase', supabase) // If needed for provide/inject
})
