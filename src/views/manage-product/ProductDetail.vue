<template>
  <v-container
    id="user-profile"
    fluid
    tag="section"
  >
    <v-row justify="center">
      <v-col
        cols="12"
        md="10"
      >
        <base-material-card>
          <template v-slot:heading>
            <div
              v-if="productId != 0"
              class="display-2 font-weight-light"
            >
              Edit Product #{{ productId }}
            </div>

            <div
              v-if="productId == 0"
              class="display-2 font-weight-light"
            >
              Add New Product
            </div>
          </template>

          <v-form
            ref="form"
            lazy-validation
          >
            <v-container class="py-0">
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="product.productNm"
                    :rules="[rules.required]"
                    class="purple-input"
                    label="Product Name"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-select
                    v-model="product.color"
                    :rules="[rules.required]"
                    :items="listColor"
                    item-text="value"
                    item-value="id"
                    label="Color"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="2"
                >
                  <v-text-field
                    v-model="product.discount"
                    min="0"
                    max="100"
                    :rules="[rules.minimum0, rules.maximum100]"
                    type="number"
                    label="Discount%"
                    class="purple-input"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  md="8"
                >
                  <v-text-field
                    v-model="product.description"
                    label="Description"
                    class="purple-input"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-select
                    v-model="product.brandId"
                    :rules="[rules.required]"
                    :items="listBrands"
                    item-text="brandNm"
                    item-value="brandId"
                    label="Brand"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="2"
                  class="text-center"
                >
                  <v-file-input
                    v-model="imageFile"
                    hide-input
                    prepend-icon="mdi-camera"
                    truncate-length="4"
                    @change="uploadImg"
                  />
                  <div style="margin-top: -26px">
                    Add Image
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  v-for="(img, index) in listPhoto"
                  :key="index"
                  cols="3"
                >
                  <v-row>
                    <v-col cols="12">
                      <img
                        style="width: 100%"
                        :src="img.url"
                      >
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      class="text-center"
                      cols="12"
                    >
                      <v-btn
                        style="width: 30px; height: 30px"
                        depressed
                        @click="removeImg(index)"
                      >
                        Remove
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row
                v-for="(detail, index) in listDetail"
                :key="index"
                align="center"
              >
                <v-col
                  cols="4"
                >
                  <v-text-field
                    v-model="detail.size"
                    type="number"
                    :rules="[rules.minimum0, rules.duplicateSize]"
                    label="Size"
                    class="purple-input"
                  />
                </v-col>
                <v-col
                  cols="4"
                >
                  <v-text-field
                    v-model="detail.price"
                    type="number"
                    :rules="[rules.minimum0]"
                    label="Price"
                    class="purple-input"
                  />
                </v-col>
                <v-col
                  cols="3"
                >
                  <v-text-field
                    v-model="detail.quantity"
                    type="number"
                    :rules="[rules.minimum0]"
                    label="Quantity"
                    class="purple-input"
                  />
                </v-col>
                <v-col
                  cols="1"
                >
                  <v-btn
                    v-if="!detail.origin"
                    style="width: 30px; height: 30px"
                    depressed
                    @click="clearDetail(index)"
                  >
                    Clear
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                >
                  <v-btn
                    style="width: 30px; height: 30px"
                    dark
                    color="primary"
                    @click="addNewDetail"
                  >
                    Add
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  class="text-right"
                >
                  <v-btn
                    color="success"
                    class="mr-0"
                    @click="action"
                  >
                    <span v-if="productId != 0">Update Product</span>
                    <span v-if="productId == 0">Add Product</span>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </base-material-card>
      </v-col>
    </v-row>
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
  import moment from 'moment'
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'ProductDetail',
    data () {
      return {
        message: '',
        snackbarShow: false,
        isLoading: false,
        productId: '',
        defaultDetail: {
          quantity: 0,
          price: 0,
          size: 0,
          origin: false,
        },
        imageFile: {},
        listColor: [
          { id: 'White', value: 'White' },
          { id: 'Black', value: 'Black' },
          { id: 'Grey', value: 'Grey' },
          { id: 'Red', value: 'Red' },
          { id: 'Orange', value: 'Orange' },
          { id: 'Yellow', value: 'Yellow' },
          { id: 'Green', value: 'Green' },
          { id: 'Blue', value: 'Blue' },
          { id: 'Brown', value: 'Brown' },
        ],
        rules: {
          required: value => !!value || 'Required.',
          maximum100: value => value <= 100 || 'Maximum 100',
          minimum0: value => value >= 0 || 'Minimum 0',
          duplicateSize: value => this.listDetail.filter(e => e.size === value).length === 1 || 'Duplicate ',
        },
      }
    },
    computed: {
      ...mapGetters('brandStore', ['listBrands']),
      ...mapGetters('productStore', ['product', 'listPhoto', 'listDetail']),
    },
    mounted () {
      this.productId = this.$route.params.productId
      this.fetchData()
    },
    methods: {
      ...mapActions('brandStore', ['fetchListBrands']),
      ...mapActions('productStore', ['fetchProduct', 'updateDetail',
                                     'updateProduct', 'insertProduct',
                                     'insertDetail', 'reset']),
      ...mapActions('loginStore', ['logout']),

      fetchData () {
        this.isLoading = true
        console.log('proID ', this.productId)
        this.fetchListBrands()
          .then(status => {
            if (status === 200) {
              if (this.productId !== '0') {
                this.fetchProduct(this.productId)
                  .then(status => {
                    if (status === 200) {
                      this.isLoading = false
                    } else if (status === 401 || status === 403) {
                      this.logout()
                    } else {
                      this.message = 'Get data fail'
                      this.snackbarShow = true
                    }
                  })
              } else {
                this.reset()
              }
            } else if (status === 401 || status === 403) {
              this.logout()
              this.$router.push('/login')
            } else {
              this.message = 'Get data fail'
              this.snackbarShow = true
            }
          })
      },

      addNewDetail () {
        this.listDetail.push(Object.assign({}, this.defaultDetail))
      },

      clearDetail (index) {
        this.listDetail.splice(index, 1)
      },

      removeImg (index) {
        this.listPhoto.splice(index, 1)
      },

      uploadImg () {
        if (this.imageFile) {
          this.isLoading = true
          var fileName = moment() + this.imageFile.name

          const storageRef = firebase.storage().ref().child('product/' + this.productId + '/' + fileName).put(this.imageFile)

          storageRef.on('state_changed', snapshot => {
                          this.uploadValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        },
                        error => {
                          console.log(error.message)
                          this.message = 'Upload image failed'
                          this.snackbarShow = true
                          this.isLoading = false
                        },
                        () => {
                          this.uploadValue = 100
                          storageRef.snapshot.ref.getDownloadURL().then((url) => {
                            this.listPhoto.push({ url: url })
                            this.isLoading = false
                          })
                        },
          )
        }
      },

      validateForm () {
        var flag = true

        if (this.listPhoto.length === 0) {
          this.message = 'Atleast 1 image'
          this.snackbarShow = true
          flag = false
        } else if (this.listDetail.length === 0) {
          this.message = 'Atleast 1 detail'
          this.snackbarShow = true
          flag = false
        }

        return flag
      },

      action () {
        console.log('actionnn', this.$refs.form.validate())
        if (this.$refs.form.validate() && this.validateForm()) {
          this.isLoading = true
          if (this.productId !== '0') {
            this.updateDetail()
              .then(() => {
                this.updateProduct()
                  .then(status => {
                    if (status === 200) {
                      this.message = 'Update success'
                      this.snackbarShow = true
                      this.fetchData()
                    } else if (status === 401 || status === 403) {
                      this.logout()
                      this.$router.push('/login')
                    } else {
                      this.message = 'Update fail'
                      this.snackbarShow = true
                    }
                    this.isLoading = false
                  })
              })
          } else {
            this.insertProduct()
              .then(status => {
                if (status === 201) {
                  this.productId = this.product.productId
                  console.log('idddd ', this.productId)
                  this.insertDetail()
                    .then(() => {
                      this.isLoading = false
                      this.fetchData()
                      history.pushState({}, null, this.product.productId)
                      this.message = 'Insert success'
                      this.snackbarShow = true
                    })
                }
              })
          }
        }
      },
    },
  }
</script>
