// SPDX-License-Identifier: unlicense

pragma solidity ^0.8.7;


contract RptToken {
    address public operator;
    string public _name = "Real Property Token";
    string public _symbol = "RPT";
    uint256 public _totalSupply = 3500;
    uint8 public _decimals = 18;
    uint256 public totalEarnedDividend;
    uint256 public dividendBalance;
    uint256 public alreadyPaidDividend;
    uint256 public remainingWei;
    event Transfer(address indexed from, address indexed to, uint256 quantityRPT);

    mapping (address => uint256) public balanceOfRpt;
    mapping (address => uint256) public balanceOfDividend;
    mapping (address => uint256) public balanceOfAlreadyPaidDividend;

    constructor () {
        operator == msg.sender;
        balanceOfRpt[operator] = _totalSupply;
        emit Transfer(address(0), operator, _totalSupply);
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

    modifier updateDividendStatus (address account) {
       uint256 owedDividend = (totalEarnedDividend - alreadyPaidDividend);
       balanceOfDividend[msg.sender] += (balanceOfRpt[msg.sender] * owedDividend);
       balanceOfAlreadyPaidDividend[msg.sender] = totalEarnedDividend;
        _;
    }


    function transfer(address from, address to, uint256 quantityRPT) public updateDividendStatus(from) updateDividendStatus(to) returns (bool success) {
        require(balanceOfRpt[from] >= quantityRPT, "You don't have sufficient fund!");
        balanceOfRpt[from] -= quantityRPT;
        balanceOfRpt[to] += quantityRPT;
        emit Transfer (msg.sender, to, quantityRPT);
        return true;
    }

    function balanceOf(address account) public view returns (uint256) {
        return balanceOfRpt[account];
    }

    function dividendDeposit(uint256 amount) public payable {
        require(msg.value == amount);
        remainingWei = msg.value % _totalSupply;
        totalEarnedDividend += ((msg.value - remainingWei)/_totalSupply);
        //There is a rounding difference when we try to divide the dividend amount (wei) to the number of tokens to calculate per-token dividend.
        //For reconciliation and accurate record, we created a variable to store this "remaining" wei amount 
        //so that: total received dividend = ditributed dividend + remaining wei.  
    }

    function checkDividendBalance(address account) public returns (uint256) {
        uint256 eligibleDividend = balanceOfDividend[account];
        return eligibleDividend;
    }

    function withdraw(address account, uint256 amount) public updateDividendStatus(msg.sender) {
        require(operator != msg.sender);
        require(amount <= balanceOfDividend[msg.sender], "Insufficient balance to withdraw!");
        balanceOfDividend[msg.sender] -= amount;
        msg.sender.transfer(amount);
        // How can an investor send dividend to his own address from the contract?
        
    }
}