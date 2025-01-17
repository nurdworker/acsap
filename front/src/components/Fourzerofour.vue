<template>
  <div class="container_fzf">
    <h1>404 Not Found</h1>
    <h4 v-on:click="first_access()">Not Found</h4>
    <p>The resource requested could not be found om the server!</p>
  </div>
</template>

<script>
// import { reactive } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  props: {
    state: Object,
  },
  setup() {
    const router = useRouter();
    router;

    return {};
  },
  methods: {
    first_access: function () {
      let id = prompt("你好", "");
      if (id === null) {
        alert("?");
      } else {
        let pw = prompt("很高兴见到你", "");
        if (pw === null) {
          alert("?");
        } else {
          axios
            .post("/api/user", {
              id,
              pw,
            })
            .then((res) => {
              if (res.data.error) {
                alert("error!");
              } else if (!res.data.correct) {
                console.log("유저아님");
              } else {
                // 여기서 작업
                let router = this.$router;
                localStorage.setItem("id", id);
                localStorage.setItem("pw", pw);
                // this.state.data_function();
                router.push({ name: "Menu" });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
.container_fzf {
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
