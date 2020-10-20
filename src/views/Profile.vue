<template>
  <v-container
    id="user-profile"
    fluid
    tag="section"
  >
    <v-row justify="center">
      <v-col
        cols="12"
        md="8"
      >
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              <span style="margin-right: 15px">Edit Profile</span>
              <v-progress-circular
                v-if="isLoading"
                indeterminate
                color="white"
              />
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
                    label="Username"
                    :value="user.username"
                    disabled
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    class="purple-input"
                    label="Role"
                    :value="user.role"
                    disabled
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="user.fullname"
                    label="Fullname"
                    class="purple-input"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="user.email"
                    label="Email"
                    class="purple-input"
                  />
                </v-col>

                <v-col cols="6">
                  <v-file-input
                    v-model="imageFile"
                    :rules="rules"
                    accept="image/*"
                    placeholder="Pick an avatar"
                    prepend-icon="mdi-camera"
                    label="Avatar"
                    @change="uploadImg"
                    @click:clear="cancelImg"
                  />
                </v-col>

                <v-col
                  cols="6"
                  class="text-center"
                >
                  <img
                    v-if="previewAvatarUrl != null"
                    style="margin: 15px 0"
                    height="100"
                    :src="previewAvatarUrl"
                  >
                </v-col>

                <v-col
                  cols="12"
                  class="text-right"
                >
                  <v-btn
                    color="success"
                    class="mr-0"
                    :disabled="isLoading"
                    @click="update"
                  >
                    Update Profile
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </base-material-card>
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <base-material-card
          class="v-card-profile"
          :avatar="tmpUser.photo"
        >
          <v-card-text class="text-center">
            <h6 class="display-1 mb-1 grey--text">
              {{ tmpUser.role }}
            </h6>

            <h4 class="display-2 font-weight-light mb-3 black--text">
              {{ tmpUser.fullname }}
            </h4>
          </v-card-text>
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
  import { mapActions, mapState } from 'vuex'
  import firebase from 'firebase'
  import moment from 'moment'

  export default {
    name: 'Profile',
    data () {
      return {
        profile: {},
        tmpUser: {},
        isLoading: false,
        imageFile: null,
        previewAvatarUrl: null,
        snackbarShow: false,
        message: '',
        rules: [
          value => !value || value.size < 20000000 || 'Image size should be less than 20 MB!',
        ],
      }
    },
    computed: {
      ...mapState('accountStore', ['user']),
    },
    mounted () {
      this.initialize()
    },
    methods: {
      ...mapActions('accountStore', ['fetchProfile', 'updateProfile']),
      ...mapActions('loginStore', ['logout']),

      initialize () {
        this.isLoading = true

        this.fetchProfile().then(status => {
          if (status === 401 || status === 403) {
            this.logout()
            this.$router.push('/login')
          }
          this.isLoading = false
          this.setTmpUserVal()
        })
      },

      setTmpUserVal () {
        this.tmpUser = {
          fullname: this.user.fullname,
          username: this.user.username,
          photo: this.user.photo,
          role: this.user.role,
        }
      },

      uploadImg () {
        if (this.imageFile) {
          this.isLoading = true
          var fileName = moment() + this.imageFile.name

          const storageRef = firebase.storage().ref().child('profile/' + fileName).put(this.imageFile)

          storageRef.on('state_changed', snapshot => {
                          this.uploadValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        },
                        () => {
                          this.isLoading = false
                        },
                        () => {
                          this.uploadValue = 100
                          storageRef.snapshot.ref.getDownloadURL().then((url) => {
                            this.previewAvatarUrl = url
                            this.user.photo = this.previewAvatarUrl
                            // console.log(this.previewAvatarUrl)
                            this.isLoading = false
                          })
                        },
          )
        }
      },

      cancelImg () {
        this.previewAvatarUrl = null
        this.user.photo = null
        this.isLoading = false
      },

      update () {
        if (!this.isLoading) {
          this.isLoading = true
          this.updateProfile().then(status => {
            if (status === 401 || status === 403) {
              this.logout()
              this.$router.push('/login')
            } else if (status === 200) {
              this.setTmpUserVal()
              this.snackbarShow = true
              this.message = 'Profile update successfully'
            }
            this.isLoading = false
          })
        }
      },
    },
  }
</script>
