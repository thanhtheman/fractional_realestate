// SPDX-License-Identifier: unlicense
pragma solidity ^0.8.7;
import "./TokenSale.sol";

//0. Seller pick the floor price.
//1. The auction runs on a specific timeline - like 5 minutes (with a countdown clock).
//2. Allow people to submit bid.
//3. People needs to stake their ETH to consider a valid bid.
//4. Comparing different bids and pick the highest one.
//5. Special: any bids submitted in the last 10-minute of the auction will extend the auction by another 10 minutes (with a countdown clock).
//6. Return the ETH bids that don't win the auction. 
//7. If there is no submit, terminate the auction as soon as the clock hits 0.

contract Auction is TokenSale {
    address public seller;
    uint256 _floorPrice;
    uint256 highestBid;
    uint256 secondHighestBid;
    mapping(address => uint256) public bidTable;

    function floorPrice () public payable returns (uint256) {
        msg.value == _floorPrice;
        return _floorPrice;
    }

    function receivingBids(uint256 quantityRptSale, uint256 amountBidUSD) public payable returns (uint256) {
        uint256 amountBidWei = amountBidUSD * usdToWeiRate();
        require(msg.value >= amountBidWei, "Insufficient Fund");
        

        return;

    }
}