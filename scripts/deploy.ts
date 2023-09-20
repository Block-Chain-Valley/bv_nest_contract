import { network, ethers } from "hardhat"
import { verify } from "../utils/verify"

const developmentChains = ["hardhat", "localhost"]

async function deploy() {
  const isDevelopment = developmentChains.includes(network.name)
  if (isDevelopment) {
    return "Not deploying to development network"
  }

  const [deployer] = await ethers.getSigners()

  const Nest = await ethers.getContractFactory("Nest")
  const nest = await Nest.deploy()
  await nest.deployed()

  console.log("Nest deployed to:", nest.address)
  // 0x38e6Faa8F9eCD6aFf32eB5BC50B01FD696691b30

  // Verify contract on Etherscan
  console.log("Verifying contract on Etherscan...")
  const args: any[] = []
  await verify(nest.address, args)
}
deploy()
