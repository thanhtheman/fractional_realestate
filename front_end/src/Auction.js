import React, {useState} from "react";

const Auction = () => {

    const contractAddress = "";
    //UI part
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connButtonText, setConnButtonText] = useState("Connect Wallet");

    //etherJS part
    const [currentContractVal, setCurrentContractVl] = useState(null);

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
        let tempProvider = ethers.provider.Web3Provider(window.ethereum);
        setProvider(tempProvider);

        let tempSigner = ethers.getSigner();
        setSigner(tempSigner);

        //This is how we are going to call functions on the contract
        let tempContract = ethers.getContract(contractAddress, Auction_abi, tempSigner);
        setContract(tempContract);
    }
    
    return (
        <div>
            <h3>{"Interaction with Auction Contract"}</h3>
            <button onClick={connectWalletHandler}>{connButtonText}</button>
            <h3>Address: {defaultAccount}</h3>
            {errorMessage}
        </div>
    )

}

export default Auction;