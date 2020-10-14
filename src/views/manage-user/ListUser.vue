<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <base-material-card
      icon="mdi-clipboard-text"
      title="Manage User"
      class="px-5 py-3"
    >
      <v-card-title>
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search fullname..."
          single-line
          hide-details
        />
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="listAcc"
        :loading="isLoading"
        :search="search"
        :custom-filter="searchFullname"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-dialog
              v-model="confirmDialog"
              max-width="500px"
            >
              <v-card>
                <v-card-title class="headline">
                  Are you sure you want to {{ action }} account @{{ currentAcc }}?
                </v-card-title>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="confirmDialog = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="callAction"
                  >
                    {{ action }}
                  </v-btn>
                  <v-spacer />
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template
          v-slot:item.delFlg="{ item }"
        >
          <div v-if="getUser().username !== item.username">
            <v-btn
              v-if="item.delFlg"
              small
              color="blue"
              @click="actionAccount('Active', item.username)"
            >
              Active
            </v-btn>

            <v-btn
              v-else
              small
              color="red"
              @click="actionAccount('Disable', item.username)"
            >
              Disable
            </v-btn>
          </div>
        </template>
        <template v-slot:item.index="{ item }">
          {{ listAcc.indexOf(item) + 1 }}
        </template>
        <template v-slot:item.photo="{ item }">
          <img
            :src="item.photo"
            width="150"
          >
        </template>
        <template v-slot:item.role="{ item }">
          <v-icon
            v-if="item.role === 'admin'"
            small
            color="green"
          >
            mdi-check-circle
          </v-icon>
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
  import { mapActions, mapState, mapGetters } from 'vuex'

  export default {
    data: () => ({
      search: '',
      isLoading: false,
      confirmDialog: false,
      currentAcc: null,
      dataShow: [],
      headers: [
        { text: 'No.', value: 'index' },
        { text: 'Username', value: 'username' },
        { text: 'Avatar', value: 'photo', sortable: false },
        { text: 'Fullname', value: 'fullname' },
        { text: 'Email', value: 'email' },
        { text: 'Admin', value: 'role', align: 'center' },
        { text: 'Action', value: 'delFlg', sortable: false, align: 'center' },
      ],
      snackbarShow: false,
      message: '',
      action: '',
    }),

    computed: {
      ...mapState('accountStore', ['listAcc']),
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
      ...mapActions('accountStore', ['fetchList', 'actionAcc']),
      ...mapActions('loginStore', ['logout']),
      ...mapGetters('loginStore', ['getUser']),

      initialize () {
        this.isLoading = true

        this.fetchList().then((status) => {
          if (status === 401 || status === 403) {
            this.logout()
            this.$router.push('/login')
          }
          this.isLoading = false
        })
      },

      actionAccount (action, username) {
        this.confirmDialog = true
        this.action = action
        this.currentAcc = username
      },

      callAction () {
        this.isLoading = true
        this.confirmDialog = false
        this.actionAcc(this.currentAcc)
          .then(status => {
            if (status === 401 || status === 403) {
              this.logout()
              this.$router.push('/login')
            } else if (status === 200) {
              this.snackbarShow = true
              this.message = 'Process success!'
            }

            this.isLoading = false
          })
      },

      searchFullname (value, search, items) {
        if (items.fullname) return items.fullname.toLowerCase().includes(search)
        return false
      },
    },
  }
</script>
