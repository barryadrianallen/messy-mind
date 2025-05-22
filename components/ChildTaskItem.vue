<template>
  <div 
    :class="['flex items-center justify-between p-5 rounded-lg mb-4', 
            completed ? 'bg-blue-50' : 'bg-white border border-gray-200']"
  >
    <div class="flex items-center">
      <!-- Task Checkbox -->
      <button 
        @click="$emit('toggle-completion')"
        class="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center mr-4"
      >
        <svg v-if="completed" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      </button>

      <!-- Task Icon -->
      <span class="text-2xl mr-3">{{ taskIcon }}</span>
      
      <!-- Task Details -->
      <div>
        <p :class="['text-lg font-medium', completed ? 'text-gray-500 line-through' : 'text-gray-900']">
          {{ title }}
        </p>
        <p :class="['text-sm', completed ? 'text-gray-400 line-through' : 'text-slate-500']">
          {{ description }}
        </p>
      </div>
    </div>
    
    <!-- Status Badge -->
    <div>
      <span 
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium', 
          completed 
            ? 'bg-gray-200 text-gray-800' 
            : 'bg-blue-600 text-white'
        ]"
      >
        {{ completed ? 'Done!' : 'To Do' }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChildTaskItem',
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
    },
    icon: {
      type: String,
      default: '📝'
    }
  },
  computed: {
    taskIcon() {
      // Map task types to appropriate emojis
      const iconMap = {
        'brush': '🪥',
        'bed': '🛏️',
        'clothes': '👕',
        'food': '🥣',
        'default': '📝'
      };
      
      return iconMap[this.icon] || iconMap.default;
    }
  },
  emits: ['toggle-completion']
}
</script>
