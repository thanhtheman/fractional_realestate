import React, {useState} from "react";
import {ethers} from "ethers";
import Auction_abi from "./Auction_abi.json";
import RptToken_abi from "./RptToken_abi.json";
import TokenSale_abi from "./TokenSale_abi.json";

const Auction = () => {

    const contractAddress = "0xdbb067aead7d5b62168031caf8c9cb887f5c9f0b";
    //UI part
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connButtonText, setConnButtonText] = useState("Connect Wallet");

    //etherJS part
    // const [currentContractVal, setCurrentContractVl] = useState(null);
    const [incrementBid, setIncrementBid] = useState(null);
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
    
    const getIncrementBid = async () => {
        let bid = await contract._totalSupply();
        bid = (bid/56).toFixed(2);
        setIncrementBid(bid);
    }

    return (
        <div>
            <h3>{"Interaction with Auction Contract"}</h3>
                <button onClick={connectWalletHandler}>{connButtonText}</button>
                <div>
                    <h3>Address: {defaultAccount}</h3>
                </div>
                <div>
                    <button onClick={getIncrementBid}>Show Increment Bid</button>
                </div>
                <div id="example">
                    <p id="text">{`$${incrementBid}`}</p>
                </div>
                
                {errorMessage}
        </div>
    )

}

export default Auction;