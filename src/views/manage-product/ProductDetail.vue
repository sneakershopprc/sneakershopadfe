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
              v-if="$route.params.productId != 0"
              class="display-2 font-weight-light"
            >
              Edit Product #{{ $route.params.productId }}
            </div>

            <div
              v-if="$route.params.productId == 0"
              class="display-2 font-weight-light"
            >
              Add New Product
            </div>
          </template>

          <v-form>
            <v-container class="py-0">
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="product.productNm"
                    class="purple-input"
                    label="Product Name"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="product.color"
                    label="Color"
                    class="purple-input"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="2"
                >
                  <v-text-field
                    v-model="product.discount"
                    label="Discount"
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
                    :items="listBrands"
                    item-text="brandNm"
                    item-value="brandId"
                    label="Brand"
                    @change="brandSelect"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-file-input
                    v-model="imageFile"
                    hide-input
                    prepend-icon="mdi-camera"
                    truncate-length="4"
                    @change="uploadImg"
                  />
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
                        width="100"
                        :src="img.url"
                      >
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-btn
                        style="width: 30px; height: 30px"
                        dark
                        color="primary"
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
                    v-model="detail.quantity"
                    label="Quantity"
                    class="purple-input"
                  />
                </v-col>
                <v-col
                  cols="4"
                >
                  <v-text-field
                    v-model="detail.price"
                    label="Price"
                    class="purple-input"
                  />
                </v-col>
                <v-col
                  cols="3"
                >
                  <v-text-field
                    v-model="detail.size"
                    label="Size"
                    class="purple-input"
                  />
                </v-col>
                <v-col
                  cols="1"
                >
                  <v-btn
                    style="width: 30px; height: 30px"
                    dark
                    color="primary"
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
                  >
                    <span v-if="$route.params.productId != 0">Update Product</span>
                    <span v-if="$route.params.productId == 0">Add Product</span>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </base-material-card>
      </v-col>
    </v-row>
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
        productId: '',
        listDetail: [],
        defaultDetail: {
          quantity: 0,
          price: 0,
          size: 0,
        },
        listPhoto: [],
        imageFile: {},
      }
    },
    computed: {
      ...mapGetters('brandStore', ['listBrands']),
      ...mapGetters('productStore', ['product']),
    },
    mounted () {
      this.productId = this.$route.params.productId
      this.fetchListBrands()
      if (this.productId !== 0) {
        this.fetchProduct(this.productId)
      }
    },
    methods: {
      ...mapActions('brandStore', ['fetchListBrands']),
      ...mapActions('productStore', ['fetchProduct']),

      addNewDetail () {
        this.listDetail.push(Object.assign({}, this.defaultDetail))
      },

      clearDetail (index) {
        this.listDetail.splice(index, 1)
      },

      brandSelect () {
        console.log('brandddd ', this.currentBrand)
      },

      removeImg (index) {
        this.listPhoto.splice(index, 1)
      },

      uploadImg () {
        if (this.imageFile) {
          var fileName = moment() + this.imageFile.name

          const storageRef = firebase.storage().ref(`${fileName}`).put(this.imageFile)

          storageRef.on('state_changed', snapshot => {
                          this.uploadValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        },
                        error => {
                          console.log(error.message)
                        },
                        () => {
                          this.uploadValue = 100
                          storageRef.snapshot.ref.getDownloadURL().then((url) => {
                            this.listPhoto.push({ url: url })
                          })
                        },
          )
        }
      },
    },
  }
</script>
