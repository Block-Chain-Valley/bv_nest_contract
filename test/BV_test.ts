import { ethers } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { Nest } from "../typechain-types"

let deployer: SignerWithAddress
let nest: Nest

describe("Farm", () => {
  before(async () => {
    ;[deployer] = await ethers.getSigners()
    const nestFactory = await ethers.getContractFactory("Nest")
    nest = await nestFactory.deploy()
    await nest.deployed()
  })
})
