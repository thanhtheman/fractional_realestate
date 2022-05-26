import React, {useState} from "react";
import {ethers} from "ethers";
import Auction_abi from "./Auction_abi.json";


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

        //This is how we are going to call functions on the contract
        let tempContract = new ethers.Contract(contractAddress, Auction_abi, tempSigner);
        setContract(tempContract);
    }
    
    const getUsdToEther = async () => {
        let usdToWeiRate = await contract.usdToWeiRate();
        // const usdToWei = ethers.utils.formatEther(usdToWeiRate);
        setUsdToEther(usdToWeiRate);
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
            <h3>{"Buy RPT"}</h3>
                <button onClick={connectWalletHandler}>{connButtonText}</button>
                <div>
                    <h3>Address: {defaultAccount}</h3>
                </div>
                <div>
                    <button onClick={getUsdToEther}>USD/ETH Exchange Rate</button>
                </div>
                <div>
                    <p>{`1 USD = ${usdToEther} Ether`}</p>
                </div>
                <><button onClick={buyRPT}>Buy RPT</button></>
                <div>
                <><button onClick={checkBalance}>Your RPT Balance</button></>
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