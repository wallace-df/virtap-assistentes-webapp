import NotFoundPage from "../../vue/components/NotFoundPage.vue";
import AssistantDashboardPage from "../../vue/components/assistant/DashboardPage.vue";
import AssistantLoginPage from "../../vue/components/assistant/LoginPage.vue";
 
const routes = [
    { path: "/assistente", component: AssistantDashboardPage },
    { path: "/assistente/login", component: AssistantLoginPage },
    { path: "/virtap-webapp/assistente", component: AssistantDashboardPage },
    { path: "/virtap-webapp/assistente/login", component: AssistantLoginPage },
    { path: "/:catchAll(.*)", component: NotFoundPage }
];

export default routes;