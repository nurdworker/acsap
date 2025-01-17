<template>
  <div class="container_test">
    <h1>developing...</h1>
    <button class="btn btn-primary" v-on:click="state.changeRouter('Menu')">
      메뉴로 가기
    </button>
  </div>
</template>

<script>
export default {
  props: {
    state: Object,
  },
  name: "Test",
};
</script>

<style lang="scss" scoped></style>
