<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-40">
      <div class="container mx-auto px-4 py-3 flex items-center">
        <button @click="goBack" class="text-gray-600 hover:text-gray-800 mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 class="text-xl font-semibold text-gray-800">Family Settings</h1>
      </div>
    </header>

    <main class="container mx-auto p-4 md:p-6">
      <!-- Tabs -->
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-6" aria-label="Tabs">
            <button 
              @click="activeTab = 'familyMembers'"
              :class="['whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center',
                        activeTab === 'familyMembers' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Family Members
            </button>
            <button 
              @click="activeTab = 'themes'"
              :class="['whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center',
                        activeTab === 'themes' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Themes
            </button>
          </nav>
        </div>
      </div>

      <!-- Content based on active tab -->
      <div v-if="activeTab === 'familyMembers'">
        <!-- Family Members Section -->
        <section class="bg-white rounded-xl shadow p-6 mb-8">
          <div class="flex justify-between items-center mb-4">
            <div>
              <h2 class="text-xl font-semibold text-gray-800">Family Members</h2>
              <p class="text-sm text-gray-500">Manage your family members and their access to the task manager</p>
            </div>
            <button 
              v-if="familyMembers.length > 0" 
              @click="openAddMemberModal" 
              class="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Member
            </button>
          </div>
          <!-- Member List -->
          <div v-if="familyMembers.length > 0" class="space-y-3">
            <FamilyMemberItem
              v-for="member in familyMembers"
              :key="member.id"
              :member="member"
              @edit="handleEditMember"
              @delete="handleDeleteMember"
            />
          </div>
          <div v-else class="text-center py-8 px-4 bg-gray-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0zM17 20v1m0-1c0-2.21-.896-4.21-2.343-5.657M12 21v-1m0 1c0-2.21.896-4.21 2.343-5.657m-4.686 0A2.25 2.25 0 017.5 15.75v-1.5a2.25 2.25 0 012.25-2.25h1.5A2.25 2.25 0 0113.5 14.25v1.5a2.25 2.25 0 01-2.25 2.25h-1.5z" />
            </svg>
            <h3 class="mt-2 text-lg font-medium text-gray-900">No family members yet</h3>
            <p class="text-sm text-gray-500 mb-4">Get started by adding a parent or child to your family.</p>
            <div class="mt-6">
              <button @click="openAddMemberModal" type="button" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Family Member
              </button>
            </div>
          </div>

          <!-- Advanced Options Toggle -->
          <div class="mt-8 pt-6 border-t border-gray-200">
            <button 
              @click="showAdvancedOptions = !showAdvancedOptions"
              data-testid="toggle-advanced-options-btn"
              class="w-full md:w-auto flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" :class="['h-5 w-5 mr-2 text-gray-500 transform transition-transform duration-150', showAdvancedOptions ? 'rotate-180' : '']" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              {{ showAdvancedOptions ? 'Hide' : 'Show' }} Advanced Options
            </button>
          </div>

          <!-- Danger Zone - Conditionally shown -->
          <div 
            v-if="showAdvancedOptions" 
            data-testid="danger-zone-container"
            class="mt-6 p-6 bg-red-50 border border-red-200 rounded-lg"
          >
            <div class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 class="text-xl font-semibold text-red-700">Advanced Options</h3>
                <p class="text-sm text-red-600 mt-1 mb-4">Permanently delete your family and all associated data. This action cannot be undone.</p>
              </div>
            </div>
            
            <div class="bg-white p-4 rounded-md border border-red-300 mb-6">
              <h4 class="text-md font-semibold text-gray-800 mb-2">What will be deleted:</h4>
              <ul class="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>All family member accounts ({{ familyMembers.length }} account{{ familyMembers.length !== 1 ? 's' : '' }})</li>
                <li>All tasks and task history (approximately {{ familyMembers.filter(m => m.role === 'Child').length * 10 }} tasks)</li> <!-- Placeholder for task count -->
                <li>All points and achievements ({{ (familyStats.find(stat => stat.label === 'Total Points') || {value: 0}).value }} total points)</li>
                <li>All family settings and preferences</li>
                <li>All login credentials and access for this family</li>
              </ul>
            </div>

            <button 
              @click="deleteEntireFamily"
              data-testid="delete-entire-family-btn"
              class="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-red-700 flex items-center justify-center text-lg transition-colors duration-150 shadow-md hover:shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Entire Family
            </button>
            <button 
              @click="showAdvancedOptions = false"
              class="w-full mt-3 text-sm text-gray-600 hover:text-gray-800 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-150"
            >
              Hide Advanced Options
            </button>
          </div>
        </section>

        <!-- Family Statistics Section -->
        <section class="bg-white rounded-xl shadow p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-1">Family Statistics</h2>
          <p class="text-sm text-gray-500 mb-6">Overview of your family's task management activity</p>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="stat in familyStats" :key="stat.label" class="bg-gray-50 p-4 rounded-lg text-center">
              <p class="text-3xl font-bold text-blue-600">{{ stat.value }}</p>
              <p class="text-sm text-gray-600">{{ stat.label }}</p>
            </div>
          </div>
        </section>
      </div>

      <div v-if="activeTab === 'themes'">
        <section class="bg-white rounded-xl shadow p-6">
          <h2 class="text-xl font-semibold text-gray-800">Theme Settings</h2>
          <p class="text-sm text-gray-500 mb-6">Choose a color theme that works best for your family</p>
          
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div 
              v-for="theme in themes" 
              :key="theme.name"
              @click="selectTheme(theme)"
              :class="['p-4 rounded-lg border cursor-pointer transition-all duration-150 flex flex-col items-center justify-center space-y-2 h-32',
                       selectedTheme.name === theme.name ? (theme.activeClass || 'bg-blue-600 text-white border-blue-700') : 'bg-white text-gray-700 hover:border-gray-400 hover:shadow-md']"
            >
              <div :class="['w-8 h-8 rounded-full flex items-center justify-center', theme.colorClass]">
                <svg v-if="selectedTheme.name === theme.name && theme.name === 'Default'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span class="text-sm font-medium">{{ theme.name }}</span>
            </div>
          </div>
        </section>
      </div>
    </main>

    <AddMemberModal 
      :show="isAddMemberModalVisible" 
      @close="closeAddMemberModal" 
      @add-member="addNewFamilyMember"
    />

  </div>
