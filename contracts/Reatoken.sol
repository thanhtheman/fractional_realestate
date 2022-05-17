// SPDX-License-Identifier: unlicense

pragma solidity ^0.8.13;

import "./AggregatorV3Interface.sol";

contract Reatoken { 
    address public operator;
    uint256 private immutable _totalSupply;
    uint256 public reaPriceUSD;
    uint256 public _totalMinted;
    string public _name = "Real Property Token";
    string public _symbol = "RPT";
    uint8 public internalDecimal = 2;
    uint256 feeRateBase;
    uint8 feeRateBasisPoint;
    mapping(address => uint256) private balanceEth;
    mapping(address => uint256) public balance;
    event TransferRea (address from, address to, uint256 amount);
    event TransferEth (address from, address to, uint256 amount);

    constructor () {
        //total token supply is fixed at 3500
        _totalSupply = 3500;
        //Each RET Token is priced at $100
        reaPriceUSD = 10000;
        feeRateBase = 10000;
        feeRateBasisPoint = 185;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function totalMinted() public view returns (uint256) {
        return _totalMinted;
    }

    function checkBalance (address account) public view returns (uint256) {
        return balance[account];
    }

    error insufficientBalance();

    function mintRPT (address client, uint256 quantityRPT) internal returns (bool success) {
        if (quantityRPT > balance[operator])
        revert insufficientBalance();
        balance[operator] -= quantityRPT;
        balance[client] += quantityRPT;
        emit TransferRea(operator, client, quantityRPT);
        return true;
    }


    AggregatorV3Interface internal priceFeed;
    
    function usdToWeiRate() internal view returns (uint256) {
        ( ,int256 usdToEth, , , ) = priceFeed.latestRoundData();
        (uint8 rateDecimals) = priceFeed.decimals();
        uint256 usdToWei = uint256(10**(rateDecimals + 18 - internalDecimal))/uint256(usdToEth);
        return usdToWei;
    }

    function buyInRea (address client, address _operator, uint256 quantityRPT) public payable returns (bool success) {
        require(totalMinted() + quantityRPT <= totalSupply(), "RPT token cap is at 350000");
        uint256 usdToWei = usdToWeiRate();
        uint256 paymentInUSD = ((reaPriceUSD*quantityRPT*feeRateBasisPoint) / feeRateBase);
        uint256 weiRequired = paymentInUSD*usdToWei;
        require(msg.value >= weiRequired, "Payment is not sufficient!");
        balanceEth[_operator] += weiRequired;
        emit TransferEth(client, _operator, weiRequired);
        mintRPT(client, quantityRPT);
        _totalMinted += quantityRPT;
        return true;
    }

   


}