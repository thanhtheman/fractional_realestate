// SPDX-License-Identifier: unlicense

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./RptToken.sol";
import "hardhat/console.sol";

contract TokenSale is RptToken { 
    uint256 public rptPriceUSD;
    uint256 public _totalRptSold;
    uint8 public internalDecimals = 2;
    uint256 feeRateBase;
    uint8 feeRateBasisPoint;
    mapping(address => uint256) public balanceEth;
    event TransferEth (address from, address to, uint256 amount);


    constructor () {
        operator = msg.sender;
        //Each RET Token is priced at $100, interal USD representation is 10000
        rptPriceUSD = 10000;
        //fee rate = feeRate BasisPoint / feeRateBase = 1.5% 
        feeRateBase = 10000;
        feeRateBasisPoint = 150;
        priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
    }

    function totalRptSold() public view returns (uint256) {
        return _totalRptSold;
    }

     function getEthBalance() public view returns (uint256) {
        return balanceEth[operator];
    }


    error insufficientBalance();

    // function sendRPT (address client, uint256 quantityRPT) internal {
    //     if (quantityRPT > balanceOfRpt[operator])
    //     revert insufficientBalance();
    //     transfer(operator, client, quantityRPT);
    //     _totalRptSold += quantityRPT;
    // }


    AggregatorV3Interface internal priceFeed;
    
    function usdToWeiRate() public view returns (uint256) {
        ( ,int256 usdToEth, , , ) = priceFeed.latestRoundData();
        (uint8 rateDecimals) = priceFeed.decimals();
        uint256 usdToWei = uint256(10**(rateDecimals + basicDecimals() - internalDecimals))/uint256(usdToEth);
        return usdToWei;
    }

    function buyRPT (address client, uint256 quantityRPT) public payable {
        require(totalRptSold() + quantityRPT <= totalSupply(), "RPT token cap is at 3500");
        uint256 usdToWei = usdToWeiRate();
        //  adding parameter _usdToWei for testing purpose
        uint256 paymentInUSD = (rptPriceUSD*quantityRPT) + ((rptPriceUSD*quantityRPT*feeRateBasisPoint) / feeRateBase);
        uint256 weiRequired = paymentInUSD*usdToWei;
        require(msg.value >= weiRequired, "Payment is not sufficient!");
        balanceEth[operator] += weiRequired;
        emit TransferEth(client, operator, weiRequired);
        // sendRPT(client, quantityRPT);
        // replaced it with direct code below
        if (quantityRPT > balanceOfRpt[operator])
        revert insufficientBalance();
        console.log("Here it is %s to %s", quantityRPT, balanceOfRpt[operator]);
        transfer(operator, client, quantityRPT);
        _totalRptSold += quantityRPT;
        console.log("Total RPT Sold is %s", _totalRptSold);
    }
}