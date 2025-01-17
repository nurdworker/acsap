import { createWebHistory, createRouter } from "vue-router";
import Menu from "./components/Menu.vue";
import Fail from "./components/Fail.vue";
import Test from "./components/Test.vue";
import Fourzerofour from "./components/Fourzerofour.vue";
import Wrongnote from "./components/Wrongnote.vue";
import General from "./components/General.vue";
import Semi from "./components/Semi.vue";
import Insertdata from "./components/Insertdata.vue";

const routes = [
  {
    path: "/",
    name: "/",
    component: Menu,
  },
  {
    path: "/fail",
    name: "Fail",
    component: Fail,
  },
  {
    path: "/wrongnote",
    name: "Wrongnote",
    component: Wrongnote,
  },
  {
    path: "/test",
    name: "Test",
    component: Test,
  },
  {
    path: "/menu",
    name: "Menu",
    component: Menu,
  },
  {
    path: "/semi",
    name: "Semi",
    component: Semi,
  },
  {
    path: "/fourzerofour",
    name: "Fourzerofour",
    component: Fourzerofour,
  },
  {
    path: "/general",
    name: "General",
    component: General,
  },
  {
    path: "/insertdata",
    name: "Insertdata",
    component: Insertdata,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
