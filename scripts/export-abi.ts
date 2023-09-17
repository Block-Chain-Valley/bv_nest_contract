import { existsSync, mkdirSync, writeFileSync } from "fs"
import { artifacts } from "hardhat"
import { join } from "path"

async function main() {
  const names = await artifacts.getAllFullyQualifiedNames()

  // [path, name]
  const targetContracts: [string, string][] = [["contracts/Nest.sol:Nest", "Nest"]]

  const abiDir = join(__dirname, "../abi")
  if (!existsSync(abiDir)) mkdirSync(abiDir)

  targetContracts.map(([path, name]) => {
    artifacts.readArtifact(path).then((res) => {
      writeFileSync(
        join(abiDir, name + ".json"),
        JSON.stringify(
          res.abi.filter((item) => item.type !== "constructor"),
          null,
          2
        )
      )
    })
  })
}

main()
