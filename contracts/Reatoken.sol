// SPDX-License-Identifier: MIT
// author: Thanh Quach

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract reaToken is ERC20 {  
    constructor () ERC20("Real Property Token", "REA") {
        _mint(msg.sender,350000);
    }

    mapping(address => uint256) public balance;

    function checkbalance (address _address) public view returns (uint256) {
        return balance[_address];
    }

}