<template>
  <div class="container_app">
    <div class="loading" v-if="state.isLoading">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <nav class="nav_top" v-if="mode.showNav">
      <div class="user_info">
        <i class="fa-solid fa-user"></i>
        <p>{{ state.id }}</p>
      </div>
      <div class="mode_custom">
        <div class="font_size_box">
          <input
            type="range"
            class="font_size"
            min="1"
            max="5"
            v-model="state.font_size"
            id="font_size_range"
          />
          <label for="font_size_range"
            ><i class="fa-solid fa-font font_size_icon"></i
          ></label>
        </div>

        <div class="form-check form-switch">
          <label class="form-check-label" for="flexSwitchCheckChecked"
            ><i class="fa-solid fa-language"></i
          ></label>
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            id="flexSwitchCheckChecked"
            v-on:click="change_lang()"
          />
        </div>
      </div>
    </nav>

    <div class="view">
      <router-view :state="state"></router-view>
    </div>

    <!-- <div class="test">
      <button class="btn btn-primary" v-on:click="changeRouter('Menu')">
        test to go menu
      </button>
      <button class="btn btn-primary" v-on:click="changeRouter('Semi')">
        test to go Semi
      </button>
      <button class="btn btn-primary" v-on:click="changeRouter('Fail')">
        test to go fail
      </button>
      <button class="btn btn-primary" v-on:click="changeRouter('Fourzerofour')">
        test to go fourzerofour
      </button>
      <button class="btn btn-primary" v-on:click="changeRouter('Test')">
        test to go test
      </button>
      <button class="btn btn-primary" v-on:click="changeRouter('Wrongnote')">
        test to go wrongnote
      </button>
    </div> -->
  </div>
</template>

<script>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
export default {
  setup() {
    const state = reactive({
      id: localStorage.getItem("id"),
      pw: localStorage.getItem("pw"),
      question_data: localStorage.getItem("question_data"),
      answer_data: localStorage.getItem("answer_data"),
      keyword_data: localStorage.getItem("keyword_data")
        ? JSON.parse(localStorage.getItem("keyword_data"))
        : [],
      is_mobile:
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ),
      style: {
        white: "#ffffff",
        navy: "#14213d",
        grey: "#e5e5e5",
        yellow: "#fca311",
        black: "#000000",
        red: "#c1121f",
      },
      font_size: localStorage.getItem("font_size")
        ? Number(localStorage.getItem("font_size"))
        : 4,
      lang: localStorage.getItem("lang") ? localStorage.getItem("lang") : "ko",
      isLoading: false,
      rnfwa_list: localStorage.getItem("rnfwa_list")
        ? JSON.parse(localStorage.getItem("rnfwa_list"))
        : [],
      change_font_size: (now_size, size) => {
        if (size == "large") {
          return now_size * 0.4 + "em";
        } else {
          return now_size * 0.3 + "em";
        }
      },

      //delete
      data_function: async () => {
        state.isLoading = true;
        if (await check_user()) {
          // bring_question_data();
          // bring_answer_data();
          state.isLoading = false;
        } else {
          state.isLoading = false;
          return;
        }
      },
      //delete
      changeRouter: (para) => {
        if (para == "/") {
          router.push("/");
        }
        router.push({ name: para });
      },
      add_rnfwa: (question_number) => {
        if (
          confirm(`QUESTION ${question_number}을 오답노트에 넣으시겠습니까?`)
        ) {
          if (state.rnfwa_list.includes(Number(question_number))) {
            alert("이미 있는 질문입니다");
          } else {
            state.rnfwa_list.push(Number(question_number));
            state.rnfwa_list.sort(function (comp1, comp2) {
              return comp1 - comp2;
            });
            localStorage.setItem(
              "rnfwa_list",
              JSON.stringify(state.rnfwa_list)
            );
          }
        }
      },
    });

    const router = useRouter();

    const path = document.location.pathname;

    const mode = reactive({
      showNav: path === ("/fail" || "/fourzerofour") ? false : true,
    });

    const changeRouter = (para) => {
      if (para == "/") {
        router.push("/");
      }
      router.push({ name: para });
    };

    const isLocal_user_data = async () => {
      return new Promise((resolve) => {
        if (!localStorage.getItem("id") || !localStorage.getItem("pw")) {
          resolve(false);
        } else {
          state.id = localStorage.getItem("id");
          state.pw = localStorage.getItem("pw");
          resolve(true);
        }
      });
    };

    const is_correct_user = async () => {
      return new Promise((resolve) => {
        axios.post("/api/user", { id: state.id, pw: state.pw }).then((res) => {
          if (res.data.correct) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    };

    const check_user = async () => {
      if (await isLocal_user_data()) {
        console.log("유저데이터 있음");
        if (await is_correct_user()) {
          console.log("인증유저 맞음");
          return true;
        } else {
          localStorage.removeItem("id");
          localStorage.removeItem("pw");
          router.push("/fourzerofour");
          console.log("비인증 유저");
          return false;
        }
      } else {
        console.log("유저데이터 없음");
        router.push("/fourzerofour");
        return false;
      }
    };

    //delete

    // const bring_question_data = async () => {
    //   // 질문 받아오기

    //   return new Promise((resolve) => {
    //     axios
    //       .post("/api/question_data", {
    //         id: localStorage.getItem("id"),
    //         pw: localStorage.getItem("pw"),
    //         version: localStorage.getItem("version"),
    //       })
    //       .then((res) => {
    //         if (res.data.error) {
    //           alert("q error");
    //           resolve(false);
    //         } else if (res.data.correct == false) {
    //           resolve(false);
    //           router.push("/fourzerofour");
    //         } else if (res.data.matched_ver == true) {
    //           console.log("matched version");
    //           resolve(false);
    //         } else {
    //           state.question_data = JSON.stringify(res.data.data);
    //           localStorage.setItem(
    //             "question_data",
    //             JSON.stringify(res.data.data)
    //           );
    //           localStorage.setItem("version", res.data.version);
    //           resolve(true);
    //         }
    //       });
    //   });
    // };

    // const bring_answer_data = async () => {
    //   //답가져와
    //   return new Promise((resolve) => {
    //     axios
    //       .post("/api/answer_data", {
    //         id: localStorage.getItem("id"),
    //         pw: localStorage.getItem("pw"),
    //         version: localStorage.getItem("version"),
    //       })
    //       .then((res) => {
    //         if (res.data.error) {
    //           alert("a error");
    //           resolve(false);
    //         } else if (res.data.correct == false) {
    //           router.push("/fourzerofour");
    //           resolve(false);
    //         } else if (res.data.matched_ver == true) {
    //           console.log("matched version");
    //           resolve(false);
    //         } else {
    //           // state.answer_data = JSON.stringify(res.data.data);
    //           localStorage.setItem(
    //             "answer_data",
    //             JSON.stringify(res.data.data)
    //           );
    //           localStorage.setItem("version", res.data.version);
    //           resolve(true);
    //         }
    //       });
    //   });
    // };

    //delete

    const change_lang = () => {
      if (state.lang == "en") {
        state.lang = "ko";
        localStorage.setItem("lang", "ko");
      } else {
        state.lang = "en";
        localStorage.setItem("lang", "en");
      }
    };

    //delete
    state.data_function();
    //delete
    return {
      state,
      mode,
      changeRouter,
      check_user,
      change_lang,
    };
  },

  watch: {
    $route(to, from) {
      //language nav
      if (from.path == "/fourzerofour") {
        this.check_user();
        this.mode.showNav = true;
      }
      if (to.path == "/fourzerofour") {
        this.mode.showNav = false;
      }

      //fail nav
      if (to.path == "/fail") {
        this.mode.showNav = false;
      }
    },
    "state.font_size": {
      handler() {
        localStorage.setItem("font_size", this.state.font_size);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  font-family: "kanit", sans-serif;
}

p {
  margin: 0;
}
#app {
  width: 100%;
}

.container_app {
  padding: 0;
  margin: 0;

  background-color: v-bind("state.style.grey");
  padding-top: 30px;
  width: 100%;
  height: auto;

  .loading {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 6;
    background-color: rgba(255, 255, 255, 0.5);
  }
  .nav_top {
    display: flex;
    justify-content: space-between;
    position: fixed;
    top: 0;
    height: 30px;
    width: 100%;
    background-color: v-bind("state.style.navy");
    color: v-bind("state.style.white");
    padding-left: 5px;
    padding-right: 5px;
    z-index: 5;
    margin: 0;
    p {
      margin: 0;
    }
    .user_info {
      display: flex;
      width: 30%;
      color: v-bind("state.style.white");
      i {
        padding-right: 5px;
        padding-top: 5px;
        margin: 0;
      }
    }
    .mode_custom {
      display: flex;
      justify-content: flex-end;

      width: 60%;
      .font_size {
        width: 60%;
        margin-right: 10px;
      }
      .font_size_icon {
        margin-left: 3px;
        margin-right: 10px;
      }
    }
  }
}
</style>
