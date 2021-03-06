import {useState, React} from 'react';
import { AppWrap, MotionWrap } from '../../Wrapper';
import {motion} from 'framer-motion';
import { images } from '../../constants';
import {BigNumber, ethers} from "ethers";
import Auction_abi from "../../Auction_abi.json";
import './BuyToken.scss';

const Buytoken = () => {
  
  const contractAddress = '0x917Fc2fE978474CbC3F0e6A7B31D238c5DCD2Ed0';

  //UI part
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

   //For the form
   const [inputs, setInputs] = useState({});
   const [ethAmount, setEthAmount] = useState(null);

  //etherJS part
  const [usdToEther, setUsdToEther] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(null);

  //Connect Wallet

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

  // Hanlding the forms
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}));
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputs);
    getUsdToEther();
  }

  //USD to ETH exchange rate, provided by Chainlink Live Data Feed
  const getUsdToEther = async () => {
    let usdToWeiRate = await contract.usdToWeiRate();
    const usdToEther = ethers.utils.formatEther(usdToWeiRate);
    setUsdToEther(usdToEther);
    ethCalculation();
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
  const checkBalance = async () => {
    let balance = await contract.balanceOf(defaultAccount);
    setCurrentBalance(balance);
  }

  return (
    <div>
      <motion.div
        whileInView={ {x: [-100, 0], opacity: [0, 1]} }
        transition={ {duration: 1} }
        className='app__header-info'
      >
        <h1 className='head-text'> <span>Buy RPT Tokens</span> </h1>
      </motion.div>

      <div className='app__header app__flex'>
        <div>
          <motion.div
            whileInView={ {x: [-100, 0], opacity: [0, 1]} }
            transition={ {duration: 1} }
            className='app__header-info'
          >
              <div className='app__header-badge'>
                <div className='badge-cmp app__flex'>
                  <span><img src={images.John}/><p className='bold-text'>John</p></span>
                  <div style={{ marginLeft: 20 }}>
                    <p>"I want to buy 100 tokens."</p>
                  </div>
                </div>
                <button className="button" onClick={checkBalance}>Your RPT Balance</button>
                <p>You have {`${currentBalance}`} RPT tokens!</p>
              </div>
          </motion.div>
        </div>

        <div>
          <motion.div
              whileInView={ {scale: [0, 1]} }
              transition={ {duration: 1, ease: 'easeInOut'} }
              className='app__execution-tasks'
          >
            <h1>Step 1 Connect Wallet</h1>
            <button className='button' onClick={connectWalletHandler}>{connButtonText}</button>
            <h4>Address: {defaultAccount}</h4>
            <br/>
            <h1>Step 2 Buy RPT</h1>
            <form onSubmit={handleSubmit}>
              <fieldset>
              <label>Your Address </label>
              <br/>
              <input type="text" name="publicAddress" value={inputs.publicAddress} onChange ={handleChange}/>
              <br/>
              <label>Number of Tokens</label>
              <br/>
              <input type="number" name="numberOfTokens" value={inputs.numberOfTokens} onChange ={handleChange}/>
              <br/>
              <input className= 'button' type="submit"/>
              </fieldset>
            </form>
            <p>{`1 USD = ${usdToEther} Ether`}</p>
            <h3>{`You will pay ${ethAmount} ETH for ${inputs.numberOfTokens} RPT tokens`}</h3>
            <button className="button" onClick={buyRPT}>Buy RPT</button>
          </motion.div>
        </div>
        
      </div>
    </div>
  )
}

export default AppWrap(
  MotionWrap(Buytoken, 'buy token'),
  'buy token',
  'app__primarybg',
);