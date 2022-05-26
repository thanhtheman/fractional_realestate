
// const {expect} = require("chai");
// const {ethers} = require("hardhat");


// describe("ETH/USD Live Data Feed Test", function () {

//     before( async function () {
//         PriceConsumerV3 = await ethers.getContractFactory("PriceConsumerV3");
//         PriceConsumerV3Contract = await PriceConsumerV3.deploy();
//         await PriceConsumerV3Contract.deployed();
//         console.log(`contract is deployed to ${PriceConsumerV3Contract.address}`);
//     });

//     it("price feed is working", async function () {
//         const result = await PriceConsumerV3Contract.getLatestPrice();
//         console.log('price:'+ parseInt(result));
//         expect(parseInt(result)).to.be.greaterThan(0);
//     });

// })