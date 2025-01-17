<template>
  <div class="container_rnfwa">
    <div class="rnfwa_list">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">question number</th>
            <th scope="col">show btn</th>
            <th scope="col">delete btn</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(question_number, i) in now_list?.question_list"
            :key="question_number"
          >
            <th scope="row" v-if="i % 2 == 0">{{ question_number }}</th>
            <td v-if="i % 2 == 0">
              <button
                class="btn btn-primary"
                v-on:click="show_question_scroll(question_number)"
              >
                Show No.{{ question_number }}
              </button>
            </td>
            <td v-if="i % 2 == 0">
              <button
                class="btn btn-danger"
                v-on:click="delete_question(question_number)"
              >
                Delete No.{{ question_number }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">question number</th>
            <th scope="col">show btn</th>
            <th scope="col">delete btn</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(question_number, i) in now_list?.question_list"
            :key="question_number"
          >
            <th scope="row" v-if="i % 2 == 1">{{ question_number }}</th>
            <td v-if="i % 2 == 1">
              <button
                class="btn btn-primary"
                v-on:click="show_question_scroll(question_number)"
              >
                Show No.{{ question_number }}
              </button>
            </td>
            <td v-if="i % 2 == 1">
              <button
                class="btn btn-danger"
                v-on:click="delete_question(question_number)"
              >
                Delete No.{{ question_number }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="box_list">
      <div class="keyword" v-if="mode_rnfwa.key_active">
        <p>
          {{
            choosing_keyword(now_list?.question_list?.[now_list.now_index])?.[
              "content"
            ]
          }}
        </p>
        <button
          class="btn btn-info"
          v-on:click="
            edit_keyword(now_list?.question_list?.[now_list.now_index])
          "
        >
          keyword edit
        </button>
      </div>
      <div class="question_number">
        <h5>QUESTION {{ now_list?.question_list?.[now_list.now_index] }}</h5>
      </div>
      <div class="question">
        <p>
          {{
            choosing_question(now_list?.question_list?.[now_list.now_index])[
              "question_" + state.lang
            ]
          }}
        </p>
      </div>

      <div
        class="answer_list"
        v-for="answer in choosing_answer(
          now_list?.question_list?.[now_list.now_index]
        )"
        :key="answer"
      >
        <div
          class="answer"
          v-on:click="quick_answer(correct_answer_class_binding(answer))"
        >
          <div class="is_correct">
            <i
              class="fa-solid fa-check"
              v-if="
                correct_answer_class_binding(answer) && mode_rnfwa.answer_active
              "
            ></i>
          </div>
          <div class="index_answer">
            <p>{{ answer.index_answer }}</p>
          </div>

          <div class="answer_content">
            <p>
              {{ answer["content_" + state.lang] }}
            </p>
          </div>
        </div>
      </div>
      <button class="btn btn-light" v-on:click="scroll_up()">up</button>
    </div>
    <div class="blank"></div>
    <div class="btns">
      <div
        class="key"
        v-bind:class="[mode_rnfwa.key_active ? 'key_btn_active' : '']"
        v-on:click="key_active()"
      >
        <i class="fa-solid fa-key"></i>
      </div>
      <div
        class="watch"
        v-bind:class="[mode_rnfwa.answer_active ? 'answer_btn_active' : '']"
        v-on:click="answer_active()"
      >
        <i class="fa-solid fa-voicemail"></i>
      </div>
    </div>

    <nav class="rnfwa_nav_bottom">
      <div class="home" v-on:click="state.changeRouter('Menu')">
        <i class="fa-solid fa-house"></i>
      </div>

      <div class="pre" v-on:click="go_pre()">
        <i class="fa-solid fa-chevron-left"></i>
      </div>
      <div class="next" v-on:click="go_next()">
        <i class="fa-solid fa-chevron-right"></i>
      </div>
    </nav>
  </div>
</template>

<script>
import { reactive } from "vue";

export default {
  props: {
    state: Object,
  },
  name: "Wrongnote",
  setup(props) {
    const state_rnfwa = reactive({
      question: JSON.parse(props.state.question_data),
      answer: JSON.parse(props.state.answer_data),
      keyword: props.state.keyword_data ? props.state.keyword_data : [],
    });

    const mode_rnfwa = reactive({
      answer_active: false,
      key_active: false,
    });

    const now_list = reactive({
      question_number: localStorage.getItem("rnfwa_question_number")
        ? localStorage.getItem("rnfwa_question_number")
        : 1,
      question_list: JSON.parse(localStorage.getItem("rnfwa_list")),
      now_index: 0,
    });

    const choosing_question = (question_number) => {
      let question;
      state_rnfwa.question.forEach((list) => {
        if (list.question_number == question_number) {
          question = list;
        }
      });
      return question;
    };

    const choosing_answer = (question_number) => {
      let answer_list = [];
      state_rnfwa.answer.forEach((list) => {
        if (list.question_number == question_number) {
          answer_list.push(list);
        }
      });
      return answer_list;
    };

    const answer_active = () => {
      if (mode_rnfwa.answer_active) {
        mode_rnfwa.answer_active = false;
      } else {
        mode_rnfwa.answer_active = true;
      }
    };

    const go_next = () => {
      if (now_list.question_list.length == now_list.now_index + 1) {
        alert("다음 질문 없어요");
      } else {
        now_list.now_index++;
        setTimeout(() => {
          window.scrollTo(0, document.body.scrollHeight);
        }, 0);
      }
    };

    const go_pre = () => {
      if (now_list.now_index == 0) {
        alert("첫번째 질문이야");
      } else {
        now_list.now_index--;
        setTimeout(() => {
          window.scrollTo(0, document.body.scrollHeight);
        }, 0);
      }
    };

    const correct_answer_class_binding = (answer) => {
      let question_number = answer.question_number;
      let now_correct_answer_list = [];
      const parsing_correct_answer = (question_number) => {
        let correct_answer_index;
        state_rnfwa.question.forEach((list) => {
          if (list.question_number == question_number) {
            correct_answer_index = list.correct_answer_index;
          }
        });
        let correct_answer_list = [];
        for (let i = 0; i < correct_answer_index.length; i++) {
          correct_answer_list.push(correct_answer_index[i]);
        }
        now_list.correct_answer_list = correct_answer_list;
        now_correct_answer_list = correct_answer_list;
      };
      parsing_correct_answer(question_number);
      if (now_correct_answer_list.includes(answer.index_answer)) {
        return true;
      } else {
        return false;
      }
    };

    const quick_answer = (para) => {
      if (para) {
        alert("정답!");
      } else {
        alert("떙");
      }
    };

    // const show_question_scroll = (question_number) => {
    //   for (let i = 0; i < now_list.question_list.length; i++) {
    //     if (now_list.question_list[i] === question_number) {
    //       now_list.now_index = i;
    //     }
    //   }
    // };

    const delete_question = (question_number) => {
      if (confirm(`QUESTION ${question_number} 오답노트에서 삭제하실건가요?`)) {
        if (now_list.question_list.length === 1) {
          localStorage.removeItem("rnfwa_list");
          props.state.changeRouter("Menu");
        } else {
          for (let i = 0; i < now_list.question_list.length; i++) {
            if (now_list.question_list[i] === question_number) {
              JSON.parse(localStorage.getItem("rnfwa_list")).splice(i, 1);
              localStorage.setItem(
                "rnfwa_list",
                JSON.stringify(now_list.question_list)
              );
              now_list.question_list.splice(i, 1);
              i--;
            }
          }
        }
      }
    };

    const key_press = (para) => {
      if (props.state.is_mobile) {
        return;
      } else {
        if (para.key == "ArrowLeft") {
          go_pre();
        } else if (para.key == "ArrowRight") {
          go_next();
        }
      }
    };

    const choosing_keyword = (question_number) => {
      let keyword_obj;

      let keyword_list = state_rnfwa.keyword;
      keyword_list.forEach((obj) => {
        if (obj.question_number == question_number) {
          keyword_obj = obj;
        }
      });

      return keyword_obj;
    };

    const edit_keyword = (question_number) => {
      let keyword_list = state_rnfwa.keyword;

      let isEmpty = keyword_list.find(
        (obj) => obj.question_number == question_number
      );

      if (!isEmpty) {
        let inserted_content = prompt("키워드 넣자", "");
        if (inserted_content) {
          let new_obj = {
            question_number: question_number,
            content: inserted_content,
          };
          state_rnfwa.keyword.push(new_obj);
          localStorage.setItem(
            "keyword_data",
            JSON.stringify(state_rnfwa.keyword)
          );
        } else {
          return;
        }
      } else {
        keyword_list.forEach((obj, index) => {
          if (obj.question_number == question_number) {
            let inserted_content = prompt("수정하자", obj.content);
            if (inserted_content) {
              let new_obj = {
                question_number: question_number,
                content: inserted_content,
              };
              state_rnfwa.keyword[index] = new_obj;
              localStorage.setItem(
                "keyword_data",
                JSON.stringify(state_rnfwa.keyword)
              );
            } else {
              return;
            }
          }
        });
      }
    };

    const key_active = () => {
      if (mode_rnfwa.key_active) {
        mode_rnfwa.key_active = false;
      } else {
        mode_rnfwa.key_active = true;
      }
    };

    return {
      state_rnfwa,
      mode_rnfwa,
      now_list,
      choosing_question,
      choosing_answer,
      answer_active,
      go_next,
      go_pre,
      correct_answer_class_binding,
      quick_answer,
      // show_question_scroll,
      delete_question,
      key_press,
      choosing_keyword,
      edit_keyword,
      key_active,
    };
  },
  watch: {
    // "now_list.question_list.length": {
    //   handler() {
    //     this.state.changeRouter("Menu");
    //     if (this.now_list.question_list.length == 0) {
    //       console.log("active");
    //     }
    //   },
    // },
  },
  methods: {
    scroll_up: () => {
      window.scrollTo(0, 0);
    },
    scroll_down: () => {
      window.scrollTo(0, document.body.scrollHeight);
    },
    show_question_scroll: function (question_number) {
      for (let i = 0; i < this.now_list.question_list.length; i++) {
        if (this.now_list.question_list[i] === question_number) {
          this.now_list.now_index = i;
        }
      }
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 100);
    },
  },
  mounted() {
    document.addEventListener("keydown", this.key_press);
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
.container_rnfwa {
  display: flex;
  flex-direction: column;
  .keyword {
    z-index: 1;
    width: 100%;
    display: flex;
    justify-content: center;
    position: fixed;
    top: 60px;
    font-size: 1.3em;
    padding: 20px;
    color: v-bind("state.style.red");
    background-color: rgba(255, 255, 255, 0.7);
    p {
      margin: 0;
    }
    button {
      margin-left: 10px;
    }
  }

  .blank {
    height: 100px;
  }

  .rnfwa_list {
    display: flex;
  }
  .box_list {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    .question_number {
      position: sticky;

      top: 30px;
      background-color: v-bind("state.style.grey");
      padding: 10px;
      margin-bottom: 20px;
      h5 {
        font-size: v-bind("state.change_font_size(state.font_size,'large')");
      }
    }
    .question {
      padding-bottom: 20px;
      width: 90%;
      font-size: v-bind("state.change_font_size(state.font_size,'medium')");
    }
    .answer_list {
      width: 90%;
      padding-top: 10px;
      padding-bottom: 10px;
      .answer {
        display: flex;
        align-items: center;
        .is_correct {
          width: 30px;
          height: 100%;
          color: red;
          font-size: v-bind("state.change_font_size(state.font_size,'large')");
        }
        .index_answer {
          font-size: 1.5em;
          margin-right: 20px;
          font-size: v-bind("state.change_font_size(state.font_size,'large')");
        }
        .answer_content {
          font-size: v-bind("state.change_font_size(state.font_size,'medium')");

          width: 80%;
        }
      }
    }
  }

  .btns {
    display: flex;
    position: fixed;
    bottom: 60px;

    width: 100%;
    justify-content: flex-end;

    .watch {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1em;
      color: v-bind("state.style.white");
      background-color: v-bind("state.style.yellow");
      padding: 10px;
      margin: 10px;
      border-radius: 50px;
      width: 50px;
      height: 50px;
      box-shadow: grey 3px 3px 3px;
    }

    .key {
      display: flex;
      justify-content: center;
      align-items: center;
      bottom: 60px;
      font-size: 1em;
      color: v-bind("state.style.white");
      background-color: v-bind("state.style.red");
      padding: 10px;
      margin: 10px;
      border-radius: 50px;
      width: 50px;
      height: 50px;
      box-shadow: grey 3px 3px 3px;
    }
  }

  .answer_btn_active {
    width: 70px;
    height: 70px;

    animation: scale 0.5s infinite;
    animation-direction: alternate;
    font-size: 1.5em;

    @keyframes scale {
      from {
        transform: scale(110%);
      }
      to {
        transform: scale(100%);
      }
    }
  }

  .rnfwa_nav_bottom {
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 60px;
    background-color: v-bind("state.style.navy");
    color: v-bind("state.style.white");
    div {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 20%;
      height: 100%;
    }
  }
  @media (max-width: 500px) {
    .rnfwa_list {
      display: flex;
      width: 100%;
      .table {
        width: 50%;
        th {
          font-size: 0.5em;
        }
        td {
          button {
            font-size: 0.7em;
            padding: 0;
          }
        }
      }
    }
    .box_list {
      justify-content: center;
      padding: 0;
      .question {
      }
      .answer_list {
        display: flex;
        justify-content: flex-start;

        position: relative;

        .answer {
          display: flex;

          position: relative;

          .is_correct {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            width: 10px;
            i {
              position: absolute;
              top: 50%;
              transform: translate(-50%, -50%);
            }

            height: 100%;
            font-size: v-bind(
              "state.change_font_size(state.font_size,'large')"
            );

            color: red;
          }
        }
      }
    }
  }
}
</style>
