import { network, ethers } from "hardhat"

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
}
deploy()
