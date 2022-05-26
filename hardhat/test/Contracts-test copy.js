/* Please keep in mind some testing limits that I am facing:

1. Our smart contracts need live data feed ETH/USD to do calculation, thus I need to deploy it 
on Rinkeby to test this feature.
2. In addition to (1), critical functions such as buying our tokens and submitting bids in the auction will
require some live accounts (MetaMask) to sign transactions and interact with our contracts. Thus, I can't test it on this script either.

Thus, these critical tests will be conducted on the front_end, please refer to the demo video.

Tests on this script only apply to those who don't need live data feed or numerous accounts acting as buyers and sellers
*/

const {expect} = require("chai");
const {ethers} = require("hardhat");


describe("Testing on Rinkeby", function () {
    
    let operator = "0x6eda30cc59f13c8973f60a167ba4b343c7e2430b";
    let acct2 = "0x1082b6b58439AAAc58c366380641C8EB2EaBDF7f"; 

    before(async function () {
        Auction = await ethers.getContractFactory("Auction");
        AuctionContract = await Auction.deploy();
        await AuctionContract.deployed();
        const operatorAddress = ethers.utils.getAddress(operator);
        console.log(`Contract is deployed to ${AuctionContract.address}`);
    });
    
    describe("RptToken Contract Test", function () {
        it("The initial operator's balance of RPT tokens should be 3500", async function () {
            const operatorAddress = ethers.utils.getAddress(operator);
            const operatorTokens = await AuctionContract.balanceOf(operatorAddress);
            console.log(operatorTokens.toString());
            expect(await parseInt(operatorTokens)).to.equal(3500);
        });

        it("Tx: Operator transfers to Acct2 15 tokens - Tokens transferred successfully?", async function () {
            const operatorAddress = ethers.utils.getAddress(operator);
            const acct2Address = ethers.utils.getAddress(acct2);
            await AuctionContract.transfer(operatorAddress, acct2Address, 15);
            const balance = await AuctionContract.balanceOf(acct2Address);
            console.log(balance.toString());
            expect(balance.toString()).to.be.equal("15");
        });
    });

    describe("TokenSale Contract Test", function () {
        it("Is the live Chainlink price feed ETH/USD working?", async function () {
            const xrate = await AuctionContract.usdToWeiRate();
            console.log(`USD to Wei: ${parseInt(xrate)}`);
            expect(parseInt(xrate)).to.be.greaterThan(0);
        });

        //As we need a live account (MetaMask) to send transaction to buy, I just simply did it with 
        // my own account, acting both as buyer and seller
        it("Tx: Operator wants to buy 5 tokens from his own - Is the sale function executed correctly?", async function () {
            const operatorAddress = ethers.utils.getAddress(operator);
            await AuctionContract.buyRPT(operatorAddress, 5, { value: ethers.utils.parseEther("0.003") });
            const operatorBalance = await AuctionContract.balanceOfRpt(operatorAddress);
            const ethBalance = await AuctionContract.balanceEth(operatorAddress);
            console.log(parseInt(ethBalance));
            console.log(parseInt(operatorBalance));
            //The operator - my account - is initialized with 3500 tokens, he transferred 15 to Acct2
            //Thus he should still have 3485 as he buys/sells to his own.
            expect(operatorBalance.toString()).to.be.equal("3485");
        })
    });

})

