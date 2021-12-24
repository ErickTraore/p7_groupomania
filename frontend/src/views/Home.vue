<template>
    <div id="app">
        <div class="group__header__body">

            <div class="container" v-for="item  in messages" :key="item .id">
            
                <div class="group__header__body__first"> 
                   <div class="group__header__body__first__in"> 
                     <figure>
                      <img :src="item.attachment" />
                      </figure>
                      <b>Mon id: {{ myId }}</b> <br>
                      <b>Mon messageUserId: {{ item.UserId}}</b> <br>
                      <b>{{ item .User.username }}</b> à écrit le
                      {{ new Date(item .createdAt) | dateFormat('DD/MM/YYYY') }} à
                      {{ new Date(item .createdAt) | dateFormat('hh:mm') }} : <br>
                      <b>{{ item .title }}</b><br>
                  </div>
                 
                   <div class="group__header__body__first__down"> 
                     {{ item .content }}<br> 
                    </div>             <!-- <u>Nombre de like:</u> {{ message.likes }} -->
                </div>
                <div _ngcontent-cpa-c6="" class="position like-buttons group__header__body__second">
                  <div class="left">
                        <div _ngcontent-cpa-c6="" class="likes">
                            <button id="dolike"
                                    v-on:click="doLike(item .id)">
                                <i _ngcontent-cpa-c6="" class="like fa-thumbs-up fa-lg far"></i>
                            </button>
                            <span class="spanLikes" _ngcontent-cpa-c6="">{{ item .likes }}</span>

                        </div>
                        <div _ngcontent-cpa-c6="" class="dislikes">
                            <button
                                    v-on:click="doDislike(item .id)">
                                <i _ngcontent-cpa-c6="" class="dislike fa-thumbs-down fa-lg far"></i>
                            </button>
                            <span class="spanDislikes" _ngcontent-cpa-c6="">{{ item .dislikes }}</span>
                        </div>
                  </div>
                  <div class="right">
                     <div _ngcontent-cpa-c6="" class="dislikes">
                        <button 
                        v-if="myId == item.UserId" 
                        class="colorRed"
                        v-on:click="doDelete(item .id)">
                           Supprimer votre message
                        </button>
                    </div>
                  </div>

                </div>
                 <ul>
  </ul>
            </div>
        
            <div class='group__header__body'>
                <form @submit="onPostData" method="post" enctype="multipart/form-data" name="message">
                    
                    
                    <label class="labelForm">Nouveau message avec image optionnelle</label> <br> <br>
                        <p v-if="errors.length">
                        <b>Merci de corriger les erreurs suivantes : </b>
                      <ul>
                          <li v-for="error in errors" :key="error">{{ error }}</li>
                      </ul>
                </p>
                    <input
                            id="title"
                            v-model="message.title"
                            type="text"
                            name="title"
                            placeholder="Titre"
                    > <br> <br>

                    <input
                            id="content"
                            v-model="message.content"
                            type="text"
                            name="content"
                            placeholder="Contenu"
                    > 
                    <input
                            id="attachment"
                            v-model="message.attachment"
                            type="text"
                            name="attachment"
                    > 
                    <br> 
                        <div>
                          <div v-if="!image">
                            <h2>Select an image</h2>
                            <div id="list">
                            </div>

                            <input 
                            id="file" 
                            type="file" 
                            @change="onFileSelected"
                            name="attachment"
                            alt="example"
                            >
                          </div>
                          <div v-else>
                            <img :src="image" />
                            <button @click="removeImage">Remove image</button>
                          </div>
                        </div><br><br>
                        <div>
                        </div>
                      <button 
                      type="submit"
                      value="val"

                      >
                      Envoyer</button>
                </form>
            </div>
        </div>
    </div>
