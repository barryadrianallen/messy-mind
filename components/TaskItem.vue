<template>
  <div 
    :class="['flex items-center justify-between p-5 rounded-lg', 
            completed ? 'bg-gray-100' : 'bg-white border border-gray-200']"
  >
    <!-- Task Details (Left) -->
    <div class="flex-1">
      <p :class="['text-lg font-medium', completed ? 'text-gray-500 line-through' : 'text-gray-900']">
        {{ title }}
      </p>
      <p :class="['text-sm mt-1', completed ? 'text-gray-400 line-through' : 'text-slate-500']">
        {{ description || '' }}
      </p>
    </div>
    
    <!-- Status and Action (Right) -->
    <div class="flex items-center gap-4">
      <span :class="['text-sm font-medium', completed ? 'text-emerald-600' : 'text-amber-600']">
        {{ completed ? 'Completed' : 'Pending' }}
      </span>
      <button 
        @click="$emit('toggle-completion')"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition-colors',
          'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
        ]"
      >
        {{ completed ? 'Mark Incomplete' : 'Mark Complete' }}
      </button>
      <button 
        @click="$emit('remove')"
        class="text-gray-400 hover:text-red-500 transition-colors"
        title="Delete task"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskItem',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle-completion', 'remove']
}
</script>
