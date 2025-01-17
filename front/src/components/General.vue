<template>
  <div class="container_general">
    <div class="keyword" v-if="mode_general.key_active">
      <p>{{ choosing_keyword(now_list.question_number)?.["content"] }}</p>
      <button
        class="btn btn-info"
        v-on:click="edit_keyword(now_list.question_number)"
      >
        keyword edit
      </button>
    </div>

    <div class="box_list">
      <div class="question_number">
        <h5>QUESTION {{ now_list.question_number }}</h5>
      </div>
      <div class="question">
        <p>
          {{
            choosing_question(now_list.question_number)[
              "question_" + state.lang
            ]
          }}
        </p>
      </div>

      <div
        class="answer_list"
        v-for="answer in choosing_answer(now_list.question_number)"
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
                correct_answer_class_binding(answer) &&
                mode_general.answer_active
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
    </div>

    <div class="btns">
      <div
        class="key"
        v-bind:class="[mode_general.key_active ? 'key_btn_active' : '']"
        v-on:click="key_active()"
      >
        <i class="fa-solid fa-key"></i>
      </div>

      <div
        class="watch"
        v-bind:class="[mode_general.answer_active ? 'answer_btn_active' : '']"
        v-on:click="answer_active()"
      >
        <i class="fa-solid fa-voicemail"></i>
      </div>
    </div>

    <div class="blank"></div>

    <nav class="general_nav_bottom">
      <div class="home" v-on:click="state.changeRouter('Menu')">
        <i class="fa-solid fa-house"></i>
      </div>
      <div class="search" v-on:click="search_question()">
        <i class="fa-solid fa-magnifying-glass"></i>
      </div>
      <div class="rnfna" v-on:click="state.add_rnfwa(now_list.question_number)">
        <i class="fa-solid fa-notes-medical"></i>
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
  name: "General",
  setup(props) {
    const state_general = reactive({
      question: JSON.parse(props.state.question_data),
      answer: JSON.parse(props.state.answer_data),
      keyword: props.state.keyword_data ? props.state.keyword_data : [],
      data: "",
    });

    const mode_general = reactive({
      answer_active: false,
      key_active: false,
    });

    const now_list = reactive({
      question_number: localStorage.getItem("general_question_number")
        ? localStorage.getItem("general_question_number")
        : 1,
    });

    const choosing_question = (question_number) => {
      let question;
      state_general.question.forEach((list) => {
        if (list.question_number == question_number) {
          question = list;
        }
      });
      localStorage.setItem("general_question_number", now_list.question_number);
      return question;
    };

    const choosing_answer = (question_number) => {
      let answer_list = [];
      state_general.answer.forEach((list) => {
        if (list.question_number == question_number) {
          answer_list.push(list);
        }
      });
      return answer_list;
    };

    const choosing_keyword = (question_number) => {
      let keyword_obj;

      let keyword_list = state_general.keyword;
      keyword_list.forEach((obj) => {
        if (obj.question_number == question_number) {
          keyword_obj = obj;
        }
      });

      return keyword_obj;
    };

    const edit_keyword = (question_number) => {
      let keyword_list = state_general.keyword;

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
          state_general.keyword.push(new_obj);
          localStorage.setItem(
            "keyword_data",
            JSON.stringify(state_general.keyword)
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
              state_general.keyword[index] = new_obj;
              localStorage.setItem(
                "keyword_data",
                JSON.stringify(state_general.keyword)
              );
            } else {
              return;
            }
          }
        });
      }
    };

    const answer_active = () => {
      if (mode_general.answer_active) {
        mode_general.answer_active = false;
      } else {
        mode_general.answer_active = true;
      }
    };

    const key_active = () => {
      if (mode_general.key_active) {
        mode_general.key_active = false;
      } else {
        mode_general.key_active = true;
      }
    };

    const go_next = () => {
      if (state_general.question.length == now_list.question_number) {
        alert("다음 질문 없어요");
      } else {
        mode_general.key_active = false;
        now_list.question_number++;
      }
    };

    const go_pre = () => {
      if (now_list.question_number == 1) {
        alert("1번이야");
      } else {
        mode_general.key_active = false;
        now_list.question_number--;
      }
    };

    const correct_answer_class_binding = (answer) => {
      let question_number = answer.question_number;
      let now_correct_answer_list = [];
      const parsing_correct_answer = (question_number) => {
        let correct_answer_index;
        state_general.question.forEach((list) => {
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

    const search_question = () => {
      let question_number = prompt("몇 번?");

      if (isNaN(Number(question_number))) {
        alert("숫자입력");
      } else if (
        question_number > state_general.question.length ||
        question_number < 1
      ) {
        alert(`1번부터 ${state_general.question.length}번까지있음`);
      } else if (!Number.isInteger(Number(question_number))) {
        alert("정수쓰세요");
      } else {
        now_list.question_number = question_number;
      }
    };

    const quick_answer = (para) => {
      if (para) {
        alert("정답!");
      } else {
        alert("떙");
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

    return {
      state_general,
      mode_general,
      now_list,
      choosing_question,
      choosing_answer,
      choosing_keyword,
      edit_keyword,
      answer_active,
      key_active,
      go_next,
      go_pre,
      correct_answer_class_binding,
      search_question,
      quick_answer,
      key_press,
    };
  },
  watch: {},
  mounted() {
    document.addEventListener("keydown", this.key_press);
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
.container_general {
  display: flex;
  flex-direction: column;

  .blank {
    height: 60px;
  }

  .keyword {
    z-index: 1;
    width: 100%;
    display: flex;
    justify-content: center;
    position: fixed;
    top: 30px;
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
  .box_list {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .question_number {
      position: sticky;
      width: 100%;

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
      font-size: v-bind("state.change_font_size(state.font_size,'medium')");
    }
    .answer_list {
      width: 90%;
      padding-top: 10px;
      padding-bottom: 10px;
      .answer {
        display: flex;
        align-items: center;
        position: relative;

        .is_correct {
          width: 30px;
          height: 100%;
          font-size: v-bind("state.change_font_size(state.font_size,'large')");

          color: red;
        }
        .index_answer {
          font-size: v-bind("state.change_font_size(state.font_size,'large')");
          margin-right: 20px;
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

  .key_btn_active {
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

  .general_nav_bottom {
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
}
</style>
