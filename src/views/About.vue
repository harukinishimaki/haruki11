<template>
  <div id="about">
    <div class="flex arrow">
      <p @click="$router.push('/')">&lt;</p>
      <h1>{{$store.state.user.displayName}}さん</h1>
      <p></p>
    </div>
    <h2>お気に入りリスト</h2>
    <div class="flex">
      <div v-for="(data,index) in likes" :key="index" class="card">
        <img :src="data.url" alt />
        <p>{{data.name}}</p>
      </div>
    </div>
  </div>
</template>

<style>
#about {
  width: 100%;
  margin: 0 auto;
  text-align: center;
  overflow: scroll;
  height: 100vh;
}
.arrow p {
  font-size: 30px;
  cursor: pointer;
}
img {
  height: 350px;
}
.flex {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.card {
  margin-bottom: 10px;
}
h2 {
  margin: 10px;
}
</style>

<script>
import firebase from "firebase";
export default {
  data() {
    return {
      likes: []
    };
  },
  created() {
    var db = firebase.firestore();
    db.collection("likes")
      .get()
      .then(query => {
        query.forEach(doc => {
          var data = doc.data();
          this.likes.push(data);
        });
      });
  }
};
</script>