</template>

<script>
import FamilyMemberItem from '~/components/FamilyMemberItem.vue';
import AddMemberModal from '~/components/AddMemberModal.vue';
import bcrypt from 'bcryptjs'; 
import { useSupabaseUser } from '#imports'; 

export default {
  name: 'FamilySettingsPage',
  components: {
    FamilyMemberItem,
    AddMemberModal
  },
  setup() {
    const parentUser = useSupabaseUser(); // Call composable here
    return {
      parentUser // Expose to the component instance (will be reactive)
    };
  },
  data() {
    return {
      activeTab: 'familyMembers', // 'familyMembers' or 'themes'
      isAddMemberModalVisible: false,
      showAdvancedOptions: false,
      familyMembers: [], // Initialize as empty array
      familyStats: [
        { label: 'Children', value: 0 }, // Default to 0
        { label: 'Parents', value: 0 },  // Default to 0
        { label: 'Total Points', value: 0 },
        { label: 'Highest Level', value: 0 }
      ],
      themes: [
        { name: 'Default', colorClass: 'bg-black', activeClass: 'bg-blue-600 text-white border-blue-700' },
        { name: 'Calm Blue', colorClass: 'bg-blue-500' },
        { name: 'Nature Green', colorClass: 'bg-green-500' },
        { name: 'Warm Orange', colorClass: 'bg-orange-500' },
        { name: 'Soft Purple', colorClass: 'bg-purple-500' },
        { name: 'Focus Gray', colorClass: 'bg-slate-500' }
      ],
      selectedTheme: { name: 'Default', colorClass: 'bg-black', activeClass: 'bg-blue-600 text-white border-blue-700' } 
    };
  },
  mounted() {
    const tabQuery = this.$route.query.tab;
    if (tabQuery === 'themes') {
      this.activeTab = 'themes';
    } else if (tabQuery === 'familyMembers') {
      this.activeTab = 'familyMembers';
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    handleEditMember(memberId) {
      console.log('Edit member with ID:', memberId);
    },
    handleDeleteMember(memberId) {
      if (confirm('Are you sure you want to remove this family member? This will also remove their associated data in the future.')) {
        console.log('Delete member with ID:', memberId);
        this.familyMembers = this.familyMembers.filter(m => m.id !== memberId);
        this.updateFamilyStats();
      }
    },
    addNewFamilyMember: async function(newMemberData) {
      const supabase = useSupabaseClient();
      const user = useSupabaseUser();
      const parentId = user.value ? user.value.id : null;

      if (!parentId) {
        alert('Error: Parent user ID not found. Please log in again.');
        console.error("addNewFamilyMember: parentId is null, user:", user.value);
        return;
      }

      this.isLoading = true; // Optional: for loading indicator. Add isLoading: false to data() properties.
      let savedMemberForUI = null;
      const roleLower = newMemberData.role.toLowerCase();

      try {
        if (roleLower === 'child') {
          console.log('Attempting to add Child via Edge Function with data:', {
            fullName: newMemberData.fullName,
            username: newMemberData.username,
            parentUserId: parentId,
          });
          const { data: functionResponse, error: functionError } = await supabase.functions.invoke('create-child-user', {
            body: {
              fullName: newMemberData.fullName,
              username: newMemberData.username,
              parentUserId: parentId,
            },
          });

          if (functionError) {
            console.error('Error invoking create-child-user Edge Function:', functionError);
            alert(`Error adding child: ${functionError.message}`);
            this.isLoading = false; // Reset on error
            return;
          }

          if (functionResponse && functionResponse.profile) {
            savedMemberForUI = functionResponse.profile;
            console.log('Child created via Edge Function:', savedMemberForUI);
          } else {
            console.error('Edge Function did not return expected profile data:', functionResponse);
            alert('Error adding child: Unexpected response from server.');
            this.isLoading = false; // Reset on error
            return;
          }
        } else if (roleLower === 'parent') {
          const profileDataForSupabase = {
            full_name: newMemberData.fullName,
            username: newMemberData.username,
            role: roleLower,
            avatar_url: null,
          };
          console.log('Attempting to save Parent directly to Supabase:', profileDataForSupabase);
          
          const { data: dbSavedMember, error: supabaseError } = await supabase
            .from('profiles')
            .insert(profileDataForSupabase)
            .select()
            .single();

          if (supabaseError) {
            console.error('Error saving new parent to Supabase:', supabaseError);
            alert(`Error adding family member: ${supabaseError.message}`);
            this.isLoading = false; // Reset on error
            return;
          }
          savedMemberForUI = dbSavedMember;
          console.log('New parent saved to Supabase:', savedMemberForUI);
        } else {
          alert('Invalid role selected. Please choose "Child" or "Parent".');
          this.isLoading = false; // Reset
          return;
        }

        // Common UI update logic
        if (savedMemberForUI) {
          const memberToAddLocally = {
            id: savedMemberForUI.id,
            name: savedMemberForUI.full_name,
            username: savedMemberForUI.username,
            role: savedMemberForUI.role, 
            age: roleLower === 'child' ? newMemberData.age : undefined,
            avatarInitial: savedMemberForUI.full_name ? savedMemberForUI.full_name.charAt(0).toUpperCase() : '?'
          };
          this.familyMembers.push(memberToAddLocally);
          this.isAddMemberModalVisible = false;
          this.updateFamilyStats();
          alert('Family member added successfully!');
        } else {
          console.warn('Saved member data for UI is null. This might indicate an issue with the data returned from the server.');
          alert('Family member may have been added, but there was an issue retrieving the confirmation details. Please refresh and check.');
        }
      } catch (e) {
        console.error(`Exception during addNewFamilyMember for role ${roleLower}:`, e);
        alert(`An unexpected error occurred: ${e.message}`);
      } finally {
        this.isLoading = false;
      }
    },
    openAddMemberModal() {
      this.isAddMemberModalVisible = true;
    },
    closeAddMemberModal() {
      this.isAddMemberModalVisible = false;
    },
    selectTheme(theme) {
      this.selectedTheme = theme;
      console.log('Selected theme:', theme.name);
      // Future: Apply theme globally
    },
    updateFamilyStats() {
      const children = this.familyMembers.filter(m => m.role === 'Child');
      const parents = this.familyMembers.filter(m => m.role === 'Parent');
      const totalPoints = children.reduce((sum, child) => sum + (child.points || 0), 0);
      const highestLevel = children.length > 0 ? Math.max(...children.map(child => child.level || 0)) : 0;

      this.familyStats = [
        { label: 'Children', value: children.length },
        { label: 'Parents', value: parents.length },
        { label: 'Total Points', value: totalPoints },
        { label: 'Highest Level', value: highestLevel }
      ];
    },
    deleteEntireFamily() {
      if (confirm('ARE YOU ABSOLUTELY SURE? This will delete the entire family and all associated data. This action cannot be undone.')) {
        if (confirm('SECOND CONFIRMATION: Please confirm you want to delete all family data.')) {
          console.log('Deleting entire family...');
          this.familyMembers = [];
          this.updateFamilyStats();
          // Later: Add API call to Supabase to delete all family data from the backend
          alert('Entire family data has been removed locally. Backend integration for full deletion is pending.');
        }
      }
    }
  },
  watch: {
  },
  created() {
    this.updateFamilyStats();
  }
};
</script>

<style scoped>
/* Add any page-specific styles here */
</style>
