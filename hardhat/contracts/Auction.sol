// SPDX-License-Identifier: unlicense
pragma solidity ^0.8.7;
import "./RptToken.sol";
import "./TokenSale.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Auction is RptToken, TokenSale {
    address public seller;
    uint256 public startBlock;
    uint256 public quantityRPTSales;
    uint256 public floorPriceInWei;
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
    event CommissionPaid(address seller, uint256 amount);
    
    constructor () {
        require(operator == msg.sender);
        // require(_endBlock > _startBlock);
        // require(block.number > _startBlock);
        // require(block.number < _endBlock);

        //need to operator to initiate this contract
        // We don't need to assign the operator to be the seller, the seller will be assigned once a customer calls a function
        // seller = _seller;
        // bidIncrement = _bidIncrement;
        // startBlock = _startBlock;
        // endBlock = _endBlock;
    }

    // This modifier ensure that only the seller can do a specific thing such as cancelling the auction.
    modifier onlySeller {
        require(seller == msg.sender);
        _;
    }

    // The seller can't submit a bid.
    modifier onlyNotSeller {
        require(seller != msg.sender);
        _;
    }
    // You can only bid After the auction starts.
    modifier onlyAfterStart {
        require(block.number > startBlock);
        _;
    }

     // You can only bid BEFORE the auction is closed.
    modifier onlyBeforeEnd {
        require(block.number < endBlock);
        _;
    }

    // This is the condition for the contract to accept bids. You can't bid if the auction is cancelled.
    modifier onlyNotCancelled {
        require(cancelled = false);
        _;
    }

    // This is the condition for all participants, including the seller, to withdraw their funds, only once the auction is ended OR cancelled.
    modifier onlyEndedOrCancelled {
        require(block.number > endBlock || cancelled);
        _;
    }

    function min(uint256 a, uint256 b) private pure returns(uint256) {
        if (a < b) return a;
        return b;
    }
    
    function getHighestBid() public view returns (uint256) {
        return bidderFund[highestBidder];
    }

    function getHighesBidingtBid() public view returns (uint256) {
        return highestBindingBid;
    }

    //The Seller can set the floor (minimum) price and the quanity of RPT tokens he wants to sell. Next,
    //He will approve/authorize the operator to transfer his sales tokens. 

    function setFloorPriceAndQuantitySales (uint256 _floorPriceInUSD, uint256 _quantityRPTSales, uint256 _bidIncrement, uint256 _startBlock, uint256 _endBlock) public {
        require(seller == msg.sender && balanceOfRpt[seller] >= _quantityRPTSales, "Insufficient tokens to sell!");
        require(_endBlock > _startBlock);
        require(block.number > _startBlock);
        require(block.number < _endBlock);

        bidIncrement = _bidIncrement;
        startBlock = _startBlock;
        endBlock = _endBlock;
        approve(_quantityRPTSales);
        quantityRPTSales = _quantityRPTSales;
        // If the seller input $145 USD, then the equivalent representation of $145 is 14500 on our smart contract. The front-end must do the conversion and feed 14500 to our smart contract.
        floorPriceInWei = _floorPriceInUSD*usdToWeiRate();
    }

    function submitBids() public payable onlyAfterStart onlyBeforeEnd onlyNotCancelled onlyNotSeller returns (bool success) {
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

  

    function withdrawFund() external onlyEndedOrCancelled nonReentrant returns (bool success) {
        address withdrawalAccount;
        uint256 withdrawalAmount;
        
        if(cancelled) {
            withdrawalAccount = msg.sender;
            withdrawalAmount = bidderFund[msg.sender];
        } else {
            //Once the auction ends, the tokens are trasnferred from the seller to the winner of the auction
            transferFrom(seller, highestBidder, quantityRPTSales); 
            
            // This is what will happen when the seller withdraws his/her money,
            // The seller pays the operator a commission fee.
            // Commission fee is 1.5% of the sale price, which is the highestBindingBid.
            // Regarding the highest bidder, he/she will be able to withdraw the diffference = highestBid - highestBindingBid
            if (msg.sender == seller) {
                uint256 commissionFee = (highestBindingBid + (highestBindingBid*feeRateBasisPoint) / feeRateBase); 
                withdrawalAccount = highestBidder;
                withdrawalAmount = (highestBindingBid - commissionFee);
                balanceEth[operator] = commissionFee;
                (bool commission, ) = operator.call{value: commissionFee}("");  
                require (commission, "Commission has not been paid");
                emit CommissionPaid (msg.sender, commissionFee);
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
        
        //All participants get their money.
        require(withdrawalAmount != 0);
        bidderFund[withdrawalAccount] -= withdrawalAmount;
        (bool withdrawn, ) = msg.sender.call{value: withdrawalAmount}(""); 
        require(withdrawn, "Withdraw request failed!");
        emit Withdrawn(msg.sender, withdrawalAccount, withdrawalAmount);

        return true;
    }

    //The seller has an option to call this function to cancel the auction. However, he/she will needs to pay a cancellation fee to the operator.
    //The seller will have to pay 1,000,000 GWei for EVERY SINGLE TOKEN that is listed for sales.
    //Once the auction is , participants can call the withdraw function to get their money back.
    function cancelAuction() private onlySeller onlyBeforeEnd onlyNotCancelled returns (bool _auctionCancelled) {
        uint256 cancellationFee = (quantityRPTSales*1000000);
        (bool cancellation, ) = operator.call{value: cancellationFee}("");  
        require (cancellation, "cancellation fee has not been paid");
        cancelled = true;
        emit AuctionCancelled();
        return true;
    }
}