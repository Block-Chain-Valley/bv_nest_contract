import { ethers } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { Nest } from "../typechain-types"
import { assert, expect } from "chai"

let deployer: SignerWithAddress
let nest: Nest

describe("Farm", () => {
  before(async () => {
    ;[deployer] = await ethers.getSigners()
    const nestFactory = await ethers.getContractFactory("Nest")
    nest = await nestFactory.deploy()
    await nest.deployed()
  })

  it("should create bird", async () => {
    const tx = await nest.createBird("jihwan", { value: ethers.utils.parseEther("0.01") })
    const txr = await tx.wait()

    const birdInfo = await nest.retrieveBirdInfo()
    assert(birdInfo[1] === "jihwan")
  })
  it("Successfully creates grass", async () => {
    const tx = await nest.createPlant(0)
    const txr = await tx.wait()

    const plantInfo = await nest.retrievePlantInfo()
    assert(plantInfo[0].toString() == "0")
  })
  it("Successfully feed on grass", async () => {
    const birdInfo = await nest.retrieveBirdInfo()
    const plantInfo = await nest.retrievePlantInfo()

    const tx = await nest.feedPlant(birdInfo[0], plantInfo[0])
    const txr = await tx.wait()

    const newBirdInfo = await nest.retrieveBirdInfo()
    const newPlantInfo = await nest.retrievePlantInfo()

    assert(Number(newBirdInfo[3]) > Number(birdInfo[3]))
    // exp
    assert(Number(newPlantInfo[1]) < Number(plantInfo[1]))
    // hp
    assert(Number(newPlantInfo[1]) == 0)
  })
  it("Successfully revies plant", async () => {
    const plantInfo = await nest.retrievePlantInfo()
    assert(Number(plantInfo[1]) == 0)

    await expect(nest.revivePlant(plantInfo[0])).to.be.revertedWith("Nest: NOT ENOUGH TIME")

    await ethers.provider.send("evm_increaseTime", [10])
    await ethers.provider.send("evm_mine", [])

    const tx = await nest.revivePlant(plantInfo[0])
    const txr = await tx.wait()

    const newPlantInfo = await nest.retrievePlantInfo()
    assert(Number(newPlantInfo[1]) > 0)
    // expect(Number(newPlantInfo[1])).to.be.greaterThan(0)
  })
  it("Successfully levels up", async () => {
    const birdInfo = await nest.retrieveBirdInfo()
    await nest.levelUp(birdInfo[0])
    const newBirdInfo = await nest.retrieveBirdInfo()
    expect(Number(newBirdInfo[3]) > Number(birdInfo[3]))
  })
  it("Successfully emits event", async () => {
    // uint _id, string memory _name, uint _ad, uint _exp, uint _level, uint _length, uint _class
    // (uint _id, uint _hp, uint _expReward, uint _deadTime, uint _class)
    const birdInfo = await nest.retrieveBirdInfo()
    const plantInfo = await nest.retrievePlantInfo()
    await expect(nest.feedPlant(birdInfo[0], plantInfo[0])).to.emit(nest, "PlantFed")
  })
})
