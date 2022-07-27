const { getNamedAccounts, deployments, network, ethers, run } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper.hardhat")
const { verify } = require("../utils/verify")


module.exports = async function ({ getNamedAccounts, deployments }) {

    const {deploy, log } = deployments
    const { deployer }  = await getNamedAccounts()
    const chainId = network.config.chainId

    const startPrice = networkConfig[chainId]["startPrice"]

    console.log(`Deployer: ${deployer}`)
    console.log(`Value: ${startPrice} $`)

    let ethUsdPriceFeedAddress
    if (chainId == 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]//Aqui es d'on treu el contract per treure el el preu de eth de aquest file: helper-hardhat-config
    }

    const args = [startPrice, ethUsdPriceFeedAddress]
    const Code = await deploy("Code", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    console.log(`Contract: ${Code.address}`)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {//Etherscan verification
        log("Verifying...")
        await verify(Code.address, args)
    }
    log("--------------------------------")
}

module.exports.tags = ["all", "Code"] 