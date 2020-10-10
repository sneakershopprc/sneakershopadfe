<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >
    <base-material-card
      icon="mdi-clipboard-text"
      title="Manage Product"
      class="px-5 py-3"
    >
      <v-data-table
        :headers="headers"
        :items="listProducts"
        :loading="isLoading"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-spacer />
            <v-dialog
              v-model="dialogDelete"
              max-width="500px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  @click="addNewProduct"
                >
                  Add New Product
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="headline">
                  Are you sure you want to delete product "{{ selectProduct.productNm }}" ?
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
            :src="item.photoList[0]"
          >
        </template>
        <template v-slot:item.index="{ item }">
          {{ listProducts.indexOf(item) + 1 }}
        </template>
        <template v-slot:item.discount="{ item }">
          {{ item.discount * 100 }}
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
        { text: 'Name', value: 'productNm' },
        { text: 'Brand', value: 'brandNm' },
        { text: 'Price', value: 'price' },
        { text: 'Discount(%)', value: 'discount' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      editedIndex: -1,
      selectProduct: {},
      imgTmp: '',
      snackbarShow: false,
      message: '',
    }),

    computed: {
      ...mapGetters('productStore', ['listProducts']),
      formTitle () {
        return this.editedIndex === -1 ? 'New Product' : 'Edit Product'
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
      ...mapActions('productStore', ['fetchListProducts', 'deleteProduct']),
      ...mapActions('loginStore', ['logout']),
      ...mapMutations('productStore', ['setProduct']),

      initialize () {
        this.isLoading = true

        this.fetchListProducts().then((status) => {
          if (status === 401 || status === 403) {
            this.logout()
            this.$router.push('/login')
          }
          this.isLoading = false
        })
      },

      editItem (item) {
        this.$router.push('/product/' + item.productId)
      },

      addNewProduct () {
        this.$router.push('/product/0')
      },

      deleteItem (item) {
        this.editedIndex = this.listProducts.indexOf(item)
        this.selectProduct = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.listProducts.splice(this.editedIndex, 1)
        this.deleteProduct(this.selectProduct.productId)
        this.closeDelete()
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.selectProduct = Object.assign({}, {})
          this.editedIndex = -1
        })
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
