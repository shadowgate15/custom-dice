import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import TabsPage from "@/views/TabsPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/tabs/dice",
  },
  {
    path: "/tabs",
    component: TabsPage,
    children: [
      {
        path: "",
        redirect: "/tabs/dice",
      },
      {
        path: "dice",
        name: "Dice",
        component: () => import("@/views/DicePage.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
