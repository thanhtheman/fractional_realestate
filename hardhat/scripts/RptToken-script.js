const hre = require("hardhat");

async function main () {
    const RptToken = await hre.ethers.getContractFactory("RptToken");
    const RptTokenContract = await RptToken.deploy();
    console.log("Starting Deploy")
    const address = await RptTokenContract.operator();
    console.log(address);
    const totalSupply = await RptTokenContract._totalSupply();
    console.log(totalSupply.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });