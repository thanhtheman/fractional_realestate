const {expect, assert, use} = require("chai");
const {ethers} = require("hardhat");


describe("RptToken Unit Test", function () {
    let totalSupply;
    let operator;
    let addr1;
    let addr2;
    let addr3;

    beforeEach(async function () {
        Auction = await ethers.getContractFactory("Auction");
        [operator, addr1, addr2] = await ethers.getSigners();
        AuctionContract = await Auction.deploy(operator.address, 10, 0, 20);
        await AuctionContract.deployed();
    })
    
    
    it("The operator's balance of RPT tokens should be 3500", async function () {
        [operator] = await ethers.getSigners();
        const operatorTokens = await AuctionContract.balanceOf(operator.address);
        console.log(operatorTokens.toString())
        expect(await parseInt(operatorTokens)).to.equal(3500);
    })

    it("Is the Transfer function working properly?", async function () {
        [operator, addr1] = await ethers.getSigners();
        await AuctionContract.transfer(operator.address, addr1.address, 35);
        const balance = await AuctionContract.balanceOf(addr1.address);
        console.log(balance.toString());
        expect(balance.toString()).to.be.equal("35");
    })

    /*This is the process of buying RPT token
    addr1 = buyer, who wants to buy 20 RPT tokens @ $100 each, he will pay in ETH
    In our system $100 = 1000*/
    it ("Is the buy-in transaction processed correctly with ETH/USD rate?", async function () {
        //Chainlink ETH/USD feed is mocked at 208912345612
        [operator, addr1, addr2] = await ethers.getSigners();
        const usdToEth = 208912345612;
        const usdToWei = (10**(8+18-2))/usdToEth;
        console.log((usdToWei).toString());
        const weiRequired = (usdToWei*200000);
        console.log(weiRequired.toString());
        // const value = BigNumber.from("9573393061769920")
        // ethers.utils.parseUnits("4786696530884", "wei")
        await expect(AuctionContract.connect(addr2).buyRPT(addr2.address, 20,{value: ethers.utils.parseUnits("957339306176991856789", "wei")})).to.be.revertedWith("Payment is insufficient!");
        // 957339306176991856789
        // await RptTokenContract.transfer(operator.address, addr1.address, 20);
        // const balance = await AuctionContract.balanceOfRpt(addr2.address);
        // console.log(balance.toString());
        // expect(await balance.toString()).to.be.equal("20");
       
    })

})

