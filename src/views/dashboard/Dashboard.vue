<template>
  <div style="min-height: 100%">
    Dashboard
  </div>
</template>

<script>
  export default {
    name: 'DashboardDashboard',

    data () {
      return {
      }
    },

    methods: {
      complete (index) {
        this.list[index] = !this.list[index]
      },
    },
  }
</script>
