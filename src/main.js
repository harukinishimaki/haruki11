import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase'

Vue.config.productionTip = false
const config = {
  apiKey: 'AIzaSyC8e7Ff0snCZFN2UyPjuKZsv5BZnBnrpS0 ',
  projectId: 'test-f1611',
  authDomain: 'test-f1611.firebaseapp.com',
  databaseURL: 'https://test-f1611.firebaseio.com',
  storageBucket: 'test-f1611.appspot.com',
}

firebase.initializeApp(config)

export default firebase;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')