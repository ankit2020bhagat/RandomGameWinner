
const { hexStripZeros } = require("ethers/lib/utils");
const {ethers} = require("hardhat");
require("dotenv").config({ path: ".env" });
const { FEE, VRF_COORDINATOR, LINK_TOKEN, KEY_HASH } = require("../constants");

async function main() {
  const randomWinnerContract = await ethers.getContractFactory("RandomWinnerGame");

  const deploycontract = await randomWinnerContract.deploy(VRF_COORDINATOR,LINK_TOKEN,KEY_HASH,FEE);

  await deploycontract.deployed();
  console.log("contract Address :",deploycontract.address);

  await sleep(30000);

  await hre.run("verify:verify",{address:deploycontract.address,
  constructorArguments:[VRF_COORDINATOR,LINK_TOKEN,KEY_HASH,FEE]
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });