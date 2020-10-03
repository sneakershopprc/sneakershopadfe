<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <base-material-card
      icon="mdi-clipboard-text"
      title="Manage Brand"
      class="px-5 py-3"
    >
      <v-data-table
        :headers="headers"
        :items="listBrands"
        :loading="isLoading"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-spacer />
            <v-dialog
              v-model="dialog"
              max-width="500px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  Add New Brand
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="editedBrand.brandNm"
                          label="Name"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="editedBrand.photo"
                          label="Image"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="editedBrand.description"
                          label="Name"
                        />
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="close"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="save"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog
              v-model="dialogDelete"
              max-width="500px"
            >
              <v-card>
                <v-card-title class="headline">
                  Are you sure you want to delete this item?
                </v-card-title>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="closeDelete"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="deleteItemConfirm"
                  >
                    OK
                  </v-btn>
                  <v-spacer />
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            small
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:item.photo="{ item }">
          <img
            style="margin: 15px 0"
            height="100"
            :src="item.photo"
          >
        </template>
        <template v-slot:item.index="{ item }">
          {{ listBrands.indexOf(item) + 1 }}
        </template>
      </v-data-table>
    </base-material-card>
  </v-container>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    data: () => ({
      isLoading: false,
      dialog: false,
      dialogDelete: false,
      headers: [
        { text: 'No.', value: 'index' },
        { text: 'Image', value: 'photo' },
        { text: 'Name', value: 'brandNm' },
        { text: 'Description', value: 'description' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      editedIndex: -1,
      editedBrand: {
        brandId: '',
        brandNm: '',
        photo: 0,
        description: 0,
      },
      defaultBrand: {
        brandId: '',
        brandNm: '',
        photo: 0,
        description: 0,
      },
    }),

    computed: {
      ...mapGetters('brandStore', ['listBrands']),
      formTitle () {
        return this.editedIndex === -1 ? 'New Brand' : 'Edit Brand'
      },
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
      ...mapActions('brandStore', ['fetchListBrands']),
      ...mapActions('loginStore', ['logout']),

      initialize () {
        this.isLoading = true

        this.fetchListBrands().then((status) => {
          if (status === 401 || status === 403) {
            this.logout()
            this.$router.push('/')
          }
          this.isLoading = false
        })
      },

      editItem (item) {
        this.editedIndex = this.listBrands.indexOf(item)
        this.editedBrand = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.listBrands.indexOf(item)
        this.editedBrand = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.listBrands.splice(this.editedIndex, 1)
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedBrand = Object.assign({}, this.defaultBrand)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedBrand = Object.assign({}, this.defaultBrand)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.listBrands[this.editedIndex], this.editedBrand)
        } else {
          this.listBrands.push(this.editedBrand)
        }
        this.close()
      },
    },
  }
</script>
