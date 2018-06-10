/*
**  mimneUtils.js
**  cloned over from my SnapperStore project
**  will get more use in future for front end preview
*/

let mimeUtils = {
  // SnapperStrore comment.. to be updated...
  // since there is no server side DB,
  // we use the filename extension to map
  // to a type (image, audio, or video),
  // so that we know how to render
  extTable: {
    "jpg": "imageComponent",
    "png": "imageComponent",
    "bmp": "imageComponent",
    "gif": "imageComponent",

    "wav": "audioComponent",
    "mp3": "audioComponent",


    "mp4": "videoComponent",
    "m4v": "videoComponent",
    "ogg": "videoComponent"
  },



  // the point of this is twofold:
  // 1) we'll have major type for a future DB field (video, audio, etc)
  // 2) normalizing to a single file extension per type (JPEG, jpg -> jpg)
  mimeTable: {

    // images
    "image/jpeg": {
      type: "image",
      ext: "jpg"
    },

    "image/jpg": {
      type: "image",
      ext: "jpg"
    },

    "image/png": {
      type: "image",
      ext: "png"
    },

    "image/bmp": {
      type: "image",
      ext: "bmp"
    },

    "image/gif": {
      type: "image",
      ext: "gif"
    },
    
    // audio
    "audio/x-wav": {
      type: "audio",
      ext: "wav"
    },
    
    "audio/mpeg": {
      type: "audio",
      ext: "mp3"
    },
    
    // video
    "video/mp4": {
      type: "video",
      ext: "mp4"
    },

    "video/x-m4v": {
      type: "video",
      ext: "m4v"
    },

    "video/ogg": {
      type: "video",
      ext: "ogv"
    },
  },

  getItemType(theFilename) {
    let ext =  theFilename.split('.').pop();
    ext = ext.toLowerCase();
    // 
    let retval =  this.extTable[ext] || "unknown";

    return retval;
  },

  getData(theFile) {
    if (this.mimeTable[theFile.type]) {
      return this.mimeTable[theFile.type];
    } else {
      alert('no...');
    }
  }
};

export default mimeUtils;
