import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import AddMemberModal from '../../components/AddMemberModal.vue';

describe('AddMemberModal.vue', () => {
  let wrapper;

  beforeEach(() => {
    // Mock window.alert
    global.alert = vi.fn();
    wrapper = mount(AddMemberModal, {
      props: { show: false } // Initially hidden
    });
  });

  it('is not visible when show prop is false', () => {
    expect(wrapper.find('.fixed.inset-0').exists()).toBe(false);
  });

  it('is visible when show prop is true', async () => {
    await wrapper.setProps({ show: true });
    expect(wrapper.find('.fixed.inset-0').exists()).toBe(true);
    expect(wrapper.find('h3').text()).toBe('Add New Family Member');
  });

  it('renders all basic form fields when visible', async () => {
    await wrapper.setProps({ show: true });
    expect(wrapper.find('input#fullName').exists()).toBe(true);
    expect(wrapper.find('select#role').exists()).toBe(true);
    expect(wrapper.find('input#username').exists()).toBe(true);
    expect(wrapper.find('input#age').exists()).toBe(false); // Age hidden initially
  });

  it('shows age field when role is Child, hides otherwise', async () => {
    await wrapper.setProps({ show: true });
    const roleSelect = wrapper.find('select#role');

    await roleSelect.setValue('Child');
    expect(wrapper.find('input#age').exists()).toBe(true);

    await roleSelect.setValue('Parent');
    expect(wrapper.find('input#age').exists()).toBe(false);
  });

  it('clears age when role changes from Child to Parent', async () => {
    await wrapper.setProps({ show: true });
    const roleSelect = wrapper.find('select#role');
    const ageInput = () => wrapper.find('input#age');

    await roleSelect.setValue('Child');
    await ageInput().setValue(10);
    expect(wrapper.vm.form.age).toBe(10);

    await roleSelect.setValue('Parent');
    expect(wrapper.vm.form.age).toBe(null);
  });

  it('resets form when modal becomes visible', async () => {
    // First, set some data as if modal was used and closed
    await wrapper.setData({ 
      form: { fullName: 'Old Name', role: 'Parent', age: null, username: 'olduser' }
    });
    await wrapper.setProps({ show: false }); // Hide it

    // Now show it again
    await wrapper.setProps({ show: true });
    expect(wrapper.vm.form.fullName).toBe('');
    expect(wrapper.vm.form.role).toBe('');
    expect(wrapper.vm.form.age).toBe(null);
    expect(wrapper.vm.form.username).toBe('');
  });

  it('updates form data on input', async () => {
    await wrapper.setProps({ show: true });
    await wrapper.find('input#fullName').setValue('Test Name');
    await wrapper.find('select#role').setValue('Child');
    await wrapper.find('input#age').setValue(8);
    await wrapper.find('input#username').setValue('testuser');

    expect(wrapper.vm.form.fullName).toBe('Test Name');
    expect(wrapper.vm.form.role).toBe('Child');
    expect(wrapper.vm.form.age).toBe(8);
    expect(wrapper.vm.form.username).toBe('testuser');
  });

  it('emits "close" when close (X) button is clicked', async () => {
    await wrapper.setProps({ show: true });
    // The close button is the second direct child (the button itself) of the header flex container
    await wrapper.find('.px-6.py-4.border-b.flex.justify-between.items-center > button').trigger('click');
    expect(wrapper.emitted().close).toBeTruthy();
  });

  it('emits "close" when Cancel button is clicked', async () => {
    await wrapper.setProps({ show: true });
    await wrapper.findAll('button[type="button"]').filter(b => b.text() === 'Cancel').at(0).trigger('click');
    expect(wrapper.emitted().close).toBeTruthy();
  });

  describe('Form Submission', () => {
    beforeEach(async () => {
      await wrapper.setProps({ show: true });
      global.alert.mockClear(); // Clear alert mock for each submission test
    });

    it('emits "add-member" and "close" on successful submission for Child', async () => {
      await wrapper.find('input#fullName').setValue('Child Name');
      await wrapper.find('select#role').setValue('Child');
      await wrapper.find('input#age').setValue(7);
      await wrapper.find('input#username').setValue('childuser');
      await wrapper.find('form').trigger('submit.prevent');

      expect(wrapper.emitted()['add-member']).toBeTruthy();
      expect(wrapper.emitted()['add-member'][0][0]).toEqual({
        fullName: 'Child Name',
        role: 'Child',
        age: 7,
        username: 'childuser'
      });
      expect(wrapper.emitted().close).toBeTruthy();
      expect(global.alert).not.toHaveBeenCalled();
    });

    it('emits "add-member" (without age) and "close" on successful submission for Parent', async () => {
      await wrapper.find('input#fullName').setValue('Parent Name');
      await wrapper.find('select#role').setValue('Parent');
      // Age field won't be visible or set
      await wrapper.find('input#username').setValue('parentuser');
      await wrapper.find('form').trigger('submit.prevent');

      expect(wrapper.emitted()['add-member']).toBeTruthy();
      expect(wrapper.emitted()['add-member'][0][0]).toEqual({
        fullName: 'Parent Name',
        role: 'Parent',
        // age should be undefined or not present
        username: 'parentuser'
      });
      expect(wrapper.emitted()['add-member'][0][0].age).toBeUndefined();
      expect(wrapper.emitted().close).toBeTruthy();
      expect(global.alert).not.toHaveBeenCalled();
    });

    it('shows alert and does not emit if role is Child and age is invalid (null)', async () => {
      await wrapper.find('input#fullName').setValue('Child Name');
      await wrapper.find('select#role').setValue('Child');
      // Age not set, will be null
      await wrapper.find('input#username').setValue('childuser');
      await wrapper.find('form').trigger('submit.prevent');

      expect(global.alert).toHaveBeenCalledWith('Please enter a valid age for the child.');
      expect(wrapper.emitted()['add-member']).toBeUndefined();
      expect(wrapper.emitted().close).toBeUndefined(); // Modal should not close on validation error
    });

    it('shows alert and does not emit if role is Child and age is invalid (negative)', async () => {
      await wrapper.find('input#fullName').setValue('Child Name');
      await wrapper.find('select#role').setValue('Child');
      await wrapper.find('input#age').setValue(-5);
      await wrapper.find('input#username').setValue('childuser');
      await wrapper.find('form').trigger('submit.prevent');

      expect(global.alert).toHaveBeenCalledWith('Please enter a valid age for the child.');
      expect(wrapper.emitted()['add-member']).toBeUndefined();
      expect(wrapper.emitted().close).toBeUndefined();
    });
  });
});
