const {expect, assert, use} = require("chai");
const {ethers} = require("hardhat");


describe("RptToken Unit Test", function () {
    let totalSupply;
    let operator;
    let addr1;
    let addr2;
    let addr3;

    before(async function () {
        const [operator, addr1, addr2, addr3] = await ethers.getSigners();
        RptToken = await ethers.getContractFactory("RptToken");
        RptTokenContract = await RptToken.deploy();
        await RptTokenContract.deployed();
        totalSupply = await RptTokenContract._totalSupply();
        console.log(`RptTokenConrtact deployed to ${RptTokenContract.address}`);
        console.log(`Operator'address is ${operator.address}`);
    })
    
    it("The operator's balance of RPT tokens should be 3500", async function () {
        const [operator] = await ethers.getSigners();
        const operatorTokens = await RptTokenContract.balanceOf(operator.address);
        console.log(operatorTokens.toString())
        expect(await parseInt(operatorTokens)).to.equal(3500);
    })

    // it ("Are other address ready?", async function () {
    //     [operator, addr1, addr2, addr3] = await ethers.getSigners();
    //     console.log(`${operator.address}`);
    //     console.log(`${addr1.address}`);
    //     console.log(`${addr2.address}`);
    //     console.log(`${addr3.address}`);
    // })
})

