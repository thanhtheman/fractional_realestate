// SPDX-License-Identifier: unlicense

pragma solidity ^0.8.13;

import "./AggregatorV3Interface.sol";

contract Reatoken { 
    address payable public operator;
    uint256 private immutable _cap = 350000;
    uint256 public totalMinted;
    string private name = "Real Property Token";
    string private symbol = "REA";
    uint8 public reaPriceUSD = 1;
    uint32 public feeRateUSD = 0.01;
    mapping(address => uint256) private balanceEth;
    mapping(address => uint256) public balance;
    event Transfer (address from, address to, uint256 amount);


    struct Property {
        uint32 priceUSD;
    }

    constructor (uint256 cap_) {
        require(cap_ > 0, "REA token cap is at 350000");
        _cap = cap_;
    }

    function cap() public view returns (uint256) {
        return _cap;
    }

    function name() public view returns (string memory) {
        return name;
    }

    function symbol() public view returns (string memory) {
        return symbol;
    }

    function totalMinted() public view returns (uint256) {
        return totalMinted;
    }

    function checkBalance (address account) public view returns (uint256) {
        return balance[account];
    }

    error insufficientBalance();

    function sentREA (address receiver, uint256 quantityREA) public {
        if (quantityREA > balance[operator])
        revert insufficientBalance();
        balance[operator] -= quantityREA;
        balance[receiver] += quantityREA;
        emit Transfer(operator, receiver, amountREA);
    }

    function usdToWei() {

    }
    function payment (uint256 quantityREA) public {
        require(totalMinted() + quantityREA <= cap(), "REA token cap is at 350000");
        uint256 paymentInUSD = reaPriceUSD*quantityREA*(feeRateUSD + 1);
        uint256 usdToWei = usdToWeiRate();
        uint256 weiRequired = paymentInUSD*usdToWei;
        balanceEth[operator] += weiRequired;
        sentREA(msg.sender, quantityREA);
        totalSupply += quantity;
    }

   


}