import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TaskForm from '../../components/TaskForm.vue';

describe('TaskForm.vue', () => {
  it('renders with correct child name', () => {
    const wrapper = mount(TaskForm, {
      props: {
        childName: 'Alex'
      }
    });
    
    expect(wrapper.text()).toContain('Assign New Task for Alex');
  });
  
  it('does not emit add-task event when form is empty', async () => {
    const wrapper = mount(TaskForm, {
      props: {
        childName: 'Alex'
      }
    });
    
    // Find and click the Add Task button
    const addButton = wrapper.find('button');
    await addButton.trigger('click');
    
    // Form should not emit add-task when title is empty
    expect(wrapper.emitted('add-task')).toBeFalsy();
  });
  
  it('emits add-task event with form data when valid', async () => {
    const wrapper = mount(TaskForm, {
      props: {
        childName: 'Alex'
      }
    });
    
    // Fill in the task title
    const titleInput = wrapper.find('input[placeholder="Enter task title"]');
    await titleInput.setValue('New Task');
    
    // Fill in the description
    const descInput = wrapper.find('textarea');
    await descInput.setValue('Task Description');
    
    // Click the Add Task button
    const addButton = wrapper.find('button');
    await addButton.trigger('click');
    
    // Check that add-task was emitted with correct data
    expect(wrapper.emitted('add-task')).toBeTruthy();
    expect(wrapper.emitted('add-task')[0][0]).toEqual({
      title: 'New Task',
      description: 'Task Description'
    });
    
    // Form should be reset after submission
    expect(wrapper.vm.taskTitle).toBe('');
    expect(wrapper.vm.taskDescription).toBe('');
  });
  
  it('resets form when child changes', async () => {
    const wrapper = mount(TaskForm, {
      props: {
        childName: 'Alex'
      }
    });
    
    // Fill in the form
    const titleInput = wrapper.find('input[placeholder="Enter task title"]');
    await titleInput.setValue('New Task');
    
    const descInput = wrapper.find('textarea');
    await descInput.setValue('Task Description');
    
    // Change the child
    await wrapper.setProps({ childName: 'Sam' });
    
    // Form should be reset
    expect(wrapper.vm.taskTitle).toBe('');
    expect(wrapper.vm.taskDescription).toBe('');
  });
});
