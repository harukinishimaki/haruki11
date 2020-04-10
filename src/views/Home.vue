<template>
  <div id="home">
    <div id="container">
      <div class="buddy" v-for="(user,index) in users"
      :key="index"
      @touchstart="OnTouchStart($event)"
      @touchmove="OnTouchMove($event, indes, user.url)"
      @touchend="OnTouchEnd()"
      >
        <div class="avatar" :style="{'background': 'url('+user.url+')'}"></div>
        <p class="user-name">{{user.name}}</p>
      </div>
    </div>
    <div class="buttons">
      <button class="btn nopeBtn" :disabled="isProcessing()" @click="nopeBtn"></button>
      <button class="btn likes" @click="$router.push('About')"></button>
      <button class="btn likeBtn" :disabled="isProcessing()" @click="likeBtn"></button>
    </div>
  </div>
</template>

<style>
  #home {
    background: "000";
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }
  .user-name {
    text-align: center;
    margin-top: 50px;
    background: #000;
  }
  .buttons {
    display: flex;
    justify-content: space-around;
    width: 20%;
    margin: 0 auto;
  }
  .btn {
    display: block;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    border: none;
  }
  .nopeBtn {
    background-image: url("../assets/cross.png");
  }
  .likes {
    background-image: url("../assets/person.png");
  }
  .likeBtn {
    background-image: url("../assets/heart.png");
  }

  #container {
    width: 20%;
    padding: 50px 0;
    margin: auto !important;
    display: block;
    height: 600px;
    position: relative;
    list-style-type: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .buddy {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    color: #fff;
    padding: 20px 0;
    width: 100%;
    height: 560px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
    cursor: hand;
  }
  .rotateleft {
    opacity: 0;
    transform: rotate(30deg) scale(1);
    transition: 1s;
    margin-left: -400px;
    cursor: e-resize;
    z-index: 10;
  }
  .rotateright {
    opacity: 0;
    transform: rotate(-30deg) scale(1);
    transition: 1s;
    margin-left: 400px;
    cursor: w-resize;
    z-index: 10;
  }
  .avatar {
    background: #222;
    width: 100%;
    height: 540px;
    background-size: cover !important;
    background-position: center;
    background-repeat: no-repeat;
  }
  @media screen and (max-width: 480px) {
    #container {
      width: 80%;
      height: 500px;
      padding: 100px 0;
    }
    .buttons {
      width: 50%;
    }
  }
</style>

<script>
import firebase from "firebase";
export default {
  data() {
    return {
      users: [],
      usersLen: null,
      processing: false,
      swipe: {
        flag: false,
        threshold: 10,
        start: {
          x: 0
        },
        current: {
          x: 0
        },
        distance: {
          x: 0
        }
      }
    };
  },
  async created() {
    var db = firebase.firestore();
    await db
    .collection("people")
    .get()
    .then(query => {
      query.forEach(doc => {
        var data = doc.data();
        this.users.push(data);
      });
    });
    this.usersLen = this.users.length;
  },
  methods: {
    OnTouchStart: function(e) {
      this.swipe.flag = true;
      this.swipe.start.x = e.touches[0].pageX;
    },
    OnTouchMove: function(e, index, url) {
      this.swipe.current.x = e.touches[0].pageX;
      this.swipe.distance.x = this.swipe.current.x - this.swipe.start.x;
      if (
        this.swipe.flag &&
        this.swipe.distance.x > 0 &&
        this.swipe.distance.x >= this.swipe.threshold
      ) {
        this.startProcessing();
        this.swipe.flag = false;
        this.rotateRight(e);
        this.addLikes(index, url);
      }
      if (
        this.swipe.flag &&
        this.swipe.distance.x < 0 &&
        this.swipe.distance.x >= this.swipe.threshold * -1
      ) {
        this.startProcessing();
        this.swipe.flag = false;
        this.rotateLeft(e);
        this.deleteLikes(url);
      }
    },
    OnTouchEnd: function() {
      this.swipe.flag = false;
    },
    rotateRight(e) {
      e.currentTarget.className = "buddy rotateright";
    },
    rotateLeft(e) {
      e.currentTarget.className = "buddy rotateleft";
    },
    async addLikes(index, url) {
      var db = firebase.firestore();
      const data = await db
        .collection("likes")
        .where("url", "==", url)
        .where("email", "==", this.$store.state.user.email)
        .get();
      if (data.empty == true) {
        db.collection("likes") .add({
          email: this.$store.state.user.email,
          url: url,
          name: this.users[index - 1].name
        });
      }
      this.usersLen -= 1;
      this.endProcessing();
    },
    async deleteLikes(url) {
      var db = firebase.firestore();
      const data = await db
        .collection("likes")
        .where("url", "==", url)
        .where("email", "==", this.$store.state.user.email)
        .get();
        if (!data.empty == true) {
          db.collection("likes")
            .doc(data.docs[0].id)
            .delete();
        }
        this.usersLen -= 1;
        this.endProcessing();
    },
    likeBtn() {
      this.startProcessing();
      const e = document.querySelector(
        ".buddy:nth-child(" + this.usersLen + ")"
      );
      e.classList.add("rotateright");
      const url = this.users[this.usersLen - 1].url;
      this.addLikes(this.usersLen, url);
    },
    nopeBtn() {
      this.startProcessing();
      const e = document.querySelector(
        ".buddy:nth-child(" + this.usersLen + ")"
      );
      e.classList.add("rotateleft");
      const url = this.users[this.usersLen - 1].url
      this.deleteLikes(url);
    },
    startProcessing: function() {
      this.processing = true;
    },
    endProcessing: function() {
      this.processing = false;
    },
    isProcessing: function() {
      return this.processing;
    }
  }
};
</script>