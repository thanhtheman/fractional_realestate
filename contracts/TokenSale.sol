// SPDX-License-Identifier: unlicense

// Checklist:
// 1. SafeMath
// 2. Reentrant Guard

pragma solidity ^0.8.7;

import "./AggregatorV3Interface.sol";
import "./RptToken.sol";

contract TokenSale is RptToken { 
    uint256 public rptPriceUSD;
    uint256 public _totalRptSold;
    uint8 public internalDecimals = 2;
    uint256 feeRateBase;
    uint8 feeRateBasisPoint;
    mapping(address => uint256) private balanceEth;
    event SoldRpt (address from, address to, uint256 amount);
    event TransferEth (address from, address to, uint256 amount);


    constructor () {
        require(operator == msg.sender);
        //Each RET Token is priced at $100, interal USD representation is 10000
        rptPriceUSD = 10000;
        //fee rate = feeRate BasisPoint / feeRateBase = 1.5% 
        feeRateBase = 10000;
        feeRateBasisPoint = 150;
    }

    function totalRptSold() public view returns (uint256) {
        return _totalRptSold;
    }


    error insufficientBalance();

    function sendRPT (address client, uint256 quantityRPT) internal {
        if (quantityRPT > balanceOfRpt[operator])
        revert insufficientBalance();
        balanceOfRpt[operator] -= quantityRPT;
        balanceOfRpt[client] += quantityRPT;
        emit SoldRpt(operator, client, quantityRPT);
        _totalRptSold += quantityRPT;
    }


    AggregatorV3Interface internal priceFeed;
    
    function usdToWeiRate() internal view returns (uint256) {
        ( ,int256 usdToEth, , , ) = priceFeed.latestRoundData();
        (uint8 rateDecimals) = priceFeed.decimals();
        uint256 usdToWei = uint256(10**(rateDecimals + basicDecimals() - internalDecimals))/uint256(usdToEth);
        return usdToWei;
    }

    function buyRPT (address client, address _operator, uint256 quantityRPT) public payable {
        require(totalRptSold() + quantityRPT <= totalSupply(), "RPT token cap is at 3500");
        uint256 usdToWei = usdToWeiRate();
        uint256 paymentInUSD = ((rptPriceUSD*quantityRPT*feeRateBasisPoint) / feeRateBase);
        uint256 weiRequired = paymentInUSD*usdToWei;
        require(msg.value >= weiRequired, "Payment is not sufficient!");
        balanceEth[_operator] += weiRequired;
        emit TransferEth(client, _operator, weiRequired);
        sendRPT(client, quantityRPT);
    }
}