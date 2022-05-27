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

    const contractAddress = "0xE32229D8cfB8B281942DF864dFB704d0218cD745";
    //UI part
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connButtonText, setConnButtonText] = useState("Connect Wallet");

    //etherJS part
    const [incrementBid, setIncrementBid] = useState(null);
    const [usdToEther, setUsdToEther] = useState(null);
    const [currentBalance, setCurrentBalance] = useState(null);
    const [ethBalance, setEthBalance] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [dividendBalance1, setDividendBalance] = useState(null);

    //For the buying form:
    const [inputs, setInputs] = useState({});
    const [ethAmount, setEthAmount] = useState(null);
    let weiToBuyRpt;
  


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

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(inputs);
    }
    const updateEthers = () => {
        let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(tempProvider);

        let tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);

        let tempContract = new ethers.Contract(contractAddress, Auction_abi, tempSigner);
        setContract(tempContract);
    }
    
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

    

    //Jenny deposited her monthly rent of $1500, which will be converted to wei
    //and send to the contract
    const dividendDeposit = async () => {
        let exchangeRate2 = await contract.usdToWeiRate();
        let dividendInWei = BigNumber.from((75000*exchangeRate2).toString());
        console.log(dividendInWei);
        // const weiAmount = ethers.utils.formatUnits(dividendInWei, 18);
        // console.log(weiAmount);
        await contract.dividendDeposit({value: dividendInWei});
    }

    //Display issue
    const checkDividendBalance = async () => {
        let dividendBalance = await contract.checkDividendBalance(defaultAccount);
        let dividendBalance1 = ethers.utils.formatUnits(dividendBalance, 0); 
        console.log(dividendBalance1);
        setDividendBalance(dividendBalance1);
    }

    const withdrawDividend = async () => {
        await contract.withdrawDividend();
    }

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

            
            <div class="container"> 
                <div class="container__diagonal"></div>
                    <img src={john} id="john" ></img>
                    <img src={condo} id="condo" ></img>
                    <h2> This is John, he walked by a building and thought "Um... I wish I could own a piece of it...".<br></br> 
                    Too bad, I don't have hundreds of thousands of dollars.<br></br>
                    I wish I could use my ETH to buy a small piece of this property and get some passive income from it.</h2>
            </div>
            
            <div class="container2">

                <div class="container__image">
                    <img src={dave} id="dave" ></img>
                </div>
                <div class="container__feature">
                    <h2 id="para2"> "Hey John, this is Thanh - the DeFi Devil real estate investor.<br></br>
                        I just "tokenized" the property (Token Name: RPT)<br></br>
                        Total supply is 350 tokens at $5 each, that's our downpayment $1750 to buy the property!<br></br> 
                        Owing a token means ownership, depending on how many tokens you buy <br></br> 
                        you are proportionally entitled to the<br></br>
                        monthly rent cash flow estimated at $750 after all expenses!"</h2>
                </div>
            </div>
            
            <br></br>
            
            <div class="container3">

                <div class="container__image3">
                    <img src={john} id="john" ></img>
                </div>
                <div class="container__feature3">
                    <h2 id="para3"> "Thanh, that's cool. I want to buy 5 tokens!"</h2>
                </div>
            </div>

            <br></br>
            <h1 className="header">Demo#1 How To Buy and Transfer RPT Tokens</h1>
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
                    <p>At the exchange rate above and the price of $100 per RPT token, click to find out how much ETH you are going to pay:</p>
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

            
            <div class="container2">
                <div class="container__image">
                    <img src={dave} id="dave" ></img>
                </div>
                <div class="container__feature">
                    <h2 id="para2"> "Hey John, thanks for buying in. As a token of apperciation,
                    <br></br>I will "gift" (or airdrop) you another 5 tokens.
                    Just simply click the button below to get them!<br></br>
                    Well, did I tell you that I never run our of good news? I have another good news!<br></br>
                    I just found a tennant to rent our property, her name is Jenny!</h2>
                </div>
            </div>
            <button className="btn"onClick={transfer}>Get 5 Tokens!</button>
            <br></br>
            <h1 className="header">Demo#2 How To Receive Dividend - Monthly Rent</h1>
            <div class="container2">
                <div class="container__image">
                    <img src={dave} id="dave" ></img>
                </div>
                <div class="container__feature">
                    <h2 id="para2"> "Alright John, many moons have passed since Jenny moved in<br></br>
                    It's time to get your monthly dividend from Jenny's rent, it's $2,000 after all expenses.</h2>
                </div>
            </div>

            <button className="btn"onClick={dividendDeposit}>Deposit rent to our smart contract!</button>
            
            <div class="container2">
                <div class="container__image">
                    <img src={dave} id="dave" ></img>
                </div>
                <div class="container__feature">
                    <h2 id="para2"> "John, now you can check your dividence balance<br></br>
                    Just enter the amount you want to witdraw, hit the button and get your money!</h2>
                </div>
            </div>
            <br></br>
            <button className="btn"onClick={checkDividendBalance}>Check Your Dividend Balance</button>
            <p>Your current balance is {`${dividendBalance1}`}</p>
            <br></br>
            <button className="btn"onClick={withdrawDividend}>Withdraw My Dividend</button>




        </div>
    )

}

export default Auction;