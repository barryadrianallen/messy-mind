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
            <button @click="openAddMemberModal" class="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Member
            </button>
          </div>
          <!-- Member List -->
          <div class="space-y-3">
            <FamilyMemberItem
              v-for="member in familyMembers"
              :key="member.id"
              :member="member"
              @edit="handleEditMember"
              @delete="handleDeleteMember"
            />
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

export default {
  name: 'FamilySettingsPage',
  components: {
    FamilyMemberItem,
    AddMemberModal
  },
  data() {
    return {
      activeTab: 'familyMembers', 
      isAddMemberModalVisible: false, 
      familyMembers: [
        {
          id: 1,
          name: 'Alex',
          age: 8,
          username: 'alex_tasks',
          level: 3,
          points: 275,
          role: 'Child',
          avatarInitial: 'A'
        },
        {
          id: 2,
          name: 'Sam',
          age: 10,
          username: 'sam_tasks',
          level: 2,
          points: 190,
          role: 'Child',
          avatarInitial: 'S'
        },
        {
          id: 3,
          name: 'Sarah',
          age: 35,
          username: 'sarah_parent',
          level: 0, 
          points: 0,
          role: 'Parent',
          avatarInitial: 'S'
        }
      ],
      familyStats: [
        { label: 'Children', value: 2 },
        { label: 'Parents', value: 1 },
        { label: 'Total Points', value: 465 },
        { label: 'Highest Level', value: 3 }
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
      console.log('Delete member with ID:', memberId);
      this.familyMembers = this.familyMembers.filter(m => m.id !== memberId);
      this.updateFamilyStats(); 
    },
    selectTheme(theme) {
      this.selectedTheme = theme;
      console.log('Selected theme:', theme.name);
    },
    openAddMemberModal() {
      this.isAddMemberModalVisible = true;
    },
    closeAddMemberModal() {
      this.isAddMemberModalVisible = false;
    },
    addNewFamilyMember(memberData) {
      const newMember = {
        id: Date.now(), 
        name: memberData.fullName,
        age: memberData.age !== undefined ? memberData.age : null, 
        username: memberData.username,
        level: memberData.role === 'Child' ? 1 : 0, 
        points: 0,
        role: memberData.role,
        avatarInitial: memberData.fullName ? memberData.fullName.charAt(0).toUpperCase() : '?'
      };
      this.familyMembers.push(newMember);
      this.updateFamilyStats(); 
      // this.closeAddMemberModal(); 
    },
    updateFamilyStats() {
      const childrenCount = this.familyMembers.filter(m => m.role === 'Child').length;
      const parentCount = this.familyMembers.filter(m => m.role === 'Parent').length;
      const totalPoints = this.familyMembers.reduce((sum, m) => sum + (m.points || 0), 0);
      const highestLevel = Math.max(0, ...this.familyMembers.map(m => m.level || 0));

      this.familyStats = [
        { label: 'Children', value: childrenCount },
        { label: 'Parents', value: parentCount },
        { label: 'Total Points', value: totalPoints },
        { label: 'Highest Level', value: highestLevel }
      ];
    }
  },
  created() {
    this.updateFamilyStats();
  }
};
</script>

<style scoped>
/* Add any page-specific styles here */
</style>
