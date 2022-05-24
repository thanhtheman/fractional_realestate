const hre = require("hardhat");

async function main() {
    const PriceConsumerV3 = await hre.ethers.getContractFactory();
    const PriceConsumerV3Contract = await PriceConsumerV3.deploy();
    console.log(`PriceConsumerV3Contract is deployed to ${PriceConsumerV3Contract.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


