import { Contract as zkSyncContract } from "zksync-web3";
import { Contract as StarknetContract } from "starknet";

import Config from "../../../resources/config.js";
import Wallet from "./wallet.js";
import CairoUtils from "../utils/cairo.js";
import StringUtils from "../utils/string.js";
import NetworkUtils from "../../js/utils/network.js"
import NumberUtils from "../../js/utils/number.js"

async function waitForBlockSync(network, blockNumber, provider, transactionHash) {
    const apiCall = async function() {

        if (network === "starknet" && !blockNumber) {
            try {
                let tx = await provider.getTransactionReceipt(transactionHash);
                if (!tx.block_number) {
                    return null;
                } else {
                    blockNumber = tx.block_number;
                }
            } catch(err) {
                return null;
            }    
        }

        let url = `${Config.apiEndpoints.testnet}/sync/${network}`;
        let response = await fetch(url);
        if (response.status === 200) {
          return await response.json();
        }
        return null; 
    };
    
    const apiResultChecker = function(result) {
      if (result && result.latestSyncBlock && Number(result.latestSyncBlock) >= blockNumber) {
        return true;
      }
      return false;
    };
    
    await NetworkUtils.monitorAPICall(apiCall, apiResultChecker);    
}

export default {

    async getNFTs() {
        let walletInstance = await Wallet.getInstance();
        
        if (!walletInstance) {
            throw Error("No wallet connected.");
        }

        let url;
        if (walletInstance.network === Wallet.networks.starknet.testnet) {
          url = Config.apiEndpoints.testnet + "/nfts/starknet";
        } else if (walletInstance.network === Wallet.networks.zkSync.testnet) {
            url = Config.apiEndpoints.testnet + "/nfts/zksync";
        } else {
            throw Error("Unsupported network: " + walletInstance.network);
        }

        url += `?ownerAddress=${walletInstance.address}`;

        let response = await fetch(url);
        if (response.status !== 200) {
            console.log(response);
            throw "Could not fetch NFTs.";
        }

        return await response.json();
    },

    async getRentedNFTs() {
        let walletInstance = await Wallet.getInstance();
        
        if (!walletInstance) {
            throw Error("No wallet connected.");
        }

        let url;
        if (walletInstance.network === Wallet.networks.starknet.testnet) {
          url = Config.apiEndpoints.testnet + "/rented-nfts/starknet";
        } else if (walletInstance.network === Wallet.networks.zkSync.testnet) {
            url = Config.apiEndpoints.testnet + "/rented-nfts/zksync";
        } else {
            throw Error("Unsupported network: " + walletInstance.network);
        }

        url += `?userAddress=${walletInstance.address}`;

        let response = await fetch(url);
        if (response.status !== 200) {
            console.log(response);
            throw "Could not fetch NFTs.";
        }

        return await response.json();
    },

    async getListings(network) {
        let url;
        if (network === Wallet.networks.starknet.testnet) {
            url = Config.apiEndpoints.testnet + "/listings/starknet";
        } else if (network === Wallet.networks.zkSync.testnet) {
            url = Config.apiEndpoints.testnet + "/listings/zksync";
        } else if (StringUtils.isEmpty(network)) {
            url = Config.apiEndpoints.testnet + "/listings";
        } else {
            throw Error("Unsupported network");
        }

        let response = await fetch(url);
        if (response.status !== 200) {
            console.log(response);
            throw Error("Could not fetch listings.");
        }

        let walletInstance = Wallet.getInstance();
        let listings = await response.json();

        if (walletInstance) {
            listings = listings.filter(listing => listing.ownerAddress.toLowerCase() !== walletInstance.address.toLowerCase());
        }

        return listings;
    },

    async checkItemApproval(collectionAddress, tokenId) {
        let walletInstance = await Wallet.getInstance();

        if (!walletInstance) {
            throw Error("No wallet connected.");
        }

        if (walletInstance.network === Wallet.networks.starknet.testnet) {

            let nftContract = new StarknetContract(Config.abis.starknet.nft, collectionAddress, walletInstance.account);
            let tokenIdFelts = CairoUtils.bnToUint256(tokenId).toFeltArray()
            let response = await nftContract.getApproved(tokenIdFelts);

            if (response.approved.toString() !== NumberUtils.toBigInt(Config.contractAddresses.starknet.testnet.nftRentingController).toString()) {
                let approveResponse = await nftContract.approve(Config.contractAddresses.starknet.testnet.nftRentingController, tokenIdFelts);
                await walletInstance.provider.waitForTransaction(approveResponse.transaction_hash);
            }

        } else if (walletInstance.network === Wallet.networks.zkSync.testnet) {

            let nftContract = new zkSyncContract(collectionAddress, Config.abis.zkSync.nft, walletInstance.signer);
            let approvedAddress = await nftContract.getApproved(tokenId);
        
            if (approvedAddress !== Config.contractAddresses.zkSync.testnet.nftRentingController) {
                let txHandle = await nftContract.approve(Config.contractAddresses.zkSync.testnet.nftRentingController, tokenId);
                await txHandle.wait();
            }
            
        } else {
            throw Error("Unsupported network: " + walletInstance.network);
        }
    },

    async listItem(collectionAddress, tokenId, hourlyRate) {
        let walletInstance = Wallet.getInstance();
 
        if (!walletInstance) {
            throw Error("No wallet connected.");
        }

        if (walletInstance.network === Wallet.networks.starknet.testnet) {

            let tokenIdFelts = CairoUtils.bnToUint256(tokenId).toFeltArray();
            let hourlyRateFelts = CairoUtils.bnToUint256(hourlyRate).toFeltArray();

            let nftRentingController = new StarknetContract(Config.abis.starknet.nftRentingController, Config.contractAddresses.starknet.testnet.nftRentingController, walletInstance.account);
            let txHandle = await nftRentingController.listItem(collectionAddress, tokenIdFelts, hourlyRateFelts);
            await walletInstance.provider.waitForTransaction(txHandle.transaction_hash);

            let tx  = await walletInstance.provider.getTransaction(txHandle.transaction_hash);
            await waitForBlockSync("starknet", tx.block_number, walletInstance.provider, txHandle.transaction_hash);

        } else if (walletInstance.network === Wallet.networks.zkSync.testnet) {

            let nftRentingController = new zkSyncContract(Config.contractAddresses.zkSync.testnet.nftRentingController, Config.abis.zkSync.nftRentingController, walletInstance.signer);
            let txHandle = await nftRentingController.listItem(collectionAddress, tokenId, hourlyRate);
            let result = await txHandle.wait();                

            await waitForBlockSync("zksync", result.blockNumber);

        } else {
            throw Error("Unsupported network: " + walletInstance.network);
        }
    },

    async unlistItem(collectionAddress, tokenId) {
        let walletInstance = Wallet.getInstance();

        if (!walletInstance) {
            throw Error("No wallet connected.");
        }
        
        if (walletInstance.network === Wallet.networks.starknet.testnet) {

            let tokenIdFelts = CairoUtils.bnToUint256(tokenId).toFeltArray();

            let nftRentingController = new StarknetContract(Config.abis.starknet.nftRentingController, Config.contractAddresses.starknet.testnet.nftRentingController, walletInstance.account);
            let txHandle = await nftRentingController.unlistItem(collectionAddress, tokenIdFelts);

            let tx  = await walletInstance.provider.getTransaction(txHandle.transaction_hash);
            await waitForBlockSync("starknet", tx.block_number, walletInstance.provider, txHandle.transaction_hash);

        } else if (walletInstance.network === Wallet.networks.zkSync.testnet) {

            let nftRentingController = new zkSyncContract(Config.contractAddresses.zkSync.testnet.nftRentingController, Config.abis.zkSync.nftRentingController, walletInstance.signer);
            let txHandle = await nftRentingController.unlistItem(collectionAddress, tokenId);
            let result = await txHandle.wait();                

            await waitForBlockSync("zksync", result.blockNumber);

        } else {
            throw Error("Unsupported network: " + walletInstance.network);
        }
    },
         
    async rentItem(collectionAddress, tokenId, hours, amount) {
        let walletInstance = Wallet.getInstance();

        if (!walletInstance) {
            throw Error("No wallet connected.");
        }
        
        if (walletInstance.network === Wallet.networks.starknet.testnet) {
            
            let tokenIdFelts = CairoUtils.bnToUint256(tokenId).toFeltArray();
            let amountFelts = CairoUtils.bnToUint256(amount).toFeltArray();

            let nftRentingController = new StarknetContract(Config.abis.starknet.nftRentingController, Config.contractAddresses.starknet.testnet.nftRentingController, walletInstance.account);
            let txHandle = await nftRentingController.rentItem(collectionAddress, tokenIdFelts, hours.toString(), amountFelts);
            await walletInstance.provider.waitForTransaction(txHandle.transaction_hash);

            let tx  = await walletInstance.provider.getTransaction(txHandle.transaction_hash);
            await waitForBlockSync("starknet", tx.block_number, walletInstance.provider, txHandle.transaction_hash);

        } else if (walletInstance.network === Wallet.networks.zkSync.testnet) {

            let nftRentingController = new zkSyncContract(Config.contractAddresses.zkSync.testnet.nftRentingController, Config.abis.zkSync.nftRentingController, walletInstance.signer);
            let txHandle = await nftRentingController.rentItem(collectionAddress, tokenId, hours, amount);
            let result = await txHandle.wait();                

            await waitForBlockSync("zksync", result.blockNumber);

        } else {
            throw Error("Unsupported network: " + walletInstance.network);
        }
    }
}