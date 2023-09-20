import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import dotenv from "dotenv"
import "hardhat-gas-reporter"

dotenv.config()

const SH_ACCOUNT = process.env.SH_ACCOUNT || ""

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    baobab: {
      url: "https://klaytn-baobab.blockpi.network/v1/rpc/public",
      accounts: [SH_ACCOUNT],
    },
    // sepolia
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/ZLAQxGyKAAmBOXf5nr8dTdsTjU-vX4Xm",
      accounts: [SH_ACCOUNT],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
}

export default config
