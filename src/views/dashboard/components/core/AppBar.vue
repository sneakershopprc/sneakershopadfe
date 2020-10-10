<template>
  <v-app-bar
    id="app-bar"
    absolute
    app
    color="transparent"
    flat
    height="75"
  >
    <v-row>
      <v-col cols="10" />

      <v-col
        cols="1"
        class="text-right"
      >
        <v-btn
          class="ml-2"
          min-width="0"
          text
          to="/"
        >
          <v-icon>mdi-view-dashboard</v-icon>
        </v-btn>
      </v-col>

      <v-col cols="1">
        <v-btn
          class="ml-2"
          min-width="0"
          text
          @click="logoutAct"
        >
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-app-bar>
</template>

<script>
  // Utilities
  import { mapState, mapMutations, mapActions } from 'vuex'

  export default {
    name: 'DashboardCoreAppBar',

    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },

    data: () => ({
    }),

    computed: {
      ...mapState(['drawer']),
    },

    methods: {
      ...mapMutations({
        setDrawer: 'SET_DRAWER',
      }),
      ...mapActions('loginStore', ['logout']),
      logoutAct () {
        this.logout()
        this.$router.push('/login')
      },
    },
  }
</script>
