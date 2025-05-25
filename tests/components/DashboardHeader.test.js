import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DashboardHeader from '../../components/DashboardHeader.vue';

describe('DashboardHeader.vue', () => {
  it('renders the title correctly', () => {
    const title = 'Test Dashboard';
    const wrapper = mount(DashboardHeader, {
      props: { title }
    });
    expect(wrapper.find('h1').text()).toBe(title);
  });

  it.each([
    { size: 'sm', expectedClass: 'text-xl' },
    { size: 'md', expectedClass: 'text-2xl' },
    { size: 'lg', expectedClass: 'text-3xl' }
  ])('applies correct class for title size $size', ({ size, expectedClass }) => {
    const wrapper = mount(DashboardHeader, {
      props: { title: 'Test Title', size }
    });
    expect(wrapper.find('h1').classes()).toContain(expectedClass);
  });

  it('applies default title size md (text-2xl) if no size prop is provided', () => {
    const wrapper = mount(DashboardHeader, {
      props: { title: 'Test Title' }
    });
    expect(wrapper.find('h1').classes()).toContain('text-2xl');
  });

  it('emits logout event when logout button is clicked', async () => {
    const wrapper = mount(DashboardHeader, {
      props: { title: 'Test Title' }
    });
    // The logout button is the second button in the flex container
    const logoutButton = wrapper.findAll('button').at(1);
    await logoutButton.trigger('click');
    expect(wrapper.emitted().logout).toBeTruthy();
    expect(wrapper.emitted().logout.length).toBe(1);
  });

  it('renders the settings button', () => {
    const wrapper = mount(DashboardHeader, {
      props: { title: 'Test Title' }
    });
    // The settings button is the first button
    const settingsButton = wrapper.findAll('button').at(0);
    // Check for an SVG path that is unique to the settings icon if possible, or just its existence
    expect(settingsButton.find('svg path[d*="M10.325"]').exists()).toBe(true); 
  });
});