</template>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/1.0.16/vue.js"></script>
<script>
  const path = require("path");
  const isLocal = typeof process.pkg === "undefined";
  const basePath = isLocal ? process.cwd() : path.dirname(process.execPath);
  const baseUri = "ipfs://NewUriToReplace";
  
  
  
  
  const http = require("http");
  var req = require('request');

  import Vue from 'vue'
  import HTTP from 'http'
  import axios from 'axios';
  import VueAxios from 'vue-axios'
  import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format';
  import FormData from 'form-data'
  import { mapGetters } from 'vuex'

  // const path = require('path').
   Vue.use(VueFilterDateFormat);
   Vue.use(VueAxios, axios);
  export default {
    name: 'Home',
    computed: {
      ...mapGetters(["imageExist"])
,    },
   
    data() {
      return {
        
              myId:Number,
              idImage: '',
              testName:Boolean,
              file:Blob,
              errors: [],
              message: {
                title: '',
                content: '',
                attachment: '',
              },
              image:'',
              selectedFile: null,
              messages: [],
              likes: 0,
              dislikes:0,
              posts: {
                  title:'',
                  content: '',
                  attachment:'' ,
                  loading: false
          },
      }
    },
    created() {
       let objMySession = localStorage.getItem("obj")
        let myStorageToken = JSON.parse(objMySession)
        let myId = myStorageToken.myId;
      axios
        .get('http://localhost:3000/api/messages/')
        .then(response => {
          this.myId = myId
          this.messages = response.data
          })
        
        .catch(error => console.log(error()))

    },

  methods: {
      resetForm() {
        console.log('Reseting the form')
        var self = this; //you need this because *this* will refer to Object.keys below`

        //Iterate through each object field, key is name of the object field`
        Object.keys(this.message).forEach(function(key,index) {
          self.message[key] = '';
        });
      },
      doLike: function (id) {
        let objMySession = localStorage.getItem("obj")
        let myStorageToken = JSON.parse(objMySession)
        let token = myStorageToken.myToken;
        this.axios.post('http://localhost:3000/api/messages/' + id + '/vote/like', null, {
            headers: {
              'Authorization': token
            }
          }
        )
          .then(() => {
            axios
              .get('http://localhost:3000/api/messages/')
              .then(response => this.messages = response.data)
              .catch(error => console.log(error()))

          })
          .catch(error => console.log(error()))
      },
      doDislike: function (id) {
        let objMySession = localStorage.getItem("obj")
        let myStorageToken = JSON.parse(objMySession)
        let token = myStorageToken.myToken;
        this.axios.post('http://localhost:3000/api/messages/' + id + '/vote/dislike', null, {
            headers: {
              'Authorization': token
            }
          }
        )
          .then(() => {
            axios
              .get('http://localhost:3000/api/messages/')
              .then(response => this.messages = response.data)
              .catch(error => console.log(error()))
          })
          .catch(error => console.log(error()))
      },
    onPostData(e) {
      e.preventDefault();
        this.errors = [];
        if (!this.message.title) {
          this.errors.push('Veillez saisir le titre');
          }
         else if (this.message.title.length >= 30 || this.message.title.length <= 3){
          this.errors.push('Votre titre doit comprendre entre 4 et 30 caractères.');
        }
        if (!this.message.content) {
          this.errors.push('Veillez saisir le message');
        } else if (this.message.content.length >= 150 || this.message.content.length <= 3){
          this.errors.push('Votre message doit contenir entre 4 et 150 caractères.');
        }
        if (!this.errors.length) {
          console.log('Vérification des inputs --> OK')
          return this.post(this.message);
        }
      },
        post: function (message, e) {
        let objMySession = localStorage.getItem("obj")
        let myStorageToken = JSON.parse(objMySession)
        let token = myStorageToken.myToken;
        this.axios.post('http://localhost:3000/api/messages/new/', message, {
            headers: {
              'Authorization': token
            }
          }
        )
         .then(reponse => {
            this.message = reponse.data
            console.log('message crée ok')
            axios
              .get('http://localhost:3000/api/messages/')
              .then(response => {
                this.messages = response.data
                this.resetForm()
                this.image = '';
                res.status(200).json(this.messages);
                })
              .catch(function(err) {
                err.statusCode = 401;
              });
          })
          .catch(function(err) {
                err.statusCode = 401;
              });
      },
      onFileSelected(e) {
      this.selectedFile = e.target.files[0];
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;
      this.createImage(files[0]);
    },
    createImage(file, next) {
      var image = new Image();
      var reader = new FileReader();
      var vm = this;
      reader.onload = (e) => {
        vm.image = e.target.result;
      };
      reader.readAsDataURL(file);
      if(this.image)
        return; 
        this.pushImage();
    },
    pushImage(e) {
        let objMySession = localStorage.getItem("obj")
        let myStorageToken = JSON.parse(objMySession)
        let token = myStorageToken.myToken;
        const util = require('util');
        var fileName = fileName;
        var formData = new FormData();
        var imagefile = document.querySelector('#file');
        console.log('Mon imageFile[0] :',imagefile.files[0]);
        formData.append("file", imagefile.files[0]);
        axios.post('http://localhost:3000/api/messages/upload', formData, {
          headers: {
            'Authorization': token,
            'Content-Type': 'multipart/form-data' 
          }
      })   
     .then((res) => {
       console.log('valeure reçu par le back:',res.data);
       console.log('valeure res.data.idImage:',res.data.idImage);

          return res.data.idImage;
     })
     .then(function(idImage){
      //  document.querySelector('#this.attachment').innerHTML = idImage

       const attachment = document.querySelector("#attachment");
          attachment.value = "http://localhost:3000/images/"+idImage;

          attachment.dispatchEvent(new Event('input'));

          response.status(200).json({idImage})
     })
    .catch(function(err) {
     err.statusCode = 401;
                    });
  },
    removeImage: function(e) {
        let objMySession = localStorage.getItem("obj")
        let myStorageToken = JSON.parse(objMySession)
        let token = myStorageToken.myToken;
        var fileName = this.selectedFile.name;
        
        console.log('Envoie dufichier pour écrasement',fileName);
        var formData = new FormData();
        formData.append("file", this.selectedFile);
      
        axios.post('http://localhost:3000/api/messages/delLienImage', formData, {
          headers: {
            'Authorization': token,
            'Content-Type': 'multipart/form-data' 
          }
      })   

      this.image = '';
      console.log('Le fichier vient d\'être effacé du navigateur');
      this.message.attachment = '';
      console.log('L\'url du fichier vient d\'être effacé du formulaire');
      e.preventDefault();
    },
    doDelete: function (id) {
        let objMySession = localStorage.getItem("obj")
        let myStorageToken = JSON.parse(objMySession)
        let token = myStorageToken.myToken;
        this.axios.post('http://localhost:3000/api/messages/' + id + '/del', null, {
            headers: {
              'Authorization': token
            }
          })
        .then(reponse => {
            console.log('Deleting message-1')
            axios
              .get('http://localhost:3000/api/messages/')
              .then(response => {
                console.log('Deleting message')
                this.messages = response.data
                this.resetForm()
                res.status(200).json(this.messages);
                })
               .catch(function(err) {
                err.statusCode = 401;
                });
          })
        .catch(function(err) {
              err.statusCode = 401;
              });
      }
  }
  }
