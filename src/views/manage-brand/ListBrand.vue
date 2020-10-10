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
              <v-card :loading="isDialogLoaing">
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <!-- Name -->
                    <v-row>
                      <v-text-field
                        v-model="editedBrand.brandNm"
                        label="Name"
                      />
                    </v-row>
                    <!-- Description -->
                    <v-row>
                      <v-text-field
                        v-model="editedBrand.description"
                        label="Description"
                      />
                    </v-row>
                    <!-- Image -->
                    <v-row
                      style="height: 120px; text-align: center"
                      :class="'justify-center align-center'"
                    >
                      <img
                        v-if="!isUploading && editedBrand.photo"
                        height="100"
                        :src="editedBrand.photo"
                      >
                      <v-progress-circular
                        v-if="isUploading"
                        indeterminate
                        color="primary"
                      />
                    </v-row>
                    <v-row>
                      <v-file-input
                        v-model="imagePreview"
                        :rules="rules"
                        accept="image/*"
                        placeholder="Pick an image"
                        prepend-icon="mdi-camera"
                        label="Image"
                        @change="uploadImg"
                        @click:clear="cancelImg"
                      />
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
  import firebase from 'firebase'
  import { mapActions, mapGetters, mapMutations } from 'vuex'

  export default {
    data: () => ({
      rules: [
        value => !value || value.size < 20000000 || 'Image size should be less than 20 MB!',
      ],
      imagePreview: null,
      isLoading: false,
      isDialogLoaing: false,
      isUploading: false,
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
        photo: '',
        description: '',
      },
      defaultBrand: {
        brandId: '',
        brandNm: '',
        photo: '',
        description: '',
      },
      imgTmp: '',
      snackbarShow: false,
      message: '',
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
      ...mapActions('brandStore', ['fetchListBrands', 'updateBrand', 'addBrand']),
      ...mapActions('loginStore', ['logout']),
      ...mapMutations('brandStore', ['setBrand']),

      initialize () {
        this.isLoading = true

        this.fetchListBrands().then((status) => {
          if (status === 401 || status === 403) {
            this.logout()
            this.$router.push('/login')
          }
          this.isLoading = false
        })
      },

      editItem (item) {
        this.imagePreview = null
        this.editedIndex = this.listBrands.indexOf(item)
        this.editedBrand = Object.assign({}, item)
        this.imgTmp = this.editedBrand.photo
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
        if (!this.isDialogLoaing) {
          this.dialog = false
          this.$nextTick(() => {
            this.editedBrand = Object.assign({}, this.defaultBrand)
            this.editedIndex = -1
          })
        }
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
          if (!this.isUploading) {
            this.isDialogLoaing = true
            this.setBrand(this.editedBrand)
            this.updateBrand()
              .then(status => {
                if (status === 200) {
                  this.message = 'Update success'
                  this.snackbarShow = true
                  this.isDialogLoaing = false
                  Object.assign(this.listBrands[this.editedIndex], this.editedBrand)
                  this.close()
                } else if (status === 401 || status === 403) {
                  this.logout()
                  this.$router.push('/login')
                } else {
                  this.message = 'Error'
                  this.snackbarShow = true
                }
              })
          }
        } else {
          if (!this.isUploading) {
            this.isDialogLoaing = true
            this.setBrand(this.editedBrand)
            this.addBrand()
              .then(status => {
                if (status === 201) {
                  this.message = 'Update success'
                  this.snackbarShow = true
                  this.isDialogLoaing = false
                  this.initialize()
                  this.close()
                } else if (status === 401 || status === 403) {
                  this.logout()
                  this.$router.push('/login')
                } else {
                  this.message = 'Error'
                  this.snackbarShow = true
                }
              })
          }
        }
      },

      uploadImg () {
        if (this.imagePreview) {
          this.isUploading = true
          var extend = this.imagePreview.name.substr(this.imagePreview.name.lastIndexOf('.'))
          var fileName = this.editedBrand.brandId + extend

          const storageRef = firebase.storage().ref(`${fileName}`).put(this.imagePreview)

          storageRef.on('state_changed', snapshot => {
                          this.uploadValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        },
                        error => {
                          console.log(error.message)
                          this.isUploading = false
                        },
                        () => {
                          this.uploadValue = 100
                          storageRef.snapshot.ref.getDownloadURL().then((url) => {
                            this.editedBrand.photo = url
                            console.log(this.editedBrand.photo)
                            this.isUploading = false
                          })
                        },
          )
        }
      },

      cancelImg () {
        this.editedBrand.photo = this.imgTmp
        this.isUploading = false
      },
    },
  }
</script>
