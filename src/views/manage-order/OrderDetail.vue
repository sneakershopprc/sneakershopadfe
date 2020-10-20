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
        <base-material-card :loading="isLoading">
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              Order #{{ orderId }}
            </div>
          </template>

          <v-container>
            <v-row>
              <v-col cols="2">
                Receiver Name:
              </v-col>

              <v-col cols="4">
                {{ orderDetail.receiverNm }}
              </v-col>
              <v-col cols="2">
                Order Date:
              </v-col>

              <v-col cols="4">
                {{ orderDetail.insDatetime }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2">
                Phone:
              </v-col>

              <v-col cols="4">
                {{ orderDetail.phonenumber }}
              </v-col>
              <v-col cols="2">
                Address Shipping:
              </v-col>

              <v-col cols="4">
                {{ orderDetail.shippingAddress }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-chip
                  v-if="orderDetail.status === 'Cancel'"
                  color="red"
                  text-color="white"
                >
                  Cancel
                </v-chip>
                <v-chip
                  v-if="orderDetail.status === 'Waiting'"
                >
                  Waiting
                </v-chip>
                <v-chip
                  v-if="orderDetail.status === 'Confirm'"
                  color="blue"
                  text-color="white"
                >
                  Confirm
                </v-chip>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-data-table
                  :headers="headers"
                  :items="listProductOfOrder"
                  :loading="isLoading"
                  class="elevation-1"
                >
                  <template v-slot:item.photo="{ item }">
                    <img
                      style="margin: 15px 0"
                      height="100"
                      :src="item.photoList ? item.photoList[0] : ''"
                    >
                  </template>
                  <template v-slot:item.index="{ item }">
                    {{ listProductOfOrder.indexOf(item) + 1 }}
                  </template>
                </v-data-table>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="7" />
              <v-col
                cols="2"
                class="text-right"
              >
                Total:
              </v-col>

              <v-col
                cols="1"
                class="text-right"
              >
                {{ orderDetail.totalPrice }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="7" />
              <v-col
                cols="2"
                class="text-right"
              >
                Discount:
              </v-col>

              <v-col
                cols="1"
                class="text-right"
              >
                {{ orderDetail.totalDiscount }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="7" />
              <v-col
                cols="2"
                class="text-right"
              >
                Total Payment:
              </v-col>

              <v-col
                cols="1"
                class="text-right"
              >
                {{ orderDetail.totalFinal }}
              </v-col>
            </v-row>

            <v-row>
              <v-col
                cols="12"
                class="text-center"
              >
                <v-btn
                  v-if="orderDetail.status === 'Waiting'"
                  color="blue"
                  @click="reqUpdate('Confirm')"
                >
                  Confirm
                </v-btn>
                <v-btn
                  v-if="orderDetail.status === 'Waiting'"
                  color="error"
                  @click="reqUpdate('Cancel')"
                >
                  Cancel
                </v-btn>
                <v-btn @click="back">
                  Back
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </base-material-card>
      </v-col>
    </v-row>
    <v-dialog
      v-model="confirmDialog"
      max-width="600px"
    >
      <v-card>
        <v-card-title class="headline">
          Are you sure you want to {{ action }} this order?
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
            @click="actionCall"
          >
            OK
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    name: 'ProductDetail',
    data () {
      return {
        message: '',
        snackbarShow: false,
        confirmDialog: false,
        isLoading: false,
        orderId: '',
        headers: [
          { text: 'No.', value: 'index' },
          { text: 'Image', value: 'photo' },
          { text: 'Name', value: 'ProductNm' },
          { text: 'Color', value: 'Color' },
          { text: 'Price', value: 'Price' },
          { text: 'Discount (%)', value: 'Discount' },
          { text: 'Quantity', value: 'quantity' },
        ],
        action: '',
      }
    },
    computed: {
      ...mapGetters('orderStore', ['orderDetail', 'listProductOfOrder']),
    },
    mounted () {
      this.orderId = this.$route.params.orderId
      this.fetchData()
    },
    methods: {
      ...mapActions('orderStore', ['fetchDetail', 'updateStatus']),
      ...mapActions('loginStore', ['logout']),

      fetchData () {
        this.isLoading = true
        // console.log('order id ', this.orderId)
        this.fetchDetail(this.orderId).then((status) => {
          if (status === 200) {
            this.isLoading = false
          } else if (status === 401 || status === 403) {
            this.logout()
            this.$router.push('/login')
          } else {
            this.message = 'Get data fail'
            this.snackbarShow = true
            this.isLoading = false
          }
        })
      },

      actionCall () {
        this.isLoading = true
        this.confirmDialog = false
        var param = {
          status: this.action,
          orderId: this.orderId,
        }
        this.updateStatus(param)
          .then(resStatus => {
            if (resStatus === 200) {
              this.message = status + ' success'
              this.snackbarShow = true
            } else if (resStatus === 401 || resStatus === 403) {
              this.logout()
              this.$router.push('/login')
            } else {
              this.message = 'Update fail'
              this.snackbarShow = true
            }
            this.isLoading = false
          })
      },

      back () {
        this.$router.push('/order/')
      },

      reqUpdate (action) {
        this.confirmDialog = true
        this.action = action
      },
    },
  }
</script>
