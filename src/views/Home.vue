<template>
  <div class="home">
    <div v-for="(data,index) in $store.state.user" :key="index">
      <p>{{data.name}}</p>
      <p>{{data.age}}</p>
    </div>
    <button @click="changeUser">変更</button>
  </div>
</template>
<script>
import firebase from "firebase";
export default {
  data() {
    return {
      users: []
    };
  },
  methods: {
    changeUser() {
      this.$store.dispatch("changeUserAction",
      {
        user: this.users
      });
    },
    get() {
      var db = firebase.firestore();
      db.collection("users")
        .get()
        .then(query => {
          query.forEach(doc => {
            var data = doc.data();
            this.users.push(data);
          });
        });
    }
  },
  created() {
    this.get();
  }
};
</script>