</script>

<style scoped>
    .group {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }
    .group__header__body {
        padding: 1rem;
        border-radius: 2rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
        background-color: rgb(35, 49, 82);
    }
    .group__header__body__first {
        height: 100%;
        margin: 5px;
    }
    .group__header__body__first__in {
        font-size: 10px;


     }
    .group__header__body__first__down {
        font-size: 14px;
        background-color:white;


     }
     .group__header__body__second {
        height: 100%;
        /* background-color: rgb(104, 161, 18); */

    }
    .like-buttons[_ngcontent-cpa-c6] {

        display: flex;
    }
    .dislikes[_ngcontent-cpa-c6], .likes[_ngcontent-cpa-c6] {
        margin: 0 .3em;
    }
  .position{
        display: flex;
        justify-content: space-between;

  }
  .left{
        display: flex;
        

  }
  .right{
        display: flex;

  }
 .spanLikes{
padding: 0px 7px 0px 7px;
background: rgb(134, 228, 139);
border: solid 1px black;

 }
  .spanDislikes{
padding: 0px 7px 0px 7px;
background: rgb(230, 122, 122);
border: solid 1px black;
 }
 .colorRed{
   color: red;
   font-size: 8px;
   }
   .container{
    border: solid 5px rgb(189, 182, 182);
    background: rgba(248, 247, 247, 0.801);
    border-radius: 20px;
    margin: 5px;
   }
   .labelForm {
     color:white;
   }
img {
  width: 30%;
  margin: auto;
  display: block;
  margin-bottom: 10px;
}

</style>