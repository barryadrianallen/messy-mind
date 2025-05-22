<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <header class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Parent Dashboard</h1>
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

    <!-- Child Tabs -->
    <ChildSelector 
      :children="children" 
      :selectedChildId="selectedChildId" 
      @select="selectChild"
    />

    <!-- Assign New Task Panel -->
    <TaskForm 
      :childName="selectedChild?.name || ''" 
      @add-task="handleAddTask"
    />

    <!-- Child's Tasks Panel -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-800">{{ selectedChild?.name || '' }}'s Tasks</h2>
        <span class="text-sm text-gray-500">{{ filteredTasks.length }} tasks assigned</span>
      </div>
      
      <!-- Task List -->
      <div v-if="filteredTasks.length > 0" class="space-y-3">
        <TaskItem 
          v-for="task in filteredTasks" 
          :key="task.id" 
          :title="task.title"
          :description="task.description"
          :completed="task.completed"
          @toggle-completion="toggleTaskCompletion(task.id)"
          @remove="removeTask(task.id)"
        />
      </div>
      <div v-else class="text-center py-6 text-gray-500">
        <p>No tasks assigned yet.</p>
      </div>
    </div>
  </div>
</template>

<script>
import ChildSelector from './ChildSelector.vue'
import TaskForm from './TaskForm.vue'
import TaskItem from './TaskItem.vue'

export default {
  name: 'ParentDashboard',
  components: {
    ChildSelector,
    TaskForm,
    TaskItem
  },
  data() {
    return {
      children: [
        { id: 1, name: 'Alex' },
        { id: 2, name: 'Sam' }
      ],
      selectedChildId: 1,
      tasks: [
        { id: 1, childId: 1, title: 'Brush teeth', description: 'Morning and evening', completed: false },
        { id: 2, childId: 1, title: 'Make bed', description: 'After waking up', completed: true },
        { id: 3, childId: 2, title: 'Practice piano', description: '30 minutes', completed: false },
      ],
      nextTaskId: 4
    }
  },
  computed: {
    selectedChild() {
      return this.children.find(child => child.id === this.selectedChildId) || this.children[0]
    },
    filteredTasks() {
      return this.tasks.filter(task => task.childId === this.selectedChildId)
    }
  },
  methods: {
    selectChild(childId) {
      this.selectedChildId = childId
    },
    handleAddTask(newTask) {
      this.tasks.push({
        id: this.nextTaskId++,
        childId: this.selectedChildId,
        title: newTask.title,
        description: newTask.description,
        completed: false
      })
    },
    removeTask(taskId) {
      const index = this.tasks.findIndex(task => task.id === taskId)
      if (index !== -1) {
        this.tasks.splice(index, 1)
      }
    },
    toggleTaskCompletion(taskId) {
      const task = this.tasks.find(task => task.id === taskId)
      if (task) {
        task.completed = !task.completed
      }
    },
    logout() {
      // Navigate to home/login page
      this.$router.push('/login')
    }
  }
}
</script>
