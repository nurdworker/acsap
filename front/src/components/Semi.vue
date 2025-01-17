<template>
  <div class="container_semi">
    <div class="intro" v-if="mode_semi.new">
      <div class="range">
        <div class="start">
          <span>START</span>
          <div class="btn-group" role="group">
            <button
              type="button"
              class="btn btn-warning"
              v-on:click="cal_start(-100)"
            >
              -100
            </button>
            <button
              type="button"
              class="btn btn-warning"
              v-on:click="cal_start(-10)"
            >
              -10
            </button>
            <h1 class="now">{{ now_list.start_point }}</h1>
            <button
              type="button"
              class="btn btn-warning"
              v-on:click="cal_start(10)"
            >
              +10
            </button>
            <button
              type="button"
              class="btn btn-warning"
              v-on:click="cal_start(100)"
            >
              +100
            </button>
          </div>
        </div>
        <div class="end">
          <span>END</span>
          <div class="btn-group" role="group">
            <button
              type="button"
              class="btn btn-warning"
              v-on:click="cal_end(-100)"
            >
              -100
            </button>
            <button
              type="button"
              class="btn btn-warning"
              v-on:click="cal_end(-10)"
            >
              -10
            </button>
            <h1 class="now">{{ now_list.end_point }}</h1>
            <button
              type="button"
              class="btn btn-warning"
              v-on:click="cal_end(10)"
            >
              +10
            </button>
            <button
              type="button"
              class="btn btn-warning"
              v-on:click="cal_end(100)"
            >
              +100
            </button>
          </div>
          <!-- 여기 -->
        </div>

        <div class="final">
          <button
            type="button"
            class="btn btn-danger"
            v-on:click="cal_end('max')"
          >
            MAX
          </button>
          <h4>
            QUESTION {{ now_list.start_point }}번부터 QUESTION
            {{ now_list.end_point }}번까지
          </h4>
          <h1>총 {{ now_list.end_point - now_list.start_point + 1 }}문항</h1>
          <button class="btn btn-primary start_test" v-on:click="start_test()">
            시작하기
          </button>
          <button
            class="btn btn-danger start_test"
            v-on:click="state.changeRouter('Menu')"
          >
            돌아가기
          </button>
        </div>
      </div>
    </div>
    <div class="test" v-if="mode_semi.ing">
      <div class="box_list">
        <div class="question_number_semi">
          <h5>SEMI QUESTION {{ now_list.now_index + 1 }}</h5>
        </div>
        <div class="keyword" v-if="mode_semi.key_active">
          <p>
            {{
              choosing_keyword(now_list.question_list?.[now_list.now_index])?.[
                "content"
              ]
            }}
          </p>
          <button
            class="btn btn-info"
            v-on:click="
              edit_keyword(now_list.question_list?.[now_list.now_index])
            "
          >
            keyword edit
          </button>
        </div>
        <div class="question">
          <p>
            {{
              choosing_question(now_list.question_list?.[now_list.now_index])?.[
                "question_" + state.lang
              ]
            }}
          </p>
        </div>

        <div
          class="answer_list"
          v-for="answer in choosing_answer(
            now_list.question_list?.[now_list.now_index]
          )"
          :key="answer"
        >
          <div class="answer">
            <div class="check">
              <input
                class="form-check-input"
                type="checkbox"
                id="flexCheckDefault"
                v-model="
                  now_list.chosen_answer_obj[answer.question_number][
                    answer.index_answer
                  ]
                "
              />
            </div>

            <div class="answer_content">
              <p>
                {{ answer["content_" + state.lang] }}
              </p>
            </div>
          </div>
        </div>
        <div class="btns">
          <div
            class="key"
            v-bind:class="[mode_semi.key_active ? 'key_btn_active' : '']"
            v-on:click="key_active()"
          >
            <i class="fa-solid fa-key"></i>
          </div>
        </div>
        <button
          v-on:click="submit()"
          v-if="now_list.question_list.length == now_list.now_index + 1"
          class="btn btn-primary"
        >
          제출하기
        </button>
      </div>
      <div class="blank"></div>
    </div>

    <div class="final" v-if="mode_semi.final">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">question number</th>
            <th scope="col">
              <i class="fa-solid fa-user-check" style="color: orange"></i>
              chosen answer
            </th>
            <th scope="col">
              <i class="fa-solid fa-check" style="color: red"></i>correct answer
            </th>
            <th scope="col">is correct?</th>
            <th scope="col">show question</th>
            <th scope="col">RNFWA</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in final.state" :key="row">
            <th scope="row">{{ row.question_number }}</th>
            <td>{{ row.chosen_answer }}</td>
            <td>{{ row.correct_answer }}</td>
            <td>
              <p style="color: red" v-if="!row.is_correct">
                <i class="fa-solid fa-xmark"></i>
              </p>
              <p style="color: greenyellow" v-if="row.is_correct">
                <i class="fa-solid fa-check"></i>
              </p>
            </td>
            <td>
              <button
                class="btn btn-primary"
                v-on:click="show_question(row.question_number), scroll_down()"
              >
                Show No.{{ row.question_number }}
              </button>
            </td>
            <td>
              <button
                class="btn btn-light"
                v-on:click="state.add_rnfwa(row.question_number)"
              >
                <i class="fa-solid fa-plus"></i>
              </button>
            </td>
          </tr>
          <tr>
            <th scope="col">question number</th>
            <th scope="col">
              <i class="fa-solid fa-user-check" style="color: orange"></i>
              chosen answer
            </th>
            <th scope="col">
              <i class="fa-solid fa-check" style="color: red"></i>correct answer
            </th>
            <th scope="col">is correct?</th>
            <th scope="col">show question</th>
            <th scope="col">RNFWA</th>
          </tr>
        </tbody>
      </table>

      <div class="question_box" v-if="final.showing_question_number">
        <div class="question_index">
          <h5>QUESTION {{ final.showing_question_number }}</h5>
        </div>
        <div class="question">
          <p>
            {{
              choosing_question(final.showing_question_number)?.[
                "question_" + state.lang
              ]
            }}
          </p>
        </div>
        <div
          class="answer_list"
          v-for="answer in choosing_answer(final.showing_question_number)"
          :key="answer"
        >
          <div class="answer">
            <div class="is_chosen_wrong">
              <i
                class="fa-solid fa-user-check"
                v-if="wrong_answer_class_binding(answer)"
              ></i>
            </div>
            <div class="is_correct">
              <i
                class="fa-solid fa-check"
                v-if="correct_answer_class_binding(answer)"
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
      <div class="btn-group">
        <button class="btn btn-primary" v-on:click="go_first()">
          Go back to Menu
        </button>
        <button class="btn btn-light scroll_up_btn" v-on:click="scroll_up()">
          up
        </button>
      </div>
    </div>

    <nav class="semi_nav_bottom" v-if="mode_semi.ing">
      <div class="home" v-on:click="state.changeRouter('Menu'), save_semi()">
        <i class="fa-solid fa-house"></i>
      </div>
      <div class="reset" v-on:click="reset()">
        <i class="fa-solid fa-trash-can-arrow-up"></i>
      </div>
      <div
        class="rnfna"
        v-on:click="state.add_rnfwa(now_list.question_list[now_list.now_index])"
      >
        <i class="fa-solid fa-notes-medical"></i>
      </div>

      <div class="pre" v-on:click="go_pre()">
        <i class="fa-solid fa-chevron-left"></i>
      </div>
      <!-- <div class="next" v-on:click="go_next(), is_checked_all()"> -->
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
  name: "Semi",
  setup(props) {
    const state_semi = reactive({
      question: JSON.parse(props.state.question_data),
      answer: JSON.parse(props.state.answer_data),
      keyword: props.state.keyword_data ? props.state.keyword_data : [],
    });

    const mode_semi = reactive({
      ing: localStorage.getItem("save_semi") ? true : false,
      // new: false,
      new: localStorage.getItem("save_semi") ? false : true,
      final: false,
      // final: true,
      answer_index: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
      key_active: false,
    });

    const now_list = reactive({
      start_point: localStorage.getItem("save_semi")
        ? JSON.parse(localStorage.getItem("save_semi")).start_point
        : 1,
      end_point: localStorage.getItem("save_semi")
        ? JSON.parse(localStorage.getItem("save_semi")).end_point
        : 10,
      question_list: localStorage.getItem("save_semi")
        ? JSON.parse(localStorage.getItem("save_semi")).question_list
        : null,
      now_index: localStorage.getItem("save_semi")
        ? JSON.parse(localStorage.getItem("save_semi")).now_index
        : null,
      chosen_answer_obj: localStorage.getItem("save_semi")
        ? JSON.parse(localStorage.getItem("save_semi")).chosen_answer_obj
        : {},
    });

    const final = reactive({
      state: [],
    });

    // const show_question = (question_number) => {
    //   final.showing_question_number = question_number;
    // };

    const cal_start = (count) => {
      if (now_list.start_point + count < 1) {
        alert("1번부터");
      } else if (now_list.start_point + count > now_list.end_point) {
        alert("START는 END 보다 작아야 합니다.");
      } else {
        now_list.start_point = now_list.start_point + count;
      }
    };

    const cal_end = (count) => {
      if (now_list.end_point + count < 1) {
        alert("1번부터");
      } else if (now_list.end_point + count > state_semi.question.length) {
        alert(`총 문제는 ${state_semi.question.length}개 입니다.`);
      } else if (now_list.end_point + count < now_list.start_point) {
        alert("START는 END 보다 작아야 합니다.");
      } else if (count == "max") {
        now_list.end_point = state_semi.question.length;
      } else {
        now_list.end_point = now_list.end_point + count;
      }
    };

    function shuffle(array) {
      let new_arr = [...array];
      new_arr.sort(() => Math.random() - 0.5);
      return new_arr;
    }

    const start_test = () => {
      let list = [];
      for (let i = now_list.start_point; i <= now_list.end_point; i++) {
        list.push(i);
      }
      const ask = confirm(
        `시험을 시작하시겠습니까? From QUESTION ${now_list.start_point} to ${now_list.end_point}`
      );
      if (ask) {
        const test_list = shuffle(list);

        now_list.now_index = 0;
        now_list.question_list = [...test_list];
        const chosen_answer_obj = {};
        now_list.question_list.forEach((question_number) => {
          chosen_answer_obj[question_number] = {};
        });
        now_list.chosen_answer_obj = chosen_answer_obj;

        mode_semi.new = false;
        mode_semi.ing = true;
        save_semi();
      }
    };

    const choosing_question = (question_number) => {
      if (!question_number) {
        return;
      } else {
        let question;
        state_semi.question.forEach((list) => {
          if (list.question_number == question_number) {
            question = list;
          }
        });
        return question;
      }
    };

    const choosing_answer = (question_number) => {
      let answer_list = [];
      state_semi.answer.forEach((list) => {
        if (list.question_number == question_number) {
          answer_list.push(list);
        }
      });

      return answer_list;
    };

    const go_next = () => {
      if (now_list.question_list.length == now_list.now_index + 1) {
        alert("문제 끝!");
      } else {
        mode_semi.key_active = false;
        now_list.now_index++;
        save_semi();
      }
    };

    const go_pre = () => {
      if (now_list.now_index == 0) {
        alert("첫문제임니다");
      } else {
        mode_semi.key_active = false;
        now_list.now_index--;
        save_semi();
      }
    };

    const submit = () => {
      //미완성 키값일때 제출 ㄴㄴ
      //chosen answer 총길이 합하기

      //correct answer과 비교
      try {
        now_list.question_list.forEach((question_number) => {
          let now_question_number = question_number;

          let chosen_answer_index = "";
          let answer_obj = now_list.chosen_answer_obj[question_number];
          for (let answer_index in answer_obj) {
            if (answer_obj[answer_index]) {
              chosen_answer_index += answer_index;
            }
          }
          chosen_answer_index = chosen_answer_index.split("").sort().join("");

          state_semi.question.forEach((question) => {
            if (question.question_number == now_question_number) {
              if (
                question.correct_answer_index.length !==
                chosen_answer_index.length
              ) {
                alert(
                  `${
                    now_list.question_list.indexOf(question.question_number) + 1
                  }번 답 잘 안고른거 같은데?`
                );
                now_list.now_index = now_list.question_list.indexOf(
                  question.question_number
                );
                final.state = [];
                throw "not enough answer count";
              } else {
                const row = {
                  question_number: question.question_number,
                  chosen_answer: chosen_answer_index,
                  correct_answer: question.correct_answer_index,
                  is_correct:
                    chosen_answer_index == question.correct_answer_index,
                };
                final.state.push(row);
              }
            }
          });
        });
        if (confirm("제출하시겠습니까?")) {
          //cut
          let sorted_arr = [];
          for (let i = 0; i < final.state.length; i++) {
            final.state.forEach((obj) => {
              //만약 101번부터 200번까지라면..? start =101, end 200
              if (obj.question_number == i + now_list.start_point) {
                sorted_arr.push(obj);
              }
            });
          }
          final.state = [...sorted_arr];
          //cut
          mode_semi.ing = false;
          mode_semi.final = true;
        } else {
          alert("좀 더 확인해보세요");
        }
      } catch (e) {
        console.log(e);
      }
    };

    const save_semi = () => {
      localStorage.setItem("save_semi", JSON.stringify(now_list));
    };

    const reset = () => {
      if (confirm("새로 시작하실건가요?")) {
        localStorage.removeItem("save_semi");
        now_list.start_point = 1;
        now_list.end_point = 10;
        now_list.question_list = null;
        now_list.now_index = null;
        now_list.chosen_answer_obj = {};
        mode_semi.new = true;
        mode_semi.ing = false;
      }
    };

    const go_first = () => {
      if (confirm("테스트 데이터가 리셋되며 메뉴로 돌아갑니다")) {
        localStorage.removeItem("save_semi");
        props.state.changeRouter("Menu");
      }
    };

    const key_press = (para) => {
      if (state_semi.ing) {
        return;
      } else {
        if (props.state.is_mobile) {
          return;
        } else {
          if (para.key == "ArrowLeft") {
            go_pre();
          } else if (para.key == "ArrowRight") {
            go_next();
          }
        }
      }
    };

    const correct_answer_class_binding = (answer) => {
      let question_number = answer.question_number;
      let now_correct_answer_list = [];
      const parsing_correct_answer = (question_number) => {
        let correct_answer_index;
        state_semi.question.forEach((list) => {
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

    const wrong_answer_class_binding = (answer) => {
      let question_number = answer.question_number;
      let answer_index = answer.index_answer;
      if (now_list.chosen_answer_obj[question_number][answer_index]) {
        return true;
      } else {
        return false;
      }
    };

    const choosing_keyword = (question_number) => {
      let keyword_obj;

      let keyword_list = state_semi.keyword;
      keyword_list.forEach((obj) => {
        if (obj.question_number == question_number) {
          keyword_obj = obj;
        }
      });

      return keyword_obj;
    };

    const edit_keyword = (question_number) => {
      let keyword_list = state_semi.keyword;

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
          state_semi.keyword.push(new_obj);
          localStorage.setItem(
            "keyword_data",
            JSON.stringify(state_semi.keyword)
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
              state_semi.keyword[index] = new_obj;
              localStorage.setItem(
                "keyword_data",
                JSON.stringify(state_semi.keyword)
              );
            } else {
              return;
            }
          }
        });
      }
    };

    const key_active = () => {
      if (mode_semi.key_active) {
        mode_semi.key_active = false;
      } else {
        mode_semi.key_active = true;
      }
    };

    return {
      state_semi,
      mode_semi,
      now_list,
      final,
      cal_start,
      cal_end,
      start_test,
      choosing_question,
      choosing_answer,
      go_next,
      go_pre,
      shuffle,
      submit,
      save_semi,
      reset,
      go_first,
      key_press,
      correct_answer_class_binding,
      wrong_answer_class_binding,
      choosing_keyword,
      edit_keyword,
      key_active,
    };
  },
  methods: {
    scroll_up: () => {
      window.scrollTo(0, 0);
    },
    scroll_down: () => {
      window.scrollTo(0, document.body.scrollHeight);
    },
    show_question: function (question_number) {
      this.final.showing_question_number = question_number;
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 100);
    },
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
.container_semi {
  width: 100%;
  display: flex;
  justify-content: center;

  .blank {
    height: 60px;
  }
  .intro {
    padding-top: 50px;
    padding-bottom: 50px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .start {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5px;

      span {
        display: flex;
        justify-content: center;
        width: 100px;
        font-size: 1.5em;
      }
      h1 {
        display: flex;
        justify-content: center;
        width: 70px;
      }
    }
    .end {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5px;
      span {
        display: flex;
        justify-content: center;
        width: 100px;
        font-size: 1.5em;
      }
      h1 {
        display: flex;
        justify-content: center;
        width: 70px;
      }
    }
    .final {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .start_test {
        width: 50%;
        height: 70px;
        margin-bottom: 5px;
      }
    }
  }

  .test {
    .box_list {
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .question_number_semi {
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
          .check {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 10px;
          }
          .is_correct {
            width: 50px;
            height: 100%;
            font-size: v-bind(
              "state.change_font_size(state.font_size,'large')"
            );
            color: red;
          }
          .index_answer {
            font-size: 1.5em;
            margin-right: 20px;
            font-size: v-bind(
              "state.change_font_size(state.font_size,'large')"
            );
          }
          .answer_content {
            width: 80%;
            font-size: v-bind(
              "state.change_font_size(state.font_size,'medium')"
            );
          }
        }
      }

      .btns {
        display: flex;
        position: fixed;
        bottom: 60px;

        width: 100%;
        justify-content: flex-end;

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

  .final {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    .question_box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      h5 {
        font-size: v-bind("state.change_font_size(state.font_size,'large')");
      }
      .question {
        width: 90%;
        margin-bottom: 30px;

        font-size: v-bind("state.change_font_size(state.font_size,'medium')");
      }
      .answer_list {
        width: 80%;
        .answer {
          display: flex;
          margin-bottom: 10px;
          position: relative;
          .index_answer {
            align-self: center;
            font-size: v-bind(
              "state.change_font_size(state.font_size,'large')"
            );

            padding-right: 10px;
          }
          .answer_content {
            font-size: v-bind(
              "state.change_font_size(state.font_size,'medium')"
            );
          }
          .is_correct {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            i {
              position: absolute;
              top: 50%;
              transform: translate(-50%, -50%);
            }
            width: 10px;
            height: 100%;
            font-size: v-bind(
              "state.change_font_size(state.font_size,'large')"
            );

            color: red;
          }

          .is_chosen_wrong {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            i {
              position: absolute;
              top: 50%;
              transform: translate(-50%, -50%);
            }
            width: 10px;

            height: 100%;
            font-size: v-bind(
              "state.change_font_size(state.font_size,'large')"
            );

            color: orange;
          }
        }
      }
    }

    @media (max-width: 500px) {
      .table {
        width: 100%;
        th {
          font-size: 0.5em;
        }
        td {
          font-size: 0.7em;

          button {
            font-size: 0.6em;
            padding: 1px;
          }
        }
      }
    }
    .scroll_up_btn {
      width: 100px;
    }
  }

  .semi_nav_bottom {
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
