<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto transform transition-all">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 class="text-lg font-semibold text-gray-800">Add New Family Member</h3>
          <p class="text-sm text-gray-500">Add a new parent or child to your family task manager</p>
        </div>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
          <span class="sr-only">Close</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <form @submit.prevent="handleSubmit">
        <div class="px-6 py-5 space-y-4">
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" id="fullName" v-model="form.fullName" required class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter full name">
          </div>

          <div>
            <label for="role" class="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select id="role" v-model="form.role" required class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white">
              <option value="" disabled>Select role</option>
              <option value="Parent">Parent</option>
              <option value="Child">Child</option>
            </select>
          </div>

          <div v-if="form.role === 'Child'">
            <label for="age" class="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input type="number" id="age" v-model.number="form.age" required min="0" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter age">
          </div>

          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input type="text" id="username" v-model="form.username" required class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Enter username for login">
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button type="button" @click="closeModal" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Cancel
          </button>
          <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Add Member
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddMemberModal',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        fullName: '',
        role: '', // Default to empty, user must select
        age: null,
        username: ''
      }
    };
  },
  watch: {
    'form.role'(newRole) {
      if (newRole !== 'Child') {
        this.form.age = null; // Clear age if role is not Child
      }
    },
    show(newVal) {
      if (newVal) {
        // Reset form when modal is shown
        this.form.fullName = '';
        this.form.role = '';
        this.form.age = null;
        this.form.username = '';
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    handleSubmit() {
      if (this.form.role === 'Child' && (this.form.age === null || this.form.age < 0)) {
        alert('Please enter a valid age for the child.');
        return;
      }
      // Create a copy to avoid reactivity issues if parent modifies it
      const memberData = { ...this.form };
      if (memberData.role !== 'Child') {
        delete memberData.age; // Remove age if not a child
      }
      this.$emit('add-member', memberData);
      this.closeModal(); // Close modal after submission
    }
  }
};
</script>

<style scoped>
/* Add any specific styles for the modal here if needed */
</style>
