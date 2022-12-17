import HomePage from "../../vue/components/HomePage.vue";
import NotFoundPage from "../../vue/components/NotFoundPage.vue";
import AssistantLoginPage from "../../vue/components/AssistantLoginPage.vue";

const routes = [
    { path: "", component: HomePage },
    { path: "/assistente", component: HomePage },
    { path: "/assistente/login", component: AssistantLoginPage },
    { path: "/virtap-webapp/assistente", component: HomePage },
    { path: "/virtap-webapp/assistente/login", component: AssistantLoginPage },
    { path: "/:catchAll(.*)", component: NotFoundPage }
];

export default routes;