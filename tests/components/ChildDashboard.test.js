import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ChildDashboard from '../../components/ChildDashboard.vue';

// Mock child components
vi.mock('../../components/ProgressBar.vue', () => ({
  default: {
    name: 'ProgressBar',
    props: ['completed', 'total'],
    template: '<div class="mock-progress-bar">{{ completed }}/{{ total }}</div>',
  }
}));

vi.mock('../../components/ChildTaskItem.vue', () => ({
  default: {
    name: 'ChildTaskItem',
    props: ['title', 'description', 'completed'],
    template: '<div class="mock-child-task-item">{{ title }}</div>',
    emits: ['toggle-completion']
  }
}));

// Mock router
const mockRouter = {
  push: vi.fn()
};

const initialTasks = [
  { id: 1, title: 'Brush teeth', description: 'Morning and evening', completed: false },
  { id: 2, title: 'Make bed', description: 'After waking up', completed: false },
  { id: 3, title: 'Get dressed', description: "Put on today's clothes", completed: true },
  { id: 4, title: 'Eat breakfast', description: 'Have a healthy meal', completed: true }
];

const childName = 'Alex';

describe('ChildDashboard.vue', () => {
  let wrapper;

  beforeEach(() => {
    // Reset mocks and mount component before each test
    mockRouter.push.mockClear();
    wrapper = mount(ChildDashboard, {
      global: {
        mocks: {
          $router: mockRouter
        }
      },
      // Set initial data to a deep copy to avoid test interference
      data() {
        return {
          childName: childName,
          childId: 1, // As in component
          tasks: JSON.parse(JSON.stringify(initialTasks)) // Deep copy
        };
      }
    });
  });

  it('renders the child name in the header', () => {
    expect(wrapper.find('header h1').text()).toBe(`Hi, ${childName}!`);
  });

  it('renders ProgressBar with correct props', () => {
    const progressBar = wrapper.findComponent({ name: 'ProgressBar' });
    expect(progressBar.exists()).toBe(true);
    const initialCompletedCount = initialTasks.filter(t => t.completed).length;
    expect(progressBar.props('completed')).toBe(initialCompletedCount);
    expect(progressBar.props('total')).toBe(initialTasks.length);
  });

  it('renders a ChildTaskItem for each task', () => {
    const taskItems = wrapper.findAllComponents({ name: 'ChildTaskItem' });
    expect(taskItems.length).toBe(initialTasks.length);
    initialTasks.forEach((task, index) => {
      expect(taskItems[index].props('title')).toBe(task.title);
      expect(taskItems[index].props('description')).toBe(task.description);
      expect(taskItems[index].props('completed')).toBe(task.completed);
    });
  });

  it('displays "No tasks assigned yet" message when tasks array is empty', async () => {
    await wrapper.setData({ tasks: [] });
    expect(wrapper.text()).toContain('No tasks assigned yet.');
    expect(wrapper.findAllComponents({ name: 'ChildTaskItem' }).length).toBe(0);
  });

  it('toggles task completion status and updates progress bar', async () => {
    const taskToToggleId = initialTasks[0].id; // First task, initially incomplete
    const initialCompletedCount = wrapper.vm.completedTasksCount;

    await wrapper.vm.toggleTaskCompletion(taskToToggleId);
    
    const updatedTask = wrapper.vm.tasks.find(t => t.id === taskToToggleId);
    expect(updatedTask.completed).toBe(true);
    expect(wrapper.vm.completedTasksCount).toBe(initialCompletedCount + 1);

    // Check ProgressBar props update
    const progressBar = wrapper.findComponent({ name: 'ProgressBar' });
    expect(progressBar.props('completed')).toBe(initialCompletedCount + 1);

    // Toggle back
    await wrapper.vm.toggleTaskCompletion(taskToToggleId);
    expect(wrapper.vm.tasks.find(t => t.id === taskToToggleId).completed).toBe(false);
    expect(wrapper.vm.completedTasksCount).toBe(initialCompletedCount);
    expect(progressBar.props('completed')).toBe(initialCompletedCount);
  });

  it('calls router.push with "/login" when logout is called', async () => {
    // The logout button is the second button in the header's div.flex.space-x-2
    const logoutButton = wrapper.find('header .flex.space-x-2 button:nth-child(2)');
    await logoutButton.trigger('click');
    // Alternatively, call the method directly if the above selector is too fragile
    // await wrapper.vm.logout(); 
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  it('renders the settings button in the header', () => {
    const settingsButton = wrapper.find('header .flex.space-x-2 button:nth-child(1)');
    expect(settingsButton.exists()).toBe(true);
    // Check for an SVG path that is unique to the settings icon
    expect(settingsButton.find('svg path[d*="M10.325"]').exists()).toBe(true);
  });
});
