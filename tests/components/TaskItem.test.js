import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TaskItem from '../../components/TaskItem.vue';

describe('TaskItem.vue', () => {
  // Test that the component renders correctly with props
  it('renders task title and description correctly', () => {
    const wrapper = mount(TaskItem, {
      props: {
        title: 'Brush teeth',
        description: 'Morning and evening',
        completed: false
      }
    });
    
    expect(wrapper.text()).toContain('Brush teeth');
    expect(wrapper.text()).toContain('Morning and evening');
  });
  
  // Test styling changes based on completion status
  it('applies correct styling when task is completed', () => {
    const wrapper = mount(TaskItem, {
      props: {
        title: 'Brush teeth',
        description: 'Morning and evening',
        completed: true
      }
    });
    
    // Check for line-through styling on completed tasks
    const titleElement = wrapper.find('.text-lg');
    expect(titleElement.classes()).toContain('line-through');
    
    // Check for green status text
    const statusElement = wrapper.find('.text-emerald-600');
    expect(statusElement.exists()).toBe(true);
    expect(statusElement.text()).toBe('Completed');
  });
  
  // Test that events are emitted correctly
  it('emits toggle-completion event when button is clicked', async () => {
    const wrapper = mount(TaskItem, {
      props: {
        title: 'Brush teeth',
        description: 'Morning and evening',
        completed: false
      }
    });
    
    // Find the "Mark Complete" button and click it
    const button = wrapper.find('button');
    await button.trigger('click');
    
    // Check that the correct event was emitted
    expect(wrapper.emitted('toggle-completion')).toBeTruthy();
    expect(wrapper.emitted('toggle-completion').length).toBe(1);
  });
  
  it('emits remove event when delete button is clicked', async () => {
    const wrapper = mount(TaskItem, {
      props: {
        title: 'Brush teeth',
        description: 'Morning and evening',
        completed: false
      }
    });
    
    // Find the delete button (it has a title="Delete task" attribute)
    const deleteButton = wrapper.find('button[title="Delete task"]');
    await deleteButton.trigger('click');
    
    // Check that the correct event was emitted
    expect(wrapper.emitted('remove')).toBeTruthy();
    expect(wrapper.emitted('remove').length).toBe(1);
  });
});
