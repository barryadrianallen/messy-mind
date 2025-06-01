<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <header class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Parent Dashboard</h1>
      <div class="flex space-x-2 items-center">
        <!-- Settings Button and Dropdown -->
        <div class="relative">
          <button 
            @click="toggleSettingsMenu"
            class="p-2 rounded-lg bg-white shadow-sm hover:bg-gray-100"
            aria-label="Settings"
            aria-haspopup="true"
            :aria-expanded="showSettingsMenu.toString()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37 1 .608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <!-- Settings Dropdown Menu -->
          <div 
            v-if="showSettingsMenu"
            class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1"
          >
            <div class="py-1" role="none">
              <!-- Family Settings -->
              <button @click="openFamilySettings" class="text-gray-700 group flex items-center px-4 py-2 text-sm w-full text-left hover:bg-gray-100 hover:text-gray-900" role="menuitem" tabindex="-1" id="menu-item-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Family Settings
              </button>
              <!-- Theme Settings -->
              <button @click="openThemeSettings" class="text-gray-700 group flex items-center px-4 py-2 text-sm w-full text-left hover:bg-gray-100 hover:text-gray-900" role="menuitem" tabindex="-1" id="menu-item-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Theme Settings
              </button>
            </div>
          </div>
        </div>

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
      children: [], // Initialize as empty
      selectedChildId: null, // Will be set after children are fetched
      tasks: [], // Initialize as empty
      showSettingsMenu: false,
      isLoading: true, // To show a loading indicator
      errorLoading: null // To display any errors during data fetch
    };
  },
  computed: {
    selectedChild() {
      if (!this.children || this.children.length === 0) return null;
      return this.children.find(child => child.id === this.selectedChildId) || this.children[0];
    },
    filteredTasks() {
      if (!this.selectedChildId) {
         return []; // No child selected, no tasks to show for them
      }
      return this.tasks.filter(task => task.child_id === this.selectedChildId);
    }
  },
  async mounted() {
    const supabase = useSupabaseClient();
    const user = useSupabaseUser();

    if (user.value && user.value.id) {
      try {
        this.isLoading = true;
        this.errorLoading = null;
        const parentUserId = user.value.id;
        console.log("[ParentDashboard] Fetching data for parent user:", parentUserId);

        // STEP 1: Fetch children managed by the current parent
        const { data: childrenData, error: childrenError } = await supabase
          .from('profiles')
          .select('id, full_name, username, role') // Select necessary child profile fields
          .eq('managed_by_user_id', parentUserId)
          .eq('role', 'child');

        if (childrenError) throw childrenError;
        // Ensure childrenData is an array and re-map if needed to fit expected structure, e.g., {id, name}
        this.children = (childrenData || []).map(child => ({ 
            id: child.id, 
            name: child.full_name || child.username || 'Unnamed Child' // Use full_name, fallback to username
        }));
        console.log("[ParentDashboard] Fetched children:", this.children);

        // STEP 2: Set selectedChildId (e.g., to the first child if any)
        if (this.children.length > 0) {
          this.selectedChildId = this.children[0].id;
        } else {
          this.selectedChildId = null;
          this.tasks = []; // No children, so no tasks
          console.log("[ParentDashboard] No children found for this parent.");
        }

        // STEP 3: Fetch tasks for the children (if any children were found)
        if (this.selectedChildId && this.children.length > 0) {
          const childIds = this.children.map(c => c.id);
          console.log("[ParentDashboard] Fetching tasks for child IDs:", childIds);
          
          // CONFIRM: Please confirm your tasks table name and the column linking to child's profile.id
          // Assuming 'tasks' table and 'child_id' column for now.
          const { data: tasksData, error: tasksError } = await supabase
            .from('tasks') // <<< CONFIRM THIS TABLE NAME
            .select('*')   // Select all task fields
            .in('child_id', childIds) // <<< CONFIRM THIS COLUMN NAME
        .eq('parent_id', parentUserId); // Ensure tasks are fetched for the logged-in parent

          if (tasksError) {
            console.error('[ParentDashboard] Supabase error fetching tasks:', JSON.stringify(tasksError));
            throw tasksError;
          }

          this.tasks = tasksData || [];
          console.log("[ParentDashboard] Fetched tasks:", this.tasks);
        } else {
            this.tasks = [];
        }

      } catch (error) {
        console.error('[ParentDashboard] Error fetching dashboard data:', error.message, error);
        this.errorLoading = 'Failed to load dashboard data. ' + error.message;
        this.children = [];
        this.tasks = [];
      } finally {
        this.isLoading = false;
      }
    } else {
      console.warn('[ParentDashboard] User not authenticated or user ID missing. Redirecting to login.');
      this.errorLoading = 'You are not logged in or user data is incomplete.';
      this.isLoading = false;
      if (this.$router) this.$router.push('/login');
    }
  },
  methods: {
    selectChild(childId) {
      this.selectedChildId = childId
    },
    async handleAddTask(newTask) {
      const supabase = useSupabaseClient();
      const user = useSupabaseUser(); // Parent user

      if (!this.selectedChildId) {
        console.error('[ParentDashboard] Cannot add task: No child selected.');
        // Optionally, set a user-facing error message
        this.errorLoading = 'Please select a child to assign the task to.';
        return;
      }
      if (!user.value || !user.value.id) {
        console.error('[ParentDashboard] Cannot add task: Parent user not authenticated.');
        this.errorLoading = 'Authentication error. Please log in again.';
        return;
      }

      try {
        this.isLoading = true; // Indicate loading for task add
        // CONFIRM: tasks table name and child_id column name
        const { data: addedTask, error } = await supabase
          .from('tasks') // Ensure this is your tasks table name
          .insert({
            title: newTask.title,
            description: newTask.description,
            child_id: this.selectedChildId, // Ensure this is the FK column for child's ID
            parent_id: user.value.id,     // Parent's ID
            completed: false                // Default completed status
          })
          .select() // Select the newly inserted task to get its ID and other defaults
          .single();  // We expect only one row to be inserted and returned

        if (error) {
          console.error('[ParentDashboard] Supabase error inserting task:', JSON.stringify(error));
          throw error;
        }

        if (addedTask) {
          this.tasks.push(addedTask); // Add the new task to the local array
          console.log('[ParentDashboard] Task added successfully and to local state:', addedTask);
        } else {
          console.warn('[ParentDashboard] Task inserted but no data returned from Supabase. Refresh might be needed.');
          // Optionally, you could re-fetch all tasks here, but push is more optimistic:
          // await this.fetchTasksForChildren(); // Assuming you might create such a method
        }
      } catch (error) {
        console.error('[ParentDashboard] Error adding task:', error.message);
        this.errorLoading = 'Failed to add task: ' + error.message;
      } finally {
        this.isLoading = false;
      }
    },
    async removeTask(taskId) {
      const supabase = useSupabaseClient();
      try {
        this.isLoading = true; // Indicate loading for task removal
        // CONFIRM: tasks table name
        const { error } = await supabase
          .from('tasks') // <<< CONFIRM THIS TABLE NAME
          .delete()
          .eq('id', taskId); // Assuming 'id' is the primary key of the tasks table

        if (error) throw error;

        const index = this.tasks.findIndex(task => task.id === taskId);
        if (index !== -1) {
          this.tasks.splice(index, 1);
        }
        console.log('[ParentDashboard] Task removed successfully:', taskId);
      } catch (error) {
        console.error('[ParentDashboard] Error removing task:', error.message);
        this.errorLoading = 'Failed to remove task: ' + error.message;
      } finally {
        this.isLoading = false;
      }
    },
    async toggleTaskCompletion(taskId) {
      const task = this.tasks.find(t => t.id === taskId);
      if (!task) {
        console.error('[ParentDashboard] Task not found for toggling completion:', taskId);
        return;
      }

      const newCompletedStatus = !task.completed;
      const supabase = useSupabaseClient();

      try {
        // Optimistically update UI first for responsiveness
        const originalStatus = task.completed;
        task.completed = newCompletedStatus;

        // CONFIRM: tasks table name
        const { error } = await supabase
          .from('tasks') // <<< CONFIRM THIS TABLE NAME
          .update({ completed: newCompletedStatus })
          .eq('id', taskId); // Assuming 'id' is the primary key of the tasks table

        if (error) {
          task.completed = originalStatus; // Revert UI on error
          throw error;
        }
        console.log('[ParentDashboard] Task completion toggled successfully:', taskId, 'to', newCompletedStatus);
      } catch (error) {
        console.error('[ParentDashboard] Error toggling task completion:', error.message);
        this.errorLoading = 'Failed to update task: ' + error.message;
        // UI is already reverted if it was an optimistic update that failed
      }
    },
    async logout() {
      const supabase = useSupabaseClient();
      try {
        this.isLoading = true; // Optional: show loading state during logout
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        this.$router.push('/login');
      } catch (error) {
        console.error('Error logging out:', error.message);
        // Optionally show an error message to the user
        this.errorLoading = 'Logout failed: ' + error.message; // Display error on dashboard if needed
      } finally {
        this.isLoading = false;
      }
    },
    toggleSettingsMenu() {
      this.showSettingsMenu = !this.showSettingsMenu;
    },
    openThemeSettings() {
      console.log('Open Theme Settings');
      this.showSettingsMenu = false; // Close menu after selection
      this.$router.push({ path: '/family-settings', query: { tab: 'themes' } });
    },
    openFamilySettings() {
      console.log('Open Family Settings');
      this.showSettingsMenu = false; // Close menu after selection
      this.$router.push({ path: '/family-settings', query: { tab: 'familyMembers' } }); // Explicitly set tab
    }
  }
}
</script>
