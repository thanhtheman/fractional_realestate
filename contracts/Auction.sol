// SPDX-License-Identifier: unlicense
pragma solidity ^0.8.7;
import "./RptToken.sol";
import "./TokenSale.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

//0. Seller pick the floor price.
//1. The auction runs on a specific timeline - like 5 minutes (with a countdown clock).
//2. Allow people to submit bid.
//3. People needs to stake their ETH to consider a valid bid.
//4. Comparing different bids and pick the highest one.
//5. Special: any bids submitted in the last 10-minute of the auction will extend the auction by another 10 minutes (with a countdown clock).
//6. Return the ETH bids that don't win the auction. 
//7. If there is no submit, terminate the auction as soon as the clock hits 0.

contract Auction is RptToken, TokenSale {
    address public seller;
     uint256 public floorPriceInWei;
    uint256 public quantityRPTSales;
    uint256 public startBlock;
    uint256 public endBlock;
    uint256 public bidIncrement;
    bool public cancelled;
    bool public sellerWithdrawn;
    address public highestBidder;
    uint256 public highestBindingBid;
    mapping(address => uint256) public bidderFund;

    event NewHighestBid(address bidder, uint256 bid, address highestBidder, uint256 highestBid, uint256 highestBindingBid);
    event Withdrawn(address withdrawer, address withdrawalAccount, uint256 withdrawalAmount);
    event AuctionCancelled();
    event CommissioPaid(address seller, uint256 amount);
    
    constructor (address _seller, uint256 _bidIncrement, uint256 _startBlock, uint256 _endBlock) {
        require(_seller == msg.sender);
        require(_endBlock > _startBlock);
        require(block.number > _startBlock);
        require(block.number < _endBlock);

        seller = _seller;
        bidIncrement = _bidIncrement;
        startBlock = _startBlock;
        endBlock = _endBlock;
    }

    modifier onlySeller {
        require(seller == msg.sender);
        _;
    }

    modifier onlyNotSeller {
        require(seller != msg.sender);
        _;
    }

    modifier onlyAfterStart {
        require(block.number > startBlock);
        _;
    }

    modifier onlyBeforeEnd {
        require(block.number < endBlock);
        _;
    }

    modifier onlyNotCancelled {
        require(cancelled = false);
        _;
    }

    function min(uint256 a, uint256 b) private pure returns(uint256) {
        if (a < b) return a;
        return b;
    }
    
    function getHighestBid() public view returns (uint256) {
        return bidderFund[highestBidder];
    }

    //Seller set the floor price and the quanity of RPT tokens he wants to sell. He needs to meet 3 conditions:
    //1. He is the seller who initiatie the sale.
    //2. He successfully pays a listing fee $ to proves his seriousness in selling. 
    function setFloorPriceAndQuantitySales (uint256 _floorPriceInUSD, uint256 _quantityRPTSales) public payable returns (uint256, uint256) {
        require(seller == msg.sender && balanceOfRpt[seller] >= quantityRPTSales, "Insufficient tokens to sell!");
        approve(_quantityRPTSales);
        // If the seller input $145 USD, then the equivalent representation of $145 is 14500 on our smart contract. The front-end must do the conversion and feed 14500 to our smart contract.
        floorPriceInWei = _floorPriceInUSD*usdToWeiRate();
        quantityRPTSales = _quantityRPTSales;
        return (floorPriceInWei, _quantityRPTSales);
    }

    function receivingBids() public payable returns (bool success) {
        require(msg.value >= floorPriceInWei, "Insufficient funds to bid!");
        uint256 newBid = bidderFund[msg.sender] + msg.value;
        require (newBid >= highestBindingBid); //do we need to revert the previous transaction?
        uint256 highestBid = bidderFund[highestBidder];
        bidderFund[msg.sender] = newBid;
        if (newBid <= highestBid) {
            highestBindingBid = min(newBid + bidIncrement, highestBid);
        } else {
            if (msg.sender != highestBidder) {
                highestBidder = msg.sender;
                highestBindingBid = min(newBid, highestBid +bidIncrement);
            }
            highestBid = newBid;
        }
        emit NewHighestBid(msg.sender, newBid, highestBidder, highestBid, highestBindingBid);
        return true;
    }

    // This is the condition for losing bidders to withdraw their funds, only once the auction is ended OR cancelled.
    modifier onlyEndedOrCancelled {
        require(block.number > endBlock || cancelled);
        _;
    }

    function withdraw() external onlyEndedOrCancelled nonReentrant returns (bool success) {
        address withdrawalAccount;
        uint256 withdrawalAmount;
        
        if(cancelled) {
            withdrawalAccount = msg.sender;
            withdrawalAmount = bidderFund[msg.sender];
        } else {
            transferFrom(seller, highestBidder, quantityRPTSales); //The tokens are trasnferred from the seller to the winner of the auction
            
            if (msg.sender == seller) {
                uint256 commissionFee = (highestBindingBid + (highestBindingBid*feeRateBasispoint) / feeRateBase); // Commission fee is 1.5% of the sale price, which is the highestBindingBid.
                withdrawalAccount = highestBidder;
                withdrawalAmount = (highestBindingBid - commissionFee);
                balanceEth[operator] = commissionFee;
                (bool commission, ) = operator.call{value: commissionFee}(""); // The seller pays the operator a commission fee. 
                require (commission, "Commission has not been paid");
                emit CommissionPaid(msg.sender, commissionFee);
                sellerWithdrawn = true;
            } else if (msg.sender == highestBidder) {
                withdrawalAccount = highestBidder;
                if (sellerWithdrawn) {
                    withdrawalAmount = bidderFund[highestBidder];
                } else {
                    withdrawalAmount =  (bidderFund[highestBidder] - highestBindingBid);
                }
                
            } else {
                withdrawalAccount = msg.sender;
                withdrawalAmount = bidderFund[msg.sender];
            }
        }
        
        require(withdrawalAmount != 0);
        bidderFund[withdrawalAccount] -= withdrawalAmount;

        (bool withdrawn, ) = msg.sender.call{value: withdrawalAmount}(""); //The seller/winner/other_bidders get their money.
        require(withdrawn, "Withdraw request failed!");
        emit Withdrawn(msg.sender, withdrawalAccount, withdrawalAmount);

        return true;
    }

    function cancelAuction() private onlySeller onlyBeforeEnd onlyNotCancelled returns (bool _auctionCancelled) {
        cancelled = true;
        emit AuctionCancelled();
        return true;
    }
}