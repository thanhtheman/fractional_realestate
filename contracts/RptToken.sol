// SPDX-License-Identifier: unlicense

pragma solidity ^0.8.7;


contract RptToken {
    address public operator;
    string public _name = "Real Property Token";
    string public _symbol = "RPT";
    uint256 public _totalSupply = 3500;
    uint8 public _decimals = 18;
    event Transfer(address indexed from, address indexed to, uint256 quantityRPT);

    mapping (address => uint256) public balanceOfRpt;

    constructor () {
        require(operator == msg.sender);
        balanceOfRpt[operator] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function basicDecimals() public view returns (uint256) {
        return _decimals;
    }

    function transfer(address from, address to, uint256 quantityRPT) public returns (bool success) {
        require(balanceOfRpt[from] >= quantityRPT, "You don't have sufficient fund!");
        balanceOfRpt[from] -= quantityRPT;
        balanceOfRpt[to] += quantityRPT;
        emit Transfer (msg.sender, to, quantityRPT);
        return true;
    }

    function balanceOf(address _address) public view returns (uint256) {
        return balanceOfRpt[_address];
    }
}