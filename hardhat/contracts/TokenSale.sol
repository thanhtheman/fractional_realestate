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
        feeRateBase = 1000;
        feeRateBasisPoint = 15;
        priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
    }

    function totalRptSold() public view returns (uint256) {
        return _totalRptSold;
    }

     function getEthBalance() public view returns (uint256) {
        return balanceEth[operator];
    }


    error insufficientBalance();


    AggregatorV3Interface internal priceFeed;
    
    function usdToWeiRate() public view returns (uint256) {
        ( ,int256 usdToEth, , , ) = priceFeed.latestRoundData();
        (uint8 rateDecimals) = priceFeed.decimals();
        uint256 usdToWei = uint256(10**(rateDecimals + basicDecimals() - internalDecimals))/uint256(usdToEth);
        return usdToWei;
    }

    function buyRPT (address client, uint256 quantityRPT) public payable {

        // Making sure the total supply is cap at 3500 
        // and the operator still have enough RPT Tokens to sell
        require(totalRptSold() + quantityRPT <= totalSupply(), "RPT token cap is at 3500");
        if (quantityRPT > balanceOfRpt[operator])
        revert insufficientBalance();
        
        // Convert Payment in USD into Wei and check if the client's payment is enough
        // including 1.5% fee
        uint256 usdToWei = usdToWeiRate();
        console.log("The exchange rate is %s", usdToWei);
        uint256 paymentInUSD = (rptPriceUSD*quantityRPT) + ((rptPriceUSD*quantityRPT*feeRateBasisPoint) / feeRateBase);
        uint256 weiRequired = paymentInUSD*usdToWei;
        console.log("The wei required is %s", weiRequired);
        require(msg.value >= weiRequired, "Payment is not sufficient!");
        balanceEth[operator] += weiRequired;
        emit TransferEth(client, operator, weiRequired);
        
        // Send RPT Tokens to the client and update total tokens sold
        transfer(operator, client, quantityRPT);
        _totalRptSold += quantityRPT;
        
        // Making sure the new balance is correct
        console.log("Operato's balance is %s and Acct2's balance is %s", balanceOfRpt[operator], balanceOfRpt[client]);
        console.log("Total RPT Sold is %s", _totalRptSold);
    }
}