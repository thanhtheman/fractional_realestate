const hre = require("hardhat");

async function main() {
    const PriceConsumerV3 = await hre.ethers.getContractFactory();
    const PriceConsumerV3Contract = await PriceConsumerV3.deploy("0x8A753747A1Fa494EC906cE90E9f37563A8AF630e");
    console.log(`PriceConsumerV3Contract is deployed to ${PriceConsumerV3Contract.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


