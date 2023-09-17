import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import dotenv from "dotenv"

dotenv.config()

const SH_ACCOUNT = process.env.SH_ACCOUNT || ""

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    baobab: {
      url: "https://klaytn-baobab.blockpi.network/v1/rpc/public",
      accounts: [SH_ACCOUNT],
    },
  },
}

export default config
