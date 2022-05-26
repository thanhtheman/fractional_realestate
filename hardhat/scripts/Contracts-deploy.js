const hre = require("hardhat");

async function main () {
    const Auction = await hre.ethers.getContractFactory("Auction");
    const AuctionContract = await Auction.deploy();
    await AuctionContract.deployed()
    console.log(`AuctionContract is deployed to: ${AuctionContract.address}`);
    
} 

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });