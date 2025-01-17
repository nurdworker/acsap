<template>
  <div class="container_insertdata">
    <button class="btn btn-success" v-on:click="bring_keyword_data()">
      Bring keyword data
    </button>
    <button class="btn btn-success" v-on:click="insert_keyword_data()">
      Insert keyword data
    </button>

    <div>
      <div>
        <label for="formFileLg" class="form-label">question data</label>
        <input
          class="form-control form-control-lg"
          id="formFileLg"
          type="file"
          @change="questionUpload"
        />
      </div>
      <div>
        <label for="formFileLg" class="form-label">answer data</label>
        <input
          class="form-control form-control-lg"
          id="formFileLg"
          type="file"
          @change="answerUpload"
        />
      </div>
    </div>

    <h1>rnfwa Data</h1>
    <textarea
      class="form-control"
      id="exampleFormControlTextarea1"
      rows="3"
      v-model="state_insertdata.rnfwa"
    ></textarea>
    <button class="btn btn-primary" v-on:click="submit_rnfwa_data()">
      Submit Rnfwa Data
    </button>

    <div class="control">
      <button class="btn btn-danger">Delete Question Data</button>
      <button class="btn btn-danger">Delete Answer Data</button>
      <button class="btn btn-danger" v-on:click="delete_all_data()">
        Delete All Data
      </button>
      <button class="btn btn-danger" v-on:click="delete_keyword_data()">
        Delete keyword Data
      </button>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
import axios from "axios";

export default {
  props: {
    state: Object,
  },
  name: "Insertdata",
  setup(props) {
    props;

    const state_insertdata = reactive({
      question: null,
      answer: null,
    });

    const mode_insertdata = reactive({
      answer_active: false,
    });

    const submit_rnfwa_data = () => {
      alert("hello rnfwa");
      localStorage.setItem("rnfwa_list", state_insertdata.rnfwa);
    };

    const delete_question_data = () => {
      alert("delete answer");
    };

    const delete_answer_data = () => {
      alert("delete answer");
    };

    const delete_all_data = () => {
      let result = confirm("진짜 다지울거야?");
      if (result) {
        localStorage.clear();
      }
    };

    const delete_keyword_data = () => {
      let result = confirm("진짜 키워드 다지울거야?");
      if (result) {
        localStorage.removeItem("keyword_data");
      }
    };

    const questionUpload = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        const fileContent = event.target.result;
        try {
          const parsedJSON = JSON.parse(fileContent);
          const jsonString = JSON.stringify(parsedJSON);

          // 로컬 스토리지에 저장
          localStorage.setItem("question_data", jsonString);
          alert("JSON 파일이 로컬 스토리지에 저장되었습니다.");
        } catch (error) {
          alert("유효한 JSON 파일이 아닙니다.", error);
        }
      };
      reader.readAsText(file);
    };

    const answerUpload = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        const fileContent = event.target.result;
        try {
          const parsedJSON = JSON.parse(fileContent);
          const jsonString = JSON.stringify(parsedJSON);

          // 로컬 스토리지에 저장
          localStorage.setItem("answer_data", jsonString);
          alert("JSON 파일이 로컬 스토리지에 저장되었습니다.");
        } catch (error) {
          alert("유효한 JSON 파일이 아닙니다.", error);
        }
      };

      reader.readAsText(file);
    };

    const insert_keyword_data = () => {
      let result = confirm("db에 있는 키워드데이터 진짜 갈아치울거야?");
      if (result) {
        axios
          .post("/api/insert_keyword", {
            id: props.state.id,
            pw: props.state.pw,
            content: localStorage.getItem("keyword_data"),
          })
          .then((res) => {
            console.log(res.data);
          });
      }
    };

    const bring_keyword_data = async () => {
      let result = confirm(
        "현재 키워드데이터를 리셋하고 새로 키워드데이터 가져올거야?"
      );

      if (result) {
        axios
          .post("/api/keyword", { id: props.state.id, pw: props.state.pw })
          .then((res) => {
            if (res.data.error) {
              localStorage.setItem("keyword_data", "[]");
              alert("keyword error");
            } else {
              console.log(res.data);
              console.log(JSON.stringify(res.data));
              localStorage.setItem("keyword_data", res.data);
            }
            location.reload();
          });
      }
    };

    return {
      state_insertdata,
      mode_insertdata,
      delete_question_data,
      submit_rnfwa_data,
      delete_answer_data,
      delete_all_data,
      delete_keyword_data,
      questionUpload,
      answerUpload,
      insert_keyword_data,
      bring_keyword_data,
    };
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
.container_insertdata {
  display: flex;
  align-items: center;
  flex-direction: column;
  textarea {
    width: 80%;
  }
  button {
    width: 70%;
    height: 60px;
    margin-top: 10px;
  }

  .blank {
    height: 60px;
  }
}
</style>
