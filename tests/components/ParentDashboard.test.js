import { describe, it, expect, vi } from 'vitest';
import { mount, shallowMount } from '@vue/test-utils';
import ParentDashboard from '../../components/ParentDashboard.vue';

// Mock child components
vi.mock('../../components/ChildSelector.vue', () => ({
  default: {
    name: 'ChildSelector',
    props: ['children', 'selectedChildId'],
    template: '<div class="mock-child-selector"></div>',
    emits: ['select']
  }
}));

vi.mock('../../components/TaskForm.vue', () => ({
  default: {
    name: 'TaskForm',
    props: ['childName'],
    template: '<div class="mock-task-form"></div>',
    emits: ['add-task']
  }
}));

vi.mock('../../components/TaskItem.vue', () => ({
  default: {
    name: 'TaskItem',
    props: ['title', 'description', 'completed'],
    template: '<div class="mock-task-item"></div>',
    emits: ['toggle-completion', 'remove']
  }
}));

// Mock router
const mockRouter = {
  push: vi.fn()
};

describe('ParentDashboard.vue', () => {
  it('renders all major components', () => {
    const wrapper = mount(ParentDashboard, {
      global: {
        mocks: {
          $router: mockRouter
        }
      }
    });
    
    // Check that all main sections are rendered
    expect(wrapper.find('header').exists()).toBe(true);
    expect(wrapper.find('.mock-child-selector').exists()).toBe(true);
    expect(wrapper.find('.mock-task-form').exists()).toBe(true);
    expect(wrapper.text()).toContain('tasks assigned');
  });
  
  it('changes selected child when child selector emits event', async () => {
    const wrapper = mount(ParentDashboard, {
      global: {
        mocks: {
          $router: mockRouter
        }
      }
    });
    
    // Initial state should be 1
    expect(wrapper.vm.selectedChildId).toBe(1);
    
    // Call the selectChild method directly
    await wrapper.vm.selectChild(2);
    
    // Selected child should be updated
    expect(wrapper.vm.selectedChildId).toBe(2);
  });
  
  it('adds a new task when handleAddTask is called', async () => {
    const wrapper = mount(ParentDashboard, {
      global: {
        mocks: {
          $router: mockRouter
        }
      }
    });
    
    // Initial task count
    const initialTaskCount = wrapper.vm.tasks.length;
    
    // Call the handleAddTask method directly
    await wrapper.vm.handleAddTask({
      title: 'New Test Task',
      description: 'Test Description'
    });
    
    // Tasks array should have one more item
    expect(wrapper.vm.tasks.length).toBe(initialTaskCount + 1);
    
    // The new task should be added with correct properties
    const newTask = wrapper.vm.tasks[wrapper.vm.tasks.length - 1];
    expect(newTask.title).toBe('New Test Task');
    expect(newTask.description).toBe('Test Description');
    expect(newTask.childId).toBe(wrapper.vm.selectedChildId);
    expect(newTask.completed).toBe(false);
  });
  
  it('toggles task completion status correctly', async () => {
    const wrapper = mount(ParentDashboard, {
      global: {
        mocks: {
          $router: mockRouter
        }
      }
    });
    
    // Get initial completion status of first task
    const taskId = wrapper.vm.tasks[0].id;
    const initialStatus = wrapper.vm.tasks[0].completed;
    
    // Call the toggleTaskCompletion method directly
    await wrapper.vm.toggleTaskCompletion(taskId);
    
    // Task completion status should be toggled
    expect(wrapper.vm.tasks[0].completed).toBe(!initialStatus);
  });
  
  it('removes a task when removeTask is called', async () => {
    const wrapper = mount(ParentDashboard, {
      global: {
        mocks: {
          $router: mockRouter
        }
      }
    });
    
    // Get initial task count and ID of first task
    const initialTaskCount = wrapper.vm.tasks.length;
    const taskIdToRemove = wrapper.vm.tasks[0].id;
    
    // Call the removeTask method directly
    await wrapper.vm.removeTask(taskIdToRemove);
    
    // Task count should decrease by 1
    expect(wrapper.vm.tasks.length).toBe(initialTaskCount - 1);
    
    // The removed task should no longer exist
    const removedTask = wrapper.vm.tasks.find(task => task.id === taskIdToRemove);
    expect(removedTask).toBeUndefined();
  });
  
  it('navigates to login page when logout is called', async () => {
    const wrapper = mount(ParentDashboard, {
      global: {
        mocks: {
          $router: mockRouter
        }
      }
    });
    
    // Call logout method
    await wrapper.vm.logout();
    
    // Router push should be called with '/login'
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });
});
