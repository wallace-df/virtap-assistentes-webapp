import { connect } from "@argent/get-starknet"
import { Web3Provider, Provider } from "zksync-web3";

let instance = null;
let eventListener;

export default {

    networks: {
        zkSync: {
            testnet: "zkSync-testnet"
        },
        starknet: {
            testnet: "StarkNet-testnet"
        }
    },

    accountChangeCallback(accounts) {
        if (accounts.length > 0) {
            instance.address = accounts[0];
            if (eventListener) {
                eventListener.onAddressChanged(accounts[0]);
            }
        } else {
            if (eventListener) {
                eventListener.onDisconnect();
            }
            this.clearInstance();
        }
    },

    async initInstance(network) {
        if (instance) {
            accountChangeCallback([]);
            this.clearInstance();
        }

        if (network === this.networks.zkSync.testnet) {
            if (!window.ethereum) {
                throw Error("Failure detecting wallet (err: 1)");
            }

            let response = await window.ethereum.request({ method: "eth_requestAccounts" });
            if (!response) {
                throw Error("Failure detecting wallet (err: 2)");
            }

            let accounts = response;
            if (!accounts || !accounts.length) {
                throw Error("Failure detecting wallet (err: 3)");
            }

            if (+window.ethereum.networkVersion !== 280) {
                try {
                    await window.ethereum.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: "0x118" }],
                    });
                } catch (switchError) {
                    // This error code indicates that the chain has not been added to MetaMask.
                    if (switchError.code === 4902) {
                        throw Error("This network is not available in your metamask, please add it");
                    }
                    throw Error("Failed to switch to the network");
                }
            }

            let provider = new Provider("https://zksync2-testnet.zksync.dev");
            let signer = (new Web3Provider(window.ethereum)).getSigner();

            if (!provider || !signer) {
                throw Error("Follow the tutorial to learn how to connect to Metamask!");
            }

            instance = {
                network: network,
                address: accounts[0],
                provider: provider,
                signer: signer
            }

            window.ethereum.removeListener("accountsChanged", this.accountChangeCallback);
            window.ethereum.on("accountsChanged", this.accountChangeCallback);
        } else if (network === this.networks.starknet.testnet) {
            const starknet = await connect();

            if (!starknet) {
                throw Error("User rejected wallet selection or silent connect found nothing");
            }

            await starknet.enable();

            if (!starknet.isConnected) {
                throw Error("Couldn\"t connect to StarkNet.");
            }

            instance = {
                network: network,
                address: starknet.selectedAddress,
                account: starknet.account,
                provider: starknet.provider
            }

            starknet.off("accountsChanged", this.accountChangeCallback);
            starknet.on("accountsChanged", this.accountChangeCallback);

        } else {
            throw Error("Unsupported network: " + network);
        }
    },

    getInstance() {
        return instance;
    },

    clearInstance() {
        if (instance) {
            instance = null;
        }
    },

    setEventListener(ev) {
        eventListener = ev;
    }
}
