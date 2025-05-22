<template>
  <div>
    <ChildDashboard />
  </div>
</template>

<script>
import ChildDashboard from '~/components/ChildDashboard.vue'

export default {
  name: 'ChildPage',
  components: {
    ChildDashboard
  },
  // Add any page-specific logic here
}
</script>
