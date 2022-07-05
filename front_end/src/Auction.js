import React, {useState} from "react";
import {BigNumber, ethers} from "ethers";
import Auction_abi from "./Auction_abi.json";
import logo from "./images/RPT.png";
import condo from "./images/condo.png";
import john from "./images/John.png";
import dave from "./images/Dave.png";
import jenny from "./images/Jenny.png";
import lisa from "./images/Lisa.png";


const Auction = () => {

    // const contractAddress = "0x6424Cd7d9f9fB3b2Dbe8416Ec12b6aB3432e4fB8"; old version
    // const contractAddress = "0xF0e996f97e69972f160b7Dd67D883174201F5848";
    // const contractAddress = "0x35f6c4f2f1980E6B54769bE89Ca6743Bf8d60496";
    // const contractAddress = "0xF87bEd4B46756D3e9bf573605e5Bb92f68392351";
    // const contractAddress = "0xB40463888618Bde856a687110cc11b8C9f3761DE";
    // const contractAddress = "0x64083a66ee28239F1222b2930ee7761CdC0C6900";
    // const contractAddress = "0x23619aff552d0D29112CF34A7B934002016D2D74";
    // const contractAddress = "0x40F64884314Dd864c6385e433EF4528e2164f43d";
    // const contractAddress = "0x4AE75a998583b705753527991adF7F5FdA39dFF6";
    // const contractAddress = "0xcDb9915082Ac18CFA98bB98682628388Aa777F30";
    // const contractAddress = "0x52CbD6831FAD4859100276f14351A9b559b05aDD";
    // const contractAddress = "0x2a300Ee6AB7F8Fa705eED664a9D83e3Af3B92bdF";
    // const contractAddress = "0xD582c2C8Ac139F8a4388B49539a3BcdAEacced53";
    
    const contractAddress = "0x6561cCE1a045858Af95087A05F7EcF66EcF6f021";
    //Contract deployed on Goerli
    // const contractAddress = "0x6aF6a07781BD90959e3593fDFBE130c91c981176";
    
    //UI part
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connButtonText, setConnButtonText] = useState("Connect Wallet");
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);


    //For the form
    const [inputs, setInputs] = useState({});
    const [ethAmount, setEthAmount] = useState(null);
    const [ethAuctionAmount, setEthAuctionAmount] = useState(null);
    const [ethBidAmount, setBidAmount] = useState(null);
    const [ethFloorPrice, setEthFloorPrice] = useState(null);
    
    //etherJS part
    const [incrementBid, setIncrementBid] = useState(null);
    const [usdToEther, setUsdToEther] = useState(null);
    const [currentBalance, setCurrentBalance] = useState(null);
    const [ethBalance, setEthBalance] = useState(null);

    const [contract, setContract] = useState(null);
    const [dividendBalance1, setDividendBalance] = useState(null);


  

    //Basic account, signer setup

    const connectWalletHandler = () => {
        if(window.ethereum) {
            window.ethereum.request({method: "eth_requestAccounts"})
            .then(result => {
                accountChangedHandler(result[0]);
                setConnButtonText("Wallet Connected");
            })
        } else {
            setErrorMessage("Need to Install MetaMask");
        }
    }

    const accountChangedHandler = (newAccount) => {
        setDefaultAccount(newAccount);
        updateEthers();
    }

    const updateEthers = () => {
        let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(tempProvider);

        let tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);

        let tempContract = new ethers.Contract(contractAddress, Auction_abi, tempSigner);
        setContract(tempContract);
    }

    //Form setup, we have 2 forms
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(inputs);
    }


    //USD to ETH exchange rate, provided by Chainlink Live Data Feed
    const getUsdToEther = async () => {
        let usdToWeiRate = await contract.usdToWeiRate();
        const usdToEther = ethers.utils.formatEther(usdToWeiRate);
        setUsdToEther(usdToEther);
    }

    //Calculating the amoutn of Eth/Wei that the investor needs to send, including 1.5% fees.
    //We have to input the fee at 2%, which is 0.5% higher, to avoid "Error: can't estimate gas" problem from MetaMask
    const ethCalculation = async () => {
        let exchangeRate1 = await contract.usdToWeiRate();
        let ethAmountInWei = BigNumber.from(((inputs.numberOfTokens*500*1.02)*exchangeRate1).toString());
        const ethAmount = ethers.utils.formatUnits(ethAmountInWei, 18);
        setEthAmount(ethAmount);
    } 

    const buyRPT = async () => {
        await contract.buyRPT(defaultAccount, inputs.numberOfTokens, { value: ethers.utils.parseUnits(ethAmount).toString() });
    }

    const transfer = async () => {
        await contract.transfer("0x6eda30cc59f13c8973f60a167ba4b343c7e2430b", "0x44C1eB053a0e058d6C72c4E5104c71bf1C790674"
        , 5);
    }

    

    //Jenny deposited her monthly rent of $750, which will be converted to wei
    //and send to the contract
    const dividendDeposit = async () => {
        let exchangeRate2 = await contract.usdToWeiRate();
        let dividendInWei = BigNumber.from((75000*exchangeRate2).toString());
        console.log(dividendInWei);
        // const weiAmount = ethers.utils.formatUnits(dividendInWei, 18);
        // console.log(weiAmount);
        await contract.dividendDeposit({value: dividendInWei});
    }

    
    const checkDividendBalance = async () => {
        await contract.checkDividendBalance(defaultAccount);
        // let dividendBalance1 = ethers.utils.formatEther(dividendBalance).toString();
        let dividendBalance2 = await contract.balanceOfDividend(defaultAccount);
        let dividendBalance1 = BigNumber.from(dividendBalance2).toString(); 
        console.log(dividendBalance1);
        setDividendBalance(dividendBalance1);
    }

    const withdrawDividend = async () => {
        await contract.withdrawDividend();
    }


    //Auction functions

    const ethAuctionCalculation = async () => {
        let exchangeRate4 = await contract.usdToWeiRate();
        let ethAuctionAmountInWei = BigNumber.from(((inputs.numberOfTokenSales*inputs.floorPriceUSD*100)*exchangeRate4).toString());
        const ethAuctionAmount = ethers.utils.formatUnits(ethAuctionAmountInWei, 18);
        setEthAuctionAmount(ethAuctionAmount);
    } 

    const startAuction = async () => {
        let _floorPriceUSD = (inputs.floorPriceUSD*100*inputs.numberOfTokenSales);
        let _bidIncrementUSD = (inputs.bidIncrementUSD*100);
        await contract.setFloorPriceAndQuantitySales(_floorPriceUSD, inputs.numberOfTokenSales, _bidIncrementUSD, 10790017, 10790027);

    }

    const checkEndBlock = async () => {
        let _checkEndBlock = await contract.endBlock();
        console.log(BigNumber.from(_checkEndBlock).toString());
    }

    const checkCancel = async () => {
        let _checkCancel = await contract.cancelled();
        console.log(_checkCancel.toString());
    }


    const whoIsSeller = async () => {
        let _seller = await contract.seller();
        console.log(_seller.toString());
    }

    const submitBid = async () => {
        let exchangeRate7 = await contract.usdToWeiRate();
        let quantityTokenSales2 = await contract.quantityRPTSales()
        let rawNumber = inputs.bidPriceUSD*100*quantityTokenSales2*exchangeRate7;
        console.log(rawNumber);
        await contract.submitBids({ value: rawNumber.toString() });
    }

    const convertBidAmount = async () => {
        let exchangeRate6 = await contract.usdToWeiRate();
        let quantityTokenSales2 = await contract.quantityRPTSales();
        let ethBidAmountInWei = BigNumber.from((inputs.bidPriceUSD*100*quantityTokenSales2*exchangeRate6).toString());
        const ethBidAmount = ethers.utils.formatUnits(ethBidAmountInWei, 18);
        setBidAmount(ethBidAmount);
    }
    
    const convertFloorPriceToWei = async () => {
        let price1 = await contract.floorPriceInWei();
        let price2 = BigNumber.from((price1).toString());
        const ethFloorPrice = ethers.utils.formatUnits(price2, 18);
        setEthFloorPrice(ethFloorPrice);
    } 


    const withdrawMoney = async () => {
        await contract.withdrawFund();
    }


    const checkFloorPrice = async () => {
        let price = await contract.floorPriceInWei();
        console.log((ethers.utils.formatUnits(price, 0)).toString());
    }

    const bidIncrement = async () => {
       let increment =  await contract.bidIncrement();
        console.log(increment.toString());
    }

    const highestBindingBid = async () => {
        let increment =  await contract.highestBindingBid();
         console.log(increment.toString());
     }

     const lisa1 = async () => {
        let lisaMoney =  await contract.bidderFund("0x1082b6b58439AAAc58c366380641C8EB2EaBDF7f");
         console.log(lisaMoney.toString());
     }

     const dave1 = async () => {
        let daveMoney =  await contract.bidderFund("0x6edA30CC59F13c8973F60a167ba4b343C7E2430b");
         console.log(daveMoney.toString());
     }

     
     const operatorDave = async () => {
        let operatorAddress =  await contract.operator();
        let commission = await contract.commissionAccount(operatorAddress);
         console.log(commission.toString());
     }

     const highestBidder = async () => {
        let bidder =  await contract.highestBidder();
         console.log(bidder);
     }


    //Basic functions to check balance, the ethBalance is for the operator only
    // That's the balance of his token sales, in ETH of course.
    const checkBalance = async () => {
        let balance = await contract.balanceOf(defaultAccount);
        setCurrentBalance(balance);
    }

    const checkEthBalance = async () => {
        let eth = await contract.balanceEth("0x6eda30cc59f13c8973f60a167ba4b343c7e2430b");
        const ethConvert = ethers.utils.formatEther(eth);
        setEthBalance(ethConvert);
    }



    return (
        <div>
            <div className="flex-container">
                <img src={logo} id="logo"  ></img>
                <h1 id="title">Real Property Token</h1>
            </div>

            
            <div className="container"> 
                <div className="container__diagonal"></div>
                    <img src={john} id="john" ></img>
                    <img src={condo} id="condo" ></img>
                    <h2> This is John, he walked by a building and thought "Um... I wish I could own a piece of it...".<br></br> 
                    Too bad, I don't have hundreds of thousands of dollars.<br></br>
                    I wish I could use my ETH to buy a small piece of this property and get some passive income from it.</h2>
            </div>
            
            <div className="container2">

                <div className="container__image">
                    <img src={dave} id="dave" ></img>
                </div>
                <div className="container__feature">
                    <h2 id="para2"> "Hey John, this is Dave - the DeFi Devil real estate investor.<br></br>
                        I just "tokenized" the property (Token Name: RPT)<br></br>
                        Total supply is 350 tokens at $5 each, that's our downpayment $1750 to buy the property!<br></br> 
                        Owing a token means ownership, depending on how many tokens you buy <br></br> 
                        you are proportionally entitled to the<br></br>
                        monthly rent cash flow estimated at $750 after all expenses!"</h2>
                </div>
            </div>
            
            <br></br>
            
            <div className="container3">

                <div className="container__image3">
                    <img src={john} id="john" ></img>
                </div>
                <div className="container__feature3">
                    <h2 id="para3"> "Dave, that's cool. I want to buy 200 tokens!"</h2>
                </div>
            </div>

            <br></br>
            <h1 className="header">Section#1 How To Buy and Transfer RPT Tokens</h1>
            <div>
                <h2 className="step">Step 1 - Connect Your MetaMask Wallet</h2>
                <button className="btn" onClick={connectWalletHandler}>{connButtonText}</button>
            </div>
            
            <div>
                <h3>Address: {defaultAccount}</h3>
            </div>

            <div>
                <h2 className="step">Step 2 - Buy RPT Tokens</h2>
                <p>Please fill out the form and hit "Submit" to start your transaction:</p>
                <div>
                    <form onSubmit={handleSubmit}>
                        <label>Public Address (Just copy from the above)</label>
                        <br></br>
                        <input type="text" name="publicAddress" value={inputs.publicAddress} onChange ={handleChange}/>
                        <br></br>
                        Number of Tokens
                        <br></br>
                        <input type="number" name="numberOfTokens" value={inputs.numberOfTokens} onChange ={handleChange}/>
                        <br></br>
                        <input type="submit"/>
                        <br></br>
                    </form>
                    <br></br>
                    Next, click to get the exchange rate
                    <br></br>
                    <br></br>
                    <button className="btn" onClick={getUsdToEther}>USD/ETH Exchange Rate</button>
                    <p>{`1 USD = ${usdToEther} Ether`}</p>
                    <p>At the exchange rate above and the price of $5 per RPT token, click to find out how much ETH you are going to pay:</p>
                    <button className="btn" onClick={ethCalculation}>ETH Convert</button>
                    <h3>{`You will pay ${ethAmount} ETH for ${inputs.numberOfTokens} RPT tokens, if you agree please click Buy`}</h3>
                    <button className="btn" onClick={buyRPT}>Buy RPT</button>
                </div>
            </div>

            <br></br>
            <div>
                <h3>Now, let's check your RPT Balance</h3>    
                <><button className="btn"onClick={checkBalance}>Your RPT Balance</button></>
                <><p>You have {`${currentBalance}`} RPT tokens!</p></>
            </div>
            <div>
                <><button onClick={checkEthBalance}>Your ETH Balance</button></>
                <><p>Your current balance is {`${ethBalance}`}</p></>
            </div>
                {errorMessage}

            
            <div className="container2">
                <div className="container__image">
                    <img src={dave} id="dave" ></img>
                </div>
                <div className="container__feature">
                    <h2 id="para2"> "Hey John, thanks for buying in. As a token of apperciation,
                    <br></br>I will "gift" (or airdrop) you another 5 tokens.
                    Just simply click the button below to get them!<br></br>
                    Well, did I tell you that I never run our of good news? I have another good news!<br></br>
                    I just found a tennant to rent our property, her name is Jenny!</h2>
                </div>
            </div>
            <button className="btn"onClick={transfer}>Get 5 Tokens!</button>
            <br></br>
            <h1 className="header">Section#2 How To Receive Dividend - Monthly Rent</h1>
            <div className="container2">
                <div className="container__image">
                    <img src={dave} id="dave" ></img>
                </div>
                <div className="container__feature">
                    <h2 id="para2"> "Alright John, many moons have passed since Jenny moved in<br></br>
                    It's time to get your monthly dividend from Jenny's rent, it's $750 after all expenses.</h2>
                </div>
            </div>


            <div className="container3">
                <div className="container__image3">
                    <img src={jenny}></img>
                </div>
                <div className="container__feature3">
                    <h2 id="para3"> "Hey, I just paid my rent by ETH on your platform."</h2>
                </div>
            </div>

            <button className="btn"onClick={dividendDeposit}>Deposit rent to our smart contract!</button>
            
            <div className="container2">
                <div className="container__image">
                    <img src={dave} id="dave" ></img>
                </div>
                <div className="container__feature">
                    <h2 id="para2"> "John, now you can check your dividence balance.<br></br>
                    Then hit the "withdraw" button and get your money!</h2>
                </div>
            </div>
            <br></br>
            <button className="btn"onClick={checkDividendBalance}>Check Your Dividend Balance</button>
            <p>Your current balance is {`${dividendBalance1} Wei, 1 Ether = 10^18 Wei.`}</p>
            <br></br>
            <button className="btn"onClick={withdrawDividend}>Withdraw My Dividend</button>
            <p></p>
            <br></br>
            <div className="container3">
                <div className="container__image3">
                    <img src={john}></img>
                </div>
                <div className="container__feature3">
                    <h2 id="para3"> "Alright, this is so cool. But I now want to sell some tokens <br></br>
                    because I need money and some people want to buy my tokens."</h2>
                </div>
            </div>

            <div className="container2">
                <div className="container__image">
                    <img src={dave} id="dave" ></img>
                </div>
                <div className="container__feature">
                    <h2 id="para2"> "Not a problem, you can put your tokens on the auction<br></br>
                    So people can bid and you get the best price! Just fill out the form below.</h2>
                </div>
            </div>
            
            <br></br>
            <h1 className="header">Section#3 How To Sell Your Tokens (Auction)</h1>
            <br></br>
            <h3 id="explain">Here at RPT, we run English Auction style. Each auction will last about 3 minutes so that people can submit bids. <br></br>
            Just let us know the minium price and how many tokens you want to sell and your incremental bid!</h3>
            <br></br>
            <div className="container3">
                <div className="container__image3">
                    <img src={john}></img>
                </div>
                <div className="container__feature3">
                    <h2 id="para3"> "Alright, price and quantity, I got it. But what is incremental bid?"</h2>
                </div>
            </div>
            <br></br>
            <h3 id="explain">Let's say Alice is the highest bidder at $420, and the incremental bid is $10. You decide to bid $500 <br></br>
            However, you are only obligated to pay $430 (the current highest bid + incremental bid) if you win the auction. <br></br>
            In this case, $440 is the highest binding bid. If someone comes along and bid $460, you are still the highest bidder (at $500)<br></br>
            </h3>
            <h3 id="explain">But the highest binding bid is now $470 ($460 + the incremental bid $10).
            </h3>
            <br></br>
            <div>
                <h2 className="step">Step 1 - Fill out the form</h2>
                <p>Please fill out the form and hit "Submit" to start your auction:</p>
                <div>
                    <form onSubmit={handleSubmit}>
                        <label>Minimum Price-USD (Your starting price)</label>
                        <br></br>
                        <input type="number" name="floorPriceUSD" value={inputs.floorPriceUSD} onChange ={handleChange}/>
                        <br></br>
                        Number of Tokens
                        <br></br>
                        <input type="number" name="numberOfTokenSales" value={inputs.numberOfTokenSales} onChange ={handleChange}/>
                        <br></br>
                        Incremental Bid - USD
                        <br></br>
                        <input type="number" name="bidIncrementUSD" value={inputs.bidIncrementUSD} onChange ={handleChange}/>
                        <br></br>
                        <input type="submit"/>
                        <br></br>
                    </form>
                </div>
            </div>

            <br></br>
            
            <div>
                Next, click to get the exchange rate, all bids are in ETH.
                <br></br>
                <br></br>
                <button className="btn" onClick={getUsdToEther}>USD/ETH Exchange Rate</button>
                <p>{`1 USD = ${usdToEther} Ether`}</p>
                <p>At the exchange rate above, click to find out your minimum asking price</p>
                <button className="btn" onClick={ethAuctionCalculation}>ETH Convert</button>
                <h3>{`You are asking ${ethAuctionAmount} ETH for ${inputs.numberOfTokenSales}`}</h3>
                <p>If everything looks good, you can star the 3-minute auction!<br></br>
                Please keep track of your clock and Check your wallet balance once the auction ends!</p>
                <button className="btn" onClick={startAuction}>Start Auction</button>
                <button className="btn" onClick={whoIsSeller}>who is seller</button>
                <button className="btn" onClick={checkFloorPrice}>Floor Price</button>
                <button className="btn" onClick={bidIncrement}>Bid Increment</button>
                <button className="btn" onClick={highestBindingBid}>Highest Binding Bid</button>
                <button className="btn" onClick={highestBidder}>Highest Bidder</button>
            </div>


            <br></br>
            <div>
                <h2 className="step">Step 2 - Submitting Bids (For Bidders Only)</h2>
                <p>Please make sure it is bigger than the minimum floor price below (ETH), click to get the floor price:</p>
                    <br></br>
                    <button className="btn" onClick={convertFloorPriceToWei}>Get Floor Price</button>
                    <h3>{`The minimum floor price is ${ethFloorPrice}`}</h3>
                
                <p>Please fill out the form and hit "Submit" to log in your bid:</p>
                <div>
                    <form onSubmit={handleSubmit}>
                        <label>Your Best Bid per Token (USD)</label>
                        <br></br>
                        <input type="number" name="bidPriceUSD" value={inputs.bidPriceUSD} onChange ={handleChange}/>
                        <input type="submit"/>
                        <br></br>
                    </form>
                </div>
                
                <div>
                    Next, click to get the exchange rate, all bids are in ETH.
                    <br></br>
                    <br></br>
                    <button className="btn" onClick={getUsdToEther}>USD/ETH Exchange Rate</button>
                    <p>{`1 USD = ${usdToEther} Ether`}</p>
                    <p>At the exchange rate above, your ETH bid is</p>
                    <button className="btn" onClick={convertBidAmount}>ETH Convert</button>
                    <h3>{`Your Bid in ETH is ${ethBidAmount}`}</h3>
                    <br></br>
                    <h3>{`The minimum floor price is ${ethFloorPrice}`}</h3>
                    <p>If everything looks good, you can submit your bid. Good luck!<br></br></p>
                </div>


                <br></br>
                <button className="btn" onClick={submitBid}>Submit</button>
                <button className="btn" onClick={checkEndBlock}>end block</button>
                <button className="btn" onClick={checkCancel}>cancelled?</button>
            </div>

            <div>
                <h2 className="step">List of Bidders</h2>
                <p>For demo purposes only, this is list of bidders and their bid</p>
                <br></br>
                <div className="container3">
                    <div className="container__image3">
                        <img src={dave}></img>
                    </div>
                    <div className="container__feature3">
                        <h2 id="para3"> Dave <br></br>
                        "I want to buy back my tokens. I bid $900 ($9 x 100 tokens)"</h2>
                    </div>
                </div>
                <div className="container3">
                    <div className="container__image3">
                        <img src={jenny}></img>
                    </div>
                    <div className="container__feature3">
                        <h2 id="para3"> Jenny <br></br>
                        "I want to own the tokens of the place I rent. <br></br> 
                        I bid for $1200 ($12 x 100 tokens)"</h2>
                    </div>
                </div>
                <div className="container3">
                    <div className="container__image3">
                        <img src={lisa}></img>
                    </div>
                    <div className="container__feature3">
                        <h2 id="para3"> Lisa
                        <br></br> "I want to invest, <br></br> 
                        I bid for $1500 ($15 x 100 tokens)"</h2>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="step">Step 3 - Withdraw Your Money</h2>
                <p> The auction is now over, everybody can get your money back. Just click on the button</p>
                <button className="btn" onClick={withdrawMoney}>Get Your Money Back</button>
                <button className="btn" onClick={lisa1}>Lisa Money</button>
                <button className="btn" onClick={dave1}>Dave Money</button>
                <button className="btn" onClick={operatorDave}>Operator Dave Fee</button>
                
                <h2 id="explain">This is the summary of what happened:</h2>
                <h2>Lisa is the winner, she paid $1210 and she should have 100 tokens on her balance<br></br>
                and she should get back the difference amount of $290 ($1500 - $1210)</h2>
                <p id="explain">The incremental bid is $10, the next highest bid is $1200 from Jenny</p>
                <h2>Both Dave and Jenny should get back the whole amount of their bids.</h2>
                <h2>Dave, the operator, should have 150 tokens <br></br>
                Jenny should have 0.</h2>
            </div>

            <div>
                <h3>Now, let's check their RPT Balance</h3>    
                <><button className="btn"onClick={checkBalance}>Check Balance</button></>
                <><p>You have {`${currentBalance}`} RPT tokens!</p></>
            </div>



        </div>
    )

}

export default Auction;