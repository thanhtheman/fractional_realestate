require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const ALCHEMY_API_KEY = "Fd9w66UwZap28AzyioS49IKOLTy9yBD6";
const RINKEBY_PRIVATE_KEY = "8dba54aeab960f36d7d6dfb08527c6dc163e73e2d6e7810c539033c65d5c3720";

module.exports = {
  defaultNetwork: "hardhat",
  solidity: "0.8.7",
  networks: {
    rinkeby: {
      url:`https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts:[`${RINKEBY_PRIVATE_KEY}`]
    }
  }
};
