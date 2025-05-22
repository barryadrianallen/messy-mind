<template>
  <div class="flex space-x-2 mb-6">
    <button 
      v-for="child in children" 
      :key="child.id"
      @click="$emit('select', child.id)"
      :class="[
        'px-4 py-2 rounded-full text-sm font-medium',
        selectedChildId === child.id 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      ]"
    >
      {{ child.name }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'ChildSelector',
  props: {
    children: {
      type: Array,
      required: true
    },
    selectedChildId: {
      type: Number,
      required: true
    }
  },
  emits: ['select']
}
</script>
