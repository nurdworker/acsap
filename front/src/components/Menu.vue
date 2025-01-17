<template>
  <div class="container_menu">
    <button
      type="button"
      class="btn btn-light"
      v-on:click="changeRouter('General')"
    >
      <div class="icon">
        <i class="fa-solid fa-house-medical"></i>
      </div>
      <div class="title">
        <p>General Questions</p>
      </div>
    </button>
    <button type="button" class="btn btn-light" v-on:click="check_semi()">
      <div class="icon">
        <i class="fa-solid fa-spell-check"></i>
      </div>
      <div class="title">Semi - Test</div>
    </button>
    <button type="button" class="btn btn-light" v-on:click="check_rnfwa()">
      <div class="icon">
        <i class="fa-solid fa-notes-medical"></i>
      </div>
      <div class="title">RNFWA</div>
    </button>
    <button
      type="button"
      class="btn btn-light"
      v-on:click="changeRouter('Test')"
    >
      <div class="icon">
        <i class="fa-regular fa-heart"></i>
      </div>
      <div class="title">Real Test(미구현)</div>
    </button>
    <button
      type="button"
      class="btn btn-light"
      v-on:click="changeRouter('Insertdata')"
    >
      <div class="icon">
        <i class="fa-solid fa-gear"></i>
      </div>
      <div class="title">Setting</div>
    </button>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
// import { reactive } from "vue";

export default {
  name: "Menu",
  props: {
    state: Object,
  },
  setup(props) {
    props;
    // const state = reactive({});
    const router = useRouter();

    const changeRouter = (para) => {
      if (para == "/") {
        router.push("/");
      }
      router.push({ name: para });
    };
    const check_semi = () => {
      if (localStorage.getItem("save_semi")) {
        let start_point = JSON.parse(
          localStorage.getItem("save_semi")
        ).start_point;
        let end_point = JSON.parse(localStorage.getItem("save_semi")).end_point;
        if (
          confirm(
            `QUESTION ${start_point}-${end_point}\n저장된 테스트가 있는데 보실 건가요?\n * 취소를 누르시면 테스트 데이터가 사라집니다.`
          )
        ) {
          changeRouter("Semi");
        } else {
          localStorage.removeItem("save_semi");
          changeRouter("Semi");
        }
      } else {
        changeRouter("Semi");
      }
    };

    const check_rnfwa = () => {
      if (
        !localStorage.getItem("rnfwa_list") ||
        JSON.parse(localStorage.getItem("rnfwa_list")).length == 0
      ) {
        alert("오답노트가 비어있답니다.");
      } else {
        changeRouter("Wrongnote");
      }
    };

    return {
      changeRouter,
      check_semi,
      check_rnfwa,
    };
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
.container_menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  button {
    display: flex;
    align-items: center;
    width: 70%;
    height: 120px;
    margin: 20px;
    color: v-bind("state.style.navy");

    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50px;
      width: 20%;
      margin: 0;

      i {
        font-size: 30px;
        width: 100%;
      }
    }
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 70%;
      font-size: 1.5em;
    }
  }
}
</style>
