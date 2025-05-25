import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import FamilySettings from '../../pages/family-settings.vue';

// Mock child components to isolate testing to FamilySettings page logic
const FamilyMemberItemMock = {
  name: 'FamilyMemberItem',
  props: ['member'],
  template: '<div class="family-member-item-mock">{{ member.name }} <button @click="$emit(\'delete\', member.id)" class="delete-member-btn">Delete</button></div>',
};

const AddMemberModalMock = {
  name: 'AddMemberModal',
  template: '<div class="add-member-modal-mock"></div>',
  // We might need to mock methods if the parent calls them, e.g., openModal
  methods: {
    openModal: vi.fn(),
  }
};

const BaseModalMock = {
  name: 'BaseModal',
  props: ['isOpen'],
  template: '<div v-if="isOpen" class="base-modal-mock"><slot /></div>',
};

// Mock Nuxt features like useRoute, useRouter, navigateTo if needed
vi.mock('#app', () => ({
  useRoute: () => ({ query: {} }), // Default mock, can be overridden in tests
  useRouter: () => ({ push: vi.fn() }),
  navigateTo: vi.fn(),
}));

describe('FamilySettings.vue', () => {
  let wrapper;
  let confirmMock;
  let alertMock;

  const initialFamilyMembers = [
    { id: 1, name: 'Parent One', role: 'Parent', points: 100, level: 1, age: 30, username: 'parent1' },
    { id: 2, name: 'Child One', role: 'Child', points: 200, level: 2, age: 10, username: 'child1' },
    { id: 3, name: 'Child Two', role: 'Child', points: 150, level: 1, age: 8, username: 'child2' },
  ];

  beforeEach(() => {
    // Reset mocks before each test
    confirmMock = vi.spyOn(window, 'confirm');
    alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    wrapper = mount(FamilySettings, {
      global: {
        stubs: {
          FamilyMemberItem: FamilyMemberItemMock,
          AddMemberModal: AddMemberModalMock,
          BaseModal: BaseModalMock,
          NuxtLink: { template: '<a><slot /></a>' } // Simple stub for NuxtLink
        },
        mocks: {
          // Provide a mock for $route directly for the component instance
          $route: { 
            query: {} // Default empty query, tests can override if specific query params are needed
          },
          // $router: { push: vi.fn() } // Add if $router is also used directly
        }
      },
      // shallow: true, // Could use shallow mount if we don't want to render even stubbed children deeply
    });
    // Set initial data - FamilySettings uses a ref for familyMembers
    // We need to set it after mounting if it's fetched or initialized in setup
    // For now, assuming it's initialized directly or we can set it via a method if exposed
    // If familyMembers is directly a ref in setup, we might need to expose it for testing or set it via props if applicable
    // This part might need adjustment based on how familyMembers is truly managed in family-settings.vue
    if (wrapper.vm.familyMembers) { // Check if familyMembers ref exists
        wrapper.vm.familyMembers = [...initialFamilyMembers];
    }
    // Or, if there's a method to set members:
    // wrapper.vm.setFamilyMembers([...initialFamilyMembers]);
    // Trigger an update for computed properties like familyStats
    wrapper.vm.$nextTick(); // Wait for DOM updates
  });

  afterEach(() => {
    confirmMock.mockRestore();
    alertMock.mockRestore();
    vi.clearAllMocks();
  });

  it('renders the component and initial family members', async () => {
    // This direct manipulation might not work if familyMembers is not directly exposed or is deeply reactive in a complex way.
    // A more robust way would be to ensure the component's internal state is set as expected.
    // For now, we assume the setup allows this for simplicity or that it's initialized with some data.
    if (wrapper.vm.familyMembers && wrapper.vm.familyMembers.length === 0 && initialFamilyMembers.length > 0) {
        wrapper.vm.familyMembers = [...initialFamilyMembers];
        await wrapper.vm.$nextTick();
    }
    expect(wrapper.text()).toContain('Family Settings');
    expect(wrapper.findAllComponents(FamilyMemberItemMock).length).toBe(initialFamilyMembers.length);
    expect(wrapper.text()).toContain('Family Statistics');
  });

  it('toggles advanced options visibility', async () => {
    const toggleButton = wrapper.find('[data-testid="toggle-advanced-options-btn"]');
    const dangerZoneSelector = '[data-testid="danger-zone-container"]';

    expect(wrapper.find(dangerZoneSelector).exists()).toBe(false); // Initially hidden

    await toggleButton.trigger('click');
    expect(wrapper.find(dangerZoneSelector).exists()).toBe(true); // Shown

    await toggleButton.trigger('click');
    expect(wrapper.find(dangerZoneSelector).exists()).toBe(false); // Hidden again
  });

  it('handleDeleteMember removes a member when confirmed', async () => {
    confirmMock.mockReturnValue(true); // Simulate user clicking "OK"
    const memberToDelete = initialFamilyMembers[1]; // Child One

    // Ensure familyMembers is set for the test if not already
    if (wrapper.vm.familyMembers && wrapper.vm.familyMembers.length === 0 && initialFamilyMembers.length > 0) {
        wrapper.vm.familyMembers = [...initialFamilyMembers];
        await wrapper.vm.$nextTick();
    }

    // Simulate the delete event from a FamilyMemberItem mock
    // This requires FamilyMemberItemMock to correctly emit 'delete' with member.id
    // Or, we can directly call the method if it's easier to test in isolation
    await wrapper.vm.handleDeleteMember(memberToDelete.id);
    await wrapper.vm.$nextTick();

    expect(confirmMock).toHaveBeenCalledOnce();
    expect(wrapper.vm.familyMembers.length).toBe(initialFamilyMembers.length - 1);
    expect(wrapper.vm.familyMembers.find(m => m.id === memberToDelete.id)).toBeUndefined();
    // We should also test that updateFamilyStats was called, if possible (e.g., by spying on it)
  });

  it('handleDeleteMember does nothing if not confirmed', async () => {
    confirmMock.mockReturnValue(false); // Simulate user clicking "Cancel"
    const memberToDelete = initialFamilyMembers[1];
    
    if (wrapper.vm.familyMembers && wrapper.vm.familyMembers.length === 0 && initialFamilyMembers.length > 0) {
        wrapper.vm.familyMembers = [...initialFamilyMembers];
        await wrapper.vm.$nextTick();
    }
    const initialLength = wrapper.vm.familyMembers.length;

    await wrapper.vm.handleDeleteMember(memberToDelete.id);
    await wrapper.vm.$nextTick();

    expect(confirmMock).toHaveBeenCalledOnce();
    expect(wrapper.vm.familyMembers.length).toBe(initialLength);
  });

  it('deleteEntireFamily clears all members when confirmed twice', async () => {
    confirmMock.mockReturnValue(true); // Simulate user clicking "OK" for both confirms
    
    if (wrapper.vm.familyMembers && wrapper.vm.familyMembers.length === 0 && initialFamilyMembers.length > 0) {
        wrapper.vm.familyMembers = [...initialFamilyMembers];
        await wrapper.vm.$nextTick();
    }

    // Find the "Delete Entire Family" button - assuming it's in the danger zone
    // First, ensure danger zone is visible
    const toggleButton = wrapper.find('[data-testid="toggle-advanced-options-btn"]'); 
    if (!wrapper.find('[data-testid="danger-zone-container"]').exists()) {
        await toggleButton.trigger('click'); // Show advanced options
    }
    
    const deleteFamilyButton = wrapper.find('[data-testid="delete-entire-family-btn"]');
    await deleteFamilyButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(confirmMock).toHaveBeenCalledTimes(2);
    expect(wrapper.vm.familyMembers.length).toBe(0);
  });

  it('deleteEntireFamily does nothing if any confirmation is cancelled', async () => {
    // Test case 1: First confirm cancelled
    confirmMock.mockReturnValueOnce(false); // First confirm: Cancel
    // confirmMock.mockReturnValueOnce(true); // Second confirm: OK (won't be reached)
    
    if (wrapper.vm.familyMembers && wrapper.vm.familyMembers.length === 0 && initialFamilyMembers.length > 0) {
        wrapper.vm.familyMembers = [...initialFamilyMembers];
        await wrapper.vm.$nextTick();
    }
    const initialLength = wrapper.vm.familyMembers.length;

    const toggleButton = wrapper.find('[data-testid="toggle-advanced-options-btn"]');
    if (!wrapper.find('[data-testid="danger-zone-container"]').exists()) {
        await toggleButton.trigger('click');
    }
    const deleteFamilyButton = wrapper.find('[data-testid="delete-entire-family-btn"]');
    await deleteFamilyButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(confirmMock).toHaveBeenCalledTimes(1); // Only first confirm called
    expect(wrapper.vm.familyMembers.length).toBe(initialLength);

    // Reset for next part of the test
    confirmMock.mockReset();
    if (wrapper.vm.familyMembers) wrapper.vm.familyMembers = [...initialFamilyMembers];
    await wrapper.vm.$nextTick();

    // Test case 2: First confirm OK, second confirm cancelled
    confirmMock.mockReturnValueOnce(true);  // First confirm: OK
    confirmMock.mockReturnValueOnce(false); // Second confirm: Cancel

    if (!wrapper.find('[data-testid="danger-zone-container"]').exists()) {
        await toggleButton.trigger('click');
    }
    await deleteFamilyButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(confirmMock).toHaveBeenCalledTimes(2); // Both confirms called
    expect(wrapper.vm.familyMembers.length).toBe(initialLength);
  });

  // TODO: Add tests for updateFamilyStats calculation
  // TODO: Add tests for tab navigation if query params are used and affect behavior significantly

});
