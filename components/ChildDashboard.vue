<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <header class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Hi, {{ childName }}!</h1>
      <div class="flex space-x-2">
        <button class="p-2 rounded-lg bg-white shadow-sm hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37 1 .608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <button 
          @click="logout" 
          class="p-2 rounded-lg bg-white shadow-sm hover:bg-gray-100 hover:text-red-500 transition-colors"
          title="Logout"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>

    <!-- Progress Bar -->
    <ProgressBar :completed="completedTasksCount" :total="tasks.length" />

    <!-- Child's Tasks Panel -->
    <div>
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Your Tasks</h2>
      
      <!-- Task List -->
      <div v-if="tasks.length > 0">
        <ChildTaskItem 
          v-for="task in tasks" 
          :key="task.id" 
          :title="task.title"
          :description="task.description"
          :completed="task.completed"
          @toggle-completion="toggleTaskCompletion(task.id)"
        />
      </div>
      <div v-else class="text-center py-6 text-gray-500 bg-white rounded-lg border border-gray-200">
        <p>No tasks assigned yet.</p>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressBar from './ProgressBar.vue'
import ChildTaskItem from './ChildTaskItem.vue'
import { initialChildName, initialTasks } from '../data/mockChildDashboardData.js';

export default {
  name: 'ChildDashboard',
  components: {
    ProgressBar,
    ChildTaskItem
  },
  data() {
    return {
      childName: initialChildName,
      tasks: initialTasks.map(task => ({ ...task })) 
    }
  },
  computed: {
    completedTasksCount() {
      return this.tasks.filter(task => task.completed).length;
    }
  },
  methods: {
    toggleTaskCompletion(taskId) {
      const task = this.tasks.find(task => task.id === taskId);
      if (task) {
        task.completed = !task.completed;
      }
    },
    logout() {
      // Navigate to login page
      this.$router.push('/login');
    }
  }
}
</script>
