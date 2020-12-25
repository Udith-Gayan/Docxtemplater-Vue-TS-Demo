import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import  {ConvertApi} from 'convertapi-js';
// import VueGoogleApi from 'vue-google-api';

Vue.config.productionTip = false;

// const config = {
//   apiKey: 'AIzaSyBl__HXmM-BGhbLWr5XrO7TkMeNA2whrT8',
//   clientId: '758058407223-hvomncjkfm1up5eoa0s7fd2sb9bdc5hr.apps.googleusercontent.com',
//   scope: 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file',
//   discoveryDocs: [ 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest' ]
// }
// Vue.use(VueGoogleApi, config);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

