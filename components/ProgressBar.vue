<template>
  <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
    <h2 class="text-xl font-bold text-gray-800 mb-4">Your Progress Today</h2>
    <div class="flex justify-between items-center mb-2">
      <p class="text-lg text-gray-700">{{ completed }} of {{ total }} tasks completed</p>
      <p class="text-lg font-semibold">{{ percentage }}%</p>
    </div>
    <div class="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
      <div 
        class="h-full bg-blue-600 rounded-full"
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    completed: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  computed: {
    percentage() {
      if (this.total === 0) return 0;
      return Math.round((this.completed / this.total) * 100);
    }
  }
}
</script>
