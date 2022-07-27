const { ethers } = require("hardhat")

const networkConfig = {
    4: {
        name:"rinkeby",
        startPrice: ethers.utils.parseEther("0.1"),
        ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    },
    31337: {
        name:"hardhat",
        startPrice: ethers.utils.parseEther("0.000000000000001000"),
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports= {
    networkConfig,
    developmentChains
}