<template>
  <div class="loading_container" v-if="loading">
    <div class="spinner-border text-primary" role="status"><span class="sr-only"></span></div>
  </div>

  <div class="loading_container" v-else-if="listings.length === 0">
    <h2 class="text-warning">No listings available yet.</h2>
  </div>

  <div class="images section" v-else>
    <h2 class="mb-5">Listings</h2>
    <div class="images__container">
      <div class="images__card" v-for="listing in listings" :key="listing.id">
        <img :src="listing.nftImageLink" id="main__img" />
        <h2 class="text-left m-3">{{listing.nftName}}</h2>
        <p class="m-3">
          <button class="btn btn-success full" @click="rentNFT(listing)" :disabled="!connectedWallet">
           {{ formatRentButton(listing) }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import NumberUtils from "../../js/utils/number.js";
import TimeUtils from "../../js/utils/time.js";
import NFT from "../../js/services/nft.js"
import Wallet from "../../js/services/wallet.js";

export default {
  name: "LendPage",

  components: { },

  created() {
    this.$store.commit("setActiveSection", "HomePage");
    this.loadListings();
  },

  data() {
    return { 
      listings: []
    }
  },

  watch: {
    activeWallet() {
      this.loadListings();
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
    async loadListings() {
      this.$store.commit("setLoading", true);
      let error = await this.doLoadListings();
      this.$store.commit("setLoading", false);

      if (error) {
        this.showError(error);
      }
    },

    async doLoadListings() {
      let walletInstance = Wallet.getInstance();
      try {
        if (walletInstance) {
         this.listings = await NFT.getListings(walletInstance.network);
        } else {
         this.listings = await NFT.getListings(null);
        }
        return null;
      } catch (err) {
        return err;
      }
    },


    async rentNFT(listing) {
      let $rentModal = $("#rentModal");
      let ctx = this;

      let $hours = $("#txtHours");
      let $btnRent = $rentModal.find("#btnRent");

      $hours.val("");

      function updateFormStatus() {
        let disabled = false;
        disabled = disabled || $hours.val() === 0 || !NumberUtils.isValidAmount($hours.val(), "1") || !Number.isInteger(Number($hours.val()));
        $btnRent.prop("disabled", disabled);
        return !disabled;
      }

      $hours.off().on("input", updateFormStatus);
      $btnRent.prop("disabled", true);

      $btnRent.off().on("click", async function() {
        if (!updateFormStatus()) {
          return false;
        }

        $rentModal.modal('hide');
        ctx.$store.commit("setLoading", true);

        try {
          let hours = Number($hours.val());
          let amount = NumberUtils.toBN(hours).mul(NumberUtils.toBN(listing.hourlyRate)).toString();

          console.log(listing);

          await NFT.rentItem(listing.collectionId, listing.tokenId, String(hours), amount);
          await ctx.doLoadListings();

          ctx.$store.commit("setLoading", false);
          ctx.showSuccess("Item rented!");
        } catch(err) {
          ctx.showError(err);
        }   

      });

      $rentModal.off().on("shown.bs.modal", function(){
        $hours.focus();
      });

      $rentModal.modal({
         backdrop: 'static',
         keyboard: false
      }).modal("show");
    }, 

    formatRentButton(listing) {
      let walletInstance = Wallet.getInstance();
      if (!walletInstance) {
        return "Connect to " + listing.network;
      } else {
        return "Rent for " + this.formatPrice(listing.hourlyRate) + " per hour";
      }
    }
  }
}
</script>

