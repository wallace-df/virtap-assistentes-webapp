<template>
  <div class="wallet-container">
    <span class="text-warning">{{connectedWallet ? connectedWallet.network : ''}}</span>
    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" :disabled="loading">
        {{connectedWallet ? formattedAddress : 'Connect wallet'}}
      </button>
      <ul class="dropdown-menu">
        <!-- Not connected wallet -->
        <li v-if="!connectedWallet">
          <a class="dropdown-item" href="javascript:void(0)" @click="connectWallet('StarkNet-testnet')">StarkNet (testnet)</a>
        </li>
        <li v-if="!connectedWallet">
          <a class="dropdown-item" href="javascript:void(0)" @click="connectWallet('zkSync-testnet')">zkSync (testnet)</a>
        </li>
        <!-- Connected wallet -->
        <li v-if="connectedWallet">
          <a class="dropdown-item" href="javascript:void(0)" @click="disconnectWallet()">Disconnect</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Wallet from "../../js/services/wallet.js";
const $ = window["$"];

export default {
    name: "Wallet",

    data() {
      return {
        connectedWallet: null
      }
    },

    computed: {
      loading() {
        return this.$store.state.loading;
      },
      
      formattedAddress() {
        if (this.connectedWallet) {
          let address = this.connectedWallet.address;
          return address.substring(0, 7) + "..." + address.slice(-5);
        }
        return "";
      }
    },

    methods: {
      async connectWallet(network) {
        if (this.connectedWallet === null) {
          let ctx = this;
          try {
            await Wallet.initInstance(network);
            let walletInstance = await Wallet.getInstance()
            this.connectedWallet = {network: network, address: walletInstance.address};

            this.$store.commit("setActiveWallet", this.connectedWallet.address);

            Wallet.setEventListener({
              onAddressChanged(newAddress) {
                ctx.connectedWallet.address = newAddress;
                ctx.$store.commit("setActiveWallet", newAddress);
              },
              onDisconnect() {
                ctx.disconnectWallet();
              }
            }); 
          } catch(err) {
            this.showError(err);
          }
        }
      },

      async disconnectWallet() {
        Wallet.clearInstance();
        this.connectedWallet = null;
        this.$store.commit("setActiveWallet", null);
      }
    }
}
</script>
