// Simple reactive state management for tasks
import { reactive } from 'vue';

// Initial state
const state = reactive({
  childTasks: {
    1: [
      { 
        id: 1, 
        title: 'Brush teeth', 
        description: 'Morning and evening', 
        completed: false,
        icon: 'brush'
      },
      { 
        id: 2, 
        title: 'Make bed', 
        description: 'After waking up', 
        completed: false,
        icon: 'bed'
      },
      {
        id: 3,
        title: 'Get dressed',
        description: "Put on today's clothes",
        completed: true,
        icon: 'clothes'
      },
      {
        id: 4,
        title: 'Eat breakfast',
        description: 'Have a healthy meal',
        completed: true,
        icon: 'food'
      }
    ],
    2: [
      {
        id: 1,
        title: 'Practice piano',
        description: '30 minutes',
        completed: false,
        icon: 'piano'
      }
    ]
  },
  nextTaskId: 5
});

// Helper methods
const getTasksByChildId = (childId) => {
  return state.childTasks[childId] || [];
};

const getCompletedTasksCount = (childId) => {
  const tasks = getTasksByChildId(childId);
  return tasks.filter(task => task.completed).length;
};

const getTotalTasksCount = (childId) => {
  return getTasksByChildId(childId).length;
};

// Methods to modify state
const addTask = (childId, task) => {
  if (!state.childTasks[childId]) {
    state.childTasks[childId] = [];
  }
  
  state.childTasks[childId].push({
    ...task,
    id: state.nextTaskId++
  });
};

const toggleTaskCompletion = (childId, taskId) => {
  const tasks = state.childTasks[childId];
  if (!tasks) return;
  
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
  }
};

const removeTask = (childId, taskId) => {
  const tasks = state.childTasks[childId];
  if (!tasks) return;
  
  const index = tasks.findIndex(t => t.id === taskId);
  if (index !== -1) {
    tasks.splice(index, 1);
  }
};

// Export the store
export default {
  state,
  getTasksByChildId,
  getCompletedTasksCount,
  getTotalTasksCount,
  addTask,
  toggleTaskCompletion,
  removeTask
};
