<template>
  <div class="bg-gray-50 p-4 rounded-lg flex items-center justify-between hover:bg-gray-100 transition-colors duration-150">
    <div class="flex items-center">
      <div class="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 font-semibold mr-4 flex-shrink-0">
        {{ member.name ? member.name.charAt(0).toUpperCase() : '?' }}
      </div>
      <div>
        <h3 class="font-semibold text-gray-800">{{ member.name }}</h3>
        <p class="text-xs text-gray-500">
          <span v-if="member.role === 'Child'">Age: {{ member.age }} &bull; </span>
          @{{ member.username }}
        </p>
        <div class="mt-1 flex space-x-2 flex-wrap">
          <span class="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Level {{ member.level }}</span>
          <span class="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">{{ member.points }} points</span>
        </div>
      </div>
    </div>
    <div class="flex items-center space-x-2 ml-2 flex-shrink-0">
      <span :class="['px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap',
                     member.role === 'Parent' ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700']">
        {{ member.role }}
      </span>
      <button @click="$emit('edit', member.id)" class="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-200" title="Edit Member">
        <span class="sr-only">Edit {{ member.name }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>
      <button @click="$emit('delete', member.id)" class="p-1.5 text-red-500 hover:text-red-700 rounded-md hover:bg-red-100" title="Delete Member">
        <span class="sr-only">Delete {{ member.name }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FamilyMemberItem',
  props: {
    member: {
      type: Object,
      required: true,
      default: () => ({ // Provide a default structure for the prop
        id: null,
        name: 'Unknown',
        age: 0,
        username: 'unknown',
        level: 0,
        points: 0,
        role: 'Child',
        avatarInitial: '?'
      })
    }
  }
  // Emits: ['edit', 'delete'] are implicitly defined by $emit in template
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
