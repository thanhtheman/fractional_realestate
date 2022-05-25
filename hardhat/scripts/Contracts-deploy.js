const hre = require("hardhat");

async function main () {
    const Auction = await hre.ethers.getContractFactory("Auction");
    const AuctionContract = await Auction.deploy("0x6eda30cc59f13c8973f60a167ba4b343c7e2430b", 1000, 10738631, 10738933);
    await AuctionContract.deployed()
    console.log(`AuctionContract is deployed to: ${AuctionContract.address}`);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });