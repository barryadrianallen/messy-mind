import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ProgressBar from '../../components/ProgressBar.vue';

describe('ProgressBar.vue', () => {
  it('displays the correct task completion count', () => {
    const wrapper = mount(ProgressBar, {
      props: {
        completed: 2,
        total: 5
      }
    });
    
    expect(wrapper.text()).toContain('2 of 5 tasks completed');
  });
  
  it('calculates and displays the correct percentage', () => {
    const wrapper = mount(ProgressBar, {
      props: {
        completed: 2,
        total: 4
      }
    });
    
    expect(wrapper.text()).toContain('50%');
  });
  
  it('renders the progress bar with the correct width', () => {
    const wrapper = mount(ProgressBar, {
      props: {
        completed: 3,
        total: 4
      }
    });
    
    const progressBar = wrapper.find('.bg-blue-600');
    expect(progressBar.attributes('style')).toContain('width: 75%');
  });
  
  it('handles zero tasks correctly', () => {
    const wrapper = mount(ProgressBar, {
      props: {
        completed: 0,
        total: 0
      }
    });
    
    expect(wrapper.text()).toContain('0 of 0 tasks completed');
    expect(wrapper.text()).toContain('0%');
    
    const progressBar = wrapper.find('.bg-blue-600');
    expect(progressBar.attributes('style')).toContain('width: 0%');
  });
});
