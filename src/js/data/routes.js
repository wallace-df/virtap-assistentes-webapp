import HomePage from "../../vue/components/HomePage.vue";
import NFTsPage from "../../vue/components/NFTsPage.vue";
import RentedNFTsPage from "../../vue/components/RentedNFTsPage.vue";
import NotFoundPage from "../../vue/components/NotFoundPage.vue";

const routes = [
    { path: "", component: HomePage },
    { path: "/my-nfts", component: NFTsPage },
    { path: "/rented-nfts", component: RentedNFTsPage },
    { path: "/:catchAll(.*)", component: NotFoundPage },
];

export default routes;