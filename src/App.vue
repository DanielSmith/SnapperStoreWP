<template>
  <v-app light
    @dragover.native="dragOver"
    @drop.native="doDrop"
    @dragstart.native="dragOver"
    @dragend.native="dragEnd" @paste.native="onPaste($event)">

    <main>
      <v-content class="blue-grey lighten-2">
        <v-container fluid>
          <v-layout row wrap>
            <v-flex xs8>
  
              <v-card>
                <h1>{{ msg }}</h1>
  
                <v-btn large primary @click="doFileClick">
                drag, paste, or select file...
                </v-btn>
  
                <p>
                  <input type="file" class="hideme" @change="checkFile($event.target)" id="newFile">
                </p>
                <div>
                  {{ thePost }}
                </div>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
    </main>  
  </v-app>
</template>

<script>
  import axios from 'axios';
  import mimeUtils from './mimeUtils';
  
  export default {
    name: 'app',
    data() {
      return {
        msg: 'Create WordPress Media...' + new Date().getTime(),
  
        auth: {
          username: 'dasssssniel',
          password: 'root'
        },
  
        titles: [
          'this',
          'that'
        ],
  
        authToken: '',
        mediaID: 1233,

        thePost: ''
      }
    },
  
  
    created: function() {},
  
    mounted: function() {
      this.doAuth();
    },
  
    methods: {

      // just pop open the file selection dialog
      // when a file has been selected, it invokes a change event,
      // so look at checkFile() for that
      doFileClick() {
        document.getElementById('newFile').click();
      },

      doAuth() {
        const wpAuthPoint = 'http://wp.dls/wp-json/simple-jwt-authentication/v1/token';
        let postData = {
          'username': 'daniel',
          'password': 'root'
        };
  
        let axiosConfig = {};
  
        axios.post(wpAuthPoint, postData, axiosConfig)
          .then(response => {
            console.dir(response.data.token);
            this.authToken = response.data.token;
          }).catch(function(error) {
            console.log('Error on Authentication');
          });
      },
  
      dragOver: (args) => {
        args.preventDefault();
      },
  
      doDrop(event) {
        event.preventDefault();
        // just upload one file for now...
        let theFile = event.dataTransfer.files[0];
        this.doUpload(theFile);
      },

  
      dragEnd: (args) => {
        args.preventDefault();
      },
  
      // pasted from screen / region capture
      onPaste(event) {
        // let index = 0;
        let items = (event.clipboardData || event.originalEvent.clipboardData).items;
        // TODO:  do a check here to see if it is an image...
        let imageItem = items[0];
        let imageFile = imageItem.getAsFile();

        /* this is for future handling of showing a preview..
        if (imageItem.kind === 'file') {
          let reader = new FileReader();
          let URLObj = window.URL || window.webkitURL;
          let source = URLObj.createObjectURL(imageFile);

          this.createImage(source);
          reader.onload = (event) => {
            let myImage = new Image();
            myImage.src = event.target.result;
            myImage.onload = () => {
              // this.doUpload(myImage);
            }
          };
          reader.readAsDataURL(imageFile);
        }
        */

        this.doUpload(imageFile);
      },
  

  
      // this will be used when creating a template
      getNewElementForType(theType) {
        switch (theType) {
          case "image":
            return new Image();
            break;
  
          case "audio":
            return new Audio();
            break;
  
          case "video":
            return document.createElement('video');
            break;
  
          default:
            return ''; // what to use for this...?
            break;
        }
      },
  
  
      // not being used yet
      getWPData() {
  
        this.titles = [];
        fetch(`http://wp.dls/wp-json/wp/v2/posts`)
          .then(response => response.json())
          .then(response => {
  
            console.log(response);
            response.map(cur => {
              this.titles.push(cur.title.rendered);
            })
          })
          .catch(err => {
            console.log(err);
          });
      },
  

      checkFile(theTarget) {
        let theFile = theTarget.files[0];
        this.doUpload(theFile);

        // console.table(theTarget.files[0]);
        // // alert('new file' + theTarget.files.fileList[0].name);
  
        // const wpPostPoint = 'http://wp.dls/wp-json/wp/v2/media';
  
        // let imageName = theTarget.files[0].name;
        // let imageType = theTarget.files[0].type;
  
        // let axiosConfig = {
        //   headers: {
        //     'Authorization': 'Bearer ' + this.authToken,
        //     'cache-control': 'no-cache',
        //     'content-disposition': `attachment; filename=${imageName}`,
        //     'content-type': imageType
        //   } nm 
        // }
  
        // let postData = theTarget.files[0];
  
  
        // axios.post(wpPostPoint, postData, axiosConfig)
        //   .then(response => {
        //     console.dir(response.data.id);
        //     this.mediaID = response.data.id * 1;

        //ok
  
        //     this.doPost();
        //   }).catch(function(error) {
        //     console.log('Error on post');
        //   });
      },
  
  
      doUpload(theFile) {
        const wpPostPoint = 'http://wp.dls/wp-json/wp/v2/media';
  
        let mediaName = theFile.name;
        let mediaMIME = mimeUtils.getData(theFile);

        console.dir(mediaMIME);
  
        let axiosConfig = {
          headers: {
            'Authorization': 'Bearer ' + this.authToken,
            'cache-control': 'no-cache',
            'content-disposition': `attachment; filename=${mediaName}`,
            'content-type': theFile.type
          }
        }

        console.dir(axiosConfig.headers);
  
        let postData = theFile;
        let mediaURL = '';

        axios.post(wpPostPoint, postData, axiosConfig)
        .then(response => {                    
          mediaURL = response.data.source_url;
          this.mediaID = response.data.id * 1;
          this.doPost(mediaURL, mediaMIME);
        }).catch(function(error) {
          console.log('Error osn post');
        });
      },
  
      doPost(url, theMIME) {
        const wpPostPoint = 'http://wp.dls/wp-json/wp/v2/posts';
        this.thePost = this.getMediaCode(url, theMIME);

        let postData = {
          'title': "'" + this.mediaID + "'",
          'content': this.thePost,
          'status': 'publish'
        }

        let axiosConfig = {
          headers: {
            'Authorization': 'Bearer ' + this.authToken
          }
        }

        axios.post(wpPostPoint, postData, axiosConfig)
          .then(function(response) {
            console.log(response);
          }).catch(function(error) {
            console.log('Error  33 on post');
          });
      },

      getMediaCode(path, mediaMIME) {

        switch (mediaMIME.type) {
          case "image":
            return `
              <div>
                <img src="${path}">
              </div>        
            `;        

            break;

          case "audio":
            return `
              <div>
                <audio controls src="${path}"></audio>
              </div>    
            `;            
            break;

          case "video":
            return `
              <div>
                <video controls src="${path}"></video>
              </div>    
            `;            
            break;

          default:
            return ''; // what to use for this...?
            break;
        }
      }
    }
}

</script>

<style lang="css">
  #app {
    color: #56b983;
  }

  .hideme {
    display: none;
  }
</style>
