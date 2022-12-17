<template>
  <div class="loading_container" v-if="loading">
    <div class="spinner-border text-primary" role="status"><span class="sr-only"></span></div>
  </div>

  <div class="loading_container" v-else-if="!connectedWallet">
    <h2 class="text-info">Please, connect your wallet.</h2>
  </div>

  <div class="loading_container" v-else-if="nfts.length === 0">
    <h2 class="text-warning">You don't have any NFTs.</h2>
  </div>

  <div class="images section" v-else>
    <h2 class="mb-4">Your NFTs</h2>
    <div class="images__container">
      <div class="images__card" v-for="nft in nfts" :key="nft.id">
        <img :src="nft.imageLink" id="main__img" />
        <h2 class="text-left m-3">{{nft.name}}</h2>

        <div v-if="nft.status === 'UNLISTED'">
          <button class="btn btn-light mt-2 btn-sm">Unlisted</button>
          <p class="m-3">
            <button class="btn btn-warning full" @click="listOffer(nft)" :disabled="!nft.delegatable">
            {{ nft.delegatable ? 'Offer for renting' : 'Renting not supported' }}
            </button>
          </p>
        </div>

        <div v-if="nft.status === 'LISTED'">
          <button class="btn btn-warning mt-2 btn-sm">Offered for {{formatPrice(nft.hourlyRate)}}/hour</button>
          <p class="m-3">
            <button class="btn btn-danger full" @click="unlistOffer(nft)">
            Cancel offer
            </button>
          </p>
        </div>

        <div v-if="nft.status === 'RENTED'">
          <button class="btn btn-success mt-2 btn-sm">Currently rented for {{formatPrice(nft.hourlyRate)}}/hour</button>
          <button class="btn btn-success mt-2 btn-sm">Renting expires in {{formatDuration(nft.userExpires - new Date().getTime()/1000)}}</button>
          <p class="m-3"/>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import NFT from "../../js/services/nft.js"
import NumberUtils from "../../js/utils/number.js";

const $ = window["$"];

export default {
  name: "BorrowPage",

  components: { },

  created() {
    this.$store.commit("setActiveSection", "NFTsPage");
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
        this.nfts = await NFT.getNFTs();
        return null;
      } catch(err) {
        this.nfts = [];
        return err;
      }      
    },

    async listOffer(nft) {
      let $offerModal = $("#offerModal");
      let ctx = this;

      this.$store.commit("setLoading", true);
      try {
        await NFT.checkItemApproval(nft.collectionId, nft.tokenId);
        this.$store.commit("setLoading", false);
      } catch(err) {
        ctx.showError(err);
        return;
      }   

      let $hourlyRate = $("#txtHourlyRate");
      let $btnOffer = $offerModal.find("#btnOffer");

      $hourlyRate.val("");

      function updateFormStatus() {
        let disabled = false;
        disabled = disabled || $hourlyRate.val() === 0 || !NumberUtils.isValidAmount($hourlyRate.val(), "0.001");
        $btnOffer.prop("disabled", disabled);
        return !disabled;
      }

      $hourlyRate.off().on("input", updateFormStatus);
      $btnOffer.prop("disabled", true);

      $btnOffer.off().on("click", async function() {
        if (!updateFormStatus()) {
          return false;
        }

        $offerModal.modal('hide');
        ctx.$store.commit("setLoading", true);

        try {
          let hourlyRate = NumberUtils.toBaseUnit($hourlyRate.val(), 18).toString();

          await NFT.listItem(nft.collectionId, nft.tokenId, hourlyRate);
          await ctx.doLoadNFTs();

          ctx.$store.commit("setLoading", false);
          ctx.showSuccess("Offer listed!");
        } catch(err) {
          ctx.showError(err);
        }   

      });

      $offerModal.off().on("shown.bs.modal", function(){
        $hourlyRate.focus();
      });

      $offerModal.modal({
         backdrop: 'static',
         keyboard: false
      }).modal("show");
    }, 

    async unlistOffer(nft) {
      this.$store.commit("setLoading", true);
      try {
        await NFT.unlistItem(nft.collectionId, nft.tokenId);
        await this.doLoadNFTs();
        this.$store.commit("setLoading", false);
        this.showSuccess("Offer cancelled!");
      } catch(err) {
        this.showError(err);
      }   
    }
  }

}
</script>
