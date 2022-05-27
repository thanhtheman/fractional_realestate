import React, {useState} from "react";
import {ethers} from "ethers";
import Auction_abi from "./Auction_abi.json";
import logo from "./images/RPT.png";
import condo from "./images/condo.png";
import john from "./images/John.png";
import dave from "./images/Dave.png";
import jenny from "./images/Jenny.png";
import lisa from "./images/Lisa.png";


const Auction = () => {

    const contractAddress = "0x818b96022b9646de7d6d5ad43610e0aa09956efc";
    //UI part
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connButtonText, setConnButtonText] = useState("Connect Wallet");

    //etherJS part
    // const [currentContractVal, setCurrentContractVl] = useState(null);
    const [incrementBid, setIncrementBid] = useState(null);
    const [usdToEther, setUsdToEther] = useState(null);
    const [currentBalance, setCurrentBalance] = useState(null);
    const [ethBalance, setEthBalance] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);


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
    
    const getUsdToEther = async () => {
        let usdToWeiRate = await contract.usdToWeiRate();
        const usdToWei = ethers.utils.formatEther(usdToWeiRate);
        setUsdToEther(usdToWei);
    }

    const buyRPT = async () => {
        let transaction = await contract.buyRPT("0x1082b6b58439AAAc58c366380641C8EB2EaBDF7f", 5, { value: ethers.utils.parseEther("0.4") });
    }

    const checkBalance = async () => {
        let balance = await contract.balanceOf("0x1082b6b58439AAAc58c366380641C8EB2EaBDF7f");
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
                    <h2 id="para2"> "Hey John, this is Thanh - the decentralized real estate investor.<br></br>
                        I just "tokenized" the property (Token Name: RPT)<br></br>
                        Total supply is 3500 tokens at $100 each, that's our downpayment $350,000 to buy the property!<br></br> 
                        Owing a token means ownership, depending on how many tokens you buy <br></br> 
                        you are proportionally entitled to the<br></br>
                        monthly rent cash flow estimated at $5,000 after all expenses!"</h2>
                </div>
            </div>
            <br></br>
            <div class="container3">

                <div class="container__image3">
                    <img src={john} id="john" ></img>
                </div>
                <div class="container__feature3">
                    <h2 id="para3"> "Thanh, that's cool. I want to buy 10 tokens!"</h2>
                </div>
            </div>






            <div>
                <h2>Step 1 - Connect Your MetaMask Wallet</h2>
                <button className="btn" onClick={connectWalletHandler}>{connButtonText}</button>
            </div>
            <div>
                <h3>Address: {defaultAccount}</h3>
            </div>
            <div>
                <button className="btn" onClick={getUsdToEther}>USD/ETH Exchange Rate</button>
            </div>
                <div>
                    <p>{`1 USD = ${usdToEther} Ether`}</p>
                </div>
                
                <br></br>

                <><button className="btn" onClick={buyRPT}>Buy RPT</button></>
                <div>
                <br></br>    
                <><button className="btn"onClick={checkBalance}>Your RPT Balance</button></>
                <><p>Your current balance is {`${currentBalance}`}</p></>
                </div>
                <div>
                <><button onClick={checkEthBalance}>Your ETH Balance</button></>
                <><p>Your current balance is {`${ethBalance}`}</p></>
                </div>
                {errorMessage}

            <div>
                <h3>Sell RPT</h3>
            </div>




        </div>
    )

}

export default Auction;