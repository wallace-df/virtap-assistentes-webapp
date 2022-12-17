<template>
    <!-- Navbar Section -->
    <nav class="navbar">
      <div class="navbar__container">
        <router-link to="/" id="navbar__logo">NFT Renting</router-link>
        <div class="navbar__toggle" id="mobile-menu">
          <span class="bar"> </span>
          <span class="bar"> </span>
          <span class="bar"> </span>
        </div>
        <ul class="navbar__menu">
          <li class="navbar__item">
            <router-link to="/" class="navbar__links" :class="{ active: section === 'HomePage' }">Home</router-link>
          </li>
          <li class="navbar__item" v-if="connectedWallet">
            <router-link to="/my-nfts" class="navbar__links" :class="{ active: section === 'NFTsPage' }">My Owned NFTs</router-link>
          </li>
          <li class="navbar__item" v-if="connectedWallet">
            <router-link to="/rented-nfts" class="navbar__links" :class="{ active: section === 'RentedNFTsPage' }">My Rented NFTs</router-link>
          </li>
          <li style="margin-left: 0.75rem">
            <ProfileButton />
          </li>
        </ul>
      </div>
    </nav>
</template>

<script>
import ProfileButton from "./ProfileButton.vue";

export default {
    name: "MenuBar",

    components: { ProfileButton },

    data() {
      return { }
    },

    computed: {
      section() {
        return this.$store.state.activeSection;
      },

      connectedWallet() {
        return this.$store.state.activeWallet !== null;
      }
    },

    methods: { }
}
</script>
