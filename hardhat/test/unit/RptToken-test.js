const {expect, assert, use} = require("chai");
const {ethers} = require("hardhat");


describe("RptToken Unit Test", function () {
    let totalSupply;

    before(async function () {
        RptToken = await ethers.getContractFactory("RptToken");
        const [operator] = await ethers.getSigners();
        RptTokenContract = await RptToken.deploy();
        await RptTokenContract.deployed();
        totalSupply = await RptTokenContract._totalSupply();
        console.log(`RptTokenConrtact deployed to ${RptTokenContract.address}`);
        console.log(`${operator.address}`);
    })
    
    it("The operator's balance of RPT tokens should be 3500", async function () {
        const [operator] = await ethers.getSigners();
        const operatorTokens = await RptTokenContract.balanceOf(operator.address);
        console.log(operatorTokens.toString())
        expect(await parseInt(operatorTokens)).to.equal(3500);
    })


})

