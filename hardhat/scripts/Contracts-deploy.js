const hre = require("hardhat");

async function main () {
    // const [operator] = await hre.ethers.getSigner();
    const RptToken = await hre.ethers.getContractFactory("RptToken");
    const TokenSale = await hre.ethers.getContractFactory("TokenSale");
    // const Auction = await hre.ethers.getContractFactory("Auction");
    
    const RptTokenContract = await RptToken.deploy();
    console.log(`RptTokenContract Deployed to: ${RptTokenContract.address}`);
    const TokenSaleContract = await TokenSale.deploy();
    console.log(`TokenSaleContract Deployed to: ${TokenSaleContract.address}`);
    // const AuctionContract = await Auction.deploy();
    // console.log(`AuctionContract Deployed to: ${AuctionContract.address}`);
    // console.log(`Contracts are deployed by ${operator.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });