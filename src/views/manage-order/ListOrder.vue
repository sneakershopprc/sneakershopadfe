<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <base-material-card
      icon="mdi-clipboard-text"
      title="Manage Order"
      class="px-5 py-3"
    >
      <v-data-table
        :headers="headers"
        :items="listOrders"
        :loading="isLoading"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-spacer />
          </v-toolbar>
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip
            v-if="item.status === 'Cancel'"
            color="red"
            text-color="white"
          >
            {{ item.status }}
          </v-chip>
          <v-chip
            v-if="item.status === 'Waiting'"
          >
            {{ item.status }}
          </v-chip>
          <v-chip
            v-if="item.status === 'Confirm'"
            color="blue"
            text-color="white"
          >
            {{ item.status }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="viewDetail(item.orderId)"
          >
            mdi-pencil
          </v-icon>
        </template>
        <template v-slot:item.index="{ item }">
          {{ listOrders.indexOf(item) + 1 }}
        </template>
      </v-data-table>
    </base-material-card>

    <v-snackbar
      v-model="snackbarShow"
      :timeout="5000"
    >
      {{ message }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="snackbarShow = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    data: () => ({
      isLoading: false,
      headers: [
        { text: 'No.', value: 'index' },
        { text: 'Fullname', value: 'receiverNm' },
        { text: 'Phone', value: 'phonenumber', sortable: false },
        { text: 'Order Date', value: 'insDatetime' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      snackbarShow: false,
      message: '',
    }),

    computed: {
      ...mapGetters('orderStore', ['listOrders']),
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    mounted () {
      this.initialize()
    },

    methods: {
      ...mapActions('orderStore', ['fetchListOrders']),
      ...mapActions('loginStore', ['logout']),

      initialize () {
        this.isLoading = true

        this.fetchListOrders().then((status) => {
          if (status === 401 || status === 403) {
            this.logout()
            this.$router.push('/login')
          }
          this.isLoading = false
        })
      },

      viewDetail (id) {
        this.$router.push('/order/' + id)
      },
    },
  }
</script>
