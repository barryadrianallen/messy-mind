// tests/pages/login.spec.js
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import LoginPage from '@/pages/login.vue';

// Mock Nuxt composables
import { ref } from 'vue'; // Import ref

import { ref, nextTick } from 'vue'; // Import nextTick
import { routerKey, routeLocationKey } from 'vue-router'; // Import official keys

// 1. Define reactive properties and mock functions
const mockPush = vi.fn();
const mockReplace = vi.fn();
const mockNavigateTo = vi.fn();
const mockCurrentRoute = ref({
  path: '/login',
  name: 'login',
  params: {},
  query: {},
  hash: '',
  fullPath: '/login',
  matched: [],
  meta: {},
  redirectedFrom: undefined
});

// 2. Define the router instance that will be provided
const routerInstanceToBeProvided = {
  push: mockPush,
  replace: mockReplace,
  currentRoute: mockCurrentRoute,
  resolve: vi.fn(to => ({ href: typeof to === 'string' ? to : JSON.stringify(to) })),
  options: { routes: [] }, // Mock parts of the router instance
  isReady: () => Promise.resolve()
};

// 3. Mock Nuxt composables to return the above reactive properties/functions
vi.mock('#app', () => ({
  useRouter: () => routerInstanceToBeProvided,
  useRoute: () => mockCurrentRoute,
  navigateTo: mockNavigateTo
}));

// 4. Create a plugin to provide the router instance and route
const testRouterPlugin = {
  install(app) {
    app.provide(routerKey, routerInstanceToBeProvided); // Use routerKey
    app.provide(routeLocationKey, mockCurrentRoute);    // Use routeLocationKey
    
    // Also set global properties if your component or Nuxt internals rely on $router/$route
    // This part might be less critical if injection works correctly, but can be a fallback
    app.config.globalProperties.$router = routerInstanceToBeProvided;
    app.config.globalProperties.$route = mockCurrentRoute.value; // $route is typically the .value of the reactive route
  }
};

vi.mock('@nuxtjs/supabase', () => ({
  useSupabaseClient: () => ({
    auth: {
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }))
    }
  }),
  useSupabaseUser: () => vi.fn().mockReturnValue(null) // Mock user as null initially
}));

describe('LoginPage', () => {
  it('renders the initial user type selection view', () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [testRouterPlugin],
        stubs: {
          NuxtLink: true // Stub NuxtLink
        }
      }
    });

    // Check for initial title
    expect(wrapper.html()).toContain('Messy Mind');
    expect(wrapper.html()).toContain('Please select your account type to continue:');

    // Check for initial buttons
    expect(wrapper.find('[data-testid="parent-button"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="child-button"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="create-parent-account-button"]').exists()).toBe(true);
  });

  it('shows parent login form when "I am a Parent" is clicked', async () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [testRouterPlugin],
        stubs: {
          NuxtLink: true // Stub NuxtLink
        }
      }
    });
    await wrapper.find('[data-testid="parent-button"]').trigger('click');
    await nextTick();

    expect(wrapper.find('[data-testid="parent-login-form"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="user-type-selection"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="child-login-form"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="parent-signup-form"]').exists()).toBe(false);
  });

  it('shows child login form when "I am a Child" is clicked', async () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [testRouterPlugin],
        stubs: {
          NuxtLink: true // Stub NuxtLink
        }
      }
    });
    await wrapper.find('[data-testid="child-button"]').trigger('click');
    await nextTick();

    expect(wrapper.find('[data-testid="child-login-form"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="user-type-selection"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="parent-login-form"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="parent-signup-form"]').exists()).toBe(false);
  });

  it('shows parent signup form when "Create Parent Account" is clicked', async () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [testRouterPlugin],
        stubs: {
          NuxtLink: true // Stub NuxtLink
        }
      }
    });
    await wrapper.find('[data-testid="create-parent-account-button"]').trigger('click');
    await nextTick();

    expect(wrapper.find('[data-testid="parent-signup-form"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="user-type-selection"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="parent-login-form"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="child-login-form"]').exists()).toBe(false);
  });

  it('returns to user type selection from parent login form when "Back to Home" is clicked', async () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [testRouterPlugin],
        stubs: {
          NuxtLink: true
        }
      }
    });

    // Go to Parent Login form
    await wrapper.find('[data-testid="parent-button"]').trigger('click');
    await nextTick();
    expect(wrapper.find('[data-testid="parent-login-form"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="user-type-selection"]').exists()).toBe(false);

    // Click "Back to Home"
    await wrapper.find('[data-testid="back-to-home-button-parent-login"]').trigger('click');
    await nextTick();

    // Verify back to user type selection
    expect(wrapper.find('[data-testid="user-type-selection"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="parent-login-form"]').exists()).toBe(false);
  });

  it('returns to user type selection from child login form when "Back to Home" is clicked', async () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [testRouterPlugin],
        stubs: {
          NuxtLink: true
        }
      }
    });

    // Go to Child Login form
    await wrapper.find('[data-testid="child-button"]').trigger('click');
    await nextTick();
    expect(wrapper.find('[data-testid="child-login-form"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="user-type-selection"]').exists()).toBe(false);

    // Click "Back to Home"
    await wrapper.find('[data-testid="back-to-home-button-child-login"]').trigger('click');
    await nextTick();

    // Verify back to user type selection
    expect(wrapper.find('[data-testid="user-type-selection"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="child-login-form"]').exists()).toBe(false);
  });

  it('returns to user type selection from parent signup form when "Back" is clicked', async () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [testRouterPlugin],
        stubs: {
          NuxtLink: true
        }
      }
    });

    // Go to Parent Signup form
    await wrapper.find('[data-testid="create-parent-account-button"]').trigger('click');
    await nextTick();
    expect(wrapper.find('[data-testid="parent-signup-form"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="user-type-selection"]').exists()).toBe(false);

    // Click "Back"
    await wrapper.find('[data-testid="back-to-home-button-parent-signup"]').trigger('click');
    await nextTick();

    // Verify back to user type selection
    expect(wrapper.find('[data-testid="user-type-selection"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="parent-signup-form"]').exists()).toBe(false);
  });
});
