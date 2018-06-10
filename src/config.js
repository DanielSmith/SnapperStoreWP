import Vue from 'vue'

const vueConfig = require('vue-config')
const configs = {
  ENV: 'Local Dev',
  SERVER: 'http://wp.dls:',
}

Vue.use(vueConfig, configs)

// A param named `$config` will be injected in to every
// component, so in your component, you can get config easily
// const API = this.$config.API

