<template>
  <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
    <h2 class="text-lg font-semibold text-gray-800 mb-4">Assign New Task for {{ childName }}</h2>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
        <input 
          v-model="taskTitle"
          type="text" 
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter task title"
        >
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
        <textarea 
          v-model="taskDescription"
          rows="2"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter task description"
        ></textarea>
      </div>
      <button 
        @click="submitTask"
        class="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Add Task
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskForm',
  props: {
    childName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      taskTitle: '',
      taskDescription: ''
    }
  },
  methods: {
    submitTask() {
      if (!this.taskTitle.trim()) return
      
      this.$emit('add-task', {
        title: this.taskTitle,
        description: this.taskDescription
      })
      
      // Reset form
      this.taskTitle = ''
      this.taskDescription = ''
    }
  },
  watch: {
    childName() {
      // Reset form when child changes
      this.taskTitle = ''
      this.taskDescription = ''
    }
  }
}
</script>
