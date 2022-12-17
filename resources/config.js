export default {

    apiEndpoints: {
        testnet: "http://localhost:3000"
    },

    abis: { 
        starknet: {
            nft: require("./abis/cairo/NFT.json"),
            nftRentingController: require("./abis/cairo/NFTRentingController.json")
        },

        zkSync: {
            nft: require("./abis/solidity/NFT.json"),
            nftRentingController: require("./abis/solidity/NFTRentingController.json")
        }
    },

    contractAddresses: {
        starknet: {
            testnet: {
                nftRentingController: "0x04b09f4876fb4977809dc5f935a75ab343d078869639eed8c197e2864c7b6e90"
            }
        },
        zkSync: {
            testnet: {
                nftRentingController: "0xA8641Db3E29699cCDC53Bc2B2eC58649B3a4AbCb"
            }
        },
    },

    providers: {
        zkSync: {
            testnet: 'https://zksync2-testnet.zksync.dev'
        }
    }
}