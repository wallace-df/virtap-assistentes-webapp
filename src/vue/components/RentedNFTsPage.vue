<template>
  <div class="loading_container" v-if="loading">
    <div class="spinner-border text-primary" role="status"><span class="sr-only"></span></div>
  </div>

  <div class="loading_container" v-else-if="!connectedWallet">
    <h2 class="text-info">Please, connect your wallet.</h2>
  </div>

  <div class="loading_container" v-else-if="nfts.length === 0">
    <h2 class="text-warning">You don't have any rented NFTs.</h2>
  </div>

  <div class="images section" v-else>
    <h2 class="mb-4">Your Rented NFTs</h2>
    <div class="images__container">
      <div class="images__card" v-for="nft in nfts" :key="nft.id">
        <img :src="nft.imageLink" id="main__img" />
        <h2 class="text-left m-3">{{nft.name}}</h2>

        <button class="btn btn-success mt-2 btn-sm">Renting expires in: {{formatDuration(nft.userExpires - parseInt(new Date().getTime()/1000,10))}}</button>
        <p class="m-3"/>

      </div>
    </div>
  </div>
</template>

<script>
import NFT from "../../js/services/nft.js"

const $ = window["$"];

export default {
  name: "BorrowPage",

  components: { },

  created() {
    this.$store.commit("setActiveSection", "RentedNFTsPage");
    this.loadNFTs();
  },

  data() {
    return { 
      nfts: []
    }
  },

  watch: {
    activeWallet() {
      this.loadNFTs();
    }
  },

  computed: {
    loading() {
      return this.$store.state.loading;
    },

    activeWallet() {
      return this.$store.state.activeWallet;
    },

    connectedWallet() {
      return this.$store.state.activeWallet !== null;
    }
},

  methods: {
    async loadNFTs() {
      if (!this.connectedWallet) {
        return;
      }
 
      this.$store.commit("setLoading", true);
      let error = await this.doLoadNFTs();
      this.$store.commit("setLoading", false);

      if (error) {
        this.showError(error);
      }
    },

    async doLoadNFTs() {
      try {
        this.nfts = await NFT.getRentedNFTs();
        return null;
      } catch(err) {
        this.nfts = [];
        return err;
      }      
    }

  }

}
</script>
