/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require("@nomiclabs/hardhat-waffle")
 require("hardhat-gas-reporter")
 require("@nomiclabs/hardhat-etherscan")
 require("dotenv").config()
 require("solidity-coverage")
 require("hardhat-deploy")
 require("hardhat-contract-sizer")


const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const REPORT_GAS = process.env.REPORT_GAS
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY


module.exports = {
  // solidity: "0.8.8",
  solidity: {
      compilers: [{version: "0.8.8"}, {version: "0.6.6"}],
  },
  defaultNetwork: "hardhat",
  networks: {
      rinkeby: {
          url: RINKEBY_RPC_URL,
          accounts: [PRIVATE_KEY],
          chainId: 4,
          blockConfirmations: 6,
          // gas: 2100000,
          // gasPrice: 130000000000
      },
      hardhat: {
        chainId: 31337,
        blockConfirmations: 1,
        // gasPrice: 130000000000,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    second: {
      default: 1,
    },
    third: {
      default: 2,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: REPORT_GAS,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: COINMARKETCAP_API_KEY,
    token: "AVAX"
  },
}
